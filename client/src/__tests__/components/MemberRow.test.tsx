import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemberRow } from '@/components/MemberRow';
import type { Member } from '@/types';

describe('MemberRow Component', () => {
	const mockMember: Member = {
		id: 1,
		name: 'Alice Champion',
		teamId: 1,
		totalCoins: 150,
		percent: 75,
	};

	it('should display member information correctly', () => {
		render(<MemberRow member={mockMember} rank={1} />);

		expect(screen.getByText('Alice Champion')).toBeInTheDocument();
		expect(screen.getByText('150 coins')).toBeInTheDocument();
		expect(screen.getByText('75% of team')).toBeInTheDocument();
		expect(screen.getByText('#1')).toBeInTheDocument();
	});

	it('should display different rank correctly', () => {
		render(<MemberRow member={mockMember} rank={3} />);

		expect(screen.getByText('#3')).toBeInTheDocument();
	});

	it('should handle zero coins member', () => {
		const zeroMember: Member = {
			...mockMember,
			totalCoins: 0,
			percent: 0,
		};

		render(<MemberRow member={zeroMember} rank={5} />);

		expect(screen.getByText('0 coins')).toBeInTheDocument();
		expect(screen.getByText('0% of team')).toBeInTheDocument();
	});
});