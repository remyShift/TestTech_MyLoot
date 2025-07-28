import { CoinEarning, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Seeding started...');

	await prisma.coinEarning.deleteMany();
	await prisma.user.deleteMany();
	await prisma.team.deleteMany();

	await prisma.$executeRaw`ALTER SEQUENCE "Team_id_seq" RESTART WITH 1`;
	await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
	await prisma.$executeRaw`ALTER SEQUENCE "CoinEarning_id_seq" RESTART WITH 1`;

	console.log('🗑️  Existing data deleted');

	const teams = await prisma.$transaction([
		prisma.team.create({
			data: { name: 'Dragons Rouges' },
		}),
		prisma.team.create({
			data: { name: 'Guerriers Bleus' },
		}),
		prisma.team.create({
			data: { name: 'Mages Verts' },
		}),
		prisma.team.create({
			data: { name: 'Assassins Noirs' },
		}),
	]);

	console.log('🏰 Teams created :', teams.map((t) => t.name).join(', '));

	const usersData = [
		{ name: 'Alice Champion', teamId: teams[0].id },
		{ name: 'Bob Warrior', teamId: teams[0].id },
		{ name: 'Charlie Fire', teamId: teams[0].id },
		{ name: 'Diana Red', teamId: teams[0].id },

		{ name: 'Eve Guardian', teamId: teams[1].id },
		{ name: 'Frank Shield', teamId: teams[1].id },
		{ name: 'Grace Ocean', teamId: teams[1].id },

		{ name: 'Henry Spell', teamId: teams[2].id },
		{ name: 'Ivy Nature', teamId: teams[2].id },
		{ name: 'Jack Forest', teamId: teams[2].id },
		{ name: 'Kate Emerald', teamId: teams[2].id },
		{ name: 'Leo Sage', teamId: teams[2].id },

		{ name: 'Maya Shadow', teamId: teams[3].id },
		{ name: 'Noah Stealth', teamId: teams[3].id },
	];

	const users = await prisma.$transaction(
		usersData.map((userData) => prisma.user.create({ data: userData }))
	);

	console.log('👥 Users created:', users.length);

	const coinEarningsData: Omit<CoinEarning, 'id'>[] = [];
	const now = new Date();

	const redTeamUsers = users.filter((u) => u.teamId === teams[0].id);
	redTeamUsers.forEach((user, index) => {
		const baseAmount = [300, 250, 200, 150][index];

		for (let day = 0; day < 30; day++) {
			const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
			const dailyVariation = Math.random() * 0.4 + 0.8;
			const amount = Math.floor(baseAmount * dailyVariation);

			if (Math.random() > 0.1) {
				coinEarningsData.push({
					amount,
					userId: user.id,
					date,
				});
			}
		}
	});

	const blueTeamUsers = users.filter((u) => u.teamId === teams[1].id);
	blueTeamUsers.forEach((user, index) => {
		const baseAmount = [180, 160, 140][index];

		for (let day = 0; day < 25; day++) {
			const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
			const amount = Math.floor(baseAmount * (Math.random() * 0.6 + 0.7));

			if (Math.random() > 0.2) {
				coinEarningsData.push({
					amount,
					userId: user.id,
					date,
				});
			}
		}
	});

	const greenTeamUsers = users.filter((u) => u.teamId === teams[2].id);
	greenTeamUsers.forEach((user, index) => {
		if (user.name === 'Henry Spell') {
			for (let day = 0; day < 35; day++) {
				const date = new Date(
					now.getTime() - day * 24 * 60 * 60 * 1000
				);
				const amount = Math.floor(400 * (Math.random() * 0.5 + 0.75));

				coinEarningsData.push({
					amount,
					userId: user.id,
					date,
				});
			}
		} else {
			const baseAmount = [50, 40, 30, 25][index - 1] || 20;
			for (let day = 0; day < 15; day++) {
				const date = new Date(
					now.getTime() - day * 24 * 60 * 60 * 1000
				);

				if (Math.random() > 0.5) {
					coinEarningsData.push({
						amount: Math.floor(baseAmount * (Math.random() + 0.5)),
						userId: user.id,
						date,
					});
				}
			}
		}
	});

	const blackTeamUsers = users.filter((u) => u.teamId === teams[3].id);
	blackTeamUsers.forEach((user) => {
		for (let i = 0; i < 3; i++) {
			const daysAgo = Math.floor(Math.random() * 20);
			const date = new Date(
				now.getTime() - daysAgo * 24 * 60 * 60 * 1000
			);

			coinEarningsData.push({
				amount: Math.floor(Math.random() * 50 + 10),
				userId: user.id,
				date,
			});
		}
	});

	await prisma.$transaction(
		coinEarningsData.map((earning) =>
			prisma.coinEarning.create({ data: earning })
		)
	);

	console.log('💰 Coins gains created:', coinEarningsData.length);

	console.log('\n📊 Seeding summary:');
	for (const team of teams) {
		const teamUsers = users.filter((u) => u.teamId === team.id);
		const teamEarnings = coinEarningsData.filter((e) =>
			teamUsers.some((u) => u.id === e.userId)
		);
		const totalCoins = teamEarnings.reduce((sum, e) => sum + e.amount, 0);

		console.log(
			`  ${team.name} (ID: ${team.id}): ${teamUsers.length} membres, ${totalCoins} coins au total`
		);
	}

	console.log('\n🎉 Seeding completed successfully!');
	console.log('\n🔗 Test your endpoints:');
	console.log(
		`  GET /teams/${teams[0].id}/stats - Dragons Rouges (équipe active)`
	);
	console.log(
		`  GET /teams/${teams[1].id}/stats - Guerriers Bleus (équipe moyenne)`
	);
	console.log(
		`  GET /teams/${teams[2].id}/stats - Mages Verts (une superstar)`
	);
	console.log(
		`  GET /teams/${teams[3].id}/stats - Assassins Noirs (équipe inactive)`
	);
}

main()
	.catch((e) => {
		console.error('❌ Error during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
