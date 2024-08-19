package com.med.con_ui.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

	@GetMapping({"/", "/index", "/index.html", "/home", "home.html"})
	public String home() {
		return "home";
	}
}
