package com.med.connector.config;

import com.med.connector.queue.Consumer;
import com.med.connector.queue.MessageParser;
import jakarta.jms.JMSException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class ApConfig {

	@Autowired
	MessageParser messageParser;

	@Bean
	public ExecutorService executorService() {
		return Executors.newFixedThreadPool(10);
	}

	@Bean
	public Consumer consumer() throws JMSException {
		return new Consumer("A_MF_DATA_VALUE", "tcp://localhost:61616", messageParser);
	}
}
