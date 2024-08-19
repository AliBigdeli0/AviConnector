package com.med.con_ui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Slf4j
@SpringBootApplication
@EnableWebMvc
public class ConUI {
	public static void main(String[] args) {
		SpringApplication.run(ConUI.class, args);
	}
}
