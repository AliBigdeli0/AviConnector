package com.med.con_data.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentVariables {
	@Value("${MED_MAX_REATTEMPT:0xffffff}")
	private long maxReconnectAttempt;

	@Value("${MED_RECONNECT_WAIT:5000}")
	private long reconnectWaitTimeInMilliSeconds;

	@Value("${MED_WELL_ID}")
	private String wellID;

	@Value("${MED_LOG_NAME:'test'}")
	private String logName;

	@Value("${MED_QUEUE_NAME}")
	private String queueName;

	@Value("${MED_QUEUE_ADDRESS}")
	private String queueAddress;

	public long getMaxReconnectAttempt() {
		if (maxReconnectAttempt < 0)
			return 0xfffff;

		return maxReconnectAttempt;
	}

	public long getReconnectWaitTimeInMilliSeconds() {
		if (reconnectWaitTimeInMilliSeconds < 0)
			return 5000;

		return reconnectWaitTimeInMilliSeconds;
	}

	public String getWellID() {
		return wellID.trim();
	}

	public String getLogName() {
		return logName.trim();
	}

	public String getQueueName() {
		return queueName.trim();
	}

	public String getQueueAddress() {
		return queueAddress.trim();
	}
}
