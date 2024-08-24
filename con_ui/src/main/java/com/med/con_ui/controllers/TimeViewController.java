package com.med.con_ui.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TimeViewController {

	@GetMapping("/time_view")
	public String timeView() {
		return "time_view";
	}
}
