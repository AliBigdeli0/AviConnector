package com.med.con_common.model;

import org.bson.BsonDateTime;
import org.bson.BsonDocument;
import org.bson.BsonDouble;
import org.bson.BsonString;

import java.awt.datatransfer.StringSelection;
import java.time.Instant;
import java.util.Optional;

public class DbComment {
	private String Comment;
	private String InsertDate;
	private Optional<Double> InsertDepth = Optional.empty();
	private String WellID;

	public DbComment(String comment, String insertDate, Optional<Double> insertDepth, String wellID) {
		Comment = comment;
		InsertDate = insertDate;

		InsertDepth = insertDepth;
		WellID = wellID;
	}

	public String getComment() {
		return Comment;
	}

	public void setComment(String comment) {
		Comment = comment;
	}

	public String getInsertDate() {
		return InsertDate;
	}

	public void setInsertDate(String insertDate) {
		InsertDate = insertDate;
	}

	public Optional<Double> getInsertDepth() {
		return InsertDepth;
	}

	public void setInsertDepth(Optional<Double> insertDepth) {
		InsertDepth = insertDepth;
	}

	public String getWellID() {
		return WellID;
	}

	public void setWellID(String wellID) {
		WellID = wellID;
	}

	public Instant convertDate() {
		return Instant.parse(this.getInsertDate());
	}

	public BsonDocument toBsonDocument() {
		var document = new BsonDocument();
		document.append("c", new BsonString(getComment()));
		document.append("t", new BsonDateTime(convertDate().toEpochMilli()));
		if(this.getInsertDepth().isPresent()) {
			document.append("d", new BsonDouble(this.getInsertDepth().get()));
		}
		return document;
	}

	public String generateCollectionName() {
		return String.format("comment_%s", getWellID());
	}

	@Override
	public String toString() {
		return "DbComment{" +
				"Comment='" + Comment + '\'' +
				", InsertDate='" + InsertDate + '\'' +
				", InsertDepth=" + InsertDepth +
				", WellID='" + WellID + '\'' +
				'}';
	}
}
