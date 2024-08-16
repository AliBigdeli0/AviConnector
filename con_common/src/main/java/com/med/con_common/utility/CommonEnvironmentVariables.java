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
		return environmentOrDefault(Constants.MED_IGNITE_ADDRESS, "ignite.local:10800");
	}

	public static String getAMQPublisherSubscriberAddress() {
		return environmentOrDefault("MED_AMQ_PUB_SUB_ADDRESS", "tcp://localhost:61616");
	}

	public static String getAMQPublisherSubscriberName() {
		return environmentOrDefault("MED_AMQ_PUB_SUB_NAME", "msg.bus");
	}

	public static String getMongoDbConnectionString() {
		return environmentOrDefault(Constants.MED_MONGO_CONN_STR, "mongodb://localhost:27017");
	}

	public static String getMongoDbName() {
		return environmentOrDefault("MED_MONGO_DB_NAME", "AVIDb");
	}

	public static Boolean getVerbose() {
		var value = environmentOrDefault(Constants.MED_VERBOSE, "false");
		return Boolean.parseBoolean(value);
	}

	public static Integer getDataCacheSize() {
		var value = environmentOrDefault("MED_DATA_CACHE_SIZE", "600");
		return Integer.parseInt(value);
	}
}
