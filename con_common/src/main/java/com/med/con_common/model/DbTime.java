package com.med.con_common.model;

import com.google.gson.Gson;
import com.med.con_common.utility.SerializeManager;
import org.bson.BsonBinary;
import org.bson.BsonDateTime;
import org.bson.BsonDocument;
import org.bson.Document;
import org.bson.codecs.pojo.annotations.BsonIgnore;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class DbTime {

	@BsonIgnore
	public Map<String, String> GetAllDbData;
	public String Date;
	public String WellID;
	public String TimeBasedCollectionName;
	public String Comment;
	public String NeedDepthUpdate;
	public String TotalDepth;
	public String WellName;

	public Instant convertDate() {
		return Instant.parse(this.Date);
	}

	public static DbTime from(String msgStr) {
		return new Gson().fromJson(msgStr, DbTime.class);
	}

	public BsonDocument toBsonDocument() throws IOException {
		try (var outputStream = new ByteArrayOutputStream()) {
			SerializeManager.fastSerialize(GetAllDbData, outputStream);
			var compressedBytes = outputStream.toByteArray();
			var document = new BsonDocument();
			document.append("l", new BsonBinary(compressedBytes));
			document.append("d", new BsonDateTime(convertDate().toEpochMilli()));
			return document;
		}
	}

	public String collectionName() {
		return collectionName(this);
	}

	public static String collectionName(DbTime timeDb) {
		var zonedDateTime = timeDb.convertDate().atZone(ZoneId.of("UTC"));
		var formatter = DateTimeFormatter.ofPattern("yy_MM_dd");
		return String.format("c_%s_%s", timeDb.WellID, zonedDateTime.format(formatter));
	}

	@Override
	public String toString() {
		return "JsonTimeDb{" +
				"GetAllDbData=" + GetAllDbData +
				", Date='" + Date + '\'' +
				", WellID='" + WellID + '\'' +
				", TimeBasedCollectionName='" + TimeBasedCollectionName + '\'' +
				", Comment='" + Comment + '\'' +
				", NeedDepthUpdate='" + NeedDepthUpdate + '\'' +
				", TotalDepth='" + TotalDepth + '\'' +
				", WellName='" + WellName + '\'' +
				'}';
	}
}
