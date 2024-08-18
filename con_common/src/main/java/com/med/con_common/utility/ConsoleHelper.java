package com.med.con_common.utility;

import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;


public class ConsoleHelper {
	public static void handleReader(BufferedReader reader, boolean isVerbose) throws IOException {
		String readerStr = "";
		while ((readerStr = reader.readLine()) != null) {
			if (isVerbose) {
				System.out.println(readerStr);
			}
		}
	}

	public static void logIfVerbose(Logger log, String msg, Object... args) {
		if(CommonEnvironmentVariables.getVerbose())
			log.info(msg,args);
	}
}
