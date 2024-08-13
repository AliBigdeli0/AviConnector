package com.med.con_common.utility;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class SerializeManager {
	public static void fastSerialize(Map<String, String> dictionary, OutputStream stream) throws IOException {
		try (DataOutputStream writer = new DataOutputStream(stream)) {
			writer.writeInt(Integer.reverseBytes(dictionary.size()));
			for (Map.Entry<String, String> entry : dictionary.entrySet()) {
				var key = entry.getKey();
				var value = entry.getValue();

				writer.writeByte(key.length());
				writer.write((key.getBytes(StandardCharsets.UTF_8)));
				writer.writeByte(value.length());
				writer.write(value.getBytes(StandardCharsets.UTF_8));
			}
			writer.flush();
		}
	}

	private static byte[] intToLittleEndianBytes(int value) {
		ByteBuffer buffer = ByteBuffer.allocate(4);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putInt(value);
		return buffer.array();
	}
}
