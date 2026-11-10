# ICHGram

ICHGram is a full-stack social networking application. Users can create accounts, publish image posts, follow other users, browse posts, and interact through likes and comments. The application consists of a React single-page client and a Node.js/Express API backed by MongoDB. The backend also exposes a Socket.IO connection for real-time notification events.

## Features

The following features are represented in the current frontend and backend implementation:

- Account registration, login, logout, and password reset by email.
- Access and refresh JWTs, refresh sessions stored in MongoDB, and refresh-token cookies. The client retries an API request after refreshing an expired access token.
- User profiles with editable profile information and images, plus user search.
- Image posts: create, edit, delete, view a user's posts, and browse all posts.
- A feed based on followed users and an Explore page.
- Follow/unfollow relationships and follower/following lists.
- Post likes, comments, and comment likes.
- Readable notifications for likes, comments, and follows, with real-time notification events through Socket.IO.

## Technology stack

| Area | Technologies used in the application |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Redux Toolkit, React Hook Form, Sass, Socket.IO Client |
| Backend | Node.js, TypeScript, Express 5, Socket.IO |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, `jsonwebtoken`, `cookie-parser`, `bcrypt`/`bcryptjs` |
| Image handling | Multer and Sharp |
| Email | Nodemailer configured for Gmail |


## Architecture and project structure

The frontend communicates with the backend over HTTP using routes under `/api`. Requests include cookies for session refresh and authenticated operations. Socket.IO is initialized on the backend's HTTP server and used by the client for notification events. MongoDB stores users, posts, interactions, notifications, refresh sessions, and password reset records.

```text
.
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Authentication, users, posts, and interaction handlers
│   │   ├── middleware/      # Authentication and image upload/processing
│   │   ├── models/          # Mongoose schemas and models
│   │   ├── routes/          # Express API route definitions
│   │   ├── services/        # Email service
│   │   ├── socket/          # Socket.IO setup and notification events
│   │   ├── utils/           # JWT and cookie helpers
│   │   └── server.ts        # HTTP server, middleware, and route mounting
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/             # App entry, layouts, routing, and Redux store
    │   ├── entities/        # User, post, follow, and notification UI/state
    │   ├── features/        # Authentication forms and post creation
    │   ├── pages/           # Login, registration, feed, profile, Explore, and other pages
    │   ├── shared/          # API modules, Socket.IO client, shared UI, styles, and assets
    │   └── main.tsx         # React entry point
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Node.js and npm. 
- A MongoDB instance, local or hosted, and its connection URI.
- A Gmail account configured with an app password for password-reset email delivery.

## Installation and configuration

Install dependencies separately in each application directory:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create environment files by copying the provided examples:

```text
backend/.env.example  -> backend/.env
frontend/.env.example -> frontend/.env
```

Set the values in `backend/.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ichgram
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

Set `frontend/.env` to point to the backend origin (do not append `/api`):

```dotenv
VITE_API_URL=http://localhost:5000
```

The example values above are placeholders. Generate separate, strong JWT secrets and keep both `.env` files out of version control. The backend requires `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. `PORT` defaults to `5000`; JWT lifetimes default in code to `15m` for access tokens and `7d` for refresh tokens if the corresponding variables are omitted. The checked-in backend example sets the access lifetime to `30m`.

`EMAIL_USER` and `EMAIL_PASSWORD` are required when the email service module loads, so configure them to start the backend. The service uses Gmail SMTP; the password should be a Gmail app password. `FRONTEND_URL` is used to build password-reset links and falls back to `http://localhost:5173` in the backend code. `VITE_API_URL` is used by the frontend to construct API and Socket.IO connections.

## Run the application

Start MongoDB first. Then run the backend and frontend in separate terminals from the repository root.

Backend terminal:

```bash
cd backend
npm run dev
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. The backend listens on port `5000` unless `PORT` is set. `GET /` on the backend returns a small JSON status message.

The backend currently allows credentialed CORS requests from the fixed origin `http://localhost:5173`. If you use a different frontend origin, update the CORS configuration in `backend/src/server.ts`. `FRONTEND_URL` does not currently change the CORS origin.

### Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Build the frontend into `frontend/dist` |
| `frontend` | `npm run preview` | Preview the built frontend locally |
| `frontend` | `npm run lint` | Run ESLint |
| `backend` | `npm run dev` | Run the backend with `tsx watch` |
| `backend` | `npm run build` | Compile the backend TypeScript into `backend/dist` |

## Database configuration

The backend connects to MongoDB using `MONGO_URI` and Mongoose. It exits if the URI is missing or the connection fails. Mongoose models define these collections and relationships:

- `User`: email, username, name, password hash, profile information, and timestamps.
- `Post`: description, image data, author reference, and timestamps.
- `Follow`: follower and followed-user references, with a unique pair constraint.
- `Like` and `CommentLike`: user/post or user/comment interactions, with unique pair constraints.
- `Comment`: text, author reference, post reference, and timestamps.
- `Notification`: recipient, actor, event type, optional post reference, read state, and timestamps.
- `RefreshSession`: user, refresh-token identifier, and expiration; MongoDB TTL index is configured for expiration.
- `PasswordResetToken`: user, token hash, and expiration; MongoDB TTL index is configured for expiration.

No database name, schema migration, seed script, or automated provisioning process is specified by the repository. With a local MongoDB URI, the `ichgram` database is selected; MongoDB/Mongoose creates collections as the application writes data.

## API overview

All API routes use the `/api` prefix. Routes marked as protected require authentication. Image uploads use multipart form data where applicable.

| Resource | Implemented routes | Access |
| --- | --- | --- |
| Authentication | `POST /api/auth/register`, `/login`, `/refresh`, `/logout`, `/reset`, `/reset-password` | Public account and reset operations; refresh/logout use session cookies as applicable |
| Users | `GET /api/users/search`, `/me`, `/:userId`, `/:userId/image`; `PATCH /api/users/profile` | Search/profile/image routes are public; `/me` and profile update are protected |
| Posts | `GET /api/posts`, `/feed`, `/user/:userId`, `/:id`, `/:id/image`; `POST /api/posts`; `PATCH /api/posts/:id`; `DELETE /api/posts/:id` | Feed and post mutations are protected; read routes are public |
| Post likes | `GET /api/likes/:postId`; `POST /api/likes/:postId` | Reading is public; toggling a like is protected |
| Comments | `GET /api/comments/:postId`; `POST /api/comments/:postId`; `DELETE /api/comments/:commentId` | Reading is public; creating/deleting is protected |
| Comment likes | `GET /api/comments/:commentId/likes`; `POST /api/comments/:commentId/like` | Protected |
| Follows | `GET /api/follows/:userId/followers`, `/:userId/following`; `POST /api/follows/:userId`; `DELETE /api/follows/:userId` | Lists are public; follow/unfollow is protected |
| Notifications | `GET /api/notifications`; `PATCH /api/notifications/:notificationId/read` | Protected |

The exact request and response payloads are defined in the route handlers/controllers and frontend API modules.

