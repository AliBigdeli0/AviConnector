package com.med.con_data.queue;

import com.med.con_common.message.memory.Memory;
import com.med.con_common.message.memory.MemoryType;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.ConsoleHelper;
import com.med.con_common.utility.MemoryUtil;
import com.med.con_data.utility.EnvironmentVariables;
import jakarta.jms.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class ClientConsumer implements Runnable, MessageListener, Closeable {
	private long numberOfAttempts = 0x0;

	private MessageConsumer consumer;
	private Connection conn;
	private Session session;

	private final MessageParser messageParser;
	private final EnvironmentVariables environmentVariables;
	private Memory memory = null;
	private final DbWell well;
	private final MemoryType memoryType;

	public ClientConsumer(MessageParser msgParser, EnvironmentVariables environmentVariables, DbWell well , MemoryType memoryType) throws Exception {
		messageParser = msgParser;
		this.environmentVariables = environmentVariables;
		this.well = well;
		this.memoryType = memoryType;
	}

	private void ReinitConnections(String queueAddress) throws Exception {
		this.close();
		final ConnectionFactory conFactory = new ActiveMQConnectionFactory(queueAddress);

		log.info("the queue address information are {}({})",this.environmentVariables.getQueueName(), this.environmentVariables.getQueueAddress());
		this.conn = conFactory.createConnection();
		this.conn.start();
		ConsoleHelper.logIfVerbose(log, "the AMQ connection is created!");

		session = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
		final var destination = session.createQueue(this.environmentVariables.getQueueName());
		consumer = session.createConsumer(destination);
		ConsoleHelper.logIfVerbose(log, "the AMQ consumer is created!");

		initIgnite();
	}

	private void initIgnite() throws IOException {
		try {
			if (this.memory != null) {
				this.memory.close();
				this.memory = null;
				ConsoleHelper.logIfVerbose(log, "ignite is closed, going to create new connection!");
			}
			this.memory = MemoryUtil.createMemory(memoryType);
			this.memory.init(log);
			ConsoleHelper.logIfVerbose(log, "ignite manager created and initialized!");

			if (this.memory.isOffline(well)) throw new IOException("WARNING => the ignite is not available");
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw new IOException("WARNING => ignite is not available");
		}
	}

	@Override
	public void run() {
		try {
			while (numberOfAttempts < environmentVariables.getMaxReconnectAttempt() && !Thread.currentThread().isInterrupted()) {
				try {
					numberOfAttempts++;
					ReinitConnections(this.environmentVariables.getQueueAddress());

					log.info("the consumer '{}' is established!", this.environmentVariables.getQueueName());

					receiveMessageWait();
				} catch (Exception ex) {
					log.error(ex.getMessage());
				} finally {
					log.info("WARNING => All connections are closed going to reset it!");

					try {
						Thread.sleep(environmentVariables.getReconnectWaitTimeInMilliSeconds(), 0);
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
			final var msg = consumer.receive();
			if (msg == null) {
				log.error("the received message is empty!");
				break;
			}
			if (memory.isOffline(well)) {
				throw new IOException("WARNING => error in get access to ignite");
			}
			else {
				this.onMessage(msg);
			}
		}
	}

	@Override
	public void onMessage(Message message) {
		if (message instanceof ActiveMQStreamMessage streamMessage) {
			try {
				messageParser.ParseMessageStream(streamMessage, memory);
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
