package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class JobLocalManager implements JobManager {
	private final ConcurrentHashMap<DbWell, ConnectorJob> jobs = new ConcurrentHashMap<>();
	private final Lock lock = new ReentrantLock();

	@Override
	public String newJob(DbWell well) throws Exception {
		lock.lock();
		try {
			if (checkJobExist(well))
				throw new Exception(String.format("job for well '%s' is currently running", well.getJobName()));
			var newJob = new ConnectorJob(well);
			newJob.execute();
			jobs.put(well, newJob);
			return "job has created!";
		} finally {
			lock.unlock();
		}
	}

	@Override
	public boolean checkJobExist(DbWell well) {
		return jobs.get(well) != null;
	}

	@Override
	public void killJob(DbWell well) throws Exception {
		lock.lock();
		try {
			if (!checkJobExist(well)) throw new Exception("the specified job does not exist!");
			var job = jobs.get(well);
			job.cancel();
			jobs.remove(well);
		} finally {
			lock.unlock();
		}
	}

	@PreDestroy
	public void cleanup() {
		lock.lock();
		try {
			for (var job : jobs.values()) {
				job.cancel();
			}
		} finally {
			lock.unlock();
		}
	}
}
