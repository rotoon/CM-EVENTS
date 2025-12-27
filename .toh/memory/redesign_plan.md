# Event Detail Page Redesign Plan

## Goal Description

Redesign `/events/[id]` to be a high-impact, modern, Neo-Brutalist (2026) experience. The current design is functional but lacks the "wow" factor and interactivity expected of a premium modern app. We will focus on:

- **Immersive Split Layout**: Large visuals on one side, sticky content on the other.
- **Neo-Brutalist Typo**: Big, bold fonts.
- **Interactive Elements**: Expandable maps, dynamic gallery.
- **Micro-animations**: Smooth transitions using our new `.animate-fadeIn`.

## Proposed Changes

### 1. New Components

We will create dedicated components for the detail page to keep `page.tsx` clean.

- `components/events/detail/event-header.tsx`: Hero section with title and status.
- `components/events/detail/event-gallery.tsx`: Main image and grid.
- `components/events/detail/event-info.tsx`: Description, Map, Meta info.
- `components/events/detail/event-actions.tsx`: Call to actions (Links, Share).

### 2. Update Page Layout

Refactor `app/events/[id]/page.tsx` to use these new components in a responsive grid layout.

## Verification Plan

- Check responsive behavior.
- Verify data correctness.
- Test interactions.
