package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import com.med.con_manager.utility.EnvironmentVariables;
import com.med.con_manager.utility.JobUtil;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.Job;
import org.jobrunr.jobs.states.StateName;
import org.jobrunr.scheduling.BackgroundJob;
import org.jobrunr.storage.StorageProvider;
import org.jobrunr.storage.navigation.AmountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class JobRunrManager implements JobManager {

	@Autowired
	StorageProvider storageProvider;

	@Autowired
	EnvironmentVariables environmentVariables;

	private final Lock lock = new ReentrantLock();

	public String newJob(DbWell well) throws Exception {

		if (checkJobExist(well))
			throw new Exception("requested job with name '" + well.getJobName() + "' exist in process list!");

		synchronized (lock) {
			var uid = UUID.randomUUID();
			var randValue = new Random().nextInt(environmentVariables.schedulerMinWaitInSecond,
					environmentVariables.schedulerMaxWaitInSecond);

			var job = JobUtil.createJob(well.getJobName(), well.toJson(), uid, randValue);

			BackgroundJob.create(job);
			return uid.toString();
		}
	}

	public boolean checkJobExist(DbWell well) {
		var job = getJobWithWellName(well);
		return job != null;
	}

	@EventListener
	private void reRunAllSucceededJobsAtStartup(ContextRefreshedEvent event) {
		final var listSucceededJobs = storageProvider.getJobList(StateName.SUCCEEDED, new AmountRequest("", 0xfff));

		for (var job : listSucceededJobs) {
			var jobName = job.getJobName();
			var jobData = job.getJobDetails().getJobParameters().get(1);
			BackgroundJob.create(JobUtil.createJob(jobName, jobData.getObject().toString(), UUID.randomUUID(), 2));

			storageProvider.deletePermanently(job.getId());
		}
	}

	private Job getJobWithWellName(DbWell well) {
		final var listProcessJobs = storageProvider.getJobList(StateName.PROCESSING, new AmountRequest("", 0xfff));
		final var listQueuedJobs = storageProvider.getJobList(StateName.ENQUEUED, new AmountRequest("", 0xfff));
		final var listSucceededJobs = storageProvider.getJobList(StateName.SUCCEEDED, new AmountRequest("", 0xfff));
		final var listScheduledJobs = storageProvider.getJobList(StateName.SCHEDULED, new AmountRequest("", 0xfff));


		var processJob = listProcessJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();
		var enqueueJob = listQueuedJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();
		var succeededJob = listSucceededJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();
		var scheduledJob = listScheduledJobs.stream().filter(j -> Objects.equals(j.getJobName(), well.getJobName())).findFirst();

		if (processJob.isPresent()) {
			return processJob.get();
		} else if (enqueueJob.isPresent()) {
			return enqueueJob.get();
		} else if (succeededJob.isPresent()) {
			return succeededJob.get();
		} else if (scheduledJob.isPresent()) {
			return scheduledJob.get();
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
}

