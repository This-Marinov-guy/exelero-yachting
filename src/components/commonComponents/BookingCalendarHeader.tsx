import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactDatePickerCustomHeaderProps } from "react-datepicker";

const MONTHS = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2000, month, 1))
);

export const bookingCalendarDayClassName = (date: Date) =>
  date.getDay() === 0 || date.getDay() === 6 ? "booking-calendar__weekend" : "";

type BookingCalendarHeaderProps = ReactDatePickerCustomHeaderProps & {
  minDate?: Date;
};

export default function BookingCalendarHeader({
  date,
  changeMonth,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  minDate,
}: BookingCalendarHeaderProps) {
  const firstYear = minDate?.getFullYear() ?? 1900;
  const lastYear = Math.max(2100, date.getFullYear());

  return (
    <div className="booking-calendar__header">
      <button
        type="button"
        className="booking-calendar__arrow"
        aria-label="Previous month"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <div className="booking-calendar__selectors">
        <div className="booking-calendar__selector">
          <span aria-hidden="true">{MONTHS[date.getMonth()]}</span>
          <ChevronDown size={14} aria-hidden="true" />
          <select
            className="booking-calendar__select react-datepicker__month-select"
            aria-label="Month"
            value={date.getMonth()}
            onChange={(event) => changeMonth(Number(event.target.value))}
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div className="booking-calendar__selector">
          <span aria-hidden="true">{date.getFullYear()}</span>
          <ChevronDown size={14} aria-hidden="true" />
          <select
            className="booking-calendar__select react-datepicker__year-select"
            aria-label="Year"
            value={date.getFullYear()}
            onChange={(event) => changeYear(Number(event.target.value))}
          >
            {Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        className="booking-calendar__arrow"
        aria-label="Next month"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
