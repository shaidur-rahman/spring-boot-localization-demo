package com.example.dto;

import java.time.Instant;

public record EventDTO(
		Long id,
		String description,
		Instant eventTime
) {}
