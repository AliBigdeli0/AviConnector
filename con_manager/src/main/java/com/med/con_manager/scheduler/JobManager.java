package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.BackgroundJob;
import org.jobrunr.scheduling.JobBuilder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class JobManager {

	private final Object lock = new Object();

	public String newJob(String wellId) {
		synchronized (ConnectorJobActivator.WellIdStack) {
			var uid = UUID.randomUUID();

			ConnectorJobActivator.WellIdStack.push(wellId);
			ConnectorJobActivator.WellIdStack.push(wellId);

			var job = JobBuilder
					.aJob()
					.withId(uid)
					.withName(wellId)
					.withDetails(ConnectorJob::execute);

			BackgroundJob.create(job);
			return uid.toString();
		}
	}

	public void killJob(String id) {
		synchronized (lock) {
			BackgroundJob.delete(UUID.fromString(id));
		}
	}
}
