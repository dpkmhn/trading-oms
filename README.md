# Trading Order Management System

A full-stack Trading Order Management System built with **Spring Boot** (Java 17) and **React** (TypeScript) with a modern UI.

## Features

- **Dashboard** — Portfolio overview with charts, P&L tracking, and order status distribution
- **Order Management** — Create, execute, and cancel orders (Market, Limit, Stop, Stop-Limit)
- **Trade History** — View all executed trades with details
- **Position Tracking** — Real-time position monitoring with unrealized/realized P&L
- **Simulated Execution** — Market orders auto-fill with simulated prices; limit orders can be manually executed

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- H2 In-Memory Database
- Maven

### Frontend
- React 18 with TypeScript
- Vite
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create a new order |
| POST | `/api/orders/{id}/cancel` | Cancel an order |
| POST | `/api/orders/{id}/execute` | Execute an order |
| GET | `/api/trades` | List all trades |
| GET | `/api/positions` | List all positions |

## Project Structure

```
trading-oms/
├── backend/
│   ├── src/main/java/com/tradingoms/
│   │   ├── config/          # CORS and data initialization
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── model/           # JPA entities and enums
│   │   ├── repository/      # Spring Data repositories
│   │   └── service/         # Business logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```
