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

	static DbManager dbMan;

	public static synchronized DbManager getDbManInstance() {
		if(dbMan == null) {
			dbMan = new DbManager();
		}
		return dbMan;
	}

	public List<String> readCollectionNames(String wellId) throws IOException {
		return getDbManInstance().readAllWellsTimeCollection(wellId);
	}

	public List<DbTime> readColData(String colName) throws Exception {
			return getDbManInstance().readAllCollection(colName);
	}

	@Override
	public void execute(String wellId, String wellName) throws Exception {
		try {
			ConsoleHelper.successNewLine("the task has been created!!");
			var collectionNames = readCollectionNames(wellId);
			var lenCollections = collectionNames.size();

			log.info("number of collections in '{}':{}", wellName, lenCollections);
			log.info("going to start task on well : {}", wellName);

			try {
				fetchDataFromCollections(wellName, lenCollections, collectionNames);
			} catch (Exception ex) {
				log.error(ex.getMessage());
			} finally {
				collectionNames = null;
				System.gc();
			}

			log.info("the well '{}({}): {}' has finished!", wellName, wellId, lenCollections);
			ConsoleHelper.error(String.format("\nthe well '%s(%s):%d'  has finished \n", wellName, wellId, lenCollections));
		} catch (Exception ex) {
			log.error(ex.getMessage());
		} finally {
//			try {
//				dbMan.close();
//			} catch (Exception ex) {
//				log.error(ex.getMessage());
//			}
		}
	}

	void fetchDataFromCollections(String wellName, int lenCollections, List<String> collectionNames) throws Exception {
		for (var i = 0; i < lenCollections; i++) {
			var colName = collectionNames.get(i);
			ConsoleHelper.drawProgressBar(i, lenCollections);

			var colDataList = readColData(colName);

			var tempXmlFile = new File(String.format("./exports/%s/%s.xml", wellName, colName));

			FileHelper.createPathIfNotExist(tempXmlFile.getParentFile());

			if (!dbTimeToWitsml(tempXmlFile, colDataList, wellName))
				log.error("collection with name '{}' has problem", colName);

			colDataList = null;
			System.gc();
		}
	}

	private boolean dbTimeToWitsml(final File fileName, final List<DbTime> colDataList, final String wellName) {
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
