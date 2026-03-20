# Spoolio Frontend (Nuxt3)

> Frontend application for a 3D printing platform, enabling users to upload models, configure print settings, visualize them in 3D, and place orders.

This project is a **Nuxt3-based web application** that connects to the Spoolio Django backend, providing a complete user interface for managing 3D printing workflows.

---

## Highlights

- Built with **Nuxt3 (Vue 3)** and modern frontend architecture
- **Interactive 3D model visualization** using Three.js
- Full integration with backend APIs (authentication, orders, pricing)
- **Stripe checkout flow** for payments
- Responsive UI for managing complex 3D printing configurations

---

## Overview

Spoolio frontend allows users to:

- upload and preview 3D models
- configure printing parameters (layer height, color, etc.)
- view real-time price and duration estimates
- manage cart and orders
- complete purchases using Stripe
- track order history

The application communicates with a Django REST backend that handles business logic, slicing, and payments.

---

## Core Features

### Authentication
- User registration and login
- Session management with backend API

### 3D Visualization
- Rendering of uploaded 3D models
- Interactive scene using **Three.js**
- Visual feedback for model orientation and scale

### Print Configuration
- UI for selecting print parameters
- Dynamic updates based on backend responses

### Cart & Orders
- Add configured models to cart
- Modify and review order items
- View order history

### Payments
- Stripe checkout integration
- Secure payment flow

---

## Tech Stack

- **Nuxt3 (Vue 3)**
- **JavaScript / TypeScript**
- **Three.js**
- **Tailwind CSS** (if used, adjust if needed)
- **Axios / Fetch API**
- Stripe frontend SDK

---

## Architecture

The frontend is structured as a modular SPA/SSR hybrid using Nuxt3:

- Pages: route-based views
- Components: reusable UI and 3D elements
- Services: API communication layer
- State management: (Pinia / composables if used)

The app communicates with the backend via REST APIs.
