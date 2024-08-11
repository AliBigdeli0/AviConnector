package com.med.con_manager.scheduler;

import com.med.con_manager.utility.EnvironmentVariables;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.configuration.JobRunr;
import org.jobrunr.configuration.JobRunrConfiguration;
import org.jobrunr.scheduling.JobScheduler;
import org.jobrunr.server.JobActivator;
import org.jobrunr.storage.InMemoryStorageProvider;
import org.jobrunr.storage.StorageProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Runner {

	@Autowired
	EnvironmentVariables environmentVariables;


	@Bean
	public StorageProvider storageProvider() {
		return new InMemoryStorageProvider();
	}

	@Bean
	public JobRunrConfiguration.JobRunrConfigurationResult jobRunrConfigurationResult(StorageProvider storageProvider, JobActivator jobActivator) {
		return JobRunr.configure()
				.useJobActivator(jobActivator)
				.useStorageProvider(storageProvider)
				.useBackgroundJobServer()
				.useDashboard(environmentVariables.dashboardPort)
				.useJmxExtensions()
				.initialize();
	}

	@Bean
	public JobScheduler initJobRunr(JobRunrConfiguration.JobRunrConfigurationResult configure) {
		return configure.getJobScheduler();
	}
}
