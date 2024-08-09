package com.med.con_data.config;

import com.med.con_data.queue.Consumer;
import com.med.con_data.queue.MessageParser;
import com.med.con_data.utility.EnvironmentVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
