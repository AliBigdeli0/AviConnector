package com.med.con_manager.controller.api;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import jakarta.jms.JMSException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController()
@RequestMapping("/api/v1/amq")
public class AMQController {
	@Autowired
	AMQPublisherSubscriber amqPublisherSubscriber;

	@GetMapping("test")
	void produce() throws JMSException {
		amqPublisherSubscriber.produce(new ActionMessage(ActionMessage.ActionType.StopMachine, UUID.randomUUID()));
	}
}
