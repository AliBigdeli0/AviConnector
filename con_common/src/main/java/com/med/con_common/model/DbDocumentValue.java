package com.med.con_common.model;

public class DbDocumentValue {
	private String Document;
	private String Value;

	public String getDocument() {
		return Document;
	}

	public void setDocument(String document) {
		Document = document;
	}

	public String getValue() {
		return Value;
	}

	public void setValue(String value) {
		Value = value;
	}

	@Override
	public String toString() {
		return "DbDocumentValue{" +
				"Document='" + Document + '\'' +
				", Value='" + Value + '\'' +
				'}';
	}
}
