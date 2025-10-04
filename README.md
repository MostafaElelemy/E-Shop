E-Shop is a lightweight storefront demo built with static HTML, CSS, and vanilla JavaScript. It showcases a catalog pulled from [Fake Store API](https://fakestoreapi.com/), lets shoppers curate favorites, and includes a simple cart plus checkout preview.

## Features
- Product grid with category filtering, keyword search, and badge counts that stay in sync across pages
- Favorites view with quick actions to move items into the cart or remove them entirely
- Shopping cart with quantity controls, subtotal calculations, and persisted state via `localStorage`
- Checkout screen that validates form inputs and summarizes the items in the order
- Responsive layout with automatic light/dark theme driven purely by CSS custom properties

## Tech Stack
- Static HTML documents (`index`, `favorites`, `cart`, `checkout`, and `landing` pages)
- Modular ES6 JavaScript located in `/js` for data fetching, storage, and UI interactions
- Single stylesheet (`assets/styles.css`) featuring CSS Grid/Flexbox layouts and theme variables

## Getting Started
1. **Install dependencies (optional).** The project does not require a build step. To run a quick development server you can use any static file host such as `serve` or `http-server`.
   ```bash
   npm install --global serve
   ```
2. **Start a local server** from the repository root:
   ```bash
   serve .
   ```
   The site will be available at the URL that `serve` prints (e.g. `http://localhost:3000`).
3. **Open the desired page** in your browser (`index.html` is the main storefront view).

> 💡 You can also double-click any of the HTML files to open them directly in a browser. A local server is recommended so that API requests to `https://fakestoreapi.com/products` are not blocked by CORS policies.

## Pages
| Page | File | Description |
| --- | --- | --- |
| Landing | `landing.html` | Hero introduction with call-to-action links into the storefront. |
| Home | `index.html` | Browse and filter the full product catalog, add items to cart or favorites. |
| Favorites | `favorites.html` | Review saved products, move them to the cart, or remove them. |
| Cart | `cart.html` | Adjust quantities, view line totals, and proceed to checkout. |
| Checkout | `checkout.html` | Fill out contact and shipping details and confirm the final order summary. |

## Data and Storage
- Primary product data is fetched from [Fake Store API](https://fakestoreapi.com/products).
- If the remote API is unavailable, the app falls back to `assets/products.json` for an embedded catalog.
- Cart and favorites selections are stored in `localStorage`, so they persist between refreshes on the same browser.

## Usage Notes
- Badge counters in the navigation update instantly when you add or remove items, regardless of which page is open.
- Favorites act as a lightweight wishlist: items stay in the list until you explicitly remove them.
- The checkout form performs client-side validation for required fields and formats before simulating a submission.
- `assets/styles.css` defines both light and dark themes using CSS variables and the `prefers-color-scheme` media query—no JavaScript toggles are required.
