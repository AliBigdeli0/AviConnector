package com.med.con_manager.scheduler;

import com.med.con_common.utility.Constants;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConnectorJob {
	private final Thread executionThread;

	Process process;
	private final String well_id;

	public ConnectorJob(String well_id) {
		this.well_id = well_id;
		var processBuilder = new ProcessBuilder(Constants.getJavaPath(), "-jar", Constants.getConDataJarFile());

		setEnvironmentVariables(processBuilder);

		this.executionThread = new Thread(() -> {
			try {
				process = processBuilder.start();
				int exitCode = process.waitFor();
				log.info("WARNING=> the well id '{}' has finished with code {}", well_id, exitCode);
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}
		});
	}

	private void setEnvironmentVariables(ProcessBuilder processBuilder) {
		var environments = processBuilder.environment();
		environments.put("MED_QUEUE_NAME", "A_MF_DATA_VALUE");
		environments.put("MED_QUEUE_ADDRESS", "tcp://127.0.0.1:61616");
		environments.put("MED_WELL_ID", this.well_id);
		environments.put("MED_LOG_NAME", "test");
	}

	public void execute() {
		try {
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
				process.destroyForcibly();
				process = null;
			} catch (Exception ex) {
				log.error("error in kill process in well id : %s{}", ex.getMessage());
			}
			executionThread.interrupt();
			executionThread.join();
			log.info("==================> the job has cancelled");
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
	}

}
