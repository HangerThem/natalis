"use client"

import { FC, MouseEvent } from "react"
import styled from "styled-components"
import { Calendar2, GeoAlt, People, Trash } from "react-bootstrap-icons"
import Button from "@/components/button"
import Link from "next/link"

const EventContainer = styled.div<{ $backgroundImage: string }>`
  border: 1px solid #444;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 350px;
  height: 200px;
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `url(${$backgroundImage})`
      : "linear-gradient(45deg, #333, #444)"};
  background-size: 101% auto;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
  transition: background-size 0.2s ease;
  cursor: pointer;

  &::before {
    content: "";
    background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:hover {
    background-size: 110% auto;
  }

  a {
    padding: 1rem;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    z-index: 1;
  }
`

const EventTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  z-index: 1;
`

const EventDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`

const EventFull = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const EventDate = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  color: #fff;
  z-index: 1;
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

interface EventProps {
  event: EventFull
  onDelete: (id: string) => void
}

const Event: FC<EventProps> = ({ event, onDelete }) => {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDelete(event.id)
  }

  return (
    <EventContainer $backgroundImage={"https://picsum.photos/350/200"}>
      <Link href={`/admin/events/${event.id}`}>
        <EventDate>
          <Calendar2 /> {new Date(event.date).toLocaleDateString()}
        </EventDate>
        <EventTitle>{event.name}</EventTitle>
        <EventDetails>
          <div>
            <EventFull>
              <GeoAlt /> {event.location}
            </EventFull>
            <EventFull>
              <People /> {event?.guests?.length}
            </EventFull>
          </div>
          <Button
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleDelete(e)}
            className="solid z-10"
          >
            <Trash /> Delete
          </Button>
        </EventDetails>
      </Link>
    </EventContainer>
  )
}

export default Event
