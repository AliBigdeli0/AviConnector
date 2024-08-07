package com.med.connector.queue;

import jakarta.jms.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;

@Slf4j
@Service
public class Consumer implements Runnable, MessageListener, Closeable {
	private final String queueName;

	private MessageConsumer consumer;
	private final Connection conn;
	private Session session;

	private MessageParser messageParser;

	public Consumer(String queueName, String queueAddress, MessageParser msgParser) throws JMSException {
		this.queueName = queueName;
		messageParser = msgParser;
		ConnectionFactory conFactory = new ActiveMQConnectionFactory(queueAddress);
		conn = conFactory.createConnection();
	}

	@Override
	public void run() {
		try {
			conn.start();

			session = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
			var destination = session.createQueue(this.queueName);
			consumer = session.createConsumer(destination);
			consumer.setMessageListener(this);

		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	@Override
	public void onMessage(Message message) {
		log.info("the message is called");
		if (message instanceof ActiveMQStreamMessage streamMessage) {
			try {
				messageParser.ParseMessageStream(streamMessage);
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}

	@Override
	public void close() throws IOException {
		try {
			this.consumer.close();
			this.session.close();
			this.conn.close();
		} catch (JMSException e) {
			log.error(e.getMessage());
		}

	}
}
