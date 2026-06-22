import * as yup from 'yup';

export const startupSchema = yup.object({
  startup_name: yup
    .string()
    .max(100, 'Startup name must be at most 100 characters')
    .required('Startup name is required'),
  logo: yup
    .string()
    .url('Please upload a valid logo')
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  industry: yup.string().required('Industry is required'),
  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  funding_stage: yup.string().required('Funding stage is required'),
  team_size: yup
    .number()
    .typeError('Team size must be a number')
    .min(1, 'Team size must be at least 1')
    .integer('Team size must be a whole number')
    .required('Team size is required'),
  website: yup
    .string()
    .url('Please enter a valid website URL')
    .nullable()
    .transform((v) => (v === '' ? null : v)),
});
