# AI Mock Interview Application

A Next.js application that helps users prepare for job interviews by generating personalized interview questions using AI.

## Features

- 🔐 Clerk Authentication
- 🤖 AI-powered interview question generation using Google Gemini
- 📝 Interactive interview form
- 🎨 Modern UI with Tailwind CSS


## Project Structure

```
ai-mock/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── layout.js          # Root layout with Clerk provider
├── components/            # Reusable UI components
├── utils/                 # Utility functions
│   ├── GeminiAi.js        # AI integration
│   └── db.js             # Database utilities
└── middleware.js          # Clerk middleware
```

## Technologies Used

- **Next.js 15** - React framework
- **Clerk** - Authentication
- **Google Gemini AI** - AI question generation
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
