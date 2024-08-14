package com.med.con_manager.utility;

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
}
