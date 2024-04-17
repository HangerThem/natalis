import React, { useRef, useState } from "react"
import { CaretLeft, CaretRight } from "react-bootstrap-icons"
import styled from "styled-components"

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`

const DatePickerInput = styled.div`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #111;
  border: 1px solid #444;
  cursor: pointer;
  font-size: 0.8rem;
  transition: border-color 0.2s ease;

  &.open {
    border: 1px solid #999;
  }
`

const DatePickerDropdown = styled.div`
  position: absolute;
  top: calc(100% + 1rem);
  left: 0;
  width: 100%;
  padding: 0.5rem;
  background-color: #111;
  border: 1px solid #999;
  border-radius: 4px;
  z-index: 100;
`

const MonthYearHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`

const Day = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #444;
  }

  &.selected {
    background-color: #fff;
    color: #111;
  }

  &.today {
    background-color: #666;
  }

  &.name {
    background-color: transparent;
    color: #888;
    cursor: default;
  }
`

const NavButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`

interface DatePickerProps {
  selectedDate: Date
  handleDateChange: (date: Date) => void
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  handleDateChange,
}) => {
  const [displayedMonth, setDisplayedMonth] = useState(selectedDate)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const wrapperRef = useRef<any>()

  const daysInMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfWeek = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth(),
    1
  ).getDay()

  const days = Array(daysInMonth + firstDayOfWeek)
    .fill(null)
    .map((_, index) => {
      const day = index + 1 - firstDayOfWeek
      const isSameDay = (date: Date) =>
        day === date.getDate() &&
        displayedMonth.getMonth() === date.getMonth() &&
        displayedMonth.getFullYear() === date.getFullYear()

      const isSelected = isSameDay(selectedDate)
      const isToday = isSameDay(new Date())

      const className = isSelected ? "selected" : isToday ? "today" : ""

      const handleClick = () => {
        if (day > 0) {
          handleDateChange(
            new Date(
              displayedMonth.getFullYear(),
              displayedMonth.getMonth(),
              day
            )
          )
        }
      }

      if (day < 1) {
        return <div />
      }

      return (
        <Day key={index} className={className} onClick={handleClick}>
          {day > 0 ? day : ""}
        </Day>
      )
    })

  document.addEventListener("mousedown", (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsDatePickerOpen(false)
    }
  })

  return (
    <DatePickerWrapper ref={wrapperRef}>
      <DatePickerInput
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className={isDatePickerOpen ? "open" : ""}
      >
        {selectedDate.toLocaleDateString()}
      </DatePickerInput>
      {isDatePickerOpen && (
        <DatePickerDropdown>
          <MonthYearHeader>
            <NavButton
              onClick={() =>
                setDisplayedMonth(
                  new Date(
                    displayedMonth.getFullYear(),
                    displayedMonth.getMonth() - 1
                  )
                )
              }
            >
              <CaretLeft size={25} />
            </NavButton>
            <div>
              {displayedMonth.toLocaleString("default", { month: "long" })}{" "}
              {displayedMonth.getFullYear()}
            </div>
            <NavButton
              onClick={() =>
                setDisplayedMonth(
                  new Date(
                    displayedMonth.getFullYear(),
                    displayedMonth.getMonth() + 1
                  )
                )
              }
            >
              <CaretRight size={25} />
            </NavButton>
          </MonthYearHeader>
          <DaysGrid>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Day key={day} className="name">
                {day}
              </Day>
            ))}
            {days}
          </DaysGrid>
        </DatePickerDropdown>
      )}
    </DatePickerWrapper>
  )
}

export default DatePicker
