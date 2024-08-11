package com.med.con_common.utility;


public class CommonEnvironmentVariables {
	public static String getIgniteAddress() {
		var value = System.getenv("MED_IGNITE_ADDRESS");
		if (value == null || value.trim().isEmpty()) {
			value = "localhost:10800";
		}
		return value;
	}
}
