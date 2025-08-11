
import { GoogleGenAI } from "@google/genai";

export async function generateInterviewQuestions(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not found. Please check your environment configuration.');
  }

  // Temporary mock response for development while API key issues are resolved
  if (apiKey === 'mock' || apiKey === 'test') {
    return [
      {
        question: "Describe your experience with React.js, including your proficiency level and any complex projects you've built.",
        answer: "I have 5 years of experience using React.js to build dynamic, responsive web applications. I've worked on several complex projects including an e-commerce platform with real-time inventory management and a social media dashboard with live data visualization. I'm proficient with hooks, context API, and state management libraries like Redux and Zustand."
      },
      {
        question: "Explain how you would build a RESTful API using Node.js and Express, including authentication and error handling.",
        answer: "I would start by setting up the Express server with middleware for parsing JSON and handling CORS. For authentication, I'd implement JWT tokens with bcrypt for password hashing. I'd structure the API with proper route organization, implement comprehensive error handling with try-catch blocks and custom error classes, and add input validation using libraries like Joi or express-validator."
      },
      {
        question: "How would you handle user authentication and authorization in a web application?",
        answer: "I'd implement a multi-layered security approach: 1) User registration with email verification and strong password requirements, 2) JWT-based authentication with refresh tokens, 3) Role-based access control (RBAC) for authorization, 4) Session management with secure cookie settings, 5) Rate limiting to prevent brute force attacks, and 6) HTTPS enforcement for all communications."
      },
      {
        question: "Describe a challenging project you worked on where you had to learn new technologies quickly.",
        answer: "I was tasked with building a real-time collaborative document editor using WebSockets and operational transformation algorithms. I had to quickly learn WebSocket protocols, conflict resolution strategies, and implement a custom OT algorithm. I broke down the problem into smaller components, researched existing solutions, and built a working prototype within 2 weeks that supported real-time collaboration for up to 10 users simultaneously."
      },
      {
        question: "What are some of the latest trends in web development that you're excited about?",
        answer: "I'm particularly excited about WebAssembly for performance-critical applications, the growing adoption of TypeScript for better type safety, serverless architectures for scalability, and the rise of micro-frontends for large applications. I'm also following the development of new CSS features like container queries and the continued evolution of React with concurrent features and server components."
      }
    ];
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  // Try different models in order of preference
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
  
  // Enhanced prompt to request structured data
  const enhancedPrompt = `${prompt}

Please provide exactly 5 interview questions and their expected answers. Return ONLY a valid JSON array in this exact format (no markdown, no code blocks, just pure JSON):

[
  {
    "question": "Your interview question here",
    "answer": "Expected answer or guidance for this question"
  }
]

Make sure the questions are relevant to the job position, tech stack, and experience level mentioned. Include a mix of technical, behavioral, and problem-solving questions. Return only the JSON array, nothing else.`;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
      });

      // Extract the text content from the response
      const responseText = response.candidates[0].content.parts[0].text;
      
      // Clean the response text - remove markdown code blocks if present
      let cleanText = responseText.trim();
      
      // Remove markdown code blocks (```json ... ```)
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to parse the JSON response
      try {
        const parsedResponse = JSON.parse(cleanText);
        if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
          return parsedResponse;
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, returning as text:', parseError);
        console.log('Raw response text:', responseText);
        console.log('Cleaned text:', cleanText);
      }
      
      // If parsing fails, return the raw text response
      return responseText;
    } catch (error) {
      // If it's a quota/rate limit error, try the next model
      if (error.message && (error.message.includes('429') || error.message.includes('quota_limit_value":"0"'))) {
        console.log(`Model ${model} failed due to quota, trying next model...`);
        continue;
      }
      // For other errors, throw immediately
      throw error;
    }
  }
  
  // If all models fail due to quota, throw a clear error
  throw new Error('All available models have quota limitations. Please check your Google AI Studio settings or wait a moment and try again.');
}
