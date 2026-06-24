# Bugfix Requirements Document

## Introduction

Authenticated users (admin, founder, collaborator) receive "Authentication required. Please log in." errors when accessing the backend API from the frontend despite being successfully authenticated via better-auth. This bug prevents all authenticated users from accessing any protected API endpoints, rendering dashboard features and user-specific operations completely non-functional.

The root cause is an authentication mechanism mismatch: the frontend uses better-auth with session-based authentication (HTTP-only cookies), while the API client (`src/lib/api.js`) expects JWT tokens stored in localStorage. Since better-auth does not store tokens in localStorage, the axios interceptor never finds a token to attach to outgoing requests, causing the backend to reject all requests as unauthenticated.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an authenticated user (any role: admin, founder, or collaborator) makes an API call to any protected endpoint THEN the system returns `{success: false, message: "Authentication required. Please log in."}` despite the user being authenticated via better-auth

1.2 WHEN the axios interceptor in `api.js` executes THEN it looks for a JWT token in `localStorage.getItem('token')` which does not exist because better-auth uses HTTP-only cookies for session management

1.3 WHEN a user successfully logs in via better-auth THEN no JWT token is stored in localStorage, causing all subsequent authenticated API requests to fail

1.4 WHEN the backend API receives requests without an `Authorization: Bearer <token>` header THEN it rejects them as unauthenticated regardless of the presence of valid better-auth session cookies

### Expected Behavior (Correct)

2.1 WHEN an authenticated user (any role: admin, founder, or collaborator) makes an API call to any protected endpoint THEN the system SHALL include valid authentication credentials (either session cookies or JWT tokens) that the backend can verify

2.2 WHEN the axios interceptor in `api.js` executes THEN it SHALL use the authentication mechanism that better-auth provides (session cookies with `withCredentials: true`) instead of looking for non-existent JWT tokens in localStorage

2.3 WHEN a user successfully logs in via better-auth THEN subsequent API requests SHALL be authenticated using the session cookies that better-auth manages automatically

2.4 WHEN the backend API receives requests with valid better-auth session cookies THEN it SHALL authenticate the user successfully and process the request

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an unauthenticated user attempts to access protected API endpoints THEN the system SHALL CONTINUE TO return authentication errors as expected

3.2 WHEN better-auth session cookies are present in requests THEN the system SHALL CONTINUE TO send them via `withCredentials: true` (already configured in api.js)

3.3 WHEN a user logs out THEN the system SHALL CONTINUE TO clear all authentication state properly

3.4 WHEN API requests succeed or fail for non-authentication reasons THEN the system SHALL CONTINUE TO handle responses and errors correctly

3.5 WHEN the axios interceptor handles 401 errors THEN the system SHALL CONTINUE TO perform appropriate cleanup actions
