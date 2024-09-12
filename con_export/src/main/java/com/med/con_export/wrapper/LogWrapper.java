package com.med.con_export.wrapper;

import com.hashmapinc.tempus.WitsmlObjects.v20.*;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.JsonWitsArray;
import lombok.Setter;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;
import java.util.UUID;

@XmlRootElement(name = "LogWrapper")
@Setter
public class LogWrapper {
	Log log;

	public LogWrapper() {
		log = new Log() {{
			setTimeDepth("Time");
			setRunNumber("Run_1");
			setStartIndex(new TimeIndexValue());
			setEndIndex(new TimeIndexValue());
			setLoggingMethod("mixed");
			setLoggingCompanyName("MED");
			setLoggingCompanyCode("Ali Bigdeli (email : alibigdeli66@gmail.com)");
		}};
	}

	@XmlElement(name = "Log")
	public Log getLog() {
		return log;
	}

	public LogWrapper addWellBore(UUID uuid, String wellName) {
		var wellBore = new DataObjectReference() {{
			setTitle(wellName);
			setUuid(uuid);
		}};

		log.setWellbore(wellBore);
		return this;
	}

	public LogWrapper addChannelSet(List<DbTime> data, JsonWitsArray jsonWitsArray) {
		// todo : convert data to the list of string
		// todo : convert to cdata string
		// todo : set to ChannelSet
		return this;
	}
}
