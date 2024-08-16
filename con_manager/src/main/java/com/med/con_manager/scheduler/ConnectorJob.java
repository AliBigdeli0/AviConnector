package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import com.med.con_manager.utility.ConsoleHelper;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.context.JobContext;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.ArrayList;

@Slf4j
public class ConnectorJob {
	private Thread executionThread = null;

	Process process;
	private DbWell well;

	public ConnectorJob() {

	}

	private void createProcess() throws URISyntaxException {
		final var processBuilder = new ProcessBuilder();

		processBuilder.command(executionCommand());

		setEnvironmentVariables(processBuilder);

		final boolean isVerbose = CommonEnvironmentVariables.getVerbose();

		this.executionThread = new Thread(() -> {
			try {
				log.info("going to start process '{}'", this.well.getJobName());
				process = processBuilder.start();
				final var error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
				final var op = new BufferedReader(new InputStreamReader(process.getInputStream()));

				// reader
				final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				ConsoleHelper.handleReader(reader, isVerbose);

				// errors
				final BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
				ConsoleHelper.handleReader(errorReader, isVerbose);

				final int exitCode = process.waitFor();
				log.info("WARNING=> well with name '{}' has finished with code {}", this.well.getJobName(), exitCode);
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}
		});
		this.executionThread.setPriority(Thread.MAX_PRIORITY);
	}

	private ArrayList<String> executionCommand() {
		var retList = new ArrayList<String>();
		retList.add(Constants.getJavaPath());
		retList.add("-Xmx4g");
		retList.add("-jar");

		retList.add("--add-opens=java.base/jdk.internal.access=ALL-UNNAMED");
		retList.add("--add-opens=java.base/jdk.internal.misc=ALL-UNNAMED");
		retList.add("--add-opens=java.base/sun.nio.ch=ALL-UNNAMED");
		retList.add("--add-opens=java.base/sun.util.calendar=ALL-UNNAMED");
		retList.add("--add-opens=java.management/com.sun.jmx.mbeanserver=ALL-UNNAMED");
		retList.add("--add-opens=jdk.internal.jvmstat/sun.jvmstat.monitor=ALL-UNNAMED");
		retList.add("--add-opens=java.base/sun.reflect.generics.reflectiveObjects=ALL-UNNAMED");
		retList.add("--add-opens=jdk.management/com.sun.management.internal=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.io=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.nio=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.net=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.util=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.util.concurrent=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.util.concurrent.locks=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.lang=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.lang.invoke=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.math=ALL-UNNAMED");
		retList.add("--add-opens=java.sql/java.sql=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.lang.reflect=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.time=ALL-UNNAMED");
		retList.add("--add-opens=java.base/java.text=ALL-UNNAMED");
		retList.add("--add-opens=java.management/sun.management=ALL-UNNAMED");
		retList.add("--add-opens=java.desktop/java.awt.font=ALL-UNNAMED");

		retList.add(Constants.getConDataJarFile());
		return retList;
	}


	private void setEnvironmentVariables(ProcessBuilder processBuilder) throws URISyntaxException {
		var environments = processBuilder.environment();
		environments.put("MED_QUEUE_NAME", this.well.getMQName());
		environments.put("MED_QUEUE_ADDRESS", this.well.getMQAddress());
		environments.put("MED_WELL_ID", this.well.getID());
		environments.put("MED_LOG_NAME", this.well.getName());
		environments.put(Constants.MED_MONGO_CONN_STR, CommonEnvironmentVariables.getMongoDbConnectionString());
	}

	public void execute(JobContext context, String jsonStr) {
		try {
			well = DbWell.fromJson(jsonStr);

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
