# Amiibo Vault

## Project Description

Amiibo Vault is a full-stack, server-side rendered web application designed for Nintendo amiibo collectors.

The application retrieves amiibo information from the external Amiibo API. Visitors can browse, search, and filter amiibo figures, cards, and other collectible types.

Registered users can create a personal wishlist, track the amiibo in their collection, and submit requests through a multi-stage workflow. Collector accounts can also create, edit, and delete reviews. Administrators can manage user roles, update request statuses, and moderate reviews.

Amiibo Vault was created as the final project for CSE 340 Web Backend Development.

---

## Live Website

`https://amiibo-vault.onrender.com/`

---

## Features

### Public Features

- Browse amiibo information from the Amiibo API
- Search by amiibo name or character
- Filter by game series
- Filter by amiibo type
- Create an account
- Log in securely

### Standard User Features

- Manage a personal amiibo wishlist
- Manage a personal amiibo collection
- Submit requests to an administrator
- View the current status of submitted requests
- View the complete status history of each request

### Collector Features

Collectors have all standard-user permissions and can also:

- Create reviews for amiibo in their collection
- Give ratings from 1 to 5
- Edit their own reviews
- Delete their own reviews

### Administrator Features

Administrators can:

- Access the admin dashboard
- View registered users
- Assign user roles
- View submitted requests
- Update request statuses
- Moderate and delete user reviews

---

## Technology Stack

### Backend

- Node.js
- Express.js
- EJS
- PostgreSQL
- JavaScript

### Authentication and Security

- express-session
- connect-pg-simple
- bcrypt
- dotenv

### External API

Amiibo information is retrieved from:

`https://amiiboapi.org/api/amiibo/`

### Deployment

- Render Web Service
- Render PostgreSQL

---

## Database Schema

![Amiibo Vault ERD](./public/images/ERD.png)

### Main Tables

#### `users`

Stores:

- Account usernames
- Email addresses
- Hashed passwords
- User roles
- Account creation dates

#### `user_amiibos`

Connects users to amiibo identifiers and stores whether each amiibo is:

- In the user's wishlist
- In the user's collection
- In both lists

#### `reviews`

Stores:

- The user who submitted the review
- The amiibo head and tail identifiers
- Rating from 1 to 5
- Review text
- Creation date

#### `requests`

Stores user-submitted requests and their current workflow status.

#### `request_history`

Stores every status change made to a request, including the date of the change.

#### `user_sessions`

Stores authenticated user sessions in PostgreSQL.

This table is created automatically by `connect-pg-simple`.

---

## Database Relationships

- One user can have many saved amiibo records.
- One user can create many reviews.
- One user can submit many requests.
- One request can have many request-history entries.
- Deleting a user also deletes their saved amiibo, reviews, and requests.
- If the user who changed a request status is deleted, the request-history entry remains and its `changed_by` value is set to `NULL`.

---

## User Roles

### Standard User

A standard user can:

- Browse amiibo
- Manage a wishlist
- Manage a collection
- Submit requests
- View request status and history

### Collector

A collector can:

- Perform all standard-user actions
- Create reviews
- Edit their own reviews
- Delete their own reviews

### Administrator

An administrator can:

- Perform all collector actions
- Manage user roles
- View all submitted requests
- Update request statuses
- Moderate and delete reviews
- Access the administrative dashboard

---

## Request Workflow

Amiibo Vault includes a multi-stage request workflow.

A request can move through the following statuses:

1. Submitted
2. Under Review
3. Approved
4. Rejected
5. Completed

Every status change is saved in the `request_history` table. Users can view both the current request status and its full history from their dashboard.

---

## Test Accounts

All test-account passwords are provided separately to the instructor and are not stored in this repository.

### Administrator Account

Email:

`admin@amiibovault.test`

### Collector Account

Email:

`collector@amiibovault.test`

### Standard User Account

Email:

`user@amiibovault.test`

---

## Security Features

- Session-based authentication
- PostgreSQL-backed session storage
- Password hashing with bcrypt
- HTTP-only session cookies
- Role-based authorization
- Protected routes
- Parameterized PostgreSQL queries
- Server-side form validation
- Review ownership checks
- Centralized server error handling
- Environment variables for database credentials and session secrets

---

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/jhodge10/amiibo-library.git
2. Enter the project directory
cd amiibo-library
3. Install dependencies
npm install
4. Create the PostgreSQL database

Create a local PostgreSQL database named:

amiibo_vault
5. Create the database tables

Run the following file against the amiibo_vault database:

database/schema.sql
6. Create the environment file

Create a .env file in the root project directory:

PORT=3000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/amiibo_vault
SESSION_SECRET=replace_with_a_long_random_secret

The .env file must not be committed to GitHub.

7. Start the development server
npm run dev
8. Open the website
http://localhost:3000
GitHub Repository

https://github.com/jhodge10/amiibo-library

Known Limitations
Amiibo catalog information depends on the availability of the external Amiibo API.
The main browse page currently displays the first 60 amiibo returned by the API.
Review permissions are limited to collector and administrator accounts.
Requests must be manually reviewed and updated by an administrator.
The application does not currently support profile editing.
The application does not support user-uploaded images.
Trading and direct messaging are not included.
Future Enhancements
Pagination for the complete amiibo catalog
Additional sorting and filtering
Public review pages
User profile editing
Collection statistics
Email notifications for request updates
Optional amiibo trading features
Direct user messaging
Author

Jerry Hodges

CSE 340 Web Backend Development

Brigham Young University–Idaho
