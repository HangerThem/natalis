"use client"

import { useState } from "react"
import Spinner from "@/components/loaders/spinner"
import ErrorComponent from "@/components/error"
import { useEvent } from "@/context/eventConext"

export default function EventPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params
  const { events, error, loading } = useEvent()
  const [event, setEvent] = useState<EventFull | undefined>(
    events.find((e) => e.id === eventId)
  )

  if (error) return <ErrorComponent statusCode={error} />

  if (loading || !event) return <Spinner />

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
    </div>
  )
}
