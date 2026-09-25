# Restaurant App MVP

Frontend-only React Native / Expo prototype for Fall 2026.

## Demo accounts
Customer:
- Email: ahmed@gmail.com
- Password: Ahmed123

Manager:
- Email: manager@gmail.com
- Password: Manager123

## Run
npm install
npx expo start

The project uses mock/local data and AsyncStorage. No backend or external API is required.

## Main hooks
useState: forms and UI state
useEffect: loading, timers and persistence
useRef: search input/list and render counter
useContext: authentication, theme and cart
useReducer: cart and orders
useMemo: filtering/sorting and order totals
useCallback/React.memo: can be added around stable menu handlers/cards
Custom hooks: useForm, useDebounce, useReservation
