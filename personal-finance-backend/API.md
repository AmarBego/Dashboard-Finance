# Personal Finance Dashboard API Documentation

This document outlines the API endpoints for the Personal Finance Dashboard backend.

## Base URL

All URLs referenced in the documentation have the following base:
```
https://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### User Authentication

#### Register a new user

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: 
    ```json
    {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "user@example.com"
      }
    }
    ```

#### User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "user@example.com"
      }
    }
    ```

### Transactions

#### Get all transactions

- **URL**: `/transactions`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    [
      {
        "id": "transaction_id",
        "amount": 100.00,
        "category": "Food",
        "date": "2023-05-01T00:00:00.000Z",
        "type": "expense"
      },
      ...
    ]
    ```

#### Add a new transaction

- **URL**: `/transactions`
- **Method**: `POST`
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "amount": 50.00,
    "category": "Transportation",
    "date": "2023-05-02T00:00:00.000Z",
    "type": "expense"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: 
    ```json
    {
      "id": "new_transaction_id",
      "amount": 50.00,
      "category": "Transportation",
      "date": "2023-05-02T00:00:00.000Z",
      "type": "expense"
    }
    ```

#### Update a transaction

- **URL**: `/transactions/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `id=[string]` where `id` is the ID of the transaction
- **Request body**:
  ```json
  {
    "amount": 75.00,
    "category": "Transportation",
    "date": "2023-05-02T00:00:00.000Z",
    "type": "expense"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "id": "transaction_id",
      "amount": 75.00,
      "category": "Transportation",
      "date": "2023-05-02T00:00:00.000Z",
      "type": "expense"
    }
    ```

#### Delete a transaction

- **URL**: `/transactions/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `id=[string]` where `id` is the ID of the transaction
- **Success Response**:
  - **Code**: 204
  - **Content**: No content

## Error Responses

- **Unauthorized**: 401
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```

- **Not Found**: 404
  ```json
  {
    "error": "Resource not found."
  }
  ```

- **Bad Request**: 400
  ```json
  {
    "error": "Invalid input data."
  }
  ```

- **Internal Server Error**: 500
  ```json
  {
    "error": "An unexpected error occurred."
  }
  ```

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per 15-minute window. The following headers will be sent with each response:

- `X-RateLimit-Limit`: The maximum number of requests allowed per window
- `X-RateLimit-Remaining`: The number of requests remaining in the current window
- `X-RateLimit-Reset`: The time at which the current rate limit window resets in UTC epoch seconds

When the rate limit is exceeded, the API will respond with a 429 (Too Many Requests) status code.