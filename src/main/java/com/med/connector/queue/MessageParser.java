package com.med.connector.queue;

import jakarta.jms.JMSException;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

@Slf4j
@NoArgsConstructor
@Service
public class MessageParser {

	public void ParseQueue(byte[] msg) {
		var msgStr = new String(msg);
		log.info("the message is : {}", msgStr);
	}

	public void ParseMessageStream(ActiveMQStreamMessage stream) throws JMSException {
		var outputStream = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int bytesRead;
		while((bytesRead = stream.readBytes(buffer)) != -1) {
			outputStream.write(buffer, 0 , bytesRead);
		}

		var bytes = outputStream.toByteArray();
		ParseQueue(bytes);
	}
}
