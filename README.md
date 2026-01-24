DAHA/R Web App | dev.dahar.services

## Overview

Frontend for the DAHA/R reservation and restaurant management system.

The app has two flows:
- Client flow: Reservation → Menu → Bookings (self‑service booking and order)
- Admin flow: Manage Availability → Manage Menu → Manage Status (operations dashboard)

The frontend is wired to a NestJS backend via Next.js API routes and an environment‑driven base URL, with local mocks only as fallbacks in some hooks.

## Tech Stack

- Next.js App Router (src/app)
- React 19 + TypeScript
- Tailwind CSS 4 (via @tailwindcss/postcss)
- Zod for schema validation and lightweight form logic
- ESLint 9 + eslint-config-next for linting

See [package.json](./package.json) for exact versions.

### Key Dependencies

- next: 16.0.10
- react: 19.2.0
- react-dom: 19.2.0
- zod: ^4.1.12

### Dev Dependencies

- typescript: ^5
- tailwindcss: ^4
- @tailwindcss/postcss: ^4
- eslint: ^9
- eslint-config-next: 16.0.3
- @types/node, @types/react, @types/react-dom

## Application Structure

High level layout:

- src/app
  - `(client)/dashboard` – client dashboard and flows
    - `/dashboard` – client landing (cards linking to Reservation, Menu, Bookings)
    - `/dashboard/reservation` – reservation wizard
    - `/dashboard/menu` and `/dashboard/menu/[slug]` – menu browsing and ordering
    - `/dashboard/bookings` – bookings list and reschedule/cancel flow
  - `(admin)/admin` – admin dashboard and tools
    - `/admin` – admin landing
    - `/admin/manage-availibility` – manage timeslots and capacity
    - `/admin/manage-menu` – manage menu items and availability
    - `/admin/manage-status` – manage bookings + reschedule requests
    - `/admin/signin` – admin sign‑in
  - `/signin`, `/signup` – client auth
  - `/api/*` – Next.js API routes that proxy to the backend
  - `/page.tsx` – marketing/landing page (Hero + CTA)

Key directories:

- src/components – reusable UI and feature “composers”
- src/lib/hooks – custom hooks for data fetching, forms, and UI behavior
- src/lib/types – shared TypeScript types for bookings, menu, reservation, UI
- src/data – local JSON fixtures used only as fallbacks or for proto flows

## Data & APIs

API routes under `src/app/api` proxy to the backend using `NEXT_PUBLIC_API_BASE_URL`. They:
- Read credentials from cookies (`upstream_bearer`, `upstream_cookie`)
- Forward requests to the backend
- Normalize backend responses into the frontend data shapes

Important routes:

- `/api/auth/*`
  - Sign in, sign up, sign out
  - `/api/auth/status` – used by client dashboard to resolve the current email

- `/api/bookings`
  - `POST /api/bookings` – create a booking:
    - Validates payload with Zod
    - Resolves a slot via `/availability/slots`
    - Posts to `POST {API_BASE}/bookings`
  - `GET /api/bookings?email=` – fetch bookings for a client (mapped from backend `BookingsService.getBookingsByEmail`)

- `/api/bookings/cancel`
  - Calls backend `POST /bookings/cancel`

- `/api/bookings/reschedule`
  - Calls backend `POST /bookings/reschedule`
  - Creates a `RescheduleRequest` with status `PENDING`

- `/api/availability/*`
  - `/availability/available-dates` – list available dates
  - `/availability/slots` – list time slots for a date
  - `/availability/admin/slots` – CRUD for slots in admin manage‑availability

- `/api/menu/*`
  - Client list: `/api/menu`
  - Admin list + CRUD: `/api/menu/admin/menu`, categories, tags

- `/api/admin/bookings`
  - Admin booking list with filters (status, date range)

- `/api/reschedules`
  - `GET` – proxies to backend `/reschedules/admin/reschedules`
  - Normalizes the response into `RescheduleRequest` objects used by admin UI

- `/api/reschedules/[id]/accept`, `/reject`
  - Proxy to backend admin accept/reject endpoints

## Client Features

### Client Dashboard (`/dashboard`)

- Landing for signed‑in clients
- Cards to:
  - Create a reservation
  - Browse the menu
  - View/manage existing bookings

### Reservation Flow (`/dashboard/reservation`)

- Date selection:
  - Uses `useAvailableDates` to fetch available dates via `/api/availability/available-dates`
  - Calendar UI via `DatePickerCalendar`
- Time selection:
  - Uses `useTimeSlotsForDate` and `/api/availability/slots` to list slots and capacities
  - Capacity rules enforced on backend for final booking creation
- Party size, contact info, and optional notes with Zod validation
- Summary and submit step calling `POST /api/bookings`

### Menu Flow (`/dashboard/menu`, `/dashboard/menu/[slug]`)

- Menu listing with:
  - Search and category filters
  - Availability badges
- Client‑side cart:
  - Add/remove items, change quantities
  - Order summary with computed subtotal
- Confirm/submit button ready to hook into backend order APIs if needed

### Bookings Flow (`/dashboard/bookings`)

Core component: `BookingsComposer`.

- Loads bookings for the current user via `useBookings({ endpoint: "/api/bookings", email })`
- Filters:
  - Status: `all | upcoming | confirmed | pending | cancelled`
  - Date range (from/to)
  - Free text search (date, time, item names)
- List:
  - `UpcomingBookingsList` renders a list of `BookingCard`s
  - Each card shows date, time, guests, items, subtotal, and a status badge
  - Status badge colors reflect upcoming, confirmed, pending, cancelled
- Actions:
  - View details (opens `BookingDetailModal`)
  - Cancel booking (calls `/api/bookings/cancel`, then refreshes)
  - Reschedule booking:
    - Opens `ClientRescheduleModal`
    - Client picks a new date and time (same availability hooks as reservation)
    - On confirm, calls `/api/bookings/reschedule`
    - Backend creates a reschedule request; frontend refetches bookings
    - If a booking has any `RescheduleRequest` with status `PENDING`, it is shown as `pending` in the client dashboard

## Admin Features

### Admin Sign‑in (`/admin/signin`)

- Form validated with Zod
- Uses auth API routes under `/api/auth/*`
- On success, sets cookies consumed by API proxies (`upstream_bearer` / `upstream_cookie`)

### Manage Availability (`/admin/manage-availibility`)

- Date range filter via `AdminToolbar`
- Calendar and slot editor via `AdminScheduleEditor`
- Uses:
  - `/api/availability/admin/slots` for listing and updates
  - Time range approx. 06:00–23:00, capacity constraints enforced by backend

### Manage Menu (`/admin/manage-menu`)

- Menu search and filters
- Toggle item availability
- Bulk operations:
  - Enable/disable many items
- Create/edit menu items via `AdminMenuForm` in a modal
- Uses admin `/api/menu/admin/menu` routes

### Manage Status (`/admin/manage-status`)

Two main sections:

1. Upcoming bookings
   - Uses `useAdminBookings({ endpoint: "/api/admin/bookings" })`
   - Filter by date range and status
   - Shows booking status badges including pending (if surfaced by backend)

2. Reschedule requests
   - Uses `useRescheduleRequests({ endpoint: "/api/reschedules" })`
   - Shows `RescheduleRequestCard` list:
     - Current vs requested date/time
     - Guests, reason (if present), admin note
   - Accept flow:
     - Opens `RescheduleDecisionModal`
     - Admin chooses final date/time
     - Calls `/api/reschedules/[id]/accept`
     - Backend moves booking to requested slot and marks reschedule as ACCEPTED
   - Reject flow:
     - Calls `/api/reschedules/[id]/reject` with a reason
     - Backend marks reschedule as REJECTED and booking as CANCELLED
   - After either action, both reschedule list and bookings list are refreshed

## Forms and Validation

Forms use Zod for validation via the `useZodFormValidation` hook:

- Auth forms (sign in, sign up)
- Reservation steps
- Admin filters (date ranges)

## Styling

- Tailwind CSS utility classes
- Dark theme by default for dashboard views
- Layout primitives:
  - `DashboardCard`, `StepSection`, `StepIndicator`
  - `Modal` with overlay + escape key handling

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` (required in production)
  - Base URL for the backend (e.g. `https://be.dahar.services`)
  - Used by API routes to build upstream URLs

## Scripts

From the frontend root:

- `npm run dev` – start Next.js dev server
- `npm run build` – production build
- `npm run start` – start the built app
- `npm run lint` – run ESLint
- `npm test` – run unit tests

## Testing

The project maintains comprehensive test coverage using Jest and React Testing Library.

### Tech Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component rendering and user interaction testing
- **ts-jest**: TypeScript support for Jest

### Running Tests
Run all unit tests:
```bash
npm test
```

Run tests in watch mode (interactive):
```bash
npm test -- --watch
```

Generate coverage report:
```bash
npm test -- --coverage
```

### Test Coverage Results
As of the latest run:
- **Test Suites**: 48 passed
- **Total Tests**: 167 passed
- **Coverage**: ~100% across Statements, Branches, Functions, and Lines.

The test suite covers:
- **Components**: Rendering, user interactions (clicks, inputs), and conditional states.
- **Hooks**: Custom logic for forms, wizards, and data fetching (mocked).
- **Utilities**: Helper functions and formatters.
- **Integration**: Form flows and wizard step transitions.

## Notes

- Components and hooks are structured to keep page contracts stable while data sources evolve.
