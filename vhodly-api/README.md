# Vhodly API

Backend API for Vhodly - Building Management System

## Description

NestJS backend API that serves building management data including apartments, announcements, account balances, bills, and transactions.

## Features

- 🏢 **Apartments Management** - Floor and apartment data from CSV
- 📢 **Announcements** - Building announcements and messages
- 💰 **Account Management** - Current expenses and repairs account balances
- 📄 **Bills** - Bill tracking and management
- 💳 **Transactions** - Transaction history for bills and accounts
- 📚 **Swagger Documentation** - Interactive API documentation
- 🔒 **CORS Enabled** - Configured for frontend integration
- ✅ **TypeScript** - Full type safety
- 🎯 **Modern NestJS** - Latest best practices

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

## API Endpoints

### Apartments
- `GET /api/apartments/floors` - Get all floors with apartments

### Announcements
- `GET /api/announcements` - Get all announcements

### Accounts
- `GET /api/accounts/balances` - Get account balances
- `GET /api/accounts/:type/transactions` - Get transactions by account type (`currentExpenses` or `repairs`)

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get a specific bill
- `GET /api/bills/:id/transactions` - Get transactions for a bill

## Project Structure

```
src/
├── apartments/          # Apartment endpoints
├── announcements/       # Announcement endpoints
├── accounts/           # Account endpoints
├── bills/              # Bill endpoints
├── csv/                # CSV parsing service
├── data/               # Mock data service
├── common/
│   └── dto/            # Data Transfer Objects
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

## Future Enhancements

This backend is currently using mock data. Future integration points:
- Database integration (PostgreSQL/MySQL)
- Authentication & Authorization
- Real-time updates (WebSockets)
- File uploads for CSV updates
- Advanced filtering and pagination

## Technologies

- NestJS 10.x
- TypeScript
- Swagger/OpenAPI
- Class Validator
- Class Transformer
