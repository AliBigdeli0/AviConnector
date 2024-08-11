package com.med.con_common.utility;


public class CommonEnvironmentVariables {
	public static String getIgniteAddress() {
		var value = System.getenv("MED_IGNITE_ADDRESS");
		if (value == null || value.trim().isEmpty()) {
			value = "localhost:10800";
		}
		return value;
	}

	public static String getAMQPublisherSubscriberAddress() {
		var value = System.getenv("MED_AMQ_PUB_SUB_ADDRESS");
		if (value == null || value.trim().isEmpty()) {
			value = "tcp://localhost:61616";
		}
		return value;
	}

	public static String getAMQPublisherSubscriberName() {
		var value = System.getenv("MED_AMQ_PUB_SUB_NAME");
		if (value == null || value.trim().isEmpty()) {
			value = "msg.bus";
		}
		return value;
	}
}
