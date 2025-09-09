# Frontend Developer's Guide to SLOA API

This document provides a comprehensive guide for frontend developers on integrating with the SLOA (Sri Lankan Orthopaedic Association) API. It covers authentication, member registration, and member management flows.

## 1. Authentication

The authentication flow is handled by the `/auth` endpoints.

### 1.1. Login

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Validation:**
  - `email`: Must be a valid email format.
  - `password`: Must be at least 6 characters long.
- **Response:**
  - **Success (200):**
    ```json
    {
      "token": "your_jwt_token",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "role": "member"
      }
    }
    ```
  - **Error (401):** Invalid credentials.

### 1.3. Reset Password

- **Endpoint:** `POST /auth/reset-password`
- **Description:** Initiates the password reset process for a user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Password reset email sent."
    }
    ```

### 1.4. Get Current User

- **Endpoint:** `GET /auth/me`
- **Description:** Retrieves the details of the currently authenticated user.
- **Authentication:** Requires a valid JWT token in the `Authorization` header (`Bearer <token>`).
- **Response:**
  - **Success (200):**
    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "member",
      "status": "active"
    }
    ```

### 1.5. Logout

- **Endpoint:** `POST /auth/logout`
- **Description:** Logs out the current user (invalidates the token if using server-side session management).
- **Authentication:** Requires a valid JWT token.
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Logged out successfully."
    }
    ```

## 2. Member Registration and Management

These flows are handled by the `/membership` endpoints.

### 2.1. Apply for Membership

- **Endpoint:** `POST /membership/apply`
- **Description:** Submits a membership application.
- **Authentication:** Requires a valid JWT token.
- **Request Body:**
  ```json
  {
    "fullName": "Dr. Jane Smith",
    "nic": "123456789V",
    "specialization": "Orthopaedic Surgery",
    "hospital": "General Hospital Colombo",
    "role": "consultant",
    "location": "local",
    "cv": "...",
    "documents": ["http://example.com/doc1.pdf"]
  }
  ```
- **Validation:** See `membershipApplicationSchema` in `src/utils/validation.schemas.ts`.
- **Response:**
  - **Success (201):**
    ```json
    {
      "message": "Application submitted successfully."
    }
    ```

### 2.2. Get Membership Status

- **Endpoint:** `GET /membership/status`
- **Description:** Retrieves the membership status of the authenticated user.
- **Authentication:** Requires a valid JWT token.
- **Response:**
  - **Success (200):**
    ```json
    {
      "status": "pending" // or "active", "expired", "rejected"
    }
    ```

### 2.3. Renew Membership

- **Endpoint:** `POST /membership/renew`
- **Description:** Initiates the membership renewal process.
- **Authentication:** Requires a valid JWT token and an `active` membership status.
- **Request Body:**
  ```json
  {
    "paymentMethod": "credit_card"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Renewal process initiated."
    }
    ```

### 2.4. Get My Application

- **Endpoint:** `GET /membership/my-application`
- **Description:** Retrieves the membership application of the authenticated user.
- **Authentication:** Requires a valid JWT token.
- **Response:**
  - **Success (200):** The user's application details.

## 3. Admin Member Management

These routes are restricted to users with the `admin` role.

### 3.1. Get All Members

- **Endpoint:** `GET /membership/members`
- **Description:** Retrieves a list of all members, with optional filtering and pagination.
- **Authentication:** Requires admin privileges.
- **Query Parameters:**
  - `status`: `pending`, `approved_guest`, `active`, `expired`, `rejected`
  - `role`: `guest`, `trainee`, `consultant`, `admin`
  - `search`: Search by name or email.
  - `page`: Page number for pagination.
  - `limit`: Number of items per page.
- **Response:**
  - **Success (200):** A paginated list of members.

### 3.2. Get All Applications

- **Endpoint:** `GET /membership/applications`
- **Description:** Retrieves all membership applications.
- **Authentication:** Requires admin privileges.
- **Query Parameters:** Same as "Get All Members".
- **Response:**
  - **Success (200):** A paginated list of applications.

### 3.3. Get Application by ID

- **Endpoint:** `GET /membership/applications/:id`
- **Description:** Retrieves a single application by its ID.
- **Authentication:** Requires admin privileges.
- **Response:**
  - **Success (200):** The application details.

### 3.4. Process Application

- **Endpoint:** `PATCH /membership/members/:id/process`
- **Description:** Approves or rejects a membership application.
- **Authentication:** Requires admin privileges.
- **Request Body:**
  ```json
  {
    "status": "approved", // or "rejected"
    "membershipId": "SLOA-C-1234", // Optional, for approved members
    "expiryDate": "2025-12-31" // Optional, for approved members
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Application processed successfully."
    }
    ```

## 4. User Management

### 4.1. Get All Users

- **Endpoint:** `GET /users`
- **Description:** Retrieves a list of all users. This is a simple endpoint and might be expanded in the future.
- **Authentication:** Not explicitly protected in the provided code, but should be admin-only in a production environment.
- **Response:**
  - **Success (200):** An array of user objects.

This guide should provide a solid foundation for developing the frontend for the SLOA application. For more detailed information on the data structures, refer to the Zod schemas in `src/utils/validation.schemas.ts`.
