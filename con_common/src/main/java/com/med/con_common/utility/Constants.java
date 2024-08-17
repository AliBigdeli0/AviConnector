package com.med.con_common.utility;

import java.nio.file.Path;

public final class Constants {
	public static final String CON_DATA_JAR_NAME = "con_data-1.0.0-plain.jar";
	public static final String CON_DATA_MAIN_CLASS = "com.med.con_data.ConData";
	public static final String MONGO_WELL_NAME = "wells";
	public static final String MED_MONGO_CONN_STR = "MED_MONGO_CONN_STR";
	public static final String MED_IGNITE_ADDRESS = "MED_IGNITE_ADDRESS";
	public static final String MED_VERBOSE = "MED_VERBOSE";

	private static String getOs() {
		return System.getProperty("os.name").toLowerCase();
	}

	public static String getJavaPath() {
		if (getOs().contains("win")) {
			return "java.exe";
		} else {
			return "java";
		}
	}

	public static String getClassPathExecution() {
		var os = getOs();
		var currentPath = System.getProperty("user.dir");
		var path = Path.of(".","lib_data", os.contains("win") ? "" : "*");
		return String.format("%s%s%s", CON_DATA_JAR_NAME, os.contains("win") ? ";" : ":", path);
	}
}
