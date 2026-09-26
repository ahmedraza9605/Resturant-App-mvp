# Restaurant Mobile Application

**Name:** Muhammad Ahmed Raza 
**Reg No:** 9605 
**Assignment No:** 01
**Submitted to:** Dr. Sadaf Tanvir
**Date:** 27-Sep-2026

Frontend-only React Native / Expo prototype (Fall 2026). No backend, API, or state library — uses mock data + AsyncStorage.

## Demo Accounts
- Customer: `ahmed@gmail.com` / `Ahmed123`
- Manager: `manager@gmail.com` / `Manager123`

## Run
```bash
npm install
npx expo start
```
Scan the QR with Expo Go, or press `a` / `i` for an Android/iOS emulator.

## Hooks Used
| Hook | Where |
|---|---|
| useState | Forms, UI state |
| useEffect | Loading, timers, persistence |
| useRef | Search input/list, render counter |
| useContext | Auth, theme, cart |
| useReducer | Cart, orders |
| useMemo | Filtering/sorting, order totals |
| useCallback / React.memo | Menu handlers/cards |
| Custom hooks | useForm, useDebounce, useReservation |

_
