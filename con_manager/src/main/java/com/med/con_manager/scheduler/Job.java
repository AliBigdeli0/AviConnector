package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.JobBuilder;
import org.jobrunr.scheduling.JobScheduler;
import org.jobrunr.server.JobActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Job {

	@Autowired
	JobScheduler jobScheduler;

	@Bean
	void DefineNewJob() {
		var jobId = jobScheduler.enqueue(this::printAndWait);

	}

	public void printAndWait() {
		System.out.println("============> here is my job");
		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			log.error(e.getMessage());
		}
		System.out.println("============> job finished");
	}
}
