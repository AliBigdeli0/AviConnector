package com.med.con_data.queue;

import com.med.con_common.utility.CommonEnvironmentVariables;
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
//		var msgStr = new String(msg);

		if (CommonEnvironmentVariables.getVerbose())
			log.info("the message counter is : {}", counter++);
	}

	public void ParseMessageStream(ActiveMQStreamMessage stream) throws JMSException {
		var outputStream = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int bytesRead;
		log.info("{} > before receive message", counter);
		while((bytesRead = stream.readBytes(buffer)) != -1) {
			outputStream.write(buffer, 0 , bytesRead);
		}
		log.info("{} > after receive message", counter);

		var bytes = outputStream.toByteArray();
		ParseQueue(bytes);
	}
}
