package com.med.con_manager;

import com.med.con_common.Info;
import com.med.con_manager.zkeeper.ZKeeperManage;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@Slf4j
public class ConManager {

	@Autowired
	ZKeeperManage zKeeperManage;

	public static void main(String[] args) {
		SpringApplication.run(ConManager.class, args);
	}

	@PostConstruct
	public void init() {
		log.info("the common version is : {}", Info.Version);
	}

	// @Bean
	public CommandLineRunner run() {
		return args -> {
			zKeeperManage.init();
		};
	}
}
