# Openworld Legends Dashboard

## Overview
A sleek dashboard application for Openworld Legends with a modern login interface and administrative tools. This is a static HTML/CSS/JavaScript frontend application served via a Node.js HTTP server.

## Project Structure
- `/` - Root directory with main redirect page
- `/login` - Login page with username/password authentication
- `/home` - Home page (accessible after login)
- `/dashboard` - Dashboard page
- `/console` - Console page
- `/dbt/admin/force-register` - Admin tool for force-registering users
- `/assets` - Images and media files
- `/css` - Stylesheets
- `/javascript` - Client-side JavaScript
- `/fonts` - Montserrat font files

## Technical Details
- **Frontend**: Pure HTML/CSS/JavaScript with no build process
- **Server**: Node.js HTTP server (server.js) serving static files
- **Port**: 5000 (configured for Replit webview)
- **Authentication**: Client-side using localStorage (demo implementation)

## Current State
The application is fully functional in the Replit environment:
- HTTP server configured to serve all static assets
- Cache control headers prevent browser caching issues
- Login flow redirects properly based on authentication state
- All pages and assets load correctly

## Recent Changes (November 27, 2025)
- **UI Design**: Transformed entire dashboard to liquid glass (glassmorphism) aesthetic with Apple-inspired visual style
- **Animations**: Added smooth animations including logo bounce, input field slide-ins with staggered timing, and button float effects
- **Styling**: Updated all CSS files (login.css, main.css, redirect.css) with gradient backgrounds and blur effects
- **Button**: Added floating animation on hover (floats 2-8px continuously)
- **Password Visibility**: Fixed show password button by setting opacity to 1 and proper z-index
- **Force Register**: Fixed JavaScript click handler and username input ID references
- **Font Support**: Added maximum browser compatibility with all Montserrat font weights (100-900) using TTF format with vendor prefixes (-webkit-, -moz-)
- **Responsive Design**: Implemented mobile-first responsive layout with media queries for tablets (768px) and mobile (480px)
- **Full Screen Fit**: Configured all pages to fit full browser viewport without scrollbars using flexbox centering and overflow:hidden
- **Cross-Browser Support**: Added vendor prefixes to all CSS properties (transforms, filters, animations, box-shadows, flexbox) for maximum compatibility across Chrome, Firefox, Safari, and Edge

## How to Run
The application starts automatically via the configured workflow:
```bash
node server.js
```

Server runs on `http://0.0.0.0:5000/` and is accessible via the Replit webview.

## Authentication
The current implementation uses localStorage for demo purposes:
- Any username/password combination is accepted
- Login state is stored in `localStorage.getItem('logged-in')`
- Username is stored in `localStorage.getItem('username')`
- This is a client-side only implementation with no backend validation

## Admin Tools
The `/dbt/admin/force-register` page connects to an external Roblox API backend at `https://oplbackend.onrender.com` to grant whitelist access to users.
