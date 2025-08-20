"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

function RecordAns({ questions, mockId, interviewId, currentQuestionIndex, setCurrentQuestionIndex, answeredQuestions, setAnsweredQuestions }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [speechDetected, setSpeechDetected] = useState(false);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const webcamRef = useRef(null);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(false); // Track recording state for cleanup

  // Cleanup function to stop all media properly
  const cleanupMedia = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping speech recognition:', e);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Indicate speech has been detected
        if (finalTranscript.trim() || interimTranscript.trim()) {
          setSpeechDetected(true);
        }
        
        // Only append final transcript to avoid duplicates
        if (finalTranscript.trim()) {
          setUserAnswer(prev => {
            const newAnswer = (prev + ' ' + finalTranscript).trim();
            return newAnswer;
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Don't immediately show error for no-speech, let it retry
          console.log('No speech detected, continuing...');
        } else if (event.error === 'audio-capture') {
          setError('Microphone not accessible. Please check permissions.');
        } else if (event.error === 'network') {
          setError('Network error. Please check your internet connection.');
        } else if (event.error !== 'aborted') {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        // Auto-restart speech recognition if still recording
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Could not restart speech recognition:', e);
          }
        }
      };
    }

    // Cleanup function
    return cleanupMedia;
  }, [cleanupMedia]);

  // Update recording ref when recording state changes
  useEffect(() => {
    isRecordingRef.current = recording;
  }, [recording]);

  const startRecording = async () => {
    try {
      setError("");
      setUserAnswer("");
      setSpeechDetected(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: true
      });

      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setProcessing(true);
        
        // Wait a moment for speech recognition to finish processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          
          // Create audio URL for storage
          const audioUrl = URL.createObjectURL(blob);
          
          // Validate that we have a meaningful answer
          const trimmedAnswer = userAnswer?.trim() || '';
          if (!trimmedAnswer || trimmedAnswer.length < 3) {
            setError('No speech detected. Please try recording your answer again and speak clearly.');
            setProcessing(false);
            return;
          }
          
          // Save answer to database
          const currentQuestion = questions[currentQuestionIndex]?.question || "No question available";
          
          console.log('=== SENDING TO API ===');
          console.log('mockIdRef:', mockId);
          console.log('interviewId:', interviewId);
          console.log('question:', currentQuestion);
          console.log('userAnswer:', trimmedAnswer);
          console.log('userAnswer length:', trimmedAnswer.length);
          console.log('Full payload:', {
            mockIdRef: mockId,
            question: currentQuestion,
            userAnswer: trimmedAnswer,
            audioUrl: audioUrl
          });
          
          const response = await fetch('/api/user-answers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mockIdRef: mockId,
              question: currentQuestion,
              userAnswer: trimmedAnswer,
              audioUrl: audioUrl
            })
          });

          // Check if response is ok before parsing JSON
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success) {
            // Mark current question as answered
            const newAnsweredQuestions = new Set(answeredQuestions);
            newAnsweredQuestions.add(currentQuestionIndex);
            setAnsweredQuestions(newAnsweredQuestions);
            
            // Check if all questions are completed
            if (newAnsweredQuestions.size === Math.min(questions.length, 5)) {
              setAllQuestionsCompleted(true);
            }
            
            // Display JSON response in console
            console.log('=== ANSWER SAVED SUCCESSFULLY ===');
            console.log(JSON.stringify({
              question: currentQuestion,
              userAnswer: trimmedAnswer,
              savedData: result.data
            }, null, 2));
          } else {
            setError('Failed to save answer: ' + result.error);
          }
        } catch (apiError) {
          console.error('Error processing answer:', apiError);
          setError('Failed to process your answer. Please try again.');
        } finally {
          setProcessing(false);
        }
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      
      if (speechSupported && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Could not start speech recognition:', e);
        }
      }
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera/microphone access denied. Please allow permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please check your devices.');
      } else {
        setError('Error accessing camera/microphone. Please check permissions and devices.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (speechSupported && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping speech recognition:', e);
      }
    }
    
    setRecording(false);
    
    // Additional cleanup
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const totalQuestions = Math.min(questions.length, 5);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Black container with webcam */}
      <div className="bg-black rounded-2xl p-8 min-h-[340px] min-w-[480px] flex flex-col justify-center items-center shadow-lg">
        {recording ? (
          <div className="relative w-full h-full">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              className="w-full h-full rounded-xl"
            />
            {/* Speech detection indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${speechDetected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white text-sm">
                {speechDetected ? 'Speech Detected' : 'Listening...'}
              </span>
            </div>
          </div>
        ) : (
          // Placeholder when not recording
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-slate-400">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-16 h-16 text-gray-500 dark:text-slate-400"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
              </svg>
            </div>
            <p className="text-sm text-center dark:text-slate-300">Click Record Answer to start your interview</p>
          </div>
        )}
      </div>
      
      {/* Modern styled button */}
      <div className="mt-6 w-full max-w-md">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={processing}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium text-base transition-all duration-200 shadow-md hover:shadow-lg ${
            recording 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : processing
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 dark:border-slate-500"
          }`}
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : recording ? (
            <>
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
              Stop Recording
            </>
          ) : (
            <>
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.2c.4-.3 1-.2 1.3.3.1.2.2.4.2.6v1.9c0 3.3-2.7 6-6 6s-6-2.7-6-6V9c0-.6.4-1 1-1s1 .4 1 1v1.9c0 2.2 1.8 4 4 4s4-1.8 4-4V9c0-.2.1-.4.2-.6.3-.5.9-.6 1.3-.2z"/>
                <path d="M11 17.9v2.1h-3c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1h-3v-2.1c3.5-.5 6-3.5 6-7.1V9c0-.6-.4-1-1-1s-1 .4-1 1v1.8c0 2.8-2.2 5.2-5 5.2s-5-2.4-5-5.2V9c0-.6-.4-1-1-1s-1 .4-1 1v1.8c0 3.6 2.5 6.6 6 7.1z"/>
              </svg>
              Record Answer
            </>
          )}
        </button>

        {error && (
          <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm dark:bg-red-900/20 dark:border-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* View Feedback Button - Only show when all questions completed */}
        {allQuestionsCompleted && (
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = `/dashboard/interview/${interviewId}/feedback`}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
            >
              🎉 View Your Interview Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordAns;
