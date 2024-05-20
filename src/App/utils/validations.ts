export const email = [
  {
    validate: "(value) => !value.includes(' ')",
    message: 'Email address cannot contain spaces',
  },
  {
    validate: "(value) => value.indexOf('@') !== -1",
    message: "Email address must contain '@' symbol",
  },
  {
    validate: "(value) => value.split('@').length === 2 && value.split('@')[1].includes('.')",
    message: 'Email address must contain a valid domain',
  },
  {
    validate: `(value) => ${/^\S+@\S+\.\S+$/}.test(value.trim())`,
    message: 'Invalid email address format',
  },
];

export const password = [
  {
    validate: "(value) => !value.includes(' ')",
    message: 'Password cannot contain spaces',
  },
  {
    validate: '(value) => value.length > 2',
    message: 'Password must be at least 3 characters',
  },
];
