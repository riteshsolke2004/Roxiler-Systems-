const { z } = require('zod');

// Password regex rules: min 8, max 16, 1 uppercase, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\-_=+\\\/\[\]]).{8,16}$/;

const nameSchema = z
  .string({ required_error: 'Name is required' })
  .min(20, { message: 'Name must be at least 20 characters long' })
  .max(60, { message: 'Name must not exceed 60 characters' })
  .trim();

const addressSchema = z
  .string({ required_error: 'Address is required' })
  .min(1, { message: 'Address is required' })
  .max(400, { message: 'Address must not exceed 400 characters' })
  .trim();

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Password must not exceed 16 characters' })
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>\-_=+\\\/\[\]]/.test(val), {
    message: 'Password must contain at least one special character',
  });

const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email({ message: 'Must be a valid standard email format' })
  .trim();

const roleEnum = z.enum(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'], {
  errorMap: () => ({ message: 'Role must be SYSTEM_ADMIN, NORMAL_USER, or STORE_OWNER' }),
});

// Registration Schema
const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

// Login Schema
const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
});

// Change Password Schema
const changePasswordSchema = z.object({
  oldPassword: z.string({ required_error: 'Current password is required' }),
  newPassword: passwordSchema,
});

// Admin Create User Schema
const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: roleEnum,
});

// Admin Create Store Schema
const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string({ required_error: 'Store Owner ID is required' }).uuid({ message: 'Invalid Store Owner ID' }),
});

// Submit/Update Rating Schema
const ratingSchema = z.object({
  rating: z
    .number({ required_error: 'Rating is required' })
    .int({ message: 'Rating must be an integer' })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must not exceed 5' }),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  createUserSchema,
  createStoreSchema,
  ratingSchema,
  passwordRegex,
};
