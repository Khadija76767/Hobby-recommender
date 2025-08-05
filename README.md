# AI-Powered Hobby Recommender System

An advanced hobby recommendation system that helps users discover new hobbies tailored to their interests and preferences. The system combines AI, vector databases, and personalized recommendations to create a comprehensive hobby exploration experience.

## Features

- **Daily Hobby Generator**: New hobby suggestions daily based on user preferences
- **Personalized Hobby Quiz**: 10-question assessment for tailored recommendations
- **AI Hobby Assistant**: Natural language conversation about hobbies
- **Comprehensive Hobby Database**: Structured information about diverse hobbies
- **User Progress Tracking**: Monitor and track hobby exploration journey

## Tech Stack

### Backend
- FastAPI
- FAISS Vector Database
- OpenAI GPT Integration
- SQLAlchemy
- JWT Authentication

### Frontend
- React
- Material UI
- TypeScript
- Axios

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```
4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Backend
```bash
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost/db_name
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET_KEY=your_jwt_secret
```

## Project Structure

```
.
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   └── services/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── alembic/
├── requirements.txt
└── README.md
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 