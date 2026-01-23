package com.devworld.mapper;

import com.devworld.dto.EventDTO;
import com.devworld.model.Event;

public class EventMapper {
	public static Event toEntity(EventDTO dto) {
		return Event.builder()
				.id(dto.id())
				.description(dto.description())
				.date(dto.date())
				.time(dto.time())
				.build();
	}

	public static EventDTO toDTO(Event event) {
		return new EventDTO(
				event.getId(),
				event.getDescription(),
				event.getDate(),
				event.getTime()
				);
	}
}
