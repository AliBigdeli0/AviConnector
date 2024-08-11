package com.med.con_data;

import com.med.con_common.Info;
import com.med.con_data.queue.ClientConsumer;
import com.med.con_data.queue.ServerSubscriber;
import com.med.con_data.utility.Executor;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;

import java.io.Closeable;
import java.io.IOException;

@SpringBootApplication
@Slf4j
public class ConData implements Closeable {

	@Autowired
	Executor executorService;

	@Autowired
	ClientConsumer consumer;

	@Autowired
	ServerSubscriber serverSubscriber;

	static ConfigurableApplicationContext context;

	public static void main(String[] args) {
		context = SpringApplication.run(ConData.class, args);
	}

	@PostConstruct
	public void init() {
		log.info("the common version is : {}", Info.Version);
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			try {
				close();
			} catch (IOException e) {
				log.error(e.getMessage());
			}
		}));

		serverSubscriber.pushCloseable(this);
	}

	@Bean
	public CommandLineRunner run() {
		return args -> {
			executorService.submit(consumer);
			executorService.submit(serverSubscriber);
		};
	}

	@Override
	public void close() throws IOException {
		var pid = ProcessHandle.current().pid();
		var os = System.getProperty("os.name").toLowerCase();
		log.info("'{}': this program PID : '{}'", os, pid);
		try {
			Process process;

			if (os.contains("win")) {
				process = Runtime.getRuntime().exec(String.format("taskkill /PID %d /F", pid));
			} else {
				process = Runtime.getRuntime().exec(String.format("kill -9 %d", pid));
			}

			process.waitFor();
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
		log.info("WARNING==> Program has closed!");
	}
}
