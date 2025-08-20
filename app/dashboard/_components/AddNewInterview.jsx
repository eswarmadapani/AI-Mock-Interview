"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { generateInterviewQuestions } from "../../../utils/GeminiAi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  /* ------------------------------------------------------------------ */
  /* state                                                              */
  /* ------------------------------------------------------------------ */
  const [formOpen, setFormOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /* submit                                                             */
  /* ------------------------------------------------------------------ */
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const prompt = `
      You are a helpful assistant that can help me with my job interviewing.
      I am interviewing for a ${jobPosition} position.
      The job description is ${jobDescription}.
      I have ${jobExperience} years of experience.
    `;

    try {
      const questions = await generateInterviewQuestions(prompt);

      if (questions && user?.primaryEmailAddress?.emailAddress) {
        const save = await fetch("/api/interviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewQuestions: questions,
            jobPosition,
            jobDescription,
            jobExperience,
            userEmail: user.primaryEmailAddress.emailAddress,
          }),
        });

        const res = await save.json();
        if (res.success && res.data?.mockId) {
          router.push("/interview");
          return;
        }
      }
    } catch (err) {
      console.error("Interview generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex justify-center">
      <div className="max-w-xl w-full">
        {/* ---------------- Trigger Card ---------------- */}
        {!formOpen && (
        <div
          onClick={() => setFormOpen(true)}
          className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 
                     bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center shadow-sm 
                     transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 
                     hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg
                     dark:border-slate-600 dark:from-slate-800 dark:to-slate-700 
                     dark:hover:border-blue-400 dark:hover:from-slate-700 dark:hover:to-slate-600"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full 
                          bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg 
                          transition-transform duration-300 group-hover:scale-110">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="mb-1 text-xl font-semibold text-gray-700 
                         transition-colors duration-300 group-hover:text-blue-600
                         dark:text-gray-200 dark:group-hover:text-blue-400">
            Create New Interview
          </h2>
          <p className="text-sm text-gray-500 transition-colors duration-300 
                        group-hover:text-blue-500
                        dark:text-gray-400 dark:group-hover:text-blue-400">
            Start practicing with AI-generated questions
          </p>
        </div>
      )}

      {/* ---------------- Medium Aesthetic Form Modal ---------------- */}
      {formOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
          {/* medium-sized modal container */}
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200
                       shadow-2xl overflow-hidden dark:bg-slate-800 dark:border-slate-600"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 pointer-events-none dark:from-slate-900/40 dark:to-blue-900/30"></div>
            
            {/* close */}
            <button
              aria-label="Close form"
              onClick={() => setFormOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 dark:hover:bg-slate-700"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* header */}
            <div className="relative p-8 pb-6 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl 
                              bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-slate-100">Set Up Your Interview</h3>
              <p className="text-gray-600 max-w-md mx-auto dark:text-slate-300">
                Provide details about the position you're preparing for, and we'll generate personalized interview questions
              </p>
            </div>

            {/* form */}
            <form onSubmit={onSubmit} className="relative px-8 pb-8 space-y-6">
              {/* job role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Job Role / Position
                </label>
                <div className="relative">
                  <input
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    placeholder="e.g., Full Stack Developer, Product Manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:hover:bg-slate-600"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Job Description / Tech Stack
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="e.g., React, Node.js, Python, AWS, Docker..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:hover:bg-slate-600"
                  />
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* experience */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Years of Experience
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    placeholder="e.g., 2, 5, 10"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:hover:bg-slate-600"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setFormOpen(false)}
                  className="flex-1 py-3 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium transition-all duration-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Questions...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Interview
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default AddNewInterview;
