# Spotify Clone

This project is being built in small, reviewable steps from the supplied
`realtime-spotify-clone.zip` reference. Each step is ready to commit before the
next part is added.

## Backend: server foundation

The first step creates the backend Node.js package and a runnable Express server.
It loads environment variables, accepts JSON requests, and allows credentialed
requests from the local frontend at `http://localhost:3000`. The API routes and
other services will be added in later steps.

To run the backend, copy `backend/.env.sample` to `backend/.env` and set
`MONGODB_URI` to your MongoDB connection string. Then run:

```bash
cd backend
npm ci
npm run dev
```

The server listens on port `5000` by default. Set `PORT` in `backend/.env` to use
another port. `backend/.env.sample` lists the configuration values that later
backend features will need; keep real credentials in the ignored `.env` file.

## Backend: MongoDB connection

The server now connects to MongoDB when it starts. A successful connection logs
the database host. If the connection fails, the backend exits with code `1`.
MongoDB must be available and `MONGODB_URI` must be set before starting the
server. The remaining data models and API routes will be added in later steps.

## Backend: user model

`backend/src/models/user.model.js` defines the MongoDB user record. Each user
requires a full name, image URL, and Clerk ID. The Clerk ID has a unique index,
and Mongoose records creation and update timestamps. Authentication endpoints
that create and read these records will be added later.
