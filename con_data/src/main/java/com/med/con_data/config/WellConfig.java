package com.med.con_data.config;

import com.med.con_common.db.DbManager;
import com.med.con_common.model.DbWell;
import com.med.con_data.utility.EnvironmentVariables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class WellConfig {
	@Autowired
	EnvironmentVariables environmentVariables;

	@Bean
	public DbWell getWell() throws IOException {
		try (var dbMan = new DbManager()) {
			return dbMan.readWellWithId(environmentVariables.getWellID());
		}
	}
}
