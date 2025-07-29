import type { DateRange } from '@/types/index';

export default function EmptyTeamState({ dateRange, setDateRange }: { dateRange: DateRange, setDateRange: (dateRange: DateRange) => void }) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Team has no members</h3>
            <p className="text-gray-600 max-w-md mx-auto">
                This team has no members or no member has earned any coins 
                {dateRange.from && dateRange.to ? ' in the selected period' : ''}.
            </p>
            {dateRange.from && dateRange.to && (
                <button
                    onClick={() => setDateRange({})}
                    className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    See all data
                </button>
            )}
        </div>
    )
}
