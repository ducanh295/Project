package com.bkap.admin.controller;	

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
	@GetMapping(value = { "/admin", "/admin/index"} )
	public String admin(Model model) {
		return "admin/index";
	}
	
	@GetMapping("/403")
	public String authorize(Model model) {
		return "home/403";
	}
}
