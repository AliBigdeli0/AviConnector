package com.med.con_common.model;


public class DbWell {
	private String Name;
	private String IP;
	private String ID;
	private String AliasWellName;
	private String AliasRegionName;

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
