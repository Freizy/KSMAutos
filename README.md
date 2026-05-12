

# KSM Autos

A premium automotive marketplace platform built for enterprise-grade showroom experiences, live at:

- **https://ksm.autos**

---

## Executive Summary

KSM Autos is a polished automotive marketplace and management system built with modern web technologies. It delivers a buyer-ready customer experience for high-value vehicle discovery, combined with an operational dashboard for inventory, inquiries, and user administration.

This repository is engineered for fast deployment, rapid iteration, and enterprise acquisition potential by a technology firm seeking a luxury ecommerce showroom solution.

## Investor Pitch

KSM Autos is a turn-key digital showroom for premium vehicle retail, combining real-time inventory management, lead capture, and a high-end customer experience in a production-ready web app. It is built to be acquired by a company looking to accelerate marketplace expansion into luxury automotive ecommerce.

## Why It’s Acquisition-Ready

- **Live production domain**: `https://ksm.autos`
- **Modern, maintainable stack**: React 19, TypeScript, Vite, Firebase
- **Real-time operations**: Firestore listeners keep inventory and inquiries in sync
- **Premium user experience**: responsive UI, motion interactions, and branded styling
- **Admin capabilities**: inventory control, inquiry handling, and maintenance mode
- **Extensible foundation**: easy to add checkout, lead nurturing, analytics, and payments

## Product Vision

KSM Autos is designed for tech-led automotive retailers, brokers, and marketplace buyers who want a seamless showroom experience that supports:

- high-value vehicle discovery
- personalized user journeys
- lead capture and inquiry management
- real-time inventory control

## Core Features

- Vehicle browsing with premium detail presentation
- Wishlist and saved favorites for signed-in users
- Comparative analysis of up to 3 vehicles
- Inquiry request flow for lead generation
- Admin dashboard for inventory, users, inquiries, and site state
- Maintenance mode for controlled launch or emergency lockdown
- Live production deployment at `ksm.autos`

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS, responsive UI patterns
- **Animations**: Framer Motion, Motion React
- **Icons**: Lucide React
- **Backend**: Firebase Authentication, Firestore realtime database
- **Server**: Express entrypoint + Vite preview support
- **Deployment**: production-ready static/app hosting with custom domain

## Architecture Overview

- **Client**: Single-page React app with component-driven UI
- **Auth**: Firebase Google sign-in for secure session management
- **Data**: Firestore collections for `inventory`, `users`, `inquiries`, and `settings`
- **Admin**: dashboard interface and Firestore rules for protected operations
- **Environment**: secrets managed through `.env.local`, `.env.example` for onboarding

## Production Readiness Checklist

- [x] Live production URL: `https://ksm.autos`
- [x] Frontend type-checked with TypeScript
- [x] Authentication and user state management
- [x] Firestore security rules included
- [x] Responsive design for desktop and mobile
- [x] Deployment instructions and build scripts present

## Setup & Local Development

### Prerequisites

- Node.js 18+ installed
- Firebase project configured with Firestore and Authentication
- `GEMINI_API_KEY` if Gemini functionality is required

### Install

```bash
npm install
```

### Environment

Create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your runtime values:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="https://ksm.autos"
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Firebase Configuration

- `firebase-applet-config.json` contains Firebase app settings
- `firestore.rules` defines Firestore access policies for production data

## Deployment Notes

The app is currently deployed at:

- **https://ksm.autos**

For production deployments, confirm:

- the correct Firebase project is configured
- the live domain is set as `APP_URL`
- secret keys are kept out of version control

## Security & Compliance

- Keep `.env.local` out of source control
- `.git_disabled/` is ignored locally and should not be committed
- Use Firestore rules to restrict access to authenticated users and admin operations

## Business Value

KSM Autos is positioned to deliver:

- faster high-end vehicle discovery
- improved lead capture and sales workflows
- a branded digital showroom experience
- a scalable base for ecommerce and marketplace expansion

## Roadmap for Acquisition-Ready Growth

To make this app even more attractive for acquisition, prioritize:

- quote and checkout workflow
- customer lead email notification system
- analytics dashboard and conversion tracking
- payment or reservation flow
- release automation and monitoring

---

Built for KSM Autos demonstration, investor-ready storytelling, and rapid enterprise adoption.
