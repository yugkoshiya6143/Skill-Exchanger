# Skill Exchanger - MERN Stack Application

A full-stack web application where users can exchange skills with each other. Users can register, search for others by skills, send skill exchange requests, chat, and rate each other after completing sessions.

## Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Profile Management**: Create and edit user profiles with skills and bio
- **Skill Search**: Search for users by specific skills
- **Request System**: Send and manage skill exchange requests
- **Real-time Chat**: Message other users for accepted requests
- **Rating System**: Rate and review users after skill exchanges
- **Responsive Design**: Mobile-friendly interface with Bootstrap 5

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Bootstrap 5 for styling
- Font Awesome for icons

## Project Structure

```
skill-exchanger/
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── db.js
│   ├── middlewares/
│   ├── models/
│   ├── controllers/
│   └── routes/
└── frontend/
    ├── public/
    └── src/
        ├── api/
        ├── components/
        ├── pages/
        ├── App.js
        └── index.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd skill-exchanger/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure MongoDB is running locally, or update the connection string in `config.js`

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd skill-exchanger/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

## Usage

1. **Register**: Create a new account with your name, email, password, and skills
2. **Login**: Sign in to access the dashboard
3. **Search Users**: Find users by searching for specific skills
4. **Send Requests**: Send skill exchange requests to other users
5. **Manage Requests**: Accept/reject incoming requests and view sent requests
6. **Chat**: Communicate with users for accepted requests
7. **Complete & Rate**: Mark exchanges as complete and rate other users

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Profile
- `GET /api/profile/me` - Get user profile
- `POST /api/profile/update` - Update profile

### Users
- `GET /api/users/search?skill=skillname` - Search users by skill
- `GET /api/users/:userId` - Get user by ID

### Requests
- `POST /api/requests/send` - Send skill exchange request
- `GET /api/requests/incoming` - Get incoming requests
- `GET /api/requests/sent` - Get sent requests
- `POST /api/requests/status` - Update request status

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/list?requestId=id` - Get messages for request

### Ratings
- `POST /api/ratings/give` - Give rating
- `GET /api/ratings/user/:userId` - Get user ratings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
