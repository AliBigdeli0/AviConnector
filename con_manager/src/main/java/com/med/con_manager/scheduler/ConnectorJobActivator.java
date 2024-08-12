package com.med.con_manager.scheduler;

import com.med.con_common.model.DbWell;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.server.JobActivator;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Deque;
import java.util.concurrent.LinkedBlockingDeque;

@Component
@Slf4j
public class ConnectorJobActivator {
	public final static Deque<DbWell> WellStack = new LinkedBlockingDeque<>();

	@Bean
	public JobActivator jobActivator() {
		return new JobActivator() {
			@Override
			public <T> T activateJob(Class<T> type) {
				synchronized (WellStack) {
					var firstWell = WellStack.pop();
					log.info("====> Create a new job from activate job, well info is: {}", firstWell);
					return type.cast(new ConnectorJob(firstWell));
				}
			}
		};
	}
}
