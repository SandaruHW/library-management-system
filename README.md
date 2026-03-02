# Library Management System

A full-stack library management application that lets users create, view, update, and delete book records. Built with an ASP.NET Core 8 REST API backend and a React + TypeScript frontend styled with Tailwind CSS.

---

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Backend   | ASP.NET Core 8 Web API (C#)                         |
| Database  | SQLite via Entity Framework Core 8                  |
| Frontend  | React 19, TypeScript, Tailwind CSS, Axios           |
| API Docs  | Swagger / OpenAPI (available in Development)        |

---

## Project Structure

```
library-management-system/
├── library-management-system.sln
├── LibraryAPI/                    # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── BooksController.cs     # REST endpoints for books
│   ├── Data/
│   │   └── LibraryDbContext.cs    # EF Core DB context
│   ├── Migrations/                # EF Core migration history
│   ├── Models/
│   │   └── Book.cs                # Book entity model
│   └── Program.cs                 # App entry point & DI setup
└── library-frontend/              # React TypeScript app
    └── src/
        ├── App.tsx                # Root component & state management
        ├── components/
        │   ├── Navbar.tsx
        │   ├── BookList.tsx
        │   ├── BookForm.tsx
        │   └── DeleteConfirmation.tsx
        └── services/
            └── bookService.ts     # Axios API calls
```

---

## Book Model

| Field         | Type   | Description             |
|---------------|--------|-------------------------|
| `id`          | int    | Auto-incremented PK     |
| `title`       | string | Book title              |
| `author`      | string | Author name             |
| `year`        | int    | Publication year        |
| `genre`       | string | Genre                   |
| `description` | string | Short book description  |

---

## API Endpoints

Base URL: `http://localhost:5217/api/books`

| Method   | Endpoint           | Description          |
|----------|--------------------|----------------------|
| `GET`    | `/api/books`       | Get all books        |
| `GET`    | `/api/books/{id}`  | Get a book by ID     |
| `POST`   | `/api/books`       | Add a new book       |
| `PUT`    | `/api/books/{id}`  | Update a book by ID  |
| `DELETE` | `/api/books/{id}`  | Delete a book by ID  |

Swagger UI is available at `http://localhost:5217/swagger` when running in Development mode.

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) — install with:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

### 1. Run the Backend

```bash
cd LibraryAPI
dotnet ef database update   # Apply migrations and create library.db
dotnet run                  # Starts API at http://localhost:5217
```

---

### 2. Run the Frontend

Open a second terminal:

```bash
cd library-frontend
npm install
npm start                   # Starts React app at http://localhost:3000
```

---

## CORS Configuration

The API is configured to allow requests from `http://localhost:3000`. If you need to run the frontend on a different port, update the CORS policy in `LibraryAPI/Program.cs`:

```csharp
policy.WithOrigins("http://localhost:3000")
```

---

## Database

SQLite is used as the database. The database file `library.db` is created in the `LibraryAPI/` directory when migrations are applied.

To add a new migration after changing the model:

```bash
cd LibraryAPI
dotnet ef migrations add <MigrationName>
dotnet ef database update
```
