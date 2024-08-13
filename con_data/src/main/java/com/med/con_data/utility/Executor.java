package com.med.con_data.utility;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

class HighPriorityThreads implements ThreadFactory {
	@Override
	public Thread newThread(Runnable r) {
		var thread = new Thread(r);
		thread.setPriority(Thread.MAX_PRIORITY);
		return thread;
	}
}

@Service
@Slf4j
public class Executor {
	private final ExecutorService executorService;

	public Executor() {
		executorService = Executors.newFixedThreadPool(40, new HighPriorityThreads());
	}

	public void submit(Runnable runnable) {
		executorService.submit(runnable);
	}

	public void shutdown() {
		executorService.shutdown();
	}
}
