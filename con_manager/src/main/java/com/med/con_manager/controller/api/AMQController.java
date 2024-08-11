package com.med.con_manager.controller.api;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import jakarta.jms.JMSException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController()
@RequestMapping("/api/v1/amq")
@Slf4j
public class AMQController {


	@GetMapping("test")
	void produce() throws JMSException {
		AMQPublisherSubscriber amqPublisherSubscriber = null;
		try {
			amqPublisherSubscriber = new AMQPublisherSubscriber();
			amqPublisherSubscriber.init();
			amqPublisherSubscriber.produce(new ActionMessage(ActionMessage.ActionType.StopMachine, UUID.randomUUID()));
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw ex;
		} finally {
			if (amqPublisherSubscriber != null) {
				amqPublisherSubscriber.close();
			}
		}
	}
}
