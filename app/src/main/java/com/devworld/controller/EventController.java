package com.devworld.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.devworld.dto.EventDTO;
import com.devworld.service.EventService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
	private final EventService service;

	@GetMapping
	public String list(Model model) {
		model.addAttribute("events", service.findAll());
		return "events";
	}

	@PostMapping("/save")
	@ResponseBody
	public EventDTO saveEvent(@RequestBody EventDTO dto) {
		return service.save(dto);
	}

	@DeleteMapping("/delete/{id}")
	@ResponseBody
	public void deleteEvent(@PathVariable Long id) {
		service.delete(id);
	}
}
