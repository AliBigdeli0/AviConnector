package com.med.connector.queue;

import com.med.connector.utility.EnvironmentVariables;
import jakarta.jms.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;

@Slf4j
@Service
public class Consumer implements Runnable, MessageListener, Closeable {

	private long numberOfAttempts = 0x0;

	private final String queueName;
	private final String queueAddress;

	private MessageConsumer consumer;
	private Connection conn;
	private Session session;

	private final MessageParser messageParser;
	private final EnvironmentVariables environmentVariables;

	public Consumer(String queueName, String queueAddress, MessageParser msgParser, EnvironmentVariables environmentVariables) throws Exception {
		this.queueName = queueName;
		messageParser = msgParser;
		this.queueAddress = queueAddress;
		this.environmentVariables = environmentVariables;
	}

	private void ReinitConnection(String queueAddress) throws Exception {
		this.close();
		ConnectionFactory conFactory = new ActiveMQConnectionFactory(queueAddress);
		this.conn = conFactory.createConnection();
		this.conn.start();

		session = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
		var destination = session.createQueue(this.queueName);
		consumer = session.createConsumer(destination);
	}

	@Override
	public void run() {
		try {
			while (numberOfAttempts < environmentVariables.MaxReconnectAttempt && !Thread.currentThread().isInterrupted()) {
				try {
					numberOfAttempts++;
					ReinitConnection(this.queueAddress);

					log.info("the consumer '{}' is established!", this.queueName);

					receiveMessageWait();
				} catch (Exception ex) {
					log.error(ex.getMessage());
				} finally {
					log.info("WARNING => Connection to '{}' is closed. going to reset it!", this.queueAddress);

					try {
						Thread.sleep(environmentVariables.ReconnectWaitTimeInMilliSeconds, 0);
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

	private void receiveMessageWait() throws Exception {
		while (!Thread.currentThread().isInterrupted()) {
			var msg = consumer.receive();
			if (msg == null)  break;

			this.onMessage(msg);
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
