package com.med.con_export.config;

import com.med.con_common.model.JsonWitsArray;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class WitsConfig {

	@Bean
	public JsonWitsArray jsonWitsArray() throws IOException {
		return JsonWitsArray.getFromResource();
	}
}
