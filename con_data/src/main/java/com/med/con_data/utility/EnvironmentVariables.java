package com.med.con_data.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentVariables {
	@Value("${MED_MAX_REATTEMPT:0xffffff}")
	public  long MaxReconnectAttempt;

	@Value("${MED_RECONNECT_WAIT:5000}")
	public  long ReconnectWaitTimeInMilliSeconds;

	@Value("${MED_WELL_ID}")
	public String wellID;

	@Value("${MED_LOG_NAME:'test'}")
	public String logName;

	@Value("${MED_QUEUE_NAME}")
	public String QueueName;

	@Value("${MED_QUEUE_ADDRESS}")
	public String QueueAddress;
}
