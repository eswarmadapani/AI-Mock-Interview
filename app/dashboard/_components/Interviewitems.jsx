import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function Interviewitems({interview, onDelete}) {
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    const onStart = () => {
        router.push(`/dashboard/interview/${interview?.mockId}/start`);
    }
    
    const onFeedback = () => {
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
    }

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/mock-interview/${interview.mockId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                onDelete(interview.mockId);
                setShowDeleteConfirm(false);
            } else {
                console.error('Failed to delete interview');
            }
        } catch (error) {
            console.error('Error deleting interview:', error);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative dark:bg-slate-800 dark:border-slate-600'>
            {/* Delete button */}
            <button
                onClick={() => setShowDeleteConfirm(true)}
                className='absolute top-2 right-2 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full flex items-center justify-center transition-colors duration-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400'
                title="Delete Interview"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            <h2 className='font-semibold text-lg text-gray-900 mb-2 pr-10 dark:text-slate-100'>{interview?.jobPosition}</h2>
            <p className='text-sm text-gray-600 mb-1 dark:text-slate-300'>{interview?.jobExperience} Years of Experience</p>
            <p className='text-xs text-gray-500 mb-4 dark:text-slate-400'>Created At {interview?.createdAt}</p>
            
            <div className='flex gap-2 justify-between'>
                <button 
                    onClick={onFeedback}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200'
                >
                    Feedback
                </button>
                <button 
                    onClick={onStart}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200'
                >
                    Start
                </button>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 dark:bg-slate-800">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-slate-100">Delete Interview</h3>
                        <p className="text-gray-600 mb-4 dark:text-slate-300">Are you sure you want to delete this mock interview? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors dark:text-slate-300 dark:hover:text-slate-100"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Interviewitems