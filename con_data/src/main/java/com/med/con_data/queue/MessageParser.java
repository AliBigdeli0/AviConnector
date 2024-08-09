package com.med.con_data.queue;

import jakarta.jms.JMSException;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Slf4j
@NoArgsConstructor
@Service
public class MessageParser {
	static int counter=0;
	public void ParseQueue(byte[] msg) {
		var msgStr = new String(msg);

		System.out.printf("\rthe counter is: %d", counter++);
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
