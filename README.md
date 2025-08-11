# AI Mock Interview Application

A Next.js application that helps users prepare for job interviews by generating personalized interview questions using AI.

## Features

- 🔐 Clerk Authentication
- 🤖 AI-powered interview question generation using Google Gemini
- 📝 Interactive interview form
- 🎨 Modern UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
# Get these from your Clerk dashboard: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Gemini AI
# Get this from Google AI Studio: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **Clerk Authentication**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy the Publishable Key from the API Keys section

2. **Google Gemini AI**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Clerk Authentication Error

If you see "Failed to load Clerk" error:

1. Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in your `.env.local` file
2. Verify the key is correct in your Clerk dashboard
3. Make sure you're using the correct environment (test/production)

### Gemini AI Error

If you see "response.text is not a function" error:

1. Ensure `NEXT_PUBLIC_GEMINI_API_KEY` is set in your `.env.local` file
2. Verify the API key is valid and has quota remaining
3. Check the Google AI Studio dashboard for any quota limitations

### Development Mode

The application includes a mock mode for development. If you set `NEXT_PUBLIC_GEMINI_API_KEY=mock`, it will return sample interview questions without making API calls.

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
