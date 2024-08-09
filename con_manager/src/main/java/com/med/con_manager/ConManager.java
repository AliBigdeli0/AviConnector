package com.med.con_manager;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import com.med.con_common.*;
import org.springframework.boot.SpringApplication;

@Slf4j
public class ConManager {

	public static void main(String[] args) {
		SpringApplication.run(ConManager.class, args);
	}

	@PostConstruct
	public void init() {
		log.info("the common version is : {}", Info.Version);
	}
}
