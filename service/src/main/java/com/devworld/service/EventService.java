package com.devworld.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devworld.dto.EventDTO;
import com.devworld.mapper.EventMapper;
import com.devworld.model.Event;
import com.devworld.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
	private final EventRepository repository;

	public EventDTO save(EventDTO dto) {
		Event event;
		if (dto.id() != null) {
			event = repository.findById(dto.id())
					.orElseThrow(() -> new IllegalArgumentException("Event not found: " + dto.id()));
			// update entity fields manually
			event.setDescription(dto.description());
			event.setDate(dto.date());
			event.setTime(dto.time());
		} else {
			event = EventMapper.toEntity(dto);
		}

		Event saved = repository.save(event);
		return EventMapper.toDTO(saved);
	}

	public List<EventDTO> findAll() {
		return repository.findAll().stream().map(EventMapper::toDTO).toList();
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}
}
