"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAdmin } from "./adminContext"
import { useToast } from "./toastContext"

interface EventContextProps {
  events: EventFull[]
  loading: boolean
  error: number | null
  addEvent: (event: EventSimple) => void
  deleteEvent: (id: string) => void
}

interface EventProviderProps {
  children: React.ReactNode
}

const EventContext = createContext<EventContextProps | undefined>(undefined)

/**
 * Provides event management functionality for the application.
 * @component
 * @param {EventProviderProps} props The props for the component.
 * @returns {React.ReactElement}
 */

export const EventProvider: React.FC<EventProviderProps> = ({
  children,
}): React.ReactElement => {
  const [events, setEvents] = useState<EventFull[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<number | null>(null)
  const { token, loading: authLoading } = useAdmin()
  const { addToastNotification } = useToast()

  useEffect(() => {
    if (authLoading) return
    fetch("/api/v1/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events")
        }
        return res.json()
      })
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setError(e.status)
        setLoading(false)
      })
  }, [authLoading])

  const addEvent = (event: EventSimple) => {
    fetch("/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add event")
        }
        return res.json()
      })
      .then((data) => {
        setEvents([...events, data])
        addToastNotification({
          type: "success",
          title: "Event added",
          description: "The event has been added successfully",
        })
      })
      .catch((e) => console.error(e))
  }

  const deleteEvent = (id: string) => {
    fetch(`/api/v1/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete event")
        }
        return res.json()
      })
      .then(() => {
        setEvents(events.filter((e) => e.id !== id))
      })
      .catch((e) => console.error(e))
  }

  return (
    <EventContext.Provider
      value={{ events, loading, error, addEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  )
}

/**
 * Returns the event context.
 * @returns {EventContextProps} The event context.
 */

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider")
  }
  return context
}
