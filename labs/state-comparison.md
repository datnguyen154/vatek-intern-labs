# Lab L5 — State Management Comparison

## 1. Overview

Lab L5 implements the same Draft Order Builder using three approaches:

1. React Context API + useReducer
2. Redux Toolkit
3. Zustand

All implementations share the same business rules through
`orderReducer` and `calculateOrderTotal`.

Supported features:

- Add and remove products.
- Update product quantities.
- Apply a discount from 0% to 100%.
- Calculate subtotal, discount amount, and total.

## 2. Comparison

| Criteria      | Context API               | Redux Toolkit                      | Zustand                       |
| ------------- | ------------------------- | ---------------------------------- | ----------------------------- |
| Setup         | Simple, built into React  | Requires Store, Slice and Provider | Simple store setup            |
| State updates | dispatch + useReducer     | dispatch + Slice reducer           | Store actions + set           |
| Sharing state | Context Provider          | Redux Provider                     | Store hook                    |
| Selectors     | Not built into useContext | useSelector                        | Built-in selector             |
| Debugging     | React DevTools            | Redux DevTools                     | DevTools middleware available |
| API caching   | Not built in              | RTK Query                          | Not built in                  |
| Boilerplate   | Low for simple cases      | Higher                             | Usually low                   |

## 3. Context API

Advantages:

- Built into React without additional dependencies.
- Easy to understand for small shared-state requirements.
- Works naturally with useReducer for predictable updates.

Disadvantages:

- Consumers of the same Context update when its value changes.
- Optimizing frequent updates may require splitting Contexts.
- More complex state logic can become harder to organize.

Best use case:
A small application sharing theme, language, or a simple
draft order within a limited component tree.

## 4. Redux Toolkit

Advantages:

- Organizes state and update logic through Stores and Slices.
- React Redux selectors allow components to subscribe
  to specific parts of the state.
- Redux DevTools helps inspect action history.
- RTK Query supports API fetching and caching.

Disadvantages:

- Requires additional dependencies and configuration.
- Involves more concepts and project structure.
- May be unnecessary for a small application.

Best use case:
A large order management application with many features,
complex business logic, debugging requirements, and
server-state management needs.

## 5. Zustand

Advantages:

- Simple API with minimal boilerplate.
- Does not require a Provider for a standard global store.
- Components can subscribe to selected state values.
- State and actions can be defined together.

Disadvantages:

- Teams need consistent conventions for larger stores.
- Advanced debugging requires additional setup.
- API caching is not provided by the basic store.

Best use case:
A small-to-medium ecommerce application that needs shared
cart or draft-order state across multiple components,
with selectors and minimal setup.

## 6. Re-render Behavior

Context API:
When a Provider value changes, components consuming that
Context receive an update, even if they only use an
unchanged field.

Redux Toolkit:
useSelector compares selected values. If the selected
value does not change, the store update does not itself
require the component to re-render.

Zustand:
Selectors allow components to subscribe to specific
state values. Unchanged selector results generally do
not cause re-renders from the store update.

All three approaches may still re-render components
because of props, parent renders, or local state.

## 7. Implementation Findings

All three implementations use the same shared business
rules and produce equivalent order totals.

Context API:

- Uses OrderProvider and useReducer.
- Components access order state through useOrderContext.

Redux Toolkit:

- Uses createSlice and configureStore.
- Components dispatch generated actions and use selectors.

Zustand:

- Uses create to define state and actions.
- Components call store actions directly.

The main difference is how shared state is accessed,
updated, organized, and observed.

## 8. Conclusion

There is no single best state-management solution
for every React application.

Context API is suitable for simple shared state.
Redux Toolkit is preferable when structured state
management, complex workflows, and tooling are important.
Zustand is suitable when shared state requires selectors
but the application benefits from simpler setup.

For a small Draft Order Builder, Context API is sufficient.
For a larger order-management system, Redux Toolkit is
a strong choice.
For a lightweight ecommerce cart, Zustand offers a
practical balance between simplicity and functionality.
