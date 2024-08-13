package com.med.con_common.message.topic;

import com.med.con_common.utility.CommonEnvironmentVariables;

public class CommonTopicInjection implements TopicInjection {

	@Override
	public String getTopicName() {
		return CommonEnvironmentVariables.getAMQPublisherSubscriberName();
	}
}
