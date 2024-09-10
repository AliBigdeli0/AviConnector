package com.med.con_export.task;

import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
public class ExportTaskImpl implements ExportTask {
	@Override
	public void execute(String wellId, String wellName) {
		try {
			log.info("going to start task on well : {}", wellName);
			Thread.sleep(10000 + (new Random().nextInt(1000, 5000)));
			log.info("the well with id : {} has finished", wellId);
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
	}
}
