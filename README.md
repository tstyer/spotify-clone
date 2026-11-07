# Spotify Clone

I'm building this Spotify-inspired app as a practice
project for combining React, Express, MongoDB, authentication, audio playback,
and real-time updates.

**Status:** Work in progress. Playback, album pages, and chat are in place. I'm
still building the music management tools.

## What works so far

- The home page loads featured, Made For You, and Trending songs from the API.
- Songs can be played from their cards. The player has play/pause, track
  skipping, seeking, and volume controls.
- Google sign-in uses Clerk. Signed-in users are saved in MongoDB.
- The album sidebar opens track lists where I can play a whole album or choose
  a song. On wide screens, another sidebar shows who is online and what they're
  listening to. Both sidebars can be resized on desktop.
- The backend has APIs for music, users, messages, and admin management. It uses
  Socket.IO for presence, listening activity, and direct messages.
- Signed-in users can open Messages, choose another listener, read their
  conversation history, and send messages in real time.
- The admin account can open Music Manager to see totals for songs, albums,
  artists, and users, and browse the songs in the catalog.

The catalog editing part of the admin dashboard is still in progress.
The backend and client-side stores for much of that work already exist.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB with Mongoose |
| Sign-in | Clerk |
| Media uploads | Cloudinary |

## Running it locally

You'll need Node.js and npm, a MongoDB database, and a Clerk application. Enable Google sign-in in Clerk if you want to use the sign-in button. Cloudinary credentials are needed when creating songs or albums through the admin API.

### 1. Set up environment files

For a fresh checkout, copy `backend/.env.sample` to `backend/.env` and `frontend/.env.sample` to `frontend/.env`. If you already have `.env` files, keep those instead of replacing them.

Fill in these values:

| File | Variable | Used for |
| --- | --- | --- |
| `backend/.env` | `MONGODB_URI` | Connecting to MongoDB |
| `backend/.env` | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Verifying signed-in users and socket connections |
| `backend/.env` | `ADMIN_EMAIL` | Choosing the admin account |
| `backend/.env` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Uploading cover images and audio |
| `frontend/.env` | `VITE_CLERK_PUBLISHABLE_KEY` | Clerk sign-in in the browser |

Use the **same Clerk application** for the frontend and backend keys. Keep secret keys and database credentials in the ignored `.env` files, not in Git. The backend uses port `5000` by default, and the frontend expects that port in development.

### 2. Start both servers

In one terminal, from the project root:

```powershell
cd backend
npm ci
npm run dev
```

In a second terminal, also from the project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Leave both terminals running while using the app. The API runs at `http://localhost:5000`.

## Still to do

- Add some music to a fresh database. Until then, the home page and album
  sidebar show empty states. The seed commands listed in `backend/package.json`
  do not have scripts yet.
- Add controls for creating and deleting songs and managing albums. The upload
  API already exists and needs Cloudinary credentials to add media.

To check the frontend code, run `npm run build` and `npm run lint` from
`frontend`. The production build goes into `frontend/dist` and can be served by
the backend when `NODE_ENV=production`.

## Project structure

- `frontend/` - React pages, player, state stores, and styles.
- `backend/` - Express API, MongoDB models, uploads, and Socket.IO.

This is a learning project based on the Udemy course's Spotify clone. Spotify's
name and branding belong to their respective owners; this project is not
affiliated with Spotify.
