package com.med.con_data.queue;

import com.med.con_common.model.JsonTimeDb;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.CompressionManager;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@NoArgsConstructor
@Service
public class MessageParser {
	static int counter=0;
	public final ConcurrentLinkedDeque<JsonTimeDb> queue = new ConcurrentLinkedDeque<>();
	private final Lock lock = new ReentrantLock();

	public void ParseQueue(byte[] msg) throws IOException {
		lock.lock();
		try {
			if (CommonEnvironmentVariables.getVerbose())
				log.info("the message counter is : {}", counter++);

			final var decompressMsg = CompressionManager.decompress(msg);
			final var strMsg = new String(decompressMsg);
			final var jsonTimeDbMsg = JsonTimeDb.from(strMsg);
			queue.push(jsonTimeDbMsg);

			if (queue.size() > 60) {
				for (JsonTimeDb jsonTimeDb : queue) {
					log.info(jsonTimeDb.toString());
				}
				queue.clear();
			}
		} finally {
			lock.unlock();
		}
	}

	public void ParseMessageStream(ActiveMQStreamMessage stream) throws Exception {
		try (var outputStream = new ByteArrayOutputStream()) {
			final byte[] buffer = new byte[0xfffff];
			int bytesRead;

			while ((bytesRead = stream.readBytes(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}

			ParseQueue(outputStream.toByteArray());
		}
	}
}
