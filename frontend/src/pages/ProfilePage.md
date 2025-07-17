# ProfilePage Component

`ProfilePage` is a user profile page component that displays personal information, a mood calendar, and a list of user entries.

---

## Props

This component does **not accept external props**. All data is sourced from:
- Redux Store (via `useSelector`)
- RTK Query (via `useGetMeQuery`)

---

## State Management

### Internal State

| Variable      | Type    | Default     | Description                                      |
|---------------|---------|-------------|--------------------------------------------------|
| `activeTab`   | string  | `"calendar"`| Currently active tab (`calendar` or `entries`)   |
| `entries`     | array   | mock data   | List of user entries                             |

### Redux Store

| Selector/Query         | Source      | Description                                     |
|------------------------|-------------|--------------------------------------------------|
| `selectCurrentUser`    | `authSlice` | Current user data                                |
| `useGetMeQuery`        | `authApi`   | Fetch current user via API                       |
| `useLogoutMutation`    | `authApi`   | RTK mutation for logging out                     |

---

## Component Structure



mermaid
graph TD
    A[ProfilePage] --> B[UserProfile]
    A --> C[TabSystem]
    C --> D[CalendarTab]
    C --> E[EntriesTab]
    B --> F[UserAvatar]
    B --> G[UserDetails]
    B --> H[EditButton]


## Methods

### `handleLogout()`

Handles the logout process for the user.

**Steps:**

1. Calls the logout API using RTK Mutation  
2. Dispatches the `logout()` action from the auth slice  
3. Navigates to the `/onboarding` route

```tsx
const handleLogout = async () => {
  try {
    await logout();          
    dispatch(logoutAction()); 
    navigate('/onboarding');  
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

---

## Notes

- This component uses mock data for entries by default — replace it with data from `useGetEntriesQuery` for production use.
- Add loading and error states for better UX.
- All interactive elements include proper ARIA attributes and semantic HTML.

---

## Usage

```tsx
import { ProfilePage } from './ProfilePage';

<Route path="/profile" element={<ProfilePage />} />
