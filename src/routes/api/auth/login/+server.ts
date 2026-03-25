import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { comparePasswords, signToken, type UserPayload } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ error: { message: 'Email and password are required' } }, { status: 400 });
	}

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return json({ error: { message: 'Invalid credentials' } }, { status: 401 });
	}

	// New check: If user exists but has no password, they need to activate their account.
	if (!user.password) {
		return json(
			{
				error: {
					message: 'Account not activated.',
					code: 'ACCOUNT_NOT_ACTIVATED'
				}
			},
			{ status: 403 } // 403 Forbidden is appropriate here
		);
	}

	if (!(await comparePasswords(password, user.password))) {
		return json({ error: { message: 'Invalid credentials' } }, { status: 401 });
	}

	const payload: UserPayload = {
		id: user.external_id,
		email: user.email,
		role: user.role
	};

	const token = signToken(payload);

	cookies.set('auth_token', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 1 week
	});

	// Return the user data (without password) to the client
	const { password: _, ...userWithoutPassword } = user;
	return json({ data: { user: userWithoutPassword } });
}
