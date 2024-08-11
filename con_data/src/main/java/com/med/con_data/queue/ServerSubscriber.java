package com.med.con_data.queue;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import com.med.con_data.utility.EnvironmentVariables;
import jakarta.jms.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Objects;

@Service
@Slf4j
public class ServerSubscriber implements Runnable, MessageListener {
	private AMQPublisherSubscriber amqPublisherSubscriber;
	private final ArrayList<Closeable> closeables = new ArrayList<>();
	private final EnvironmentVariables environmentVariables;

	public ServerSubscriber(EnvironmentVariables environmentVariables) {
		this.environmentVariables = environmentVariables;
	}

	@Override
	public void onMessage(Message message) {
		if (message instanceof TextMessage msgTxt) {
			try {
				var jsonTxt = msgTxt.getText();
				var actionMsg = ActionMessage.fromJson(jsonTxt);
				parseMessage(actionMsg);
			} catch (JMSException e) {
				log.error(e.getMessage());
			}
		}
	}

	private void reinitConnection() throws JMSException {
		if (amqPublisherSubscriber != null)
			amqPublisherSubscriber.close();
		amqPublisherSubscriber = new AMQPublisherSubscriber();
		amqPublisherSubscriber.init();
	}

	public void pushCloseable(Closeable closeable) {
		closeables.add(closeable);
	}

	private void parseMessage(ActionMessage actionMsg) {
		if (Objects.requireNonNull(actionMsg.getType()) == ActionMessage.ActionType.StopMachine) {
			if (!Objects.equals(environmentVariables.getWellID(), actionMsg.getWellId())) return;
			log.info("WARNING ===> going to kill well id : '{}'", actionMsg.getWellId());

			closeables.forEach(c -> {
				try {
					c.close();
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			});
		}
	}

	@Override
	public void run() {
		while (!Thread.currentThread().isInterrupted()) {
			try {
				reinitConnection();
				log.info("the subscriber address is '{}', topic name: '{}'",
						amqPublisherSubscriber.getMQAddress(), amqPublisherSubscriber.getMQTopicName());
				try (var consumer = amqPublisherSubscriber.consumer(this)) {
					receiveMessageWait(consumer);
				}
			} catch (Exception e) {
				log.error(e.getMessage());
			} finally {
				log.info("WARNING => topic with name '{}' is closed. going to reset it!", this.amqPublisherSubscriber.getMQTopicName());

				try {
					Thread.sleep(environmentVariables.getReconnectWaitTimeInMilliSeconds(), 0);
				} catch (Exception ex) {
					log.error("error in sleep time for consumer reconnect: {}", ex.getMessage());
				}
			}
			log.error("DANGER=> the topic connection closed for no reason");
		}
	}

	private void receiveMessageWait(MessageConsumer consumer) throws Exception {
		while (!Thread.currentThread().isInterrupted()) {
			var msg = consumer.receive();
			if (msg == null) break;

			this.onMessage(msg);
		}
	}
}
