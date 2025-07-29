import { useState, useRef } from 'react';

interface DateRangePickerProps {
	onFilter: (from?: string, to?: string) => void;
}

export function DateRangePicker({ onFilter }: DateRangePickerProps) {
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [error, setError] = useState('');
	const filterButtonRef = useRef<HTMLButtonElement>(null);

	const handleFilter = () => {
		setError('');
		
		if ((fromDate && !toDate) || (!fromDate && toDate)) {
			setError('Please select both dates');
			return;
		}
		
		if (fromDate && toDate) {
			onFilter(fromDate, toDate);
		}
	};

	const handleReset = () => {
		setFromDate('');
		setToDate('');
		setError('');
		onFilter(undefined, undefined);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
			e.preventDefault();
			handleFilter();
		}
		
		if (e.key === 'Escape') {
			e.preventDefault();
			handleReset();
		}
	};

	return (
		<div 
			className="bg-white rounded-lg shadow-lg p-6 mb-6"
			role="region"
			aria-labelledby="date-filter-heading"
			onKeyDown={handleKeyDown}
		>
			<h2 
				id="date-filter-heading"
				className="text-xl font-bold text-gray-800 mb-4"
			>
				Filter by period
			</h2>
			
			<div className="flex flex-wrap items-end gap-4">
				<div className="flex-1 min-w-48">
					<label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
						From date
					</label>
					<input
						type="date"
						id="from-date"
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						aria-describedby={error ? "date-error" : undefined}
						aria-invalid={!!error}
					/>
				</div>
				
				<div className="flex-1 min-w-48">
					<label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
						To date
					</label>
					<input
						type="date"
						id="to-date"
						value={toDate}
						onChange={(e) => setToDate(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						aria-describedby={error ? "date-error" : undefined}
						aria-invalid={!!error}
					/>
				</div>
				
				<div className="flex gap-2">
					<button
						ref={filterButtonRef}
						onClick={handleFilter}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
						aria-describedby="filter-help"
					>
						Filter
					</button>
					<button
						onClick={handleReset}
						className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
						aria-label="Reset date filters"
					>
						Reset
					</button>
				</div>
			</div>
			
			{error && (
				<div 
					id="date-error"
					className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md"
					role="alert"
					aria-live="polite"
				>
					<p className="text-red-700 text-sm">{error}</p>
				</div>
			)}
		</div>
	);
}