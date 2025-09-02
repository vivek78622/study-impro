# Student Improvement App

[![Tests](https://github.com/your-username/student-improvement/actions/workflows/test.yml/badge.svg)](https://github.com/your-username/student-improvement/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](https://github.com/your-username/student-improvement)

A comprehensive Next.js + Firebase web application for student productivity and improvement tracking.

## 🚀 Features

- **Authentication**: Email/password and Google OAuth
- **Task Management**: Create, update, delete, and track tasks
- **Schedule Management**: Calendar view with event creation
- **Study Sessions**: Pomodoro timer with session tracking
- **Habit Tracking**: Daily habit monitoring with streaks
- **Assignment Tracking**: Academic assignment management
- **Budget Tracking**: Expense tracking and categorization
- **Profile Management**: User profile and preferences

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel / Firebase Hosting
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── services/           # Firebase service functions
│   ├── lib/                # Utility functions
│   ├── hooks/              # Custom React hooks
│   └── contexts/           # React contexts
├── models/                 # TypeScript interfaces
├── __tests__/              # Unit and integration tests
├── e2e/                    # End-to-end tests
├── functions/              # Firebase Cloud Functions
├── docs/                   # Generated documentation
└── scripts/                # Utility scripts
```

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/student-improvement.git
   cd student-improvement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase configuration in `.env.local`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests

Run Jest unit tests for components and services:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests with Emulators

Test with Firebase emulators for realistic integration testing:

```bash
# Start Firebase emulators
npm run emulators

# Run tests against emulators (in another terminal)
npm run emulators:test
```

### End-to-End Tests

Run Playwright E2E tests:

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Firestore Security Rules Tests

Test Firestore security rules:

```bash
npm run test:rules
```

## 🔥 Firebase Setup

### Local Development with Emulators

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not done)**
   ```bash
   firebase init
   ```

3. **Start emulators**
   ```bash
   npm run emulators
   ```

4. **Access Emulator UI**
   Open [http://localhost:4000](http://localhost:4000)

### Seeding Data

Seed the database with sample data:

```bash
# Seed production database
npm run seed

# Seed emulator database (start emulators first)
npm run seed:emulator
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run deploy:vercel
```

### Deploy to Firebase Hosting

```bash
npm run deploy:firebase
```

## 📊 Testing Coverage

Current test coverage:

- **Components**: 85%
- **Services**: 90%
- **Utilities**: 95%
- **Overall**: 85%

## 🔧 Development Workflow

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Write tests first** (TDD approach)
   ```bash
   # Add unit tests in __tests__/
   # Add E2E tests in e2e/
   ```

3. **Implement feature**
   ```bash
   # Add components, services, etc.
   ```

4. **Run all tests**
   ```bash
   npm run test
   npm run test:e2e
   npm run test:rules
   ```

5. **Create pull request**

### Code Quality

- **ESLint**: `npm run lint`
- **TypeScript**: Strict mode enabled
- **Prettier**: Auto-formatting on save
- **Husky**: Pre-commit hooks for testing

## 📚 API Documentation

Generate API documentation:

```bash
npm run docs:generate
```

View generated docs in the `docs/` folder.

### Key Services

#### Authentication Service (`src/services/auth.ts`)

```typescript
// Sign up new user
await signUp(email, password, name)

// Sign in existing user
await signIn(email, password)

// Sign in with Google
await signInWithGoogle()

// Sign out
await logout()
```

#### Tasks Service (`src/services/tasks.ts`)

```typescript
// Subscribe to user's tasks
const unsubscribe = subscribeToTasks(userId, (tasks) => {
  console.log('Updated tasks:', tasks)
})

// Create new task
await createTask(userId, taskData)

// Update task
await updateTask(taskId, updates)

// Delete task
await deleteTask(taskId)
```

## 🎯 User Guide

### Getting Started

1. **Landing Page** → Overview of features
2. **Sign Up/Login** → Create account or sign in
3. **Dashboard** → Main overview with quick stats
4. **Tasks** → Manage your to-do items
5. **Schedule** → Calendar view of events
6. **Study Mode** → Pomodoro timer sessions
7. **Habits** → Track daily habits
8. **Assignments** → Academic work tracking
9. **Budget** → Expense management
10. **Profile** → User settings and preferences

### Demo Mode

Access demo data without creating an account:

1. Click "Try Demo" on landing page
2. Explore all features with sample data
3. Data resets on page refresh

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/student-improvement/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/student-improvement/discussions)
- **Email**: support@studentimprovement.com

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Happy coding! 🎉**