import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { hashPassword, signToken, type UserPayload } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	// 1. Validate input
	if (!email || !password) {
		return json({ error: { message: 'Email and password are required' } }, { status: 400 });
	}
	if (password.length < 6) {
		return json(
			{ error: { message: 'Password must be at least 6 characters long' } },
			{ status: 400 }
		);
	}

	// 2. Check if user exists and is pending activation
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return json(
			{ error: { message: 'This email is not registered. Please contact an administrator.' } },
			{ status: 404 } // Not Found
		);
	}

	if (user.password) {
		return json(
			{ error: { message: 'This account has already been activated.' } },
			{ status: 409 }
		); // Conflict
	}

	// 3. Hash the password
	const hashedPassword = await hashPassword(password);

	// 4. Update the user with the new password
	const updatedUser = await prisma.user.update({
		where: { email },
		data: {
			password: hashedPassword
		}
	});

	// 5. User is activated, now log them in by creating a session token
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

	// 6. Return the new user's data (without the password)
	const { password: _, ...userWithoutPassword } = updatedUser;
	return json({ data: { user: userWithoutPassword } }, { status: 200 }); // 200 OK
}
