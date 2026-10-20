import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { usePublicLocale } from "@/app/i18n/i18n-context";
import { usePublicText } from "@/lib/usePublicText";
import { BOOKING_DATE_LOCALES } from "@/lib/bookingDateLocales";


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
  const locale = usePublicLocale();
  const tr = usePublicText();
  const months = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(BOOKING_DATE_LOCALES[locale].code, { month: "long" }).format(new Date(2000, month, 1))
  );
  const firstYear = minDate?.getFullYear() ?? 1900;
  const lastYear = Math.max(2100, date.getFullYear());

  return (
    <div className="booking-calendar__header">
      <button
        type="button"
        className="booking-calendar__arrow"
        aria-label={tr("Previous month")}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <div className="booking-calendar__selectors">
        <div className="booking-calendar__selector">
          <span aria-hidden="true">{months[date.getMonth()]}</span>
          <ChevronDown size={14} aria-hidden="true" />
          <select
            className="booking-calendar__select react-datepicker__month-select"
            aria-label={tr("Month")}
            value={date.getMonth()}
            onChange={(event) => changeMonth(Number(event.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div className="booking-calendar__selector">
          <span aria-hidden="true">{date.getFullYear()}</span>
          <ChevronDown size={14} aria-hidden="true" />
          <select
            className="booking-calendar__select react-datepicker__year-select"
            aria-label={tr("Year")}
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
        aria-label={tr("Next month")}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
