import { DevToolbar } from '../DevToolbar'

export default function ErrorCard({ error }: { error: Error }) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    const is404 = errorMessage.includes("doesn't exist") || errorMessage.includes("not found") || errorMessage.includes("404");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        {is404 ? '🔍' : '⚠️'}
                    </div>
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        {is404 ? 'Team not found' : 'Error'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {errorMessage}
                    </p>
                    <button
                        onClick={() => window.location.href = '/teams/1'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to team 1
                    </button>
                </div>
            </div>
            <DevToolbar />
        </div>
    )
}
