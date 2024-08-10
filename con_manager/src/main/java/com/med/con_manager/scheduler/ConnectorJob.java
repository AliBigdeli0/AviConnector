package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

@Slf4j
public class ConnectorJob {
	private final Thread executionThread;

	public ConnectorJob(Runnable run) {
		this.executionThread = new Thread(run);
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
			executionThread.interrupt();
			executionThread.join();
			log.info("==================> the job has cancelled");
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
	}
}
