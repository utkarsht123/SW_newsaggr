# News Aggregator

A full-stack MERN (MongoDB, Express, React, Node.js) news aggregator with user accounts,
role-based publishing, and a Reddit-style upvoting system for articles.

## Features

- **Authentication** — register/login with JWT-based sessions and bcrypt-hashed passwords
  (`auth.js` route, `User.js` model)
- **Role-based access** — users are `reader`, `publisher`, or `admin`; only publishers and
  admins can create articles, and only an article's author (or an admin) can edit or
  delete it (`articles.js`)
- **Articles** — create, read, update, delete, list (sorted by upvotes), and list a user's
  own articles (`Article.js`, `articles.js`)
- **Voting** — upvote/remove-upvote on articles, one vote per user per article, tracked via
  a separate `Vote` collection (`Vote.js`, `votes.js`)
- **React frontend** — routed with `react-router-dom`: home feed, login/register, article
  detail, create-article (behind a `PrivateRoute`), and a user dashboard, with auth state
  shared through `AuthContext`

## Tech Stack

- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Frontend:** React, React Router
- **Dev tooling:** `nodemon`, `concurrently`

## Project structure note

The files in this repository were committed flat at the repository root rather than in the
`client/` and `server/` directories the code itself expects — for example, `server.js`
requires `./routes/auth`, `./routes/articles`, and `./routes/votes`, and those route files
in turn require `../models/User`, `../models/Article`, `../middleware/auth`, etc. To run
this project, reorganize the files into the structure the `require()` calls expect:

```
server/
├── server.js
├── routes/        # auth.js, articles.js, votes.js
├── models/        # User.js, Article.js, Vote.js
└── middleware/     # auth.js (JWT-verification middleware — not present in this repo and
                     # needs to be added; it's referenced by routes/articles.js and
                     # routes/votes.js but no implementation is currently committed)
client/
├── package.json    # from .package-lock.json, this was originally a separate "client" app
└── src/
    ├── App.js, App.css
    ├── components/
    │   ├── layout/Navbar.js
    │   ├── pages/Home.js
    │   ├── auth/Login.js, Register.js
    │   ├── articles/ArticleList.js, ArticleItem.js, ArticleDetail.js, CreateArticle.js
    │   ├── dashboard/Dashboard.js
    │   └── routing/PrivateRoute.js
    └── context/AuthContext.js
```

`t.env` is an environment variable template (`PORT`, `MONGO_URI`, `JWT_SECRET`) — copy it
to `server/.env` and fill in real values.

## Running it (after reorganizing as above)

```bash
# Backend
npm install
npm run server        # nodemon server/server.js, reads server/.env

# Frontend (separate terminal)
npm install --prefix client
npm run client         # starts the React dev server

# or both at once
npm run dev
```

The API listens on `PORT` (default 5000) and connects to MongoDB via `MONGO_URI`.
