package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import com.med.con_manager.utility.EnvironmentVariables;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.Job;
import org.jobrunr.jobs.states.StateName;
import org.jobrunr.scheduling.BackgroundJob;
import org.jobrunr.scheduling.JobBuilder;
import org.jobrunr.storage.StorageProvider;
import org.jobrunr.storage.navigation.AmountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
public class JobManager {

	@Autowired
	StorageProvider storageProvider;

	@Autowired
	EnvironmentVariables environmentVariables;

	private final Object lock = new Object();

	public String newJob(DbWell well) throws Exception {

		if (checkJobExist(well))
			throw new Exception("requested job with name '" + well.getJobName() + "' exist in process list!");

		synchronized (ConnectorJobActivator.WellStack) {
			var uid = UUID.randomUUID();
			var randValue = new Random().nextInt(environmentVariables.schedulerMinWaitInSecond,
					environmentVariables.schedulerMaxWaitInSecond);

			ConnectorJobActivator.WellStack.push(well);
			ConnectorJobActivator.WellStack.push(well);

			var job = JobBuilder
					.aJob()
					.withId(uid)
					.withName(String.format("%s", well.getJobName()))
					.scheduleIn(Duration.ofSeconds(randValue))
					.withDetails(ConnectorJob::execute);

			BackgroundJob.create(job);

			return uid.toString();
		}
	}

	public boolean checkJobExist(DbWell well) {
		var job = getJobWithWellName(well);
		return job != null;
	}

	private Job getJobWithWellName(DbWell well) {
		var listProcessJobs = storageProvider.getJobList(StateName.PROCESSING, new AmountRequest("", 0xfff));
		var listQueuedJobs = storageProvider.getJobList(StateName.ENQUEUED, new AmountRequest("", 0xfff));

		var processJob = listProcessJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();
		var enqueueJob = listQueuedJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();

		if (processJob.isPresent()) {
			return processJob.get();
		} else if (enqueueJob.isPresent()) {
			return enqueueJob.get();
		}
		return null;
	}

	public void killJob(DbWell well) throws Exception {
		var job = getJobWithWellName(well);
		if (job != null) {
			storageProvider.deletePermanently(job.getId());
		} else {
			throw new Exception("job does not exist in the list of jobs");
		}
	}

	public void killJob(String id) {
		synchronized (lock) {
			BackgroundJob.delete(UUID.fromString(id));
		}
	}
}

