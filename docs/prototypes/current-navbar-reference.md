# Current Navbar Reference

Status: reference only

This file records the pre-prototype navbar implementation points so the
prototype navbar can be backed out without reconstructing the old layout from
memory.

## Unchanged Live Components

- `src/components/modules/navigation/mainNav/MainNav.tsx`
- `src/components/modules/navigation/mainNav/DesktopNavLayout.tsx`
- `src/components/modules/navigation/mainNav/TabletNavLayout.tsx`
- `src/components/modules/navigation/mainNav/MobileNavLayout.tsx`
- `src/components/elements/icons/Logo.tsx`

## Baseline Layout

- Desktop: logo on the left, all primary nav links plus account controls aligned
  to the right.
- Tablet: logo and account controls on the top row, primary nav links on a
  second row aligned from the left.
- Mobile: logo on the left, search and menu drawer icons on the right.
- Lower header row: breadcrumbs on the left and desktop search on the right.

The `/prototype/home` navbar experiment should add new components around these
files instead of editing their current layout directly.
