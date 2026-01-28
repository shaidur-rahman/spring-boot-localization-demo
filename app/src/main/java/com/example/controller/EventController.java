package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dto.EventDTO;
import com.example.facade.EventFacade;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
	private final EventFacade facade;

	@GetMapping
	public String list(Model model) {
		model.addAttribute("events", facade.findAll());
		return "events";
	}

	@PostMapping("/save")
	@ResponseBody
	public EventDTO saveEvent(@RequestBody EventDTO dto) {
		return facade.save(dto);
	}

	@DeleteMapping("/delete/{id}")
	@ResponseBody
	public void deleteEvent(@PathVariable Long id) {
		facade.delete(id);
	}
}
