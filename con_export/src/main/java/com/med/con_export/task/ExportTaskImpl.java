package com.med.con_export.task;

import com.med.con_common.utility.ConsoleHelper;
import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
public class ExportTaskImpl implements ExportTask {
	@Override
	public void execute(String wellId, String wellName) {
		try {
			log.info("going to start task on well : {}", wellName);
			ConsoleHelper.successNewLine("the task has been created!!");
			Thread.sleep(10000 + (new Random().nextInt(1000, 5000)));
			log.info("the well with id : {} has finished", wellId);
			for(var i = 0; i < 100; i++) {
				Thread.sleep(500);
				ConsoleHelper.drawProgressBar(i, 100);
			}
			ConsoleHelper.error("the task finished!");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}
}
