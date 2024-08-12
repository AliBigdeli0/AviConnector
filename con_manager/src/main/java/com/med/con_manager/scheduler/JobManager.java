package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;

public interface JobManager {
	String newJob(DbWell well) throws Exception;

	boolean checkJobExist(DbWell well);

	void killJob(DbWell well) throws Exception;
}
