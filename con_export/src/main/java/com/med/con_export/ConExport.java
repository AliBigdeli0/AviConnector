package com.med.con_export;

import com.med.con_export.config.WellsConfig;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Slf4j
@SpringBootApplication
@EnableConfigurationProperties(WellsConfig.class)
public class ConExport {

	@Autowired
	private WellsConfig wellsConfig;

	public static void main(String[] args) {
		SpringApplication.run(ConExport.class, args);
	}

	@PostConstruct
	public void postConstruct() throws Exception {
		log.info("list wells are: {}", Strings.join(wellsConfig.getWells().values(), ','));
	}
}