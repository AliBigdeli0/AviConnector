package com.med.con_data.queue;

import com.med.con_common.db.DbManager;
import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.CompressionManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class MessageParser {
	static int counter=0;
	public final ConcurrentLinkedDeque<DbTime> queue = new ConcurrentLinkedDeque<>();
	private final Lock lock = new ReentrantLock();
	private final DbWell well;

	public MessageParser(DbWell well) {
		this.well = well;
	}

	public void ParseQueue(byte[] msg) throws Exception {
		lock.lock();
		try (final var dbMan = new DbManager()) {
			if (CommonEnvironmentVariables.getVerbose())
				log.info("the message counter is : {}", counter++);

			final var decompressMsg = CompressionManager.decompress(msg);
			final var strMsg = new String(decompressMsg);

			AMQPublisherSubscriber.sendMessageToExclusiveBus(well, strMsg);

			final var jsonTimeDbMsg = DbTime.from(strMsg);
			queue.push(jsonTimeDbMsg);

			if (queue.size() > 60) {
				dbMan.bulkTimeDb(queue.stream().toList());
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
