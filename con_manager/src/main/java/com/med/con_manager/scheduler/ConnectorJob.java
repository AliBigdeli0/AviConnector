package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.annotations.Job;

import java.util.UUID;

@Slf4j
public class ConnectorJob {

	public final UUID id = UUID.randomUUID();
	private final Thread executionThread = new Thread(() -> {
		log.info("============> here is my job");
		try {
			Thread.sleep(600000);
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
		log.info("============> job finished");
	});

	@Job(name = "connector job")
	public void execute() {
		executionThread.start();
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
