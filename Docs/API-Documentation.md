
# TripCraft - API Documentation

## 1. Overview

This document defines the API endpoints and communication rules between the TripCraft frontend and backend.

The frontend communicates with the backend through RESTful APIs using HTTP requests.

## 2. Base URL

Development Base URL:

`http://localhost:5000`

## 3. API Conventions

- Request bodies and standard API responses use JSON format, except file-download endpoints such as PDF export.
- API responses must never include sensitive fields such as `password` or `passwordHash`.
- HTTP methods are used according to the operation:
  - GET: Retrieve data.
  - POST: Create new data or perform an operation.
  - PUT: Replace existing data.
  - PATCH: Partially update data.
  - DELETE: Remove data.
- Each endpoint returns an appropriate HTTP status code.
- Protected endpoints require a valid JWT token.
- The backend validates incoming data before processing requests.
- API keys and database credentials must never be exposed to the frontend.
- PDF export endpoints return files with the `application/pdf` content type.
- PATCH requests update only the fields included in the request body. Omitted fields remain unchanged.
- Protected endpoints derive the authenticated user's ID from the JWT token. The frontend must not send or control the userId.
**Resource Ownership:**

- Users can only access and modify their own resources.
- Every protected trip-related operation must verify that the authenticated user owns the associated trip.
- Activities and expenses must belong to the specified trip and its authenticated owner.
- Favorites and notifications must belong to the authenticated user.
- The backend must never trust a `userId` provided in the request body or URL when determining resource ownership.

## 4. Authentication

Protected requests must include the JWT token in the Authorization header.

Example:

`Authorization: Bearer <token>`

The backend identifies the authenticated user from the JWT token. The frontend must not send or control the userId when creating or accessing user-owned resources.

For protected endpoints, the backend uses the authenticated user's ID from the token to verify resource ownership and prevent unauthorized access.

## 5. Authentication APIs

All authentication endpoints are handled by the backend.

### 5.1 Register

- **Method:** POST
- **Endpoint:** `/api/v1/auth/register`
- **Access:** Public
- **Description:** Create a new user account.

**Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response:** `201 Created`

Returns the created user information and an authentication token.
The response must never include the user's `password` or `passwordHash`.

### 5.2 Login

- **Method:** POST
- **Endpoint:** `/api/v1/auth/login`
- **Access:** Public
- **Description:** Authenticate an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response:** `200 OK`

Returns the user information and an authentication token. Sensitive fields such as `password` and `passwordHash` must never be included.

### 5.3 Get Current User

- **Method:** GET
- **Endpoint:** `/api/v1/auth/me`
- **Access:** Protected
- **Description:** Get the profile information of the currently authenticated user.

**Headers:**

`Authorization: Bearer <token>`

**Success Response:** `200 OK`

Returns the authenticated user's profile information.


### 5.4 Update Profile

- **Method:** PATCH
- **Endpoint:** `/api/v1/users/me`
- **Access:** Protected
- **Description:** Update the current user's profile information.

**Headers:**

`Authorization: Bearer <token>`

**Request Body Example:**

```json
{
  "name": "Updated Name",
  "photoUrl": "https://example.com/profile.jpg",
  "interests": ["Museums", "Food", "Adventure"],
  "preferredCurrency": "USD",
  "travelStyle": "Adventure"
}
```

**Success Response:** `200 OK`

Returns the updated user information.


### 5.5 Change Password

- **Method:** PATCH
- **Endpoint:** `/api/v1/users/me/password`
- **Access:** Protected
- **Description:** Change the current user's password.

**Headers:**

`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Success Response:** `204 No Content`

## 6. Trips APIs

All trip endpoints require authentication.

### 6.1 Get All Trips

- **Method:** GET
- **Endpoint:** `/api/v1/trips`
- **Access:** Protected
- **Description:** Retrieve all trips belonging to the authenticated user.

**Success Response:** `200 OK`

Returns a list of the user's trips.

### 6.2 Get Trip By ID

- **Method:** GET
- **Endpoint:** `/api/v1/trips/:tripId`
- **Access:** Protected
- **Description:** Retrieve details of a specific trip owned by the authenticated user.

**Success Response:** `200 OK`

Returns the trip details.

### 6.3 Create Trip

- **Method:** POST
- **Endpoint:** `/api/v1/trips`
- **Access:** Protected
- **Description:** Create a new trip for the authenticated user.

**Validation Rules:**

- The title and destination are required.
- The startDate must be earlier than or equal to the endDate.
- The budget must be a positive number or null.
- The currency is required and must be a valid currency code.
- The authenticated user's ID is assigned by the backend and must not be provided in the request body.

**Request Body:**

```json
{
  "title": "Summer Vacation",
  "destination": "Paris, France",
  "startDate": "2027-07-10T00:00:00.000Z",
  "endDate": "2027-07-17T00:00:00.000Z",
  "budget": 1500,
  "currency": "EUR"
}
```

**Success Response:** `201 Created`

Returns the newly created trip.

### 6.4 Update Trip

- **Method:** PATCH
- **Endpoint:** `/api/v1/trips/:tripId`
- **Access:** Protected
- **Description:** Update the details of an existing trip owned by the authenticated user.

**Validation Rules:**

- Only the fields provided in the request body are updated.
- If provided, the title and destination must not be empty.
- If startDate or endDate is updated, the resulting startDate must be earlier than or equal to the resulting endDate.
- If provided, the budget must be a positive number or null.
- If provided, the currency must be a valid currency code.
- The backend must verify that the authenticated user owns the trip.

**Request Body Example:**

```json

{
  "title": "Updated Summer Vacation",
  "destination": "Paris, France",
  "startDate": "2027-07-10T00:00:00.000Z",
  "endDate": "2027-07-17T00:00:00.000Z",
  "budget": 1800,
  "currency": "EUR"
}
```

**Success Response:** `200 OK`

Returns the updated trip.

### 6.5 Delete Trip

- **Method:** DELETE
- **Endpoint:** `/api/v1/trips/:tripId`
- **Access:** Protected
- **Description:** Delete a trip owned by the authenticated user.

Deleting a trip also deletes its related activities and expenses.

**Success Response:** `204 No Content`


### 6.6 Export Trip as PDF

- **Method:** GET
- **Endpoint:** `/api/v1/trips/:tripId/export/pdf`
- **Access:** Protected
- **Description:**
Exports the trip details as a downloadable PDF file, including trip information, activities, schedules, locations, and expense details.

**Success Response:** `200 OK`

Returns a downloadable PDF file containing the complete trip plan.
Content-Type: application/pdf

## 7. Itinerary & Activities APIs

All activity endpoints require authentication.

### 7.1 Get Trip Activities

- **Method:** GET
- **Endpoint:** `/api/v1/trips/:tripId/activities`
- **Access:** Protected
- **Description:** Retrieve all activities belonging to a specific trip.

**Success Response:** `200 OK`

Returns a list of trip activities.

### 7.2 Add Activity

- **Method:** POST
- **Endpoint:** `/api/v1/trips/:tripId/activities`
- **Access:** Protected
- **Description:** Add a new activity to a specific trip.
**Validation Rules:**

- The activity title and startTime are required.
- The endTime, if provided, must be later than or equal to startTime.
- The estimatedCost must be a non-negative number or null.
- Latitude and longitude must be provided together, and both must be valid geographic coordinates.
- The activity must belong to the specified trip, and the authenticated user must own that trip.
- The tripId and userId must be verified by the backend.
- The endTime is optional and can be null. If provided, it must be later than or equal to startTime.
- The estimatedCost must be a non-negative number or null.
- Latitude and longitude are optional. If provided, both must be provided together and must be valid geographic coordinates. Both can be null.


**Request Body:**

```json
{
  "title": "Visit Eiffel Tower",
  "category": "Sightseeing",
  "externalPlaceId": "PLACE_ID",
  "description": "Visit the Eiffel Tower in Paris.",
  "location": "Paris, France",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "startTime": "2027-07-11T10:00:00.000Z",
  "endTime": "2027-07-11T12:00:00.000Z",
  "estimatedCost": 30
}
```

**Success Response:** `201 Created`

Returns the newly created activity.


### 7.3 Update Activity

- **Method:** PATCH
- **Endpoint:** `/api/v1/trips/:tripId/activities/:activityId`
- **Access:** Protected
- **Description:** Update an existing activity in a specific trip.

**Validation Rules:**

- Only the fields provided in the request body are updated.
- If startTime or endTime is updated, the resulting endTime must be later than or equal to the resulting startTime.
- Latitude and longitude must be provided together when either coordinate is updated.
- Both coordinates can be set to null to clear the location coordinates.
- If provided, estimatedCost must be a non-negative number or null.
- If provided, endTime must be a valid date and time or null.
- The backend must verify that the activity belongs to the specified trip and that the authenticated user owns the trip.
- If provided, the title must not be empty.
- If provided, startTime must be a valid date and time.

**Request Body Example:**

```json
{
  "title": "Visit Louvre Museum",
  "category": "Museum",
  "description": "Explore the famous art museum.",
  "location": "Paris, France",
  "latitude": 48.8606,
  "longitude": 2.3376,
  "startTime": "2027-07-12T10:00:00.000Z",
  "endTime": "2027-07-12T13:00:00.000Z",
  "estimatedCost": 20
}
```

**Success Response:** `200 OK`

Returns the updated activity.


### 7.4 Delete Activity

- **Method:** DELETE
- **Endpoint:** `/api/v1/trips/:tripId/activities/:activityId`
- **Access:** Protected
- **Description:** Delete an activity from a specific trip.

**Success Response:** `204 No Content`

## 8. Budget & Expenses APIs
**Currency Note:**
Expenses do not store a separate currency value. Each expense uses the currency of its associated trip.
All expense endpoints require authentication.

### 8.1 Get Trip Expenses

- **Method:** GET
- **Endpoint:** `/api/v1/trips/:tripId/expenses`
- **Access:** Protected
- **Description:** Retrieve all expenses belonging to a specific trip.

**Success Response:** `200 OK`

Returns a list of trip expenses.

### 8.2 Add Expense

- **Method:** POST
- **Endpoint:** `/api/v1/trips/:tripId/expenses`
- **Access:** Protected
- **Description:** Add a new expense to a specific trip.

**Validation Rules:**

- The title, amount, and category are required.
- The amount must be greater than zero.
- The date is optional. If omitted, the backend uses the current date.
- The expense must belong to the specified trip, and the authenticated user must own that trip.
- The expense currency is inherited from the associated trip and must not be sent separately.

**Request Body:**

```json
{
  "title": "Hotel Booking",
  "amount": 250,
  "category": "Accommodation",
  "date": "2027-07-10",
  "notes": "Two nights hotel booking"
}
```

**Success Response:** `201 Created`

Returns the newly created expense.

### 8.3 Update Expense

- **Method:** PATCH
- **Endpoint:** `/api/v1/trips/:tripId/expenses/:expenseId`
- **Access:** Protected
- **Description:** Update an existing expense.

**Validation Rules:**

- Only provided fields are updated.
- If provided, title must not be empty.
- If provided, amount must be greater than 0.
- If provided, category must not be empty.
- If provided, date must be a valid date.
- Notes can be a string or null.
- The expense must belong to the specified trip.
- The authenticated user must own the trip.
- Expense currency is inherited from the associated trip and cannot be updated separately.

**Request Body Example:**

```json
{
  "title": "Updated Hotel Booking",
  "amount": 300,
  "category": "Accommodation",
  "date": "2027-07-10T00:00:00.000Z",
  "notes": "Updated booking cost"
}
```


**Success Response:** `200 OK`
Returns the updated expense


### 8.4 Delete Expense

- **Method:** DELETE
- **Endpoint:** `/api/v1/trips/:tripId/expenses/:expenseId`
- **Access:** Protected
- **Description:** Delete an expense from a specific trip.

**Success Response:** `204 No Content`

### 8.5 Get Budget Summary

- **Method:** GET
- **Endpoint:** `/api/v1/trips/:tripId/budget`
- **Access:** Protected
- **Description:** Retrieve the trip budget summary.
**Response Data:**

- `currency`: The trip's currency.
- `totalBudget`: The trip budget, or null if no budget is set.
- `totalExpenses`: The sum of all expenses for the trip.
- `remainingBudget`: The remaining amount after deducting expenses, or null if no budget is set.
- `spendingStatus`: The spending status: `within_budget`, `over_budget`, or `no_budget`.


**The summary includes:**

- Total trip budget.
- Total expenses.
- Remaining budget.
- Spending status.

**Success Response:** `200 OK`

## 9. Destinations & Favorites APIs

### 9.1 Search Destinations

- **Method:** GET
- **Endpoint:** `/api/v1/destinations/search`
- **Access:** Public
- **Description:** Search for destinations and tourist places using the external places service (OpenTripMap).

**Query Parameters Example:**

`?name=Paris&limit=10`

**Success Response:** `200 OK`

Returns a list of matching destinations.

### 9.2 Get Destination Details

- **Method:** GET
- **Endpoint:** `/api/v1/destinations/:placeId`
- **Access:** Public
- **Description:** Retrieve details of a specific destination from the external places service.

**Success Response:** `200 OK`

Returns destination information when available.

### 9.3 Get Favorites

- **Method:** GET
- **Endpoint:** `/api/v1/favorites`
- **Access:** Protected
- **Description:** Retrieve all favorite places saved by the authenticated user.

**Success Response:** `200 OK`

Returns the user's favorite places.

### 9.4 Add Favorite

- **Method:** POST
- **Endpoint:** `/api/v1/favorites`
- **Access:** Protected
- **Description:** Save a destination to the authenticated user's favorites.

**Validation Rules:**

- The placeName is required.
- The favorite is automatically associated with the authenticated user. The userId must not be included in the request body.
- If an externalPlaceId is provided, the same place cannot be saved more than once by the same user.
- The backend must associate the favorite with the authenticated user and verify ownership before allowing access or deletion.

**Request Body:**

```json
{
  "placeName": "Eiffel Tower",
  "description": "Famous landmark in Paris",
 "imageUrl": "https://example.com/destination.jpg",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "externalPlaceId": "PLACE_ID"
}
```

**Success Response:** `201 Created`

Returns the saved favorite.

### 9.5 Remove Favorite

- **Method:** DELETE
- **Endpoint:** `/api/v1/favorites/:favoriteId`
- **Access:** Protected
- **Description:** Remove a saved place from the authenticated user's favorites.

**Success Response:** `204 No Content`

## 10. Weather & AI APIs

**External Service Handling:**

If an external weather, places, or AI service is unavailable or returns an error, the backend should return a clear error response without exposing API keys or internal server details.

The frontend should display a helpful error message and, where applicable, allow the user to continue planning manually.

### 10.1 Get Weather Forecast

- **Method:** GET
- **Endpoint:** `/api/v1/weather`
- **Access:** Protected
- **Description:** Retrieve weather forecast information for a selected location using the Open-Meteo API.

**Query Parameters Example:**

`?latitude=48.8566&longitude=2.3522`

**Success Response:** `200 OK`

Returns available weather forecast information.

### 10.2 Get Weather Alternatives

- **Method:** POST
- **Endpoint:** `/api/v1/weather/alternatives`
- **Access:** Protected
- **Description:** Suggest indoor activity alternatives when weather conditions may affect planned outdoor activities.

**Request Body Example:**

```json
{
  "destination": "Paris, France",
  "weatherCondition": "Rainy",
  "plannedActivity": "Outdoor sightseeing"
}
```

**Success Response:** `200 OK`

Returns suggested alternative activities when available.

### 10.3 Generate AI Itinerary

- **Method:** POST
- **Endpoint:** `/api/v1/ai/generate-itinerary`
- **Access:** Protected
- **Description:** Generate a suggested travel itinerary based on the user's destination, dates, budget, and preferences using an AI service.

- **Note:** The generated itinerary is returned as suggestions. It is not automatically saved to the database. The user can review the suggestions and manually add selected activities to a trip.


**Request Body Example:**

```json
{
  "destination": "Paris, France",
  "startDate": "2027-07-10",
  "endDate": "2027-07-15",
  "budget": 1500,
  "currency": "EUR",
  "interests": ["Museums", "Food", "Sightseeing"]
}
```

**Success Response:** `200 OK`

Returns a suggested itinerary.

### 10.4 AI Travel Assistant

- **Method:** POST
- **Endpoint:** `/api/v1/ai/chat`
- **Access:** Protected
- **Description:** Allow users to ask travel-related questions and receive AI-generated suggestions.


- **Note:** The AI assistant provides travel-related information and suggestions only. It cannot directly create, update, or delete trips, activities, or expenses.


**Request Body Example:**

```json
{
  "message": "Suggest affordable activities in Paris."
}
```

**Success Response:** `200 OK`

Returns an AI-generated response.

## 11. Notifications APIs

All notification endpoints require authentication.

### 11.1 Get Notifications

- **Method:** GET
- **Endpoint:** `/api/v1/notifications`
- **Access:** Protected
- **Description:** Retrieve all notifications belonging to the authenticated user.

**Success Response:** `200 OK`

Returns a list of notifications.

### 11.2 Mark Notification as Read

- **Method:** PATCH
- **Endpoint:** `/api/v1/notifications/:notificationId/read`
- **Access:** Protected
- **Description:** Mark a specific notification as read.

**Success Response:** `200 OK`

Returns the updated notification.

### 11.3 Delete Notification

- **Method:** DELETE
- **Endpoint:** `/api/v1/notifications/:notificationId`
- **Access:** Protected
- **Description:** Delete a notification belonging to the authenticated user.

**Success Response:** `204 No Content`

## 12. Dashboard APIs

All dashboard endpoints require authentication.

### 12.1 Get Dashboard Summary

- **Method:** GET
- **Endpoint:** `/api/v1/dashboard`
**Response Data:**

- `totalTrips`: The total number of trips owned by the authenticated user.
- `upcomingTrips`: A list of the user's upcoming trips.
- `expenseSummaries`: Expense totals grouped by currency. Different currencies must not be combined.
- `budgetSummaries`: Budget and spending information for each trip.
- `recentActivities`: A list of the user's recent trip activities.
- `recentNotifications`: A list of the user's recent notifications.
- **Access:** Protected
- **Description:** Retrieve summary information for the authenticated user's dashboard.

**The response includes:**

- Total number of trips.
- Upcoming trips.
- Total expenses.
- Budget summaries.
- Recent activities.
- Recent notifications.

**Success Response:** `200 OK`

Returns the dashboard summary.

### 12.2 Get Upcoming Activities

- **Method:** GET
- **Endpoint:** `/api/v1/dashboard/upcoming-activities`
- **Access:** Protected
- **Description:** Retrieve upcoming activities from the user's trips for dashboard display.

**Success Response:** `200 OK`

Returns a list of upcoming activities.






## 13. HTTP Status Codes & Error Handling

The backend uses standard HTTP status codes to indicate the result of each request.

### Success Status Codes

- 200 OK: The request was successful and returns a response body.
- 201 Created: A new resource was successfully created.
- 204 No Content: The request was successful with no response body.

### Client Error Status Codes

- 400 Bad Request: The request contains invalid data.
- 401 Unauthorized: Authentication is required or the token is invalid.
- 403 Forbidden: The user does not have permission to access the resource.
- 404 Not Found: The requested resource does not exist.
- 409 Conflict: The request conflicts with existing data, such as a duplicate email.

### Server Error Status Codes

- 500 Internal Server Error: An unexpected server error occurred.
- 503 Service Unavailable: An external service or server is temporarily unavailable.

### Error Response Format

All API errors should follow a consistent JSON format.

Example:

```json
{
  "success": false,
  "message": "An error occurred.",
  "errors": []
}
```

The backend must never expose passwords, secret API keys, or sensitive server information in error responses.
