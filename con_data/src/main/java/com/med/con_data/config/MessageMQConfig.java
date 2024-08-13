package com.med.con_data.config;

import com.med.con_common.db.DbManager;
import com.med.con_data.queue.ClientConsumer;
import com.med.con_data.queue.MessageParser;
import com.med.con_data.utility.EnvironmentVariables;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Slf4j
@Configuration
public class MessageMQConfig {

	@Autowired
	EnvironmentVariables environmentVariables;

	@Bean
	public MessageParser messageParser() throws IOException {
		try (var dbMan = new DbManager()) {
			var well = dbMan.readWellWithId(environmentVariables.getWellID());
			return new MessageParser(well);
		}
	}

	@Bean
	public ClientConsumer consumer() throws Exception {
		return new ClientConsumer(messageParser(), environmentVariables);
	}
}
