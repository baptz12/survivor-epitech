import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { hashPassword, signToken, type UserPayload } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ error: { message: 'Email and password are required' } }, { status: 400 });
	}

	// Validate password length
	if (password.length < 6) {
		return json(
			{ error: { message: 'Password must be at least 6 characters long' } },
			{ status: 400 }
		);
	}

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return json({ error: { message: 'User not found' } }, { status: 404 });
	}

	// Check if account is already activated
	if (user.password) {
		return json(
			{
				error: {
					message: 'Account is already activated. Please use the sign in option.',
					code: 'ALREADY_ACTIVATED'
				}
			},
			{ status: 400 }
		);
	}

	// Hash the password and update the user
	const hashedPassword = await hashPassword(password);

	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: {
			password: hashedPassword
			// You might also want to update other fields during activation
			// updatedAt: new Date(), // This should be automatic with Prisma
		}
	});

	// Create the auth token
	const payload: UserPayload = {
		id: updatedUser.id,
		email: updatedUser.email,
		role: updatedUser.role
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
	const { password: _, ...userWithoutPassword } = updatedUser;
	return json({
		data: {
			user: userWithoutPassword,
			message: 'Account successfully activated!'
		}
	});
}
