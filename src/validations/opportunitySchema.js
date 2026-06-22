import * as yup from 'yup';

export const opportunitySchema = yup.object({
  role_title: yup
    .string()
    .max(100, 'Role title must be at most 100 characters')
    .required('Role title is required'),
  required_skills: yup
    .array()
    .of(yup.string())
    .min(1, 'Please add at least one required skill')
    .required('Required skills are needed'),
  work_type: yup
    .string()
    .oneOf(['Remote', 'On-site', 'Hybrid'], 'Please select a work type')
    .required('Work type is required'),
  commitment_level: yup
    .string()
    .oneOf(
      ['Full-time', 'Part-time', 'Contract', 'Internship'],
      'Please select a commitment level'
    )
    .required('Commitment level is required'),
  deadline: yup
    .date()
    .typeError('Please select a valid date')
    .min(new Date(), 'Deadline must be a future date')
    .required('Deadline is required'),
  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  responsibilities: yup
    .array()
    .of(yup.string())
    .default([])
    .notRequired(),
});

export const applicationSchema = yup.object({
  portfolio_link: yup
    .string()
    .url('Please enter a valid portfolio URL')
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  motivation: yup
    .string()
    .max(1000, 'Motivation must be at most 1000 characters')
    .required('Motivation is required'),
});
