package com.med.con_manager.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentVariables {
	@Value("${MED_ZOOKEEPER_ADDRESS:localhost:2181}")
	private String zookeeperAddress;

	@Value("${MED_ZOOKEEPER_TIMEOUT:5000}")
	private int zookeeperSessionTimeout;

	@Value("${MED_DASHBOARD_PORT:12001}")
	public int dashboardPort;

	@Value("${MED_SCHEDULER_MIN_WAIT_TIME:1}")
	public int schedulerMinWaitInSecond;

	@Value("${MED_SCHEDULER_MAX_WAIT_TIME:4}")
	public int schedulerMaxWaitInSecond;

	public String getZookeeperAddress() {
		return zookeeperAddress.trim();
	}
	
	public int getZookeeperSessionTimeout() {
		if (zookeeperSessionTimeout < 0) {
			return 5000;
		}
		return zookeeperSessionTimeout;
	}
}
