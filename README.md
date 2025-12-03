DAHA/R Web App | dev.dahar.services

Overview
- Client flow: Reservation → Menu → Bookings
- Admin flow: Manage Availability → Manage Menu → Manage Status
- Local-state prototypes ready to swap to a backend

Tech Stack
- Next.js app router, React, TypeScript
- Tailwind CSS

Client Features
- Dashboard: links to Reservation, Menu, Bookings
- Reservation: pick date, time, party size; enter details; review and submit
- Menu: search and category filter; add/remove items; order summary; confirm
- Bookings: list upcoming/confirmed; filter by status/date; view details; cancel/reschedule

Admin Features
- Manage Availability: date filters, calendar, slot editor; time 06:00–11:00 PM; capacity 2–30; save and confirm
- Manage Menu: search/filter, availability toggles, bulk disable, create new menu item via modal; local persistence
- Manage Status: list pending reschedule requests; accept with date/time; reject with confirmation; date range filter

Notes
- Components and hooks are structured to swap to real APIs without changing page contracts
