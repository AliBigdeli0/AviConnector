package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConnectorJob {
	private final Thread executionThread;

	public ConnectorJob() {
		this.executionThread = new Thread(() -> {
			log.info("============> here is my job");
			try {
				Thread.sleep(30000);
			} catch (InterruptedException e) {
				log.error(e.getMessage());
			}
			log.info("============> job finished");
		});
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
