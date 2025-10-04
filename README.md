# E-Shop

E-Shop is a simple front-end storefront that showcases products, lets visitors mark favorites, manage a shopping cart, and walk through a mock checkout flow. It is built with static HTML/CSS and vanilla JavaScript.

## Features
- Product catalog with search and category filtering
- Favorites list with quick “move to cart” action
- Persistent cart backed by `localStorage`
- Checkout form with client-side validation and order summary

## Getting Started
1. Clone the repository.
2. Serve the root directory with any static HTTP server (e.g., `npx serve .`).
3. Open `landing.html` in your browser.

## Pages
- 'landing.html' Home page.
- `index.html` – Browse and filter products.
- `favorites.html` – Review and manage saved items.
- `cart.html` – Adjust quantities and view totals.
- `checkout.html` – Submit customer details and review the order.

## Data Sources
Product data is fetched from `https://fakestoreapi.com/products`, with `assets/products.json` as a local fallback when the remote API is unavailable.

