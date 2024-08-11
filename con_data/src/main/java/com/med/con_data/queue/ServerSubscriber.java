package com.med.con_data.queue;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.MessageListener;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Objects;

@Service
@Slf4j
public class ServerSubscriber implements Runnable, MessageListener {
	private final AMQPublisherSubscriber amqPublisherSubscriber;
	private final ArrayList<Closeable> closeables = new ArrayList<>();

	public ServerSubscriber(AMQPublisherSubscriber amqPublisherSubscriber) {
		this.amqPublisherSubscriber = amqPublisherSubscriber;
		log.info("the subscriber address is '{}', topic name: '{}'",
				amqPublisherSubscriber.getMQAddress(), amqPublisherSubscriber.getMQTopicName());
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

	public void pushCloseable(Closeable closeable) {
		closeables.add(closeable);
	}

	private void parseMessage(ActionMessage actionMsg) {
		if (Objects.requireNonNull(actionMsg.getType()) == ActionMessage.ActionType.StopMachine) {
			log.info("WARNING=> program killed by subscriber message");
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
		try {
			amqPublisherSubscriber.consumer(this);
		} catch (JMSException e) {
			log.error(e.getMessage());
		}
	}
}
