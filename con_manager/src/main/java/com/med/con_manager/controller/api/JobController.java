package com.med.con_manager.controller.api;

import com.med.con_common.db.DbManager;
import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import com.med.con_manager.scheduler.JobManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;


@Slf4j
@RestController
@RequestMapping("/api/v1/job")
public class JobController {
	@Autowired
	JobManager jobManager;

	@GetMapping("/create")
	public Mono<String> createJob(@RequestParam("well_id") String wellId) {
		try (var db = new DbManager()) {
			var well = db.readWellWithId(wellId);
			return Mono.just(jobManager.newJob(well));
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "please check the system logs! or connect to the system administration");
		}
	}

	@GetMapping("kill")
	public Mono<String> deleteJobWithWellId(@RequestParam("well_id") String wellId) {
		try (var db = new DbManager()) {
			AMQPublisherSubscriber.sendMessageToCommonBus(ActionMessage.ActionType.StopMachine, wellId);

			var well = db.readWellWithId(wellId);
			jobManager.killJob(well);

			return Mono.just("the job deleted!");
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "please check the system logs! or connect to the system administration");
		}
	}

	@GetMapping("exist")
	public Mono<Boolean> jobStatus(@RequestParam("well_id") String wellId) {
		try (var db = new DbManager()) {
			var well = db.readWellWithId(wellId);
			return Mono.just(jobManager.checkJobExist(well));
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "please check the system logs! or connect to the system administration");
		}
	}
}
