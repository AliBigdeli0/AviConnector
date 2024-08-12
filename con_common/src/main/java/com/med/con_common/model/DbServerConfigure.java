package com.med.con_common.model;


public class DbServerConfigure {
	DbMQClientConfiguration MQClientConfigure;

	public DbMQClientConfiguration getMQClientConfigure() {
		return MQClientConfigure;
	}

	public void setMQClientConfigure(DbMQClientConfiguration MQClientConfigure) {
		this.MQClientConfigure = MQClientConfigure;
	}

	@Override
	public String toString() {
		return "DbServerConfigure{" +
				"MQClientConfigure=" + MQClientConfigure +
				'}';
	}
}
