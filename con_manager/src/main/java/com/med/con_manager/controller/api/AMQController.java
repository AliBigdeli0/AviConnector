package com.med.con_manager.controller.api;

import com.med.con_common.message.AMQPublisherSubscriber;
import com.med.con_common.model.ActionMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/v1/amq")
@Slf4j
public class AMQController {

	@GetMapping("kill_job")
	void sendKillRequestToMsgBus(@RequestParam("well_id") String wellId) throws Exception {
		try {
			AMQPublisherSubscriber.sendMessageToCommonBus(ActionMessage.ActionType.StopMachine, wellId);
		} catch (Exception ex) {
			log.error(ex.getMessage());
			throw ex;
		}
	}
}
