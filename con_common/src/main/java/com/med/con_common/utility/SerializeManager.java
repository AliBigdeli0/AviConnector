package com.med.con_common.utility;



import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
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
