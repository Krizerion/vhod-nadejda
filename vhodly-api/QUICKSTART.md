# Quick Start Guide

## Installation

1. Navigate to the backend directory:
```bash
cd vhodly-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional, defaults are fine for development):
```bash
copy .env.example .env
```

## Running the Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

The API will start on `http://localhost:3000`

## Testing the API

### Using Swagger UI
Visit http://localhost:3000/api/docs to see interactive API documentation and test endpoints.

### Using cURL

**Get all data (announcements, balances, floors):**
```bash
curl http://localhost:3000/api/data/load
```

**Get all floors:**
```bash
curl http://localhost:3000/api/apartments/floors
```

**Get announcements:**
```bash
curl http://localhost:3000/api/announcements
```

**Get account balances:**
```bash
curl http://localhost:3000/api/accounts/balances
```

**Get bills:**
```bash
curl http://localhost:3000/api/bills
```

**Get transactions for current expenses account:**
```bash
curl http://localhost:3000/api/accounts/currentExpenses/transactions
```

**Get transactions for repairs account:**
```bash
curl http://localhost:3000/api/accounts/repairs/transactions
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/data/load` | GET | Get all data (announcements, balances, floors) |
| `/api/apartments/floors` | GET | Get all floors with apartments |
| `/api/announcements` | GET | Get all announcements |
| `/api/accounts/balances` | GET | Get account balances |
| `/api/accounts/:type/transactions` | GET | Get transactions by account type |
| `/api/bills` | GET | Get all bills |
| `/api/bills/:id` | GET | Get a specific bill |
| `/api/bills/:id/transactions` | GET | Get transactions for a bill |

## Frontend Integration

Update your Angular `DataService` to use HTTP calls instead of mock data:

```typescript
// Example: In your Angular service
loadData(): Observable<{announcements, accountBalances, floors}> {
  return this.http.get<{announcements, accountBalances, floors}>('http://localhost:3000/api/data/load');
}
```

Make sure CORS is configured correctly (already set up for `http://localhost:4200`).
