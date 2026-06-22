import * as yup from 'yup';

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#^()_-]{6,}$/;

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  image: yup.string().url('Please upload a valid profile image').nullable(),
  password: yup
    .string()
    .matches(passwordRules, {
      message:
        'Password must contain at least 6 characters, 1 uppercase, 1 lowercase and 1 number',
    })
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['founder', 'collaborator'], 'Please select a role')
    .required('Role is required'),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  bio: yup.string().max(500, 'Bio must be at most 500 characters'),
  skills: yup
    .array()
    .of(yup.string())
    .max(20, 'You can add at most 20 skills'),
  portfolio: yup
    .string()
    .url('Please enter a valid URL')
    .nullable()
    .transform((v) => (v === '' ? null : v)),
});
