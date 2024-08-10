package com.med.con_manager.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping({"", "/", "index.html"})
public class HomeController {
	@GetMapping("")
	public String Home() {
		return "home.html";
	}
}
