# [Project name]

> How to use this template (Course Project brief, section 5):
> 1. Rename this file to `README.md` and put it in the root of your repository,
>    next to `backend/` and `frontend/`.
> 2. Replace everything in [square brackets], brackets included.
> 3. Delete every line that starts with `>`, like this one.
> 4. Keep the headings and their numbers. Do not rename, reorder or delete sections.
> 5. Push to `main` by **Thursday 12 November 2026, 23:59** (Submission 1).

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

> Use the GitHub username each member commits from. A team of 5 deletes the last row.

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| [Name] | [ID] | [T#] | [username] |
| [Name] | [ID] | [T#] | [username] |
| [Name] | [ID] | [T#] | [username] |
| [Name] | [ID] | [T#] | [username] |
| [Name] | [ID] | [T#] | [username] |
| [Name] | [ID] | [T#] | [username] |

## 2. The idea

> One short paragraph: what the application is, who it is for, and what problem it solves.

[Your paragraph]

## 3. Features

### 3.1 The full product

> Everything the complete product could do, including features you will not
> build in this course. One line per feature.

- [Feature]
- [Feature]
- [Feature]

### 3.2 The use cases we will build

> One per member: 5 or 6. Registration and login is use case 1: keep it, and
> adjust the row to your project. Every use case must change data: create,
> update or delete something. A team of 5 deletes the last row.

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email and password; logs in with email and password | Their home page, with their name in the header | A User, with the password hashed |
| 2 | [Use case] | [What the user does] | [What they see] | [What is stored] |
| 3 | [Use case] | [What the user does] | [What they see] | [What is stored] |
| 4 | [Use case] | [What the user does] | [What they see] | [What is stored] |
| 5 | [Use case] | [What the user does] | [What they see] | [What is stored] |
| 6 | [Use case] | [What the user does] | [What they see] | [What is stored] |

## 4. Who owns what

> Each member owns one use case from 3.2 and builds it end to end: the React
> pages, the API routes, the controllers and the models it needs.

| Member | Use case |
|---|---|
| [Name] | 1. Registration and login |
| [Name] | [2. Use case] |
| [Name] | [3. Use case] |
| [Name] | [4. Use case] |
| [Name] | [5. Use case] |
| [Name] | [6. Use case] |

## 5. Data model

> The Mongoose schema of every model you plan to use, one heading per model.
> The User schema is given: add fields if you need them. Add a heading for
> each extra model you need.

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
});
```

### [Model name]

```js
// [Your schema]
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].
