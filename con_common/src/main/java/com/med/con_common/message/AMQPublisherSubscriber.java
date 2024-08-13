package com.med.con_common.message;

import com.med.con_common.message.topic.CommonTopicInjection;
import com.med.con_common.message.topic.ExclusiveTopicInjection;
import com.med.con_common.message.topic.TopicInjection;
import com.med.con_common.model.ActionMessage;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import jakarta.jms.*;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.Closeable;
import org.apache.activemq.command.ActiveMQTopic;

import java.util.UUID;

public class AMQPublisherSubscriber implements Closeable {
	Connection con;
	Session session;
	public TopicInjection topic;

	public AMQPublisherSubscriber(TopicInjection topic) {
		this.topic = topic;
	}

	public void init() throws JMSException {
		var amqConFactory = new ActiveMQConnectionFactory(getMQAddress());
		con = amqConFactory.createConnection();
		con.start();

		session = con.createSession(false, Session.AUTO_ACKNOWLEDGE);
	}

	public void produce(ActionMessage msg) throws JMSException {
		var msgTxt = session.createTextMessage(msg.toJson());

		var producer = session.createProducer(getTopic());
		producer.send(msgTxt);
	}

	public void produce(String msg) throws JMSException {
		var msgTxt = session.createTextMessage(msg);

		var producer = session.createProducer(getTopic());
		producer.send(msgTxt);
	}

	public MessageConsumer consumer(MessageListener msg) throws JMSException {
		return session.createConsumer(getTopic());
	}

	private Destination getTopic() {
		return new ActiveMQTopic(this.topic.getTopicName());
	}

	public String getMQAddress() {
		return CommonEnvironmentVariables.getAMQPublisherSubscriberAddress();
	}


	@Override
	public void close() throws JMSException {
		if (con != null) con.close();
		if (session != null) session.close();
	}

	public static void sendMessageToCommonBus(ActionMessage.ActionType type, String wellId) throws Exception {
		AMQPublisherSubscriber amqPubSub = null;
		try {
			amqPubSub = new AMQPublisherSubscriber(new CommonTopicInjection());
			amqPubSub.init();
			amqPubSub.produce(new ActionMessage(type, UUID.randomUUID().toString(), wellId));
		} finally {
			if (amqPubSub != null) {
				amqPubSub.close();
			}
		}
	}

	public static void sendMessageToExclusiveBus(DbWell well, String content) throws Exception {
		AMQPublisherSubscriber amqPubSub = null;
		try {
			amqPubSub = new AMQPublisherSubscriber(new ExclusiveTopicInjection(well));
			amqPubSub.init();
			amqPubSub.produce(content);
		} finally {
			if (amqPubSub != null) {
				amqPubSub.close();
			}
		}
	}
}
