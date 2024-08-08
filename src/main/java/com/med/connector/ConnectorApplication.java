package com.med.connector;

import com.med.connector.queue.Consumer;
import com.med.connector.utility.Executor;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.concurrent.ExecutorService;

@SpringBootApplication
public class ConnectorApplication {

	@Autowired
	Executor executorService;

	@Autowired
	Consumer consumer;

	public static void main(String[] args) {
		SpringApplication.run(ConnectorApplication.class, args);
	}

	@PostConstruct
	public void init() {
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
