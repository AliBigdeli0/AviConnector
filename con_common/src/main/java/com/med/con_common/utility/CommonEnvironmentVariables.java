package com.med.con_common.utility;


public class CommonEnvironmentVariables {

	private static String environmentOrDefault(String key, String defaultValue) {
		var value = System.getenv(key);
		if (value == null || value.trim().isEmpty()) {
			value = defaultValue;
		}
		return value;
	}

	public static String getIgniteAddress() {
		return environmentOrDefault("MED_IGNITE_ADDRESS", "localhost:10800");
	}

	public static String getAMQPublisherSubscriberAddress() {
		return environmentOrDefault("MED_AMQ_PUB_SUB_ADDRESS", "tcp://localhost:61616");
	}

	public static String getAMQPublisherSubscriberName() {
		return environmentOrDefault("MED_AMQ_PUB_SUB_NAME", "msg.bus");
	}

	public static String getMongoDbConnectionString() {
		return environmentOrDefault("MED_MONGO_CONN_STR", "mongodb://localhost:27017");
	}

	public static String getMongoDbName() {
		return environmentOrDefault("MED_MONGO_DB_NAME", "AVIDb");
	}
}
