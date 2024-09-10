package com.med.con_export.task;

import org.springframework.scheduling.annotation.Async;

public interface ExportTask {
	@Async
	void execute(String wellId, String wellName);
}
