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
server. API routes and other services will be added in later steps.

## Backend: user model

`backend/src/models/user.model.js` defines the MongoDB user record. Each user
requires a full name, image URL, and Clerk ID. The Clerk ID has a unique index,
and Mongoose records creation and update timestamps. Authentication endpoints
that create and read these records will be added later.

## Backend: song model

`backend/src/models/song.model.js` defines each track's title, artist, cover
image URL, audio URL, and duration. A song can optionally reference an album by
its MongoDB ID. Mongoose also records creation and update timestamps.

## Backend: album model

`backend/src/models/album.model.js` defines an album's title, artist, cover
image URL, release year, and list of song IDs. Each song ID references the Song
model. Mongoose records creation and update timestamps. Album management
endpoints will be added in later steps.

## Backend: message model

`backend/src/models/message.model.js` stores a sender's Clerk ID, a receiver's
Clerk ID, and the message text. All three fields are required, and Mongoose
records creation and update timestamps. Real-time delivery will be added in a
later step.

## Backend: album read API

The public album API is available at `GET /api/albums` and
`GET /api/albums/:albumId`. The first route returns all albums. The second
returns one album with its song references populated, or `404` if no album has
that ID. Database errors are passed to the server's JSON error handler. These
routes require the MongoDB connection configured above.

## Backend: public song discovery API

The public song routes are `GET /api/songs/featured`,
`GET /api/songs/made-for-you`, and `GET /api/songs/trending`. They return up to
six, four, and four randomly sampled songs, respectively. Each response includes
the song ID, title, artist, image URL, and audio URL. The admin-only list of all
songs will be added with authentication later.

## Backend: authorization middleware

`backend/src/middleware/auth.middleware.js` provides two route guards.
`protectRoute` requires a Clerk user ID and otherwise returns `401`.
`requireAdmin` checks the signed-in user's primary Clerk email against
`ADMIN_EMAIL` and otherwise returns `403`. The guards are used by the admin
access check below. Set
`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `ADMIN_EMAIL` in `backend/.env`
before using those routes. Keep the values out of Git.

## Backend: admin access check

The server attaches Clerk identity to requests when both Clerk keys are set in
`backend/.env`. `GET /api/admin/check` uses the authorization middleware to
return `{ "admin": true }` for the configured admin user. It returns `401` when
there is no signed-in user and `403` when the user is not the admin. Without
Clerk keys, the protected route remains unavailable while public APIs still
work.

## Backend: sign-in callback

`POST /api/auth/callback` saves a new Clerk user to MongoDB and returns
`{ "success": true }` for a user already saved. The request must include a
valid Clerk bearer token and the matching `id`, plus a first or last name and
an `imageUrl`. Missing profile details return `400`; a mismatched ID returns
`403`. The frontend reference sends this payload after sign-in. Configure both
Clerk keys in `backend/.env` before using the callback.

## Backend: user and message read API

Two authenticated routes support the chat UI. `GET /api/users` returns other
users, excluding the signed-in user. `GET /api/users/messages/:userId` returns
messages between the signed-in user and the selected user in chronological
order. Both require a valid Clerk session; configure the backend Clerk keys to
use them.
