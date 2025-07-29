import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/Loader';

describe('Loader Component', () => {
	it('should display loading spinner with text', () => {
		render(<Loader />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('should display custom loading text when provided', () => {
		render(<Loader text="Loading data..." />);

		expect(screen.getByText('Loading data...')).toBeInTheDocument();
	});
});