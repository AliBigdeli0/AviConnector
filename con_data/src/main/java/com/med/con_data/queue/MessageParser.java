package com.med.con_data.queue;

import com.med.con_common.db.DbManager;
import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.message.memory.Memory;
import com.med.con_common.model.DbComment;
import com.med.con_common.model.DbDepth;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.CompressionManager;
import com.med.con_common.utility.ConsoleHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQStreamMessage;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class MessageParser {
	static AtomicInteger counter = new AtomicInteger();
	private final Lock lock = new ReentrantLock();
	private final DbWell well;
	private String lastComment = "";
	private double lastDepth = 0;

	public MessageParser(DbWell well) {
		this.well = well;
	}

	public void ParseQueue(final byte[] msg, final Memory igniteMemory) throws Exception {
		lock.lock();
		try {
			ConsoleHelper.logIfVerbose(log, "the message counter is : {}", counter.incrementAndGet());

			final var strMsg = getJsonFromBytes(msg);
			final var jsonTimeDbMsg = DbTime.from(strMsg);

			publishToLive(strMsg);

			commentActions(jsonTimeDbMsg);
			depthActions(jsonTimeDbMsg);
			timeActions(jsonTimeDbMsg, igniteMemory);
		} finally {
			lock.unlock();
		}
	}

	private void depthActions(DbTime jsonTimeDbMsg) {
		if(Strings.isNotBlank(jsonTimeDbMsg.TotalDepth)) {
			var currentDepth = Double.parseDouble(jsonTimeDbMsg.TotalDepth);
			if(lastDepth != currentDepth) {
				var dbDepth = new DbDepth();
				dbDepth.fill(jsonTimeDbMsg);

				try(var dbMan = new DbManager()){
					dbMan.insertDepth(dbDepth);
				}catch (Exception ex){
					log.error(ex.getMessage());
				}

				lastDepth = currentDepth;

				ConsoleHelper.logIfVerbose(log, "==========> the depth value inserted at depth: {}", jsonTimeDbMsg.TotalDepth);
			}
		}
	}

	private void commentActions(DbTime jsonTimeDbMsg) {
		if(Strings.isNotEmpty(jsonTimeDbMsg.Comment))
			if(!Objects.equals(jsonTimeDbMsg.Comment, lastComment))
			{
				pushToComments(jsonTimeDbMsg);
				lastComment = jsonTimeDbMsg.Comment;
			}
	}

	private void pushToComments(DbTime jsonTimeDbMsg)  {
		var commentStr = jsonTimeDbMsg.Comment;
		var wellId = well.getID();
		Optional<Double> totalDepth = Strings.isNotBlank(jsonTimeDbMsg.TotalDepth) ? Optional.empty() : Optional.of(Double.parseDouble(jsonTimeDbMsg.TotalDepth));
		var dateStr = jsonTimeDbMsg.Date;

		var dbComment = new DbComment(commentStr, dateStr, totalDepth, wellId);
		try(var dbMan = new DbManager()) {
			dbMan.insertComment(dbComment);
		}catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	private void timeActions(final DbTime jsonTimeDbMsg, Memory igniteMemory) throws IOException {
		igniteMemory.pushTimeToMemory(jsonTimeDbMsg, well);
		if (igniteMemory.sizeOfMemory(well) > CommonEnvironmentVariables.getDataCacheSize()) {
			try (var dbMan = new DbManager()) {
				var list = igniteMemory.readAllCache(well);
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

	public void ParseMessageStream(final ActiveMQStreamMessage stream, final Memory igniteMemory) throws Exception {
		try (var outputStream = new ByteArrayOutputStream()) {
			final byte[] buffer = new byte[0xfffff];
			int bytesRead;

			while ((bytesRead = stream.readBytes(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}

			ParseQueue(outputStream.toByteArray(), igniteMemory);
		}
	}
}
