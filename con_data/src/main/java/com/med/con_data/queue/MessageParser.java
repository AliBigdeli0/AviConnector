package com.med.con_data.queue;

import com.med.con_common.db.DbManager;
import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.message.IgniteManager;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.CompressionManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class MessageParser {
	static AtomicInteger counter = new AtomicInteger();
	private final Lock lock = new ReentrantLock();
	private final DbWell well;

	public MessageParser(DbWell well) {
		this.well = well;
	}

	public void ParseQueue(final byte[] msg, final IgniteManager igniteManager) throws Exception {
		lock.lock();
		try {
			if (CommonEnvironmentVariables.getVerbose())
				log.info("the message counter is : {}", counter.incrementAndGet());

			final var strMsg = getJsonFromBytes(msg);

			publishToLive(strMsg);

			readMemoryAndPushToDb(strMsg, igniteManager);
		} finally {
			lock.unlock();
		}
	}

	private void readMemoryAndPushToDb(final String strMsg, IgniteManager igniteManager) throws IOException {
		final var jsonTimeDbMsg = DbTime.from(strMsg);
		igniteManager.pushTimeToMemory(jsonTimeDbMsg, well);
		if (igniteManager.sizeOfMemory(well) > CommonEnvironmentVariables.getDataCacheSize()) {
			try (var dbMan = new DbManager()) {
				var list = igniteManager.readAllCache(well);
				dbMan.bulkTimeDb(list);
			}
		}
	}

	private void publishToLive(final String strMsg) throws Exception {
		AMQPublisherSubscriber.sendMessageToExclusiveBus(well, strMsg);
	}

	private static String getJsonFromBytes(final byte[] msg) throws IOException {
		final var decompressMsg = CompressionManager.decompress(msg);
		return new String(decompressMsg);
	}

	public void ParseMessageStream(final ActiveMQStreamMessage stream, final IgniteManager igniteManager) throws Exception {
		try (var outputStream = new ByteArrayOutputStream()) {
			final byte[] buffer = new byte[0xfffff];
			int bytesRead;

			while ((bytesRead = stream.readBytes(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}

			ParseQueue(outputStream.toByteArray(), igniteManager);
		}
	}
}
