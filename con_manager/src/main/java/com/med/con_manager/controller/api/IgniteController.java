package com.med.con_manager.controller.api;

import com.med.con_common.message.IgniteManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ignite")
@Slf4j
public class IgniteController {

	@GetMapping("/test")
	public String testIgnite() {
		try (var igniteManager = new IgniteManager()) {
			igniteManager.init();
			igniteManager.putCache("test", "1", "13");
			return igniteManager.getCache("test", "1");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
		return "error in get data";
	}
}
