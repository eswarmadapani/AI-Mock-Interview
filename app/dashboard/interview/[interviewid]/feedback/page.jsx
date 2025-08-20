"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [overallRating, setOverallRating] = useState(0);
  const params = useParams();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const mockId = params.interviewid;
        console.log('=== FEEDBACK PAGE DEBUG ===');
        console.log('Interview ID from params:', mockId);
        console.log('Full params object:', params);
        
        // Fetch user answers from the database
        const apiUrl = `/api/user-answers?mockId=${mockId}`;
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        console.log('API Response:', result);
        console.log('Response success:', result.success);
        console.log('Response data length:', result.data?.length);
        
        if (!result.success || !result.data || result.data.length === 0) {
          console.log('No data found or API error');
          setError(`No interview answers found for ID: ${mockId}. Please complete the interview by recording answers to all questions first.`);
          setLoading(false);
          return;
        }

        const userAnswers = result.data;
        
        // Calculate overall rating
        console.log('=== RATING CALCULATION DEBUG ===');
        userAnswers.forEach((item, index) => {
          console.log(`Answer ${index + 1}: rating = "${item.rating}", type = ${typeof item.rating}, parsed = ${parseInt(item.rating) || 0}`);
        });
        
        const totalRating = userAnswers.reduce((sum, item) => {
          const rating = Number(item.rating) || 0;
          return sum + rating;
        }, 0);
        const avgRating = userAnswers.length > 0 ? Math.round(totalRating / userAnswers.length) : 0;
        
        console.log('Total rating:', totalRating);
        console.log('Average rating:', avgRating);
        console.log('Number of answers:', userAnswers.length);
        
        setOverallRating(avgRating);
        
        // Format data for display - using real database data
        const formattedData = userAnswers.map((item, index) => ({
          id: index,
          question: item.question,
          userAnswer: item.userAnswer,
          correctAnswer: `A comprehensive answer should include: proper implementation details, best practices, security considerations, and practical examples. For technical questions, mention specific technologies, frameworks, and methodologies relevant to the topic.`,
          rating: Number(item.rating) || 0,
          feedback: item.geminiFeedback || "No feedback available for this answer."
        }));
        
        setFeedbackData(formattedData);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to fetch feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [params.interviewid]);

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-emerald-500';
    if (rating >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRatingBadgeColor = (rating) => {
    if (rating >= 8) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600';
    if (rating >= 6) return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600';
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center max-w-md dark:bg-slate-800 dark:border-slate-600">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-red-900/20">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-slate-100">No Results Found</h3>
          <p className="text-gray-600 mb-6 text-sm dark:text-slate-300">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-lg mb-6 dark:bg-emerald-900/30">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-slate-100">Interview Complete</h1>
          <p className="text-gray-600 mb-8 dark:text-slate-300">Here's your detailed performance feedback</p>
          
          {/* Overall Rating Card */}
          <div className="inline-flex items-center gap-4 bg-white rounded-lg shadow-sm border px-6 py-4 mb-8 dark:bg-slate-800 dark:border-slate-600">
            <span className="text-gray-700 font-medium dark:text-slate-200">Overall Score:</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getRatingColor(overallRating)}`}></div>
              <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{overallRating}/10</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm max-w-2xl mx-auto dark:text-slate-400">
            Review each question below to understand your performance and areas for improvement
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {feedbackData.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 dark:bg-slate-800 dark:border-slate-600">
              {/* Question Header - Clickable */}
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center font-semibold text-sm dark:bg-slate-700 dark:text-slate-200">
                    {index + 1}
                  </div>
                  <span className="text-gray-900 font-medium dark:text-slate-100">
                    {item.question}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRatingBadgeColor(item.rating)}`}>
                    {item.rating}/10
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedItems[item.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedItems[item.id] && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-600">
                  <div className="pt-6 space-y-6">
                    {/* Your Answer */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">Your Answer</h4>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400">
                        <p className="text-gray-700 leading-relaxed dark:text-slate-200">{item.userAnswer}</p>
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">Model Answer</h4>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500 dark:bg-emerald-900/20 dark:border-emerald-400">
                        <p className="text-gray-700 leading-relaxed dark:text-slate-200">{item.correctAnswer}</p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">Feedback</h4>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500 dark:bg-amber-900/20 dark:border-amber-400">
                        <p className="text-gray-700 leading-relaxed dark:text-slate-200">{item.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
