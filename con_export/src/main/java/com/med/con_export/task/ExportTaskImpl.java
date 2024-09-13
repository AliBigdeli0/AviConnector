package com.med.con_export.task;

import com.med.con_common.db.DbManager;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.JsonWitsArray;
import com.med.con_common.utility.CompressionManager;
import com.med.con_common.utility.ConsoleHelper;
import com.med.con_common.utility.FileHelper;
import com.med.con_common.utility.SerializeManager;
import com.med.con_export.wrapper.LogWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.UUID;

@Slf4j
public class ExportTaskImpl implements ExportTask {

	@Autowired
	JsonWitsArray jsonWitsArray;

	final UUID fakeUUID = UUID.randomUUID();

	public List<String> readCollectionNames(String wellId) throws IOException {
		try (final var dbMan = new DbManager()) {
			return dbMan.readAllWellsTimeCollection(wellId);
		}
	}

	public List<DbTime> readColData(String colName) throws Exception {
		try (final var dbMan = new DbManager()) {
			return dbMan.readAllCollection(colName);
		}
	}

	@Override
	public void execute(String wellId, String wellName) throws Exception {
		try {
			ConsoleHelper.successNewLine("the task has been created!!");
			final var collectionNames = readCollectionNames(wellId);
			final var lenCollections = collectionNames.size();

			log.info("number of collections in '{}':{}", wellName, lenCollections);
			log.info("going to start task on well : {}", wellName);

			try {
				for (var i = 0; i < lenCollections; i++) {
					final var colName = collectionNames.get(i);
					ConsoleHelper.drawProgressBar(i, lenCollections);

					final var colDataList = readColData(colName);

					final var tempXmlFile = new File(String.format("./exports/%s/%s.xml", wellName, colName));

					FileHelper.createPathIfNotExist(tempXmlFile.getParentFile());
					dbTimeToWitsmlFile(tempXmlFile, colDataList, wellName);
				}
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}

			log.info("the well '{}({}): {}' has finished!", wellName, wellId, lenCollections);
			ConsoleHelper.error("\nthe task finished!\n");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	private boolean dbTimeToWitsmlFile(File fileName, List<DbTime> colDataList, String wellName) {
		LogWrapper logWrapper = null;
		String objectToWrite = "";
		try {
			logWrapper = new LogWrapper().addWellBore(fakeUUID, wellName).addChannelSet(colDataList, jsonWitsArray);

			objectToWrite = SerializeManager.serializeXml(logWrapper);

			Files.write(Path.of(fileName.getAbsolutePath()), objectToWrite.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
			return true;
		} catch (Exception ex) {
			log.error(ex.getMessage());
			return false;
		} finally {
			colDataList.clear();
			if (logWrapper != null) logWrapper = null;
			if (!objectToWrite.isEmpty()) objectToWrite = null;
		}
	}

	private void compressFile(File sevenZFileName, File xmlFileName) throws Exception {
		CompressionManager.compress7Z(sevenZFileName, xmlFileName);
	}
}
