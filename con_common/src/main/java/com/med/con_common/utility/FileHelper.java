package com.med.con_common.utility;

import java.io.File;
import java.io.IOException;

public class FileHelper {

	public static void createPathIfNotExist(File dir) throws IOException {
		if (!dir.exists()) {
			var created = dir.mkdirs();
			if (!created) throw new IOException("error in create path!");
		}
	}
}
