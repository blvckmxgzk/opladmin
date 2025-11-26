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

## Recent Changes (November 26, 2025)
- Created `javascript/account.js` for login functionality (was missing from original repo)
- Set up `server.js` Node.js HTTP server for static file serving
- Configured proper directory handling to prevent EISDIR errors
- Added cache control headers to prevent caching issues in Replit iframe
- Configured workflow to run on port 5000 with webview output
- Updated .gitignore for Node.js and Replit files
- Fixed force-register page styling by linking to shared login.css and fonts.css

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
