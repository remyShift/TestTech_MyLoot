import { DevToolbar } from '../DevToolbar'
import { AppError, ErrorType } from '@/types/errors'

interface ErrorCardProps {
    error: Error | AppError;
}

export default function ErrorCard({ error }: ErrorCardProps) {
    const isAppError = error instanceof AppError;
    const errorMessage = error.message;
    
    const getErrorConfig = () => {
        if (isAppError) {
            switch (error.type) {
                case ErrorType.NOT_FOUND_ERROR:
                    return {
                        emoji: '🔍',
                        title: 'Team not found',
                        color: 'text-blue-600',
                        buttonText: 'Back to team 1',
                        buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    };
                case ErrorType.VALIDATION_ERROR:
                    return {
                        emoji: '⚠️',
                        title: 'Invalid request',
                        color: 'text-orange-600',
                        buttonText: 'Try again',
                        buttonColor: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                    };
                case ErrorType.RATE_LIMIT_ERROR:
                    return {
                        emoji: '⏱️',
                        title: 'Too many requests',
                        color: 'text-purple-600',
                        buttonText: 'Wait and retry',
                        buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                    };
                case ErrorType.NETWORK_ERROR:
                    return {
                        emoji: '🌐',
                        title: 'Network error',
                        color: 'text-red-600',
                        buttonText: 'Retry',
                        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    };
                case ErrorType.SERVER_ERROR:
                default:
                    return {
                        emoji: '🔧',
                        title: 'Server error',
                        color: 'text-red-600',
                        buttonText: 'Back to team 1',
                        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    };
            }
        }

        const isLegacy404 = errorMessage.includes("doesn't exist") || 
                          errorMessage.includes("not found") || 
                          errorMessage.includes("404");
        
        return isLegacy404 ? {
            emoji: '🔍',
            title: 'Team not found',
            color: 'text-blue-600',
            buttonText: 'Back to team 1',
            buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        } : {
            emoji: '⚠️',
            title: 'Error',
            color: 'text-red-600',
            buttonText: 'Back to team 1',
            buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
    };

    const config = getErrorConfig();

    const handleRetry = () => {
        if (isAppError && error.isRateLimit) {
            setTimeout(() => window.location.reload(), 1000);
        } else if (isAppError && (error.isNetwork || error.isValidation)) {
            window.location.reload();
        } else {
            window.location.href = '/teams/1';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        {config.emoji}
                    </div>
                    <h1 className={`text-3xl font-bold ${config.color} mb-4`}>
                        {config.title}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {errorMessage}
                    </p>
                    {isAppError && error.isRateLimit && (
                        <p className="text-sm text-gray-500 mb-4">
                            Please wait a moment before trying again.
                        </p>
                    )}
                    <button
                        onClick={handleRetry}
                        className={`px-6 py-3 ${config.buttonColor} text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                    >
                        {config.buttonText}
                    </button>
                </div>
            </div>
            <DevToolbar />
        </div>
    )
}
