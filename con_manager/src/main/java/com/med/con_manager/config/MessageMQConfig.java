package com.med.con_manager.config;

import com.med.con_common.message.AMQPublisherSubscriber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class MessageMQConfig {

	@Bean
	public AMQPublisherSubscriber getPublisher() throws Exception {
		var mq = new AMQPublisherSubscriber();
		mq.init();
		return mq;
	}
}
