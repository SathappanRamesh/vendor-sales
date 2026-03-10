# Vendor Billing & Sales Management System

![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## Description

A web-based billing and sales management platform built to help small vendors replace manual billing processes with a faster, digital solution.

The system enables vendors to generate bills instantly, send them directly to customers through WhatsApp, and track sales performance through built-in analytics dashboards. By automating calculations and invoice generation, the platform significantly reduces billing time and minimizes human error.

## Live Demo

https://vendor-sales343.netlify.app

## Demo

![Vendor-Sales Demo](demo/vendor-sales-demo.gif)

## Tech Stack

### Frontend

- React.js
- JavaScript (ES6+)
- CSS Modules
- React Router
- Bootstrap

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

### Database

- MongoDB

### Other Tools

- Axios
- Chart.js / Data visualization
- Cloudinary

## Installation

### Clone the repository

- git clone https://github.com/SathappanRamesh/vendor-sales.git

## Install dependencies

### Frontend

- cd my-app
- npm install

### Backend

- cd server
- npm install

## Running the Application

### Start the frontend

- cd my-app
- npm run dev

### Start the backend server

- cd server
- node server.js
- Optional: Install "nodemon" package for automated restarts (cd backend -> npm install nodemon)

## Environment Variables

### Create a .env file in the server directory and add the following:

- SECRET_KEY=your_secret_key
- JWT_SECRET=your_jwt_secret
- DB_URL=your_db_url
- PORT=3000
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_name
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### CORS
go to backend > server.js and change cors({origin: your_client_side_localhost})

# Author

## Sathappan R

## GitHub
- https://github.com/SathappanRamesh

## LinkedIn
- https://www.linkedin.com/in/sathappan-ramesh
