package com.med.con_common.utility;

import java.nio.file.Path;

public final class Constants {
	public static final String CON_DATA_JAR_NAME = "con_data-1.0.0.jar";
	public static final String MONGO_WELL_NAME = "wells";
	public static final String MED_MONGO_CONN_STR = "MED_MONGO_CONN_STR";

	public static String getJavaPath() {
		var os = System.getProperty("os.name").toLowerCase();
		if (os.contains("win")) {
			return "java.exe";
		} else {
			return "java";
		}
	}

	public static String getConDataJarFile() {
		var currentPath = System.getProperty("user.dir");
		var path = Path.of(currentPath, CON_DATA_JAR_NAME);
		return path.toAbsolutePath().toString();
	}
}
