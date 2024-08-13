package com.med.con_common.utility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;

public class CompressionManager {

	public static byte[] decompress(byte[] raw) throws IOException {
		try (var byteArrayInputStream = new ByteArrayInputStream(raw);
		     var gzipInputStream = new GZIPInputStream(byteArrayInputStream);
		     var byteArrayOutputStream = new ByteArrayOutputStream()) {

			var buffer = new byte[0xfffff];
			int bytesRead;

			while ((bytesRead = gzipInputStream.read(buffer)) != -1) {
				byteArrayOutputStream.write(buffer, 0, bytesRead);
			}

			return byteArrayOutputStream.toByteArray();
		}
	}
}
