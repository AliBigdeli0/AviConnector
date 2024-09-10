package com.med.con_export.config;

import com.med.con_export.task.ExportTask;
import com.med.con_export.task.ExportTaskImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class TaskConfig {

	@Bean
	public ExportTask exportTask() {
		return new ExportTaskImpl();
	}

	@Bean
	public ExecutorService taskExecutor() {
		return Executors.newFixedThreadPool(20);
	}
}
