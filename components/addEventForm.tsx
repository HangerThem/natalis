"use client"

import { useState } from "react"
import {
  Container,
  Form,
  FormField,
  Label,
  Input,
  TextArea,
  FormTitle,
  FormSubtitle,
} from "@/components/FormElements"
import Button from "@/components/button"
import DatePicker from "./inputs/datepicker"
import { useEvent } from "@/context/eventConext"

const AddEventForm = () => {
  const [event, setEvent] = useState<EventSimple>({
    name: "",
    date: new Date(),
    location: "",
    description: "",
  })
  const { addEvent } = useEvent()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!event.name || !event.date || !event.location || !event.description) {
      return
    }
    addEvent(event)
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Add Event</FormTitle>
        <FormSubtitle>Fill out the form to add a new event</FormSubtitle>
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
          />
        </FormField>
        <FormField>
          <Label htmlFor="date">Date</Label>
          <DatePicker
            selectedDate={event.date}
            handleDateChange={(date) => {
              setEvent({ ...event, date: date })
            }}
          />
        </FormField>
        <FormField>
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
          />
        </FormField>
        <FormField>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
        </FormField>
        <Button
          type="submit"
          className="full-width"
          disabled={
            !event?.name ||
            !event?.date ||
            !event?.location ||
            !event?.description
          }
        >
          Add Event
        </Button>
      </Form>
    </Container>
  )
}

export default AddEventForm
