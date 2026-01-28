package com.example.facade;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.EventDTO;
import com.example.mapper.EventMapper;
import com.example.model.Event;
import com.example.service.EventService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventFacade {
	private final EventService eventService;

	public EventDTO save(EventDTO dto) {
		Event entity = EventMapper.toEntity(dto);
		Event saved = eventService.save(entity);
		return EventMapper.toDTO(saved);
	}

	public List<EventDTO> findAll() {
		List<Event> events = eventService.findAll();
		return events.stream().map(EventMapper::toDTO).toList();
	}

	public void delete(Long id) {
		eventService.delete(id);
	}
}
