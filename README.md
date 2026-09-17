# Felix James S — Portfolio & Commission Management System

A full-stack portfolio and client commission management platform for **Felix James Studio**, a graphic design and web development practice. Built as a Firebase-backed web app that doubles as a public portfolio and a private client/admin workflow tool.

## Overview

This isn't just a static portfolio — it's a working business tool. Visitors browse a live design gallery and testimonials, while returning clients log in to track their commissions and message directly with the studio. On the back end, an admin dashboard manages designs, commissions, and testimonials in real time.

## Features

- **Portfolio gallery** — Pinterest-style masonry layout showcasing design work, pulled live from Firestore
- **Client portal** — commission tracking and real-time messaging between client and studio
- **Admin dashboard** — full CRUD control over designs, commissions, and testimonials via live Firestore collections
- **Two-role authentication** — admin sign-in via email/password, client access via magic link
- **Testimonials** — client reviews displayed on the portfolio, with a review submission popup
- **Progressive Web App (PWA)** — installable, with service worker and manifest configured
- **Theming** — automatic dark/light mode based on system preference
- **Polish touches** — floating arc navigation menu, text-to-speech buttons, skeleton loading states, JSON-driven status page

## Tech Stack

- **Frontend:** HTML/CSS/JavaScript (PWA)
- **Backend/Data:** Firebase (Firestore, Authentication)
- **Payments:** M-Pesa (Daraja API)
- **Hosting:** GitHub Pages / Firebase Hosting
- **Notifications:** OneSignal (push notifications)

## Project History

The data layer evolved in stages: a local `designs.json` → Google Sheets (with a JSONP workaround for CORS) → Firestore, which now backs both the designs and testimonials collections. Authentication similarly evolved from magic links toward an OTP-after-payment flow for a smoother client experience.

## Status & Roadmap

- ✅ Core portfolio, admin dashboard, and client portal live
- 🚧 Push notifications — partially working; GitHub Pages subfolder paths currently complicate PWA service worker registration
- 🔜 Dedicated Node.js backend
- 🔜 Fully private admin PWA
- 🔜 Deeper Firestore security rule hardening

## Getting Started

```bash
git clone <repo-url>
cd <repo-name>
# Add your Firebase config to the appropriate config file
```

> **Note:** This repo requires a Firebase project with Firestore and Authentication enabled. See `firebase-config.example.js` (or equivalent) for the expected structure — never commit real API keys.

## About

Built and maintained by **Felix**, — a computer science student, graphic designer expanding into full-stack development.

---
