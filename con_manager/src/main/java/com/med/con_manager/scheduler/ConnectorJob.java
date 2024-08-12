package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import lombok.extern.slf4j.Slf4j;

import java.net.URISyntaxException;

@Slf4j
public class ConnectorJob {
	private Thread executionThread = null;

	Process process;
	private final DbWell well;

	public ConnectorJob(DbWell well) {
		this.well = well;
	}

	private void createProcess() throws URISyntaxException {
		var processBuilder = new ProcessBuilder(Constants.getJavaPath(), "-jar", Constants.getConDataJarFile());

		setEnvironmentVariables(processBuilder);

		this.executionThread = new Thread(() -> {
			try {
				process = processBuilder.start();
				int exitCode = process.waitFor();
				log.info("WARNING=> well with name '{}({})' has finished with code {}", this.well.getName(), well.getID(), exitCode);
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}
		});
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
		} finally {
			cancel();
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
