# Todo App Backend API

Backend server for the Todo App with Annual Planning, Monthly Tracker, and Revision Schedule features.

## 📋 Features

- **Annual Planning** - Manage monthly goals and tasks
- **Monthly Tracker** - Track daily tasks with completion status
- **Revision Schedule** - Plan and track revision topics by date
- **User Isolation** - Each user's data is stored separately
- **RESTful API** - Clean and organized endpoints

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- MongoDB database
- npm or yarn

### Installation

1. **Navigate to backend folder**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
   - Copy `.env.example` to `.env` (or use existing `.env`)
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update other variables as needed

4. **Start the server**

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── Models/
│   └── AnnualPlanning.js       # MongoDB schema for annual planning
├── Controllers/
│   └── AnnualPlanningController.js  # Business logic for annual planning
├── routes/
│   └── annualPlanning.js       # API endpoints
├── index.js                    # Server entry point
├── .env                        # Environment variables
└── package.json               # Dependencies
```

## 🔌 API Endpoints

### Annual Planning Routes

**Base URL:** `/api/v1/annual-planning`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all planning for user |
| GET | `/:month` | Get planning for specific month |
| POST | `/` | Create/update planning |
| POST | `/:month/things` | Add thing to do |
| DELETE | `/:month/things/:thingId` | Delete thing to do |
| PUT | `/:month/things/:thingId/toggle` | Toggle thing completion |
| POST | `/:month/goals` | Add goal |
| DELETE | `/:month/goals/:goalId` | Delete goal |
| PUT | `/:month/goals/:goalId/toggle` | Toggle goal completion |

### Example Requests

**Get all planning:**
```bash
curl -X GET http://localhost:5000/api/v1/annual-planning \
  -H "X-User-ID: user123"
```

**Add thing to do:**
```bash
curl -X POST http://localhost:5000/api/v1/annual-planning/January/things \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user123" \
  -d '{"text":"Complete project"}'
```

**Toggle completion:**
```bash
curl -X PUT http://localhost:5000/api/v1/annual-planning/January/things/12345/toggle \
  -H "X-User-ID: user123"
```

## 🔐 Authentication

Currently using userId passed via `X-User-ID` header for simple user isolation.

Header format:
```
X-User-ID: your-user-id
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

## 🛠️ Development

### Adding New Routes

1. Create model in `Models/` folder
2. Create controller in `Controllers/` folder
3. Create routes file in `routes/` folder
4. Import and register routes in `index.js`

### Database

Connected to MongoDB using Mongoose. Update `MONGODB_URI` in `.env` with your connection string.

## 🐛 Troubleshooting

**MongoDB connection error:**
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB server is running
- Verify IP whitelist in MongoDB Atlas (if using cloud)

**CORS errors:**
- Check `CORS_ORIGIN` in `.env`
- Ensure frontend URL is included in CORS configuration

**Port already in use:**
- Change `PORT` in `.env`
- Or kill process using the port

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

---

**Backend API Server Ready!** 🎉
