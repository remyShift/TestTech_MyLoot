import { useState } from 'react';

export function DevToolbar() {
	const [isOpen, setIsOpen] = useState(false);

	if (import.meta.env.PROD) {
		return null;
	}

	const testCases = [
		{ label: 'Team 1 (data)', url: '/teams/1' },
		{ label: 'Team 2 (data)', url: '/teams/2' },
		{ label: 'Team 3 (data)', url: '/teams/3' },
		{ label: 'Team 4 (data)', url: '/teams/4' },
		{ label: 'Team 5 (empty)', url: '/teams/5' },
		{ label: 'Team 999 (404)', url: '/teams/999' },
		{ label: 'Invalid ID', url: '/teams/invalid' },
	];

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
					title="Debug: Test error cases"
				>
					🔧
				</button>
			) : (
				<div className="bg-white rounded-lg shadow-xl border p-4 min-w-64">
					<div className="flex justify-between items-center mb-3">
						<h3 className="font-semibold text-gray-800">🔧 Dev Tools</h3>
						<button
							onClick={() => setIsOpen(false)}
							className="text-gray-500 hover:text-gray-700"
						>
							✕
						</button>
					</div>
					<div className="space-y-2">
						<p className="text-sm text-gray-600 mb-2">Test cases :</p>
						{testCases.map((testCase, index) => (
							<button
								key={index}
								onClick={() => window.location.href = testCase.url}
								className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
							>
								{testCase.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}