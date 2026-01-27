package com.devworld.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devworld.model.Event;
import com.devworld.repository.EventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

	private final EventRepository repository;

	public Event save(Event event) {
		Event saved;
		if (event.getId() != null) {
			Event existing = repository.findById(event.getId())
					.orElseThrow(() -> new IllegalArgumentException("Event not found: " + event.getId()));

			existing.setDescription(event.getDescription());
			existing.setDate(event.getDate());
			existing.setTime(event.getTime());
		}

		saved = repository.save(event);

		log.info("Saved event: {}", saved);
		return saved;
	}

	public List<Event> findAll() {
		List<Event> list = repository.findAll();
		log.info("Events");
		list.forEach(e -> {
			log.info("Event {}: {}", e.getId(), e);
		});
		return repository.findAll();
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}
}
