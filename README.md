# MyLOOT.gg - Full-Stack Technical Test

## 📋 **Overview**

Full-stack application for managing user teams and their coin earnings. Users are grouped into teams and their individual earnings contribute to their team's total.

### **Tech Stack**

-   **Backend**: Node.js + Express + TypeScript
-   **Database**: PostgreSQL + Prisma ORM
-   **Frontend**: React + TypeScript + Vite + Tailwind CSS
-   **Testing**: Jest + React Testing Library
-   **Tools**: ESLint, Prettier

---

## 🏗️ **Architecture**

```
TestTech_MyLoot/
├── server/                     # Backend API
│   ├── src/
│   │   ├── controllers/        # HTTP Controllers
│   │   ├── services/          # Business Logic
│   │   ├── repositories/      # Data Access
│   │   ├── routes/           # Express Routes
│   │   ├── utils/            # Validators & Error Handling
│   │   └── types/            # TypeScript Types
│   ├── prisma/               # DB Schema & Migrations
│   └── __tests__/            # Unit & Integration Tests
├── client/                    # React Interface
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Application Pages
│   │   ├── hooks/           # Custom Hooks
│   │   └── types/           # Frontend Types
│   └── __tests__/           # React Tests
└── README.md
```

---

## 🗄️ **Database Modeling**

### **Entities**

```sql
-- Teams
Team {
  id: Int (PK, auto-increment)
  name: String
  users: User[] (relation)
}

-- Users
User {
  id: Int (PK, auto-increment)
  name: String
  teamId: Int (FK -> Team.id)
  coinEarnings: CoinEarning[] (relation)
}

-- Coin Earnings
CoinEarning {
  id: Int (PK, auto-increment)
  amount: Int (positive)
  userId: Int (FK -> User.id)
  date: DateTime (default: now())
}
```

### **Relations & Constraints**

-   **Team ↔ User**: One-to-Many with cascade delete
-   **User ↔ CoinEarning**: One-to-Many with cascade delete
-   **Indexes**: `(teamId)` on User, `(userId, date)` on CoinEarning

### **Modeling Choices**

-   **Calculated denormalization**: Totals are computed on-the-fly to avoid synchronization issues
-   **Composite indexes**: `(userId, date)` optimizes period-filtered queries
-   **Cascade delete**: Data consistency on deletion
-   **Timestamps**: `date` with default value for temporal tracking

---

## 🚀 **Installation & Setup**

### **Prerequisites**

-   Node.js 18+
-   PostgreSQL 14+
-   npm or yarn

### **Complete Setup**

```bash
# 1. Clone the repo
git clone <repo-url>
cd TestTech_MyLoot

# 2. Backend Setup
cd server
cp .env.example .env  # Configure DATABASE_URL
npm install
npx prisma migrate deploy
npx prisma generate
npm run db:seed

# 3. Frontend Setup
cd ../client
npm install

# 4. Development Launch
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### **Environment Variables**

```env
# server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/myloot_db"
PORT=3000
```

---

## 📡 **API Endpoints**

### **GET /teams/:id/leaderboard**

Retrieves team statistics with member rankings.

**Parameters:**

-   `id`: Team ID (positive integer)
-   `from`: Start date (ISO string, optional)
-   `to`: End date (ISO string, optional)

**Response:**

```json
{
	"total": 1500,
	"members": [
		{
			"id": 1,
			"name": "Alice Champion",
			"teamId": 1,
			"totalCoins": 800,
			"percent": 53
		},
		{
			"id": 2,
			"name": "Bob Warrior",
			"teamId": 1,
			"totalCoins": 700,
			"percent": 47
		}
	]
}
```

### **POST /coin_earnings**

Creates a new coin earning.

**Body:**

```json
{
	"userId": 1,
	"amount": 150
}
```

**Response:**

```json
{
	"id": 123,
	"userId": 1,
	"amount": 150,
	"date": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎨 **React Interface**

### **Pages**

-   **TeamPage**: Team statistics display with rankings
-   **Error Components**: Handling 404 states, empty teams, generic errors

### **Features**

-   ✅ Real-time team stats display
-   ✅ Member rankings sorted by earnings
-   ✅ Date range filtering
-   ✅ Responsive design with Tailwind CSS
-   ✅ Error handling with adapted UX
-   ✅ Loading states

### **Key Components**

-   `TeamPage`: Main page
-   `HeaderTeamCard`: Global statistics
-   `MemberRow`: Member row in rankings
-   `DateRangePicker`: Period selector
-   `ErrorCard`: User error handling
-   `DevToolbar`: Development tools

---

## 🧪 **Testing**

### **Backend**

```bash
cd server
npm test              # Complete tests
npm run test:watch    # Watch mode
```

**Coverage:**

-   Unit tests on services
-   Integration tests with DB
-   Validator and error handling tests

### **Frontend**

```bash
cd client
npm test              # React tests
```

**Coverage:**

-   Main component tests
-   Custom hook tests
-   Error case tests

---

## 📊 **Performance & Optimizations**

### **Database**

-   **Composite indexes**: `(userId, date)` for temporal filters
-   **Simple indexes**: `(teamId)` for team-user joins
-   **Optimized queries**: DB aggregation rather than application-side

### **Backend**

-   **Upstream validation**: Reduced invalid queries
-   **Centralized error handling**: Performance and maintainability
-   **Strict types**: Reduced runtime errors

### **Frontend**

-   **React Query**: Automatic caching and synchronization
-   **Optimized components**: Avoids unnecessary re-renders
-   **Lazy loading**: Conditional component loading

---

## 🔧 **Useful Scripts**

### **Backend**

```bash
npm run dev           # Development with hot-reload
npm run build         # Production build
npm run start         # Production launch
npm run db:reset      # Reset DB with seed
npm run db:seed       # Populate test data
```

### **Frontend**

```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Build preview
npm run lint          # ESLint linting
```

---

## 📈 **Possible Improvements**

### **Short Term**

-   [ ] Team member pagination
-   [ ] API rate limiting
-   [ ] Environment variables for API URL
-   [ ] URL filters for sharing

### **Medium Term**

-   [ ] Authentication & authorization
-   [ ] Websockets for real-time updates
-   [ ] Admin dashboard
-   [ ] Data export (CSV, PDF)

### **Long Term**

-   [ ] GraphQL API for flexible queries
-   [ ] Microservices for scalability
-   [ ] Redis cache for performance
-   [ ] Monitoring & metrics

---

## 🏆 **Code Strengths**

-   **Hexagonal architecture**: Clear separation of responsibilities
-   **Type Safety**: Strict TypeScript on front/back
-   **Complete tests**: Unit and integration
-   **Robust error handling**: Appropriate UX and logging
-   **Modern code**: Async/await, React hooks, Prisma ORM
-   **Responsive Design**: Mobile/desktop adapted interface

---

## 👨‍💻 **Development**

### **Conventions**

-   **Commits**: Conventional messages (feat, fix, docs, etc.)
-   **Branches**: feature/_, fix/_, hotfix/\*
-   **Code**: ESLint + Prettier for consistency
-   **Types**: Explicit interfaces for all exchanges

### **Debugging**

-   **Backend**: Structured logs with levels
-   **Frontend**: DevToolbar with development tools
-   **Database**: Prisma Studio for DB inspection

This architecture respects SOLID principles and ensures optimal code maintainability and scalability.
