package com.med.connector.utility;

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
}
