package com.med.con_common.utility;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;

import java.io.*;
import java.util.zip.Deflater;
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

	public static void compress7Z(File sevenZFile, File... filesToZip) throws Exception {
		try(var fos = new FileOutputStream(sevenZFile);
		    var zipOut = new ZipArchiveOutputStream(fos);
		){
			zipOut.setMethod(ZipArchiveOutputStream.DEFLATED);
			zipOut.setLevel(Deflater.BEST_COMPRESSION);

			for(var file : filesToZip) {
				var zipEntry = new ZipArchiveEntry(file.getName());
				zipOut.putArchiveEntry(zipEntry);
				zipOut.write(java.nio.file.Files.readAllBytes(file.toPath()));
				zipOut.closeArchiveEntry();
			}

			zipOut.finish();
		}
	}
}
