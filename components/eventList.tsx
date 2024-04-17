"use client"

import { useEvent } from "@/context/eventConext"
import styled from "styled-components"
import Event from "@/components/event"

const EventsWrapper = styled.ul`
  list-style: none;
  display: grid;
  padding: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`

export default function EventList() {
  const { events, deleteEvent } = useEvent()

  return (
    <>
      <EventsWrapper>
        {events.map((event) => (
          <Event
            key={event.id}
            event={event}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </EventsWrapper>
      {events.length === 0 && <li>No events found</li>}
    </>
  )
}
