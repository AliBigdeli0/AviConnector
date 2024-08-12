package com.med.con_common.model;

import com.google.gson.Gson;

import java.time.Instant;
import java.util.Map;

public class JsonTimeDb {
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

	public static JsonTimeDb from(String msgStr) {
		return new Gson().fromJson(msgStr, JsonTimeDb.class);
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
