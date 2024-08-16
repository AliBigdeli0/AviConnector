package com.med.con_common.model;

import com.med.con_common.utility.DepthNameGeneratorUtil;
import com.med.con_common.utility.SerializeManager;
import org.bson.BsonBinary;
import org.bson.BsonDateTime;
import org.bson.BsonDocument;
import org.bson.BsonDouble;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class DbDepth {
	String WellID;
	Instant Date;
	double TotalDepth;
	final Map<String, String> GetAllDbData = new HashMap<>();

	public void fill(DbTime time) {
		this.TotalDepth = Double.parseDouble(time.TotalDepth);
		this.Date = time.convertDate();
		this.WellID = time.WellID;
		GetAllDbData.putAll(time.GetAllDbData);
	}

	public String collectionName() {
		return DepthNameGeneratorUtil.generateDepthBaseCol(this.TotalDepth, this.WellID);
	}

	public BsonDocument toBsonDocument() throws IOException {
		try(var outputStream = new ByteArrayOutputStream()){
			SerializeManager.fastSerialize(GetAllDbData, outputStream);
			var compressed = outputStream.toByteArray();
			var retBson = new BsonDocument();
			retBson.append("c", new BsonBinary(compressed));
			retBson.append("t", new BsonDateTime(this.Date.toEpochMilli()));
			retBson.append("d", new BsonDouble(this.TotalDepth));

			return retBson;
		}
	}

	@Override
	public String toString() {
		return "DbDepth{" +
				"WellID='" + WellID + '\'' +
				", Date=" + Date +
				", TotalDepth=" + TotalDepth +
				", GetAllDbData=" + GetAllDbData +
				'}';
	}
}
