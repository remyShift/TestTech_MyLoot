import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from '@/components/DateRangePicker';

describe('DateRangePicker Component', () => {
	it('should render date inputs and filter button', () => {
		const mockOnFilter = vi.fn();
		
		render(<DateRangePicker onFilter={mockOnFilter} />);

		expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
	});

	it('should call onFilter when dates are selected and filter button is clicked', async () => {
		const user = userEvent.setup();
		const mockOnFilter = vi.fn();
		
		render(<DateRangePicker onFilter={mockOnFilter} />);

		const fromInput = screen.getByLabelText(/from/i);
		const toInput = screen.getByLabelText(/to/i);
		const filterButton = screen.getByRole('button', { name: /filter/i });

		await user.type(fromInput, '2024-01-01');
		await user.type(toInput, '2024-01-31');
		await user.click(filterButton);

		expect(mockOnFilter).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
	});

	it('should call onFilter with undefined when reset button is clicked', async () => {
		const user = userEvent.setup();
		const mockOnFilter = vi.fn();
		
		render(<DateRangePicker onFilter={mockOnFilter} />);

		const resetButton = screen.getByRole('button', { name: /reset/i });
		await user.click(resetButton);

		expect(mockOnFilter).toHaveBeenCalledWith(undefined, undefined);
	});

	it('should not call onFilter when only one date is provided', async () => {
		const user = userEvent.setup();
		const mockOnFilter = vi.fn();
		
		render(<DateRangePicker onFilter={mockOnFilter} />);

		const fromInput = screen.getByLabelText(/from/i);
		const filterButton = screen.getByRole('button', { name: /filter/i });

		await user.type(fromInput, '2024-01-01');
		await user.click(filterButton);

		expect(mockOnFilter).not.toHaveBeenCalled();
	});

	it('should show error message when only one date is provided', async () => {
		const user = userEvent.setup();
		const mockOnFilter = vi.fn();
		
		render(<DateRangePicker onFilter={mockOnFilter} />);

		const fromInput = screen.getByLabelText(/from/i);
		const filterButton = screen.getByRole('button', { name: /filter/i });

		await user.type(fromInput, '2024-01-01');
		await user.click(filterButton);

		expect(screen.getByText(/please select both dates/i)).toBeInTheDocument();
	});
});