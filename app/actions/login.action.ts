'use server';

import { signIn } from '@/lib/server/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authenticate(formData: {
  email: string;
  password: string;
}) {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: 'Invalid fields',
        success: false,
      };
    }

    const { email, password } = validatedFields.data;

    // Attempt sign in
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials',
            success: false,
          };
        default:
          return {
            error: 'Something went wrong',
            success: false,
          };
      }
    }

    return {
      error: 'Something went wrong',
      success: false,
    };
  }
}
