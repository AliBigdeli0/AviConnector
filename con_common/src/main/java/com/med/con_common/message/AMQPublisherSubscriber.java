package com.med.con_common.message;

import com.med.con_common.model.ActionMessage;
import com.med.con_common.utility.CommonEnvironmentVariables;
import jakarta.jms.*;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.Closeable;
import org.apache.activemq.command.ActiveMQTopic;

public class AMQPublisherSubscriber implements Closeable {
	Connection con;
	Session session;

	public AMQPublisherSubscriber() {
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

	public void consumer(MessageListener msg) throws JMSException {
		var consumer = session.createConsumer(getTopic());
		consumer.setMessageListener(msg);
	}

	private Destination getTopic() {
		return new ActiveMQTopic(getMQTopicName());
	}

	public String getMQAddress() {
		return CommonEnvironmentVariables.getAMQPublisherSubscriberAddress();
	}

	public String getMQTopicName() {
		return CommonEnvironmentVariables.getAMQPublisherSubscriberName();
	}

	@Override
	public void close() throws JMSException {
		if (con != null) con.close();
		if (session != null) session.close();
	}
}
