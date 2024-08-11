package com.med.con_manager.config;

import com.med.con_manager.utility.EnvironmentVariables;
import com.med.con_manager.zkeeper.ZKeeperManage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

	@Autowired
	EnvironmentVariables environmentVariables;

	@Bean
	public ZKeeperManage zKeeperManage() {
		return new ZKeeperManage(environmentVariables);
	}

}
