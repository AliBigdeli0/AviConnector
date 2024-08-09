package com.med.con_data.utility;

import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class Executor {
	private final ExecutorService executorService = Executors.newFixedThreadPool(10);

	public void submit(Runnable runnable) {
		executorService.submit(runnable);
	}

	public void shutdown() {
		executorService.shutdown();
	}
}
