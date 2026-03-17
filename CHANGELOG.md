# Changelog

All notable changes to the Zombie Escape Z project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.4.0] - 2026-03-17
### Added
- Created MVP Step 3: Map Waypoints system.
- Added mock waypoints generator (`src/lib/mockData/waypoints.ts`).
- Integrated custom POI icons (Danger, Safehouse, Objective) to the interactive map.
- Added `zombie-poi-popup` styling to map tooltips.

### Changed
- Translated all user interface text completely into Spanish.

## [v0.3.0] - 2026-03-17
### Added
- Created MVP Step 2: Leaflet and GPS implementation.
- Added `react-leaflet`, `leaflet`, and `@types/leaflet`.
- Added `useGeolocation` custom hook to track high-accuracy browser location.
- Added `<GPSMap>` component mapping user coordinates with accuracy circles.
- Added "Simulator Fallback" for environments where location privacy is enforced (e.g., Opera GX).
- Integrated Map Component into `src/app/dashboard/page.tsx`.

## [v0.2.0-ui] - 2026-03-17
### Added
- Complete visual UI overhaul with a dark/neon survival horror aesthetic.
- New Landing Page (`src/app/page.tsx`).
- New Login Page (`src/app/login/page.tsx`).
- New Registration Page (`src/app/register/page.tsx`).
- New user Dashboard (`src/app/dashboard/page.tsx`).
- New Form Group/Team Creation Page (`src/app/teams/create/page.tsx`).
- Created a local `/backups/` mechanism to store compressed physical copies of the codebase per version.

## [v0.1.0] - 2026-03-16
### Added
- Initial project generation using Next.js 16.
- Git repository initialization and connection to GitHub remote (`albertosarrion/zombie-escape-z`).
- Project architecture planning documents (MVP, structure, setup guides) located in `/md/`.
