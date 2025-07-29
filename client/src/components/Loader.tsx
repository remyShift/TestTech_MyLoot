interface LoaderProps {
	text?: string;
}

export function Loader({ text = 'Loading...' }: LoaderProps) {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<div 
				role="status" 
				className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
			>
				<span className="sr-only">Loading...</span>
			</div>
			<p className="mt-2 text-gray-600">{text}</p>
		</div>
	);
}