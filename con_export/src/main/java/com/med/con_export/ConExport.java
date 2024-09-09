package com.med.con_export;

import com.hashmapinc.tempus.WitsmlObjects.v20.Well;
import com.med.con_common.utility.SerializeManager;
import com.med.con_export.wrapper.WellWrapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class ConExport {
	public static void main(String[] args) {
		SpringApplication.run(ConExport.class, args);
	}

	@PostConstruct
	public void postConstruct() throws Exception {
		var well =new Well();
		well.setNameLegal("AZ-234");

		var serializer = SerializeManager.serializeXml(new WellWrapper(well));
		log.info("the serialized well is: {}", serializer);

		var deserializer = SerializeManager.deserializeXml(serializer, WellWrapper.class);

		log.info("after deserialization well is : {}", deserializer);
	}
}