package com.med.con_manager.scheduler;

import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_manager.utility.EnvironmentVariables;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.bson.UuidRepresentation;
import org.jobrunr.configuration.JobRunr;
import org.jobrunr.configuration.JobRunrConfiguration;
import org.jobrunr.scheduling.JobScheduler;
import org.jobrunr.server.BackgroundJobServerConfiguration;
import org.jobrunr.storage.InMemoryStorageProvider;
import org.jobrunr.storage.StorageProvider;
import org.jobrunr.storage.nosql.mongo.MongoDBStorageProvider;
import org.springframework.beans.factory.BeanExpressionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Runner {
	@Autowired
	EnvironmentVariables environmentVariables;

	@Value("${med.job-manager.db-type.value}")
	private String jobType;

	public StorageProvider storageProviderMongodb() {
		var connectionString = new ConnectionString(CommonEnvironmentVariables.getMongoDbConnectionString());

		MongoClientSettings settings = MongoClientSettings.builder()
				.uuidRepresentation(UuidRepresentation.JAVA_LEGACY)
				.applyConnectionString(connectionString)
				.build();

		var mongoClient = MongoClients.create(settings);

		return new MongoDBStorageProvider(mongoClient);
	}

	public StorageProvider storageProviderInMemory() {
		return new InMemoryStorageProvider();
	}

	@Bean
	public StorageProvider storageProvider() {
		return switch (jobType) {
			case "InMemory" -> storageProviderInMemory();
			case "Mongodb" -> storageProviderMongodb();
			default -> throw new BeanExpressionException("invalid storage provider type");
		};
	}

	@Bean
	public BackgroundJobServerConfiguration backgroundJobServerConfiguration() {
		return BackgroundJobServerConfiguration
				.usingStandardBackgroundJobServerConfiguration();
	}

	@Bean
	public JobRunrConfiguration.JobRunrConfigurationResult
	jobRunrConfigurationResult(
			StorageProvider storageProvider,
			BackgroundJobServerConfiguration backgroundJobServerConfiguration
	) {
		return JobRunr.configure()
				.useStorageProvider(storageProvider)
				.useBackgroundJobServer(backgroundJobServerConfiguration)
				.useDashboard(environmentVariables.dashboardPort)
				.useJmxExtensions()
				.initialize();
	}

	@Bean
	public JobScheduler initJobRunr(JobRunrConfiguration.JobRunrConfigurationResult configure) {
		return configure.getJobScheduler();
	}

}
