package com.med.con_data.config;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_data.queue.ClientConsumer;
import com.med.con_data.queue.MessageParser;
import com.med.con_data.queue.ServerSubscriber;
import com.med.con_data.utility.EnvironmentVariables;
import jakarta.jms.JMSException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class MessageMQConfig {

	@Autowired
	MessageParser messageParser;

	@Autowired
	EnvironmentVariables environmentVariables;

	@Bean
	public ClientConsumer consumer() throws Exception {
		return new ClientConsumer(messageParser, environmentVariables);
	}
}
