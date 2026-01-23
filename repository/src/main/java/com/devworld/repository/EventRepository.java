package com.devworld.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devworld.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}