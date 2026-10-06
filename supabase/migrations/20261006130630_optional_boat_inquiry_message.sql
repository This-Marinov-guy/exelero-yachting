alter table public.boat_inquiries
  drop constraint boat_inquiries_message_check;

alter table public.boat_inquiries
  add constraint boat_inquiries_message_check
  check (length(trim(message)) <= 3000);
