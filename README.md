# 🍽️ Restaurant Mobile Application

**Name:** Muhammad Ahmed Raza\
**Reg No:** 9605\
**Assignment No:** 01\
**Submitted to:** Dr. Sadaf Tanvir\
**Date:** 27th-September-2026

Frontend-only React Native / Expo prototype for Fall 2026.

---

## 📖 Overview

A restaurant ordering and reservation app built for two roles — **Customer** and **Manager** — sharing one codebase. Customers browse a menu, build a cart, place an order, and track it live. Managers see a dashboard of active orders and manage table reservations. There's no backend: all data is mocked, so the app is a UI/UX and state-management demo rather than a production app.

## ✨ Features

- 🔎 Menu browsing with category filters and live search
- 🛒 Cart with quantity control, per-item notes, and promo codes (`SAVE10`, `WELCOME5`)
- 🧾 Order summary with dine-in / takeaway toggle
- 📡 Animated order tracking through status stages
- 👤 Customer profile screen
- 📊 Manager dashboard with stat cards and a live orders list
- 📅 Manager reservations view with status tracking

## 🧭 App Flow

```
RoleSelect → Customer (Menu → Cart → Order Summary → Order Tracking, + Profile)
           → Manager  (Dashboard, Reservations)
```

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo |
| Navigation | React Navigation (bottom tabs + stack) |
| State | React Context (`CartContext`) |
| Data | Local mock data (`src/data/mockData.js`) |
| Styling | Custom theme constants (`src/theme/theme.js`) |

## 🚀 Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android/iOS), or press `i` / `a` for a simulator.

## 📁 Structure

```
App.js                          entry point, wraps app in CartProvider
src/
  context/CartContext.js        cart state: items, promo, order type, totals
  data/mockData.js               menu items, orders, reservations (fake data)
  theme/theme.js                  colors, spacing, typography constants
  navigation/
    RootNavigator.js              RoleSelect → CustomerTabs / ManagerTabs
    CustomerNavigator.js          bottom tabs (Menu, Profile) + stack for Cart/Order flow
    ManagerNavigator.js           bottom tabs (Dashboard, Reservations)
  screens/
    RoleSelectScreen.js
    customer/
      MenuScreen.js               search + category filter + add to cart
      CartScreen.js               quantity, notes, promo code, totals
      OrderSummaryScreen.js       dine-in/takeaway toggle, final review
      OrderTrackingScreen.js      animated status stages
      ProfileScreen.js
    manager/
      DashboardScreen.js          stat cards + live orders list
      ReservationsScreen.js       reservation list with status
  components/
    MenuItemCard.js
    CategoryChip.js
    CartItemRow.js
```

## 📐 UML Diagrams

Design diagrams for this assignment are included in `/docs` (or wherever you place them):

- Use Case Diagram
- Class Diagram
- Sequence Diagram (Customer places an order)
- State Machine Diagram (order lifecycle)
- Component Diagram (app architecture)
- Activity Diagram (reservation flow)

## ✅ What's real vs. stubbed

**Real:** navigation flow, cart math (subtotal/discount/tax/total), promo code validation, search/filter, quantity + notes editing, order tracking animation.

**Stubbed (no backend):** all data lives in `mockData.js`, no auth, no persistence between app restarts, no real payment integration.

## 🔭 Next steps if this goes further

- Wire a real API instead of `mockData.js`
- Add auth so Manager routes aren't just a tab away from Customer
- Persist cart with AsyncStorage so it survives app restarts
- Replace the `setInterval` mock in `OrderTrackingScreen` with real order-status push/poll

## 📄 License

Academic project — for coursework purposes only.
