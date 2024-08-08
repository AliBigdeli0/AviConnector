package com.med.connector.config;

import com.med.connector.queue.Consumer;
import com.med.connector.queue.MessageParser;
import com.med.connector.utility.EnvironmentVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class AppConfig {

	@Autowired
	MessageParser messageParser;

	@Autowired
	EnvironmentVariables environmentVariables;

	@Bean
	public Consumer consumer() throws Exception {
		return new Consumer(messageParser, environmentVariables);
	}
}
