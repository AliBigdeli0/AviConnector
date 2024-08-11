package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class JobManager {
	@Autowired
	JobScheduler jobScheduler;

	private final Object lock = new Object();

	public String newJob(String wellId) {
		synchronized (lock) {
			var uid = UUID.randomUUID();
			ConnectorJobActivator.WellIdStack.push(wellId);
			ConnectorJobActivator.WellIdStack.push(wellId);
			jobScheduler.enqueue(uid, ConnectorJob::execute);
			return uid.toString();
		}
	}

	public void killJob(String id) {
		synchronized (lock) {
			jobScheduler.delete(UUID.fromString(id));
		}
	}
}
