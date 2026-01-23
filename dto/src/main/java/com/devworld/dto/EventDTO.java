package com.devworld.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventDTO(
		Long id,
		String description,
		LocalDate date,
		LocalTime time
) {}
