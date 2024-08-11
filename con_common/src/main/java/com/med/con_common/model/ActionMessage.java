package com.med.con_common.model;

import com.google.gson.Gson;
import org.springframework.core.serializer.Deserializer;

import java.io.Serializable;
import java.util.UUID;

public class ActionMessage {
	public enum ActionType {
		StopMachine,
	}

	private ActionType type;
	private UUID uid;

	public ActionMessage(ActionType type, String uidStr) {
		this.type = type;
		this.uid = UUID.fromString(uidStr);
	}

	public ActionMessage(ActionType type, UUID uid) {
		this.type = type;
		this.uid = uid;
	}

	public String toJson() {
		return new Gson().toJson(this);
	}

	public static ActionMessage fromJson(String jsonStr) {
		return new Gson().fromJson(jsonStr, ActionMessage.class);
	}

	public ActionType getType() {
		return type;
	}

	public void setType(ActionType type) {
		this.type = type;
	}

	public UUID getUid() {
		return uid;
	}

	public void setUid(UUID uid) {
		this.uid = uid;
	}
}
