import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';
// The 'bcrypt' package is no longer needed, we'll use Bun's native API.

// This is the shape of the data we'll encode in the JWT
export interface UserPayload {
	id: string;
	email: string;
	role: string;
}

export function signToken(payload: UserPayload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		return payload as UserPayload;
	} catch (error) {
		return null; // Token is invalid or expired
	}
}

/**
 * Hashes a password using Bun's native, high-performance password hashing API.
 * This is significantly faster than traditional JavaScript libraries like bcrypt.
 *
 * @param password The plain-text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string) {
	// Bun.password.hash() uses the bcrypt algorithm by default with a cost of 10.
	// It's a direct, much faster replacement for bcrypt.hash().
	return await bcrypt.hash(password, 10);
}

/**
 * Compares a plain-text password with a hash to see if they match.
 * Uses Bun's native, constant-time verification to prevent timing attacks.
 *
 * @param password The plain-text password.
 * @param hash The hash to compare against.
 * @returns A promise that resolves to true if the password matches the hash, false otherwise.
 */
export async function comparePasswords(password: string, hash: string) {
	// Bun.password.verify() is the native equivalent for bcrypt.compare().
	return await bcrypt.compare(password, hash);
}
