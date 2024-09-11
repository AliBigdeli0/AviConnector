package com.med.con_common.model;

import com.google.gson.Gson;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.NoSuchElementException;

public class JsonWitsArray {
	public List<JsonWits> WitsJson;

	public static JsonWitsArray getFromResource() throws IOException {
		try (var inputStream = JsonWitsArray.class.getClassLoader().getResourceAsStream("wits.json")) {
			if (inputStream == null) throw new IOException("resource is empty!");

			var witsFileStrings = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			return new Gson().fromJson(witsFileStrings, JsonWitsArray.class);
		}
	}

	public JsonWits getRecord(int record, int item) throws NoSuchElementException {
		var first = WitsJson.stream().filter(w -> w.getRecord() == record && w.getItem() == item).findFirst();
		return first.orElseThrow();
	}

	public JsonWits getRecord(String itemStr) {
		var record = itemStr.substring(0, 2);
		var item = itemStr.substring(2, 4);
		return getRecord(Integer.parseInt(record), Integer.parseInt(item));
	}
}
