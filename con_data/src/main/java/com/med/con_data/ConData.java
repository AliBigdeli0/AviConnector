package com.med.con_data;

import com.med.con_common.Info;
import com.med.con_data.queue.ClientConsumer;
import com.med.con_data.utility.Executor;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@Slf4j
public class ConData {

	@Autowired
	Executor executorService;

	@Autowired
	ClientConsumer consumer;

	public static void main(String[] args) {
		SpringApplication.run(ConData.class, args);
	}

	@PostConstruct
	public void init() {
		log.info("the common version is : {}", Info.Version);
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			executorService.shutdown();
		}));
	}

	@Bean
	public CommandLineRunner run() {
		return args -> {
			executorService.submit(consumer);
		};
	}
}
