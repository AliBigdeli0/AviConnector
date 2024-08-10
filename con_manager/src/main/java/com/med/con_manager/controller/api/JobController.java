package com.med.con_manager.controller.api;

import com.med.con_manager.scheduler.JobManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/job")
public class JobController {
	@Autowired
	JobManager jobManager;

	@GetMapping()
	public Mono<String> createJob() {
		return Mono.just(jobManager.newJob());
	}

	@DeleteMapping("/{id}")
	public Mono<String> deleteJob(@PathVariable("id") String id) {
		jobManager.killJob(id);
		return Mono.just("the object has deleted");
	}
}
