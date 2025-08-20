"use client";

import React, { useState, useRef, useEffect } from 'react';

function QuestionsSections({ mockInterview, currentQuestionIndex, setCurrentQuestionIndex, answeredQuestions }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);

  // Defensive: handle missing or invalid questions array
  const questions = Array.isArray(mockInterview?.questions) ? mockInterview.questions : [];

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Listen/Pause handler in one button
  const handleListenPause = () => {
    if (
      typeof window !== "undefined" &&
      synthRef.current &&
      questions[currentQuestionIndex]?.question
    ) {
      if (!isSpeaking) {
        synthRef.current.cancel(); // Stop any previous speech
        const utterance = new window.SpeechSynthesisUtterance(
          questions[currentQuestionIndex].question
        );
        utterance.volume = 1;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        utterance.onpause = () => setIsSpeaking(false);
        
        synthRef.current.speak(utterance);
        setIsSpeaking(true);
      } else {
        synthRef.current.cancel(); // Use cancel instead of pause for better reliability
        setIsSpeaking(false);
      }
    }
  };

  // Navigation functions
  const nextQuestion = () => {
    const totalQuestions = Math.min(questions.length, 5);
    if (currentQuestionIndex < totalQuestions - 1 && answeredQuestions.has(currentQuestionIndex)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Stop speaking when switching questions
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Stop speaking when switching questions
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
    }
  };

  if (!mockInterview || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 shadow-lg max-w-md text-center dark:bg-red-900/20 dark:border-red-600 dark:text-red-400">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-red-100 rounded-full dark:bg-red-800/30">
            <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1 dark:text-red-300">No Questions Available</h3>
          <p className="text-sm text-red-600 dark:text-red-400">No questions found for this interview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Main Question Card - Compact Version */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden dark:bg-slate-800 dark:border-slate-600">
        {/* Header with Navigation Pills - Combined */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-200 dark:from-slate-700 dark:to-slate-600 dark:border-slate-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Interview Questions</h2>
              <p className="text-sm text-gray-600 mt-1 dark:text-slate-300">Navigate and listen to questions</p>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full dark:text-slate-300 dark:bg-slate-700">
              {currentQuestionIndex + 1} of {Math.min(questions.length, 5)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {questions.slice(0, 5).map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  // Stop speaking when switching questions
                  if (synthRef.current) {
                    synthRef.current.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  currentQuestionIndex === index
                    ? 'bg-blue-600 text-white shadow-md focus:ring-blue-500'
                    : answeredQuestions.has(index)
                      ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 focus:ring-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-900/40'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm focus:ring-gray-400 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center bg-current bg-opacity-20 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  Q{index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Question Content - Compact */}
        {questions[currentQuestionIndex] && (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
                    <span className="text-blue-600 font-bold text-sm dark:text-blue-400">{currentQuestionIndex + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  {answeredQuestions.has(currentQuestionIndex) && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-green-900/30 dark:text-green-300">
                      ✓ Answered
                    </span>
                  )}
                </div>
                <p className="text-base text-gray-800 leading-relaxed dark:text-slate-200">
                  {questions[currentQuestionIndex].question}
                </p>
              </div>
              
              {/* Listen Button - Compact */}
              <button
                onClick={handleListenPause}
                title={isSpeaking ? "Stop reading" : "Read aloud"}
                className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm hover:shadow-md ${
                  isSpeaking
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-700 focus:ring-amber-400 border border-amber-200"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700 focus:ring-blue-400 border border-blue-200"
                }`}
              >
                {isSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-4 dark:from-slate-700 dark:to-slate-600 dark:border-slate-500">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-600 dark:text-slate-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-600'
              }`}
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {answeredQuestions.size} of {Math.min(questions.length, 5)} questions answered
              </p>
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex >= Math.min(questions.length, 5) - 1 || !answeredQuestions.has(currentQuestionIndex)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentQuestionIndex >= Math.min(questions.length, 5) - 1 || !answeredQuestions.has(currentQuestionIndex)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-600 dark:text-slate-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next →
            </button>
          </div>

          <div className="text-center">
            <p className="text-blue-800 text-sm leading-relaxed dark:text-blue-300">
              {!answeredQuestions.has(currentQuestionIndex) ? (
                <>Click <span className="font-semibold bg-blue-200 px-1.5 py-0.5 rounded dark:bg-blue-900/40 dark:text-blue-200">Record Answer</span> to respond to this question.</>
              ) : (
                <>Question answered! {currentQuestionIndex < Math.min(questions.length, 5) - 1 ? 'Click Next to continue.' : 'All questions completed!'}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsSections;
