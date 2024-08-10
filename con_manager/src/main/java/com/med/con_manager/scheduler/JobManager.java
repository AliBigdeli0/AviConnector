package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.JobScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class JobManager {
	@Autowired
	JobScheduler jobScheduler;

	private final ConcurrentHashMap<UUID, ConnectorJob> jobs = new ConcurrentHashMap<>();

	public String newJob() {
		synchronized (jobs) {
			var job = jobScheduler.enqueue(JobManager::createNewJob);
			return job.asUUID().toString();
		}
	}

	public void createNewJob() {
		var job = new ConnectorJob();
		jobs.put(job.id, job);
		job.execute();
	}

	public void killJob(String id) {
		synchronized (jobs) {
			var uid = UUID.fromString(id);
			var currentJob = jobs.remove(uid);
			currentJob.cancel();
			jobScheduler.delete(uid);
		}
	}
}
