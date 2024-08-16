package com.med.con_manager;

import com.med.con_common.Info;
import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import com.med.con_manager.zkeeper.ZKeeperManage;
import jakarta.annotation.PostConstruct;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class ConManager {

	@Autowired
	ZKeeperManage zKeeperManage;

	public static void main(String[] args) {
		SpringApplication.run(ConManager.class, args);
	}

	@SneakyThrows
	@PostConstruct
	public void init() {
		log.info("the common version is : {}", Info.Version);
		log.info("Developer Name : {}", Info.DeveloperName);
		log.info("Developer Email: {}", Info.DeveloperEmail);

		AMQPublisherSubscriber.sendMessageToCommonBus(ActionMessage.ActionType.StopAll, "");
	}

	// @Bean
	public CommandLineRunner run() {
		return args -> {
			zKeeperManage.init();
		};
	}
}
