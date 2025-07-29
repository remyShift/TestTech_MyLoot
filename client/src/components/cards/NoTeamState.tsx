import { DevToolbar } from '../DevToolbar'

export default function NoTeamState() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No data available</h1>
                    <p className="text-gray-600 mb-6">
                        The data for this team could not be loaded.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
            <DevToolbar />
        </div>
    )
}
