package com.med.con_export;

import com.med.con_common.utility.ConsoleHelper;
import com.med.con_export.config.WellsConfig;
import com.med.con_export.task.ExportTask;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@SpringBootApplication
@EnableConfigurationProperties(WellsConfig.class)
public class ConExport {

	@Autowired
	private WellsConfig wellsConfig;

	@Autowired
	private ExportTask exportTask;

	@Autowired
	private ExecutorService taskExecutor;

	private static ConfigurableApplicationContext context;

	public static void main(String[] args) {
		ConsoleHelper.successNewLine("system started!!!");
		context = SpringApplication.run(ConExport.class, args);
	}

	@PostConstruct
	public void postConstruct() throws Exception {
		log.info("list wells are: {}", Strings.join(wellsConfig.getWells().values(), ','));

		wellsConfig.getWells().forEach((wellId, wellName)->{
			taskExecutor.execute(()->{
				exportTask.execute(wellId, wellName);
			});
		});

		if(!taskExecutor.awaitTermination(Integer.MAX_VALUE - 1, TimeUnit.SECONDS)) {
			taskExecutor.shutdown();
		}

		log.info("going to shutdown all application.");
		SpringApplication.exit(context, ()->0);
	}
}