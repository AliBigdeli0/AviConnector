package com.med.con_common.message.topic;

import com.med.con_common.model.DbWell;

public class ExclusiveTopicInjection implements TopicInjection {

	final DbWell well;

	public ExclusiveTopicInjection(DbWell well) {
		this.well = well;
	}

	@Override
	public String getTopicName() {
		return String.format(well.getBusName());
	}
}
