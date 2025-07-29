import type { TeamStats } from '@/types/index';

export default function HeaderTeamCard({ data }: { data: TeamStats }) {
    const { total } = data;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Team statistics</h1>
            <div className="text-xl text-blue-600 font-semibold">
                Total: {total} coins
            </div>
        </div>
    )
}
