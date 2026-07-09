# Amiibo Collector Hub

## Project Description

Amiibo Collector Hub is a full-stack web application designed for Nintendo amiibo collectors. The application uses the Amiibo API to display information about amiibo figures, cards, and yarn collectibles. Users can create accounts, manage their personal amiibo collections, submit reviews, and participate in a trade request system.

The site includes role-based access control with administrators, moderators, and standard users. Administrators can manage users, monitor content, and oversee trade requests. Moderators can review and remove inappropriate content. Standard users can build collections, submit reviews, and participate in trades.

The application is built using Node.js, Express.js, EJS, PostgreSQL, and session-based authentication.

---

## Features

### User Features

* Register and log in to an account
* View amiibo information from the Amiibo API
* Search and filter amiibo by character, series, game series, and type
* Create and manage a personal amiibo collection
* Add amiibo to a wishlist
* Submit reviews and ratings
* Edit and delete personal reviews
* Submit trade requests
* Track trade request status

### Moderator Features

* Review reported content
* Remove inappropriate reviews
* Monitor user-generated content

### Administrator Features

* Manage users and user roles
* View all trade requests
* Approve or reject trade requests
* Remove inappropriate content
* Access administrative dashboard and reports

---

## Technology Stack

### Backend

* Node.js
* Express.js
* EJS
* PostgreSQL
* Express Session
* bcrypt
* dotenv

### External API

* [Amiibo API](https://amiiboapi.org/api/amiibo/)
* https://amiiboapi.org/api/amiibo/

### Deployment

* Render
* PostgreSQL Database

---

## Database Schema

Insert your exported ERD image below after completing your database design.

![Database ERD](images/ERD.png)

### Main Tables

* users
* collections
* reviews
* trade_requests
* reports

---

## User Roles

### Administrator

Permissions:

* Manage all users
* Assign user roles
* Delete content
* Approve and reject trade requests
* Access administrative dashboard

### Moderator

Permissions:

* Review user-generated content
* Remove inappropriate reviews
* Moderate reports

### Standard User

Permissions:

* Manage personal collection
* Create reviews
* Submit trade requests
* Manage account information

---

## Workflow System

### Trade Request Workflow

The application includes a multi-stage trade request system.

Status options:

1. Pending
2. Approved
3. Rejected
4. Completed

Users can submit trade requests and monitor their current status through their dashboard.

---

Test Account Credentials

All test accounts use the following password:

Password:

P@$$w0rd!

---

## Security Features

* Session-based authentication
* Password hashing using bcrypt
* Protected routes
* Role-based authorization
* Parameterized PostgreSQL queries
* Input validation and sanitization
* Global error handling

---

## Deployment

### Live Site

Add Render URL here: TBD

https://your-render-url.onrender.com

### GitHub Repository

https://github.com/jhodge10/amiibo-library

---

## Known Limitations

* Additional search filters may be added in future updates.
* Trading system currently tracks requests but does not provide direct messaging between users.
* Amiibo information depends on availability of the external Amiibo API.

---

## Future Enhancements

* Direct user-to-user messaging
* Collection statistics and analytics
* Amiibo rarity tracking
* Advanced search and filtering
* Image upload support for trade listings

---

## Author

Jerry Hodges

CSE 340 Web Backend Development

Brigham Young University–Idaho
