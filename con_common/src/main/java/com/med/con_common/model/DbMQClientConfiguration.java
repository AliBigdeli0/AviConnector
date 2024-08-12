package com.med.con_common.model;

public class DbMQClientConfiguration {
	private DbDocumentValue Uri;
	private DbDocumentValue MQOfflineName;

	public DbDocumentValue getUri() {
		return Uri;
	}

	public void setUri(DbDocumentValue uri) {
		Uri = uri;
	}

	public DbDocumentValue getMQOfflineName() {
		return MQOfflineName;
	}

	public void setMQOfflineName(DbDocumentValue MQOfflineName) {
		this.MQOfflineName = MQOfflineName;
	}

	@Override
	public String toString() {
		return "DbMQClientConfiguration{" +
				"Uri=" + Uri +
				'}';
	}
}
