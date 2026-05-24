package com.med.con_manager.utility;

import com.med.con_manager.scheduler.ConnectorJob;
import org.jobrunr.jobs.context.JobContext;
import org.jobrunr.scheduling.JobBuilder;
import org.springframework.context.annotation.Bean;

import java.time.Duration;
import java.util.UUID;

public class JobUtil {

	public static JobBuilder createJob(String jobName, String jsonStr, UUID uid, int randValue) {
		var connectorJob = new ConnectorJob();
		return JobBuilder
				.aJob()
				.withId(uid)
				.withName(String.format("%s", jobName))
				.scheduleIn(Duration.ofSeconds(randValue))
				.withDetails(() -> {
					connectorJob.execute(JobContext.Null, jsonStr);
				});
	}
}
