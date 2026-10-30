# Backend Setup

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Create PostgreSQL database

```bash
createdb -U postgres tutoring_db
```

## 3. Create tables

Run from the project root:

```bash
psql -U postgres -d tutoring_db -v ON_ERROR_STOP=1 --single-transaction -f backend/database_SQL/schema.sql
```

## 4. Load seed data

Run from the project root:

```bash
psql -U postgres -d tutoring_db -v ON_ERROR_STOP=1 --single-transaction -f backend/database_SQL/seed.sql
```

## 5. Start backend

```bash
cd backend
npm start
```
