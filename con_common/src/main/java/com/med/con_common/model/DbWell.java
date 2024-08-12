package com.med.con_common.model;


import com.google.gson.Gson;

import java.net.URI;
import java.net.URISyntaxException;

public class DbWell {
	private String Name;
	private String IP;
	private String ID;
	private String AliasWellName;
	private String AliasRegionName;
	private DbServerConfigure ServerConfigure;

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getIP() {
		return IP;
	}

	public void setIP(String IP) {
		this.IP = IP;
	}

	public String getID() {
		return ID;
	}

	public void setID(String ID) {
		this.ID = ID;
	}

	public String getAliasWellName() {
		return AliasWellName;
	}

	public void setAliasWellName(String aliasWellName) {
		AliasWellName = aliasWellName;
	}

	public String getAliasRegionName() {
		return AliasRegionName;
	}

	public void setAliasRegionName(String aliasRegionName) {
		AliasRegionName = aliasRegionName;
	}

	public DbServerConfigure getServerConfigure() {
		return ServerConfigure;
	}

	public void setServerConfigure(DbServerConfigure serverConfigure) {
		ServerConfigure = serverConfigure;
	}

	public String getMQName() {
		return this.getServerConfigure().MQClientConfigure.getMQOfflineName().getValue();
	}

	public String getMQAddress() throws URISyntaxException {
		var uri = new URI(this.ServerConfigure.MQClientConfigure.getUri().getValue());
		return String.format("tcp://%s:%d", uri.getHost(), uri.getPort());
	}

	public String getJobName() {
		return String.format("%s_%s", ID, Name);
	}

	public static DbWell toDbWell(org.bson.Document document) {
		var jsonData = document.toJson();
		return new Gson().fromJson(jsonData, DbWell.class);
	}

	@Override
	public String toString() {
		return "DbWell{" +
				"Name='" + Name + '\'' +
				", IP='" + IP + '\'' +
				", ID='" + ID + '\'' +
				", AliasWellName='" + AliasWellName + '\'' +
				", AliasRegionName='" + AliasRegionName + '\'' +
				'}';
	}
}
