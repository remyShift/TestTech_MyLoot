import type { TeamStats } from '@/types/index';
import CardTitle from './CardTitle';

export default function HeaderTeamCard({ data }: { data: TeamStats }) {
    const { total } = data;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <CardTitle title="Team statistics" />
            <div className="text-xl text-blue-600 font-semibold">
                Total : {total} coins
            </div>
        </div>
    )
}
