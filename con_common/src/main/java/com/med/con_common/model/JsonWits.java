package com.med.con_common.model;

public class JsonWits {
	public Integer Identifier;
	public Integer Record;
	public Double Item;
	public String Description;
	public String LongMnemonic;
	public String ShortMnemonic;
	public String Type;
	public Double Length;
	public double UnitId;
	public Integer WitsTrigger;

	public Integer getIdentifier() {
		return Identifier;
	}

	public void setIdentifier(Integer identifier) {
		this.Identifier = identifier;
	}

	public Integer getRecord() {
		return Record;
	}

	public void setRecord(Integer record) {
		this.Record = record;
	}

	public Double getItem() {
		return Item;
	}

	public void setItem(Double item) {
		this.Item = item;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		this.Description = description;
	}

	public String getLongMnemonic() {
		return LongMnemonic;
	}

	public void setLongMnemonic(String longMnemonic) {
		this.LongMnemonic = longMnemonic;
	}

	public String getShortMnemonic() {
		return ShortMnemonic;
	}

	public void setShortMnemonic(String shortMnemonic) {
		this.ShortMnemonic = shortMnemonic;
	}

	public String getType() {
		return Type;
	}

	public void setType(String type) {
		this.Type = type;
	}

	public Double getLength() {
		return Length;
	}

	public void setLength(Double length) {
		this.Length = length;
	}

	public double getUnitId() {
		return UnitId;
	}

	public void setUnitId(double unitId) {
		this.UnitId = unitId;
	}

	public Integer getWitsTrigger() {
		return WitsTrigger;
	}

	public void setWitsTrigger(Integer witsTrigger) {
		this.WitsTrigger = witsTrigger;
	}
}
