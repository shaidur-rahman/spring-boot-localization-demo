package com.devworld.mapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.devworld.dto.EventDTO;
import com.devworld.model.Event;

public class EventMapper {

	public static Event toEntity(EventDTO dto) {
		if (dto == null || dto.eventTime() == null) return null;

		ZonedDateTime zdt = dto.eventTime()
				.atZone(ZoneId.systemDefault());

		return Event.builder()
				.id(dto.id())
				.description(dto.description())
				.date(zdt.toLocalDate())
				.time(zdt.toLocalTime().withSecond(0).withNano(0))
				.build();
	}

	public static EventDTO toDTO(Event event) {
		LocalDateTime ldt = LocalDateTime.of(
				event.getDate(),
				event.getTime()
				);

		Instant instant = ldt
				.atZone(ZoneId.systemDefault())
				.toInstant();

		return new EventDTO(
				event.getId(),
				event.getDescription(),
				instant
				);
	}
}
