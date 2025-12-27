# Active Context

## Current Focus

- **Goal**: Fix event detail page crash.
- **Task**: `/toh:fix` (Fixed Thai date parsing in event-schema.tsx).
- **Current Action**: Task Completed.

## Context

- **Issue**: `event-schema.tsx` used `new Date(event.date_text)` which crashed on Thai dates.
- **Solution**:
  - Added `parseThaiDateToISO` function to `lib/date-utils.ts`.
  - Updated `event-schema.tsx` to use the new function.

## Next Steps

1. Test /events/74 page.
2. Deploy frontend if needed.
