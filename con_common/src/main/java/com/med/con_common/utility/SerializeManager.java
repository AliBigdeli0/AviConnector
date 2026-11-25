package com.med.con_common.utility;



import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class SerializeManager {
	public static void fastSerialize(Map<String, String> dictionary, OutputStream stream) throws IOException {
		try (DataOutputStream writer = new DataOutputStream(stream)) {
			writer.writeInt(Integer.reverseBytes(dictionary.size()));
			for (Map.Entry<String, String> entry : dictionary.entrySet()) {
				final var key = entry.getKey();
				final var value = entry.getValue();

				writer.writeByte(key.length());
				writer.write((key.getBytes(StandardCharsets.UTF_8)));
				writer.writeByte(value.length());
				writer.write(value.getBytes(StandardCharsets.UTF_8));
			}
			writer.flush();
		}
	}

	public static Map<String, String> fastDeserialize(InputStream stream) throws Exception {
		try (DataInputStream reader = new DataInputStream(stream)) {
			final Map<String, String> retMap = new HashMap<>();
			final var count = reverseBytes(reader);

			for (var i = 0; i < count; i++) {
				final var key = extractData(reader);
				final var value = extractData(reader);
				retMap.put(key, value);
			}

			return retMap;
		}
	}

	private static String extractData(DataInputStream reader) throws IOException {
		final int dataLen = reader.readUnsignedByte();
		final byte[] dataBytes = new byte[dataLen];
		reader.readFully(dataBytes);
		return new String(dataBytes, StandardCharsets.UTF_8);
	}

	private static int reverseBytes(DataInputStream reader) throws IOException {
		final byte[] bufLen = new byte[4];
		reader.readFully(bufLen);
		return ((bufLen[0] & 0xFF)) |
				((bufLen[1] & 0xFF) << 8) |
				((bufLen[2] & 0xFF) << 16) |
				((bufLen[3] & 0xFF) << 24);
	}

	private static byte[] intToLittleEndianBytes(int value) {
		final ByteBuffer buffer = ByteBuffer.allocate(4);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putInt(value);
		return buffer.array();
	}

	public static <T> String serializeXml(T obj) throws Exception {
		final var context = JAXBContext.newInstance(obj.getClass());

		final var marshaller = context.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

		try(final var writer = new StringWriter()){
			marshaller.marshal(obj, writer);
			return writer.toString();
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T deserializeXml(String content, Class<T> type) throws Exception {
		final var context = JAXBContext.newInstance(type);
		final var unmarshaller = context.createUnmarshaller();

		try(final var reader = new StringReader(content)) {
			return (T) unmarshaller.unmarshal(reader);
		}
	}
}
