package com.med.con_manager.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.jobrunr.server.JobActivator;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Deque;
import java.util.concurrent.LinkedBlockingDeque;

@Component
@Slf4j
public class ConnectorJobActivator {
	public final static Deque<String> WellIdStack = new LinkedBlockingDeque<>();

	@Bean
	public JobActivator jobActivator() {
		return new JobActivator() {
			@Override
			public <T> T activateJob(Class<T> type) {
				synchronized (WellIdStack) {
					var firstWellId = WellIdStack.pop();
					return type.cast(new ConnectorJob(firstWellId));
				}
			}
		};
	}
}
