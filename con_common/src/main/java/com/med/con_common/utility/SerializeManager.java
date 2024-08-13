package com.med.con_common.utility;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

public class SerializeManager {
	public static void fastSerialize(Map<String, String> dictionary, OutputStream stream) throws IOException {
		try (DataOutputStream writer = new DataOutputStream(stream)) {
			writer.writeInt(dictionary.size());
			for (Map.Entry<String, String> entry : dictionary.entrySet()) {
				writer.writeUTF(entry.getKey());
				writer.writeUTF(entry.getValue());
			}
			writer.flush();
		}
	}
}
