package com.med.connector.queue;

import jakarta.jms.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;

@Slf4j
@Service
public class Consumer implements Runnable, MessageListener, Closeable {

	@Value("${MED_MAX_REATTEMPT:0xffffff}")
	private long MaxReconnectAttempt;

	@Value("${MED_RECONNECT_WAIT:5000}")
	private long ReconnectWaitTimeInMilliSeconds;


	private long numberOfAttempts = 0x0;

	private final String queueName;
	private final String queueAddress;

	private MessageConsumer consumer;
	private Connection conn;
	private Session session;

	private final MessageParser messageParser;

	public Consumer(String queueName, String queueAddress, MessageParser msgParser) throws JMSException {
		this.queueName = queueName;
		messageParser = msgParser;
		this.queueAddress = queueAddress;
	}

	private void ReinitConnection(String queueAddress) throws Exception {
		this.close();
		ConnectionFactory conFactory = new ActiveMQConnectionFactory(queueAddress);
		this.conn = conFactory.createConnection();
		this.conn.start();

		session = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
		var destination = session.createQueue(this.queueName);
		consumer = session.createConsumer(destination);
		// consumer.setMessageListener(this);
	}

	@Override
	public void run() {
		try {
			while (numberOfAttempts < MaxReconnectAttempt) {
				try {
					numberOfAttempts++;
					ReinitConnection(this.queueAddress);

					log.info("the consumer '{}' is established!", this.queueName);

					while (true) {
						var msg = consumer.receive();
						if (msg == null)  break;

						this.onMessage(msg);
					}
				} catch (Exception ex) {
					log.error(ex.getMessage());
				} finally {
					log.info("WARNING => Connection to '{}' is closed. going to reset it!", this.queueAddress);

					try {
						Thread.sleep(ReconnectWaitTimeInMilliSeconds, 0);
					} catch (Exception ex) {
						log.error("error in sleep time for consumer reconnect: {}", ex.getMessage());
					}
				}
			}
			log.error("DANGER=> the JMS connection closed for no reason");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	@Override
	public void onMessage(Message message) {
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
			if (this.consumer != null) this.consumer.close();
			if (this.session != null) this.session.close();
			if (this.conn != null) this.conn.close();
		} catch (JMSException e) {
			log.error(e.getMessage());
		}
	}
}
