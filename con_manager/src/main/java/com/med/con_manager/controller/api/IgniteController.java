package com.med.con_manager.controller.api;

import com.med.con_common.db.DbManager;
import com.med.con_common.message.memory.MemoryType;
import com.med.con_common.utility.MemoryUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/ignite")
@Slf4j
public class IgniteController {

	@Value("${med.memory.type}")
	public MemoryType memoryType;

	@GetMapping("/size")
	public Mono<Long> getSize(@RequestParam("well_id") String wellId) {
		try (var dbMan = new DbManager();
		     var ignite = MemoryUtil.createMemory(memoryType);
		) {
			ignite.reinit(log);
			var well = dbMan.readWellWithId(wellId);
			return Mono.just(ignite.sizeOfMemory(well));
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
		return Mono.just(-999L);
	}

	@GetMapping("/names")
	public Mono<String> getNames() {
		try (var ignite = MemoryUtil.createMemory(memoryType)) {
			ignite.reinit(log);
			return Mono.just(Strings.join(ignite.getCacheNames(), ','));
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
		return Mono.just("error in get names");
	}

	@GetMapping("/test")
	public String testIgnite() {
		try (var igniteManager = MemoryUtil.createMemory(memoryType)) {
			igniteManager.init(log);
			igniteManager.putCache("test", "1", "13");
			return igniteManager.getCache("test", "1");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		}
		return "error in get data";
	}
}
