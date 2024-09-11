package com.med.con_export.task;

import com.med.con_common.db.DbManager;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.JsonWitsArray;
import com.med.con_common.utility.CompressionManager;
import com.med.con_common.utility.ConsoleHelper;
import com.med.con_common.utility.FileHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;

@Slf4j
public class ExportTaskImpl implements ExportTask {

	@Autowired
	JsonWitsArray jsonWitsArray;

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

					final var tempXmlFile = new File(String.format("./exports_temp/%s.xml", colName));
					final var sevenZFileName = new File(String.format("./exports/%s/%s.7z", wellName, colName));

					writeInFile(tempXmlFile, colDataList);
					compressFile(sevenZFileName, tempXmlFile);

					java.nio.file.Files.delete(Path.of(tempXmlFile.getAbsolutePath()));
				}
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}

			log.info("the well '{}({})' has finished!", wellName, wellId);
			ConsoleHelper.error("\nthe task finished!\n");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}

	private void compressFile(File sevenZFileName, File xmlFileName) throws Exception {
		FileHelper.createPathIfNotExist(sevenZFileName.getParentFile());
		CompressionManager.compress7Z(sevenZFileName, xmlFileName);
	}

	private void writeInFile(File fileName, List<DbTime> colDataList) throws Exception {
		try {
			FileHelper.createPathIfNotExist(fileName.getParentFile());
			var builder = new StringBuilder();

			for (final var dbTime : colDataList) {
				for (final Map.Entry<String, String> entry : dbTime.GetAllDbData.entrySet()) {
					var valueString = jsonWitsArray.getRecord(entry.getKey());
					builder.append(valueString.getLongMnemonic()).append(":").append(entry.getValue()).append(",");
				}

				builder.append("\n\r");
			}

			Files.write(Path.of(fileName.getAbsolutePath()),
					builder.toString().getBytes(),
					StandardOpenOption.CREATE,
					StandardOpenOption.APPEND);
		} finally {
			colDataList.clear();
		}
	}
}
