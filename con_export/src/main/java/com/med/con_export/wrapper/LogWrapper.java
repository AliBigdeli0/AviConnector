package com.med.con_export.wrapper;

import com.hashmapinc.tempus.WitsmlObjects.v20.*;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.JsonWitsArray;
import com.med.con_common.utility.Constants;
import lombok.Setter;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.*;

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

	public LogWrapper addChannelSet(List<DbTime> dbTimes, JsonWitsArray jsonWitsArray) throws Exception {
		var firstNotEmptyList = dbTimes.stream().filter(t -> !t.GetAllDbData.isEmpty()).max(DbTime::compareTo).stream().findFirst().orElse(null);

		if (firstNotEmptyList == null) throw new Exception("all objects in GetAllDbData is empty");

		var header = separateHeader(firstNotEmptyList, jsonWitsArray);

		var channelSet = new ChannelSet() {{
			setTimeDepth("Time");
			setStartIndex(new TimeIndexValue());
			setChannelState("realtime");
			getChannel().addAll(convertFirstElementToChannel(firstNotEmptyList, header));
			getIndex().add(new ChannelIndex() {{
				setUom("UnitOfMeasure.nohm");
				setDirection("IndexDirection.increasing");
				setIndexType("ChannelIndexType.datetime");
				setMnemonic("TIME");
			}});
			setData(new ChannelData() {{
				setFileUri("");
				setData(convertDbTimeToCData(dbTimes, header));
			}});
		}};

		this.log.getChannelSet().add(channelSet);
		return this;
	}

	private String convertDbTimeToCData(List<DbTime> data, Map<String, String> headers) {
		var strBuilder = new StringBuilder();
		var headerSize = headers.size();

		strBuilder.append("[");
		for (var i = 0; i < data.size(); i++) {
			var dbTime = data.get(i);
			var headerCounter = 0;

			strBuilder.append("[[").append(i).append("],").append("[");
			for (var header : headers.entrySet()) {
				if (dbTime.GetAllDbData.containsKey(header.getKey())) {
					var value = dbTime.GetAllDbData.get(header.getKey());
					strBuilder.append(value);
				} else {
					strBuilder.append(Constants.WITSML_EMPTY_VALUE);
				}

				headerCounter++;
				if (headerCounter != headerSize) strBuilder.append(",");
			}
			strBuilder.append("]],").append(System.lineSeparator());
		}
		strBuilder.append("]");

		return strBuilder.toString();
	}

	private Map<String, String> separateHeader(DbTime firstNonEmptyElement, JsonWitsArray jsonWitsArray) {
		final var retMap = new HashMap<String, String>();
		firstNonEmptyElement.GetAllDbData.forEach((key, value) -> {
			var witsElement = jsonWitsArray.getRecord(key);
			if (witsElement == null) return;
			if (retMap.containsKey(key)) return;
			retMap.put(key, witsElement.getDescription());
		});
		return retMap;
	}

	private List<Channel> convertFirstElementToChannel(DbTime firstNonEmptyElement, Map<String, String> headers) {
		final var retList = new ArrayList<Channel>();
		for (var entry : headers.entrySet()) {

			retList.add(new Channel() {{
				setMnemonic(entry.getValue());
				setDataType("EtpDataType.@double");
				setUom("UnitOfMeasure.N");
				setGrowingStatus("ChannelStatus.active");
				setStartIndex(new TimeIndexValue());
				setEndIndex(new TimeIndexValue());
				setTimeDepth("TIME");
				getIndex().add(new ChannelIndex() {{
					setIndexType("ChannelIndexType.datetime");
					setMnemonic(entry.getValue());
				}});
			}});
		}
		return retList;
	}
}
