package com.med.con_data.utility;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@Slf4j
public class Executor {
	private final ExecutorService executorService = Executors.newFixedThreadPool(40);

	public void submit(Runnable runnable) {
		executorService.submit(runnable);
	}

	public void shutdown() {
		executorService.shutdown();
	}
}
