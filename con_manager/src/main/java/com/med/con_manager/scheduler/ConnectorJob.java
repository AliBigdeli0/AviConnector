package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
public class ConnectorJob {
	private Thread executionThread = null;

	Process process;
	private final DbWell well;

	public ConnectorJob(DbWell well) {
		this.well = well;
	}

	private void createProcess() throws URISyntaxException {
		final var listArgs = List.of(Constants.getJavaPath(), "-Xmx4g", "-jar", Constants.getConDataJarFile());
		final var processBuilder = new ProcessBuilder();

		processBuilder.command(listArgs);

		setEnvironmentVariables(processBuilder);

		this.executionThread = new Thread(() -> {
			try {
				log.info("going to start process '{}'", this.well.getJobName());
				process = processBuilder.start();
				final var error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
				final var op = new BufferedReader(new InputStreamReader(process.getInputStream()));

				// reader
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				while (reader.readLine() != null) ;

				// errors
				BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
				while (errorReader.readLine() != null) ;

				final int exitCode = process.waitFor();
				log.info("WARNING=> well with name '{}' has finished with code {}", this.well.getJobName(), exitCode);
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}
		});
		this.executionThread.setPriority(Thread.MAX_PRIORITY);
	}

	private void setEnvironmentVariables(ProcessBuilder processBuilder) throws URISyntaxException {
		var environments = processBuilder.environment();
		environments.put("MED_QUEUE_NAME", this.well.getMQName());
		environments.put("MED_QUEUE_ADDRESS", this.well.getMQAddress());
		environments.put("MED_WELL_ID", this.well.getID());
		environments.put("MED_LOG_NAME", this.well.getName());
		environments.put(Constants.MED_MONGO_CONN_STR, CommonEnvironmentVariables.getMongoDbConnectionString());
	}

	public void execute() {
		try {
			if (well == null) throw new Exception("the well object can not be empty");
			createProcess();
			executionThread.start();
			executionThread.join();
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	public void cancel() {
		try {
			try {
				if (process != null) {
					process.destroyForcibly();
					process = null;
				}
			} catch (Exception ex) {
				log.error("[Well Name: {}(ID:{})]: error in kill process in well id : {}",
						this.well.getMQName(),
						this.well.getID(),
						ex.getMessage()
				);
			}

			executionThread.interrupt();
			executionThread.join();
			log.info("==================> the job has cancelled");
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
	}

}
