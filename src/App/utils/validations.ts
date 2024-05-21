export const emailValidator = [
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

export const passwordValidator = [
  {
    validate: '(value) => /[A-ZА-ЯЁ]/.test(value)',
    message: 'Password must contain at least 1 uppercase letter',
  },
  {
    validate: '(value) => /[a-zа-яё]/.test(value)',
    message: 'Password must contain at least 1 lowercase letter',
  },
  {
    validate: '(value) => /[0-9]/.test(value)',
    message: 'Password must contain at least 1 number',
  },
  {
    validate: "(value) => !value.includes(' ')",
    message: 'Password cannot contain spaces',
  },
  {
    validate: '(value) => value.length >= 8',
    message: 'Password must be at least 8 characters long',
  },
];

export const nameValidator = [
  {
    validate: `(value) => !${/[!"#$%&'()*+\-\\,.:;<=>?@^_``{|}~]/}.test(value)`,
    message: 'Name cannot contain special characters',
  },
  {
    validate: `(value) => !/[0-9]/.test(value)`,
    message: 'Name cannot contain numbers',
  },
  {
    validate: `(value) => ${/[А-Яа-яЁёa-zA-Z]+/}.test(value)`,
    message: 'Name must contain at least one letter',
  },
];
export const surnameValidator = [
  {
    validate: `(value) => !${/[!"#$%&'()*+\-\\,.:;<=>?@^_``{|}~]/}.test(value)`,
    message: 'Surname cannot contain special characters',
  },
  {
    validate: `(value) => !/[0-9]/.test(value)`,
    message: 'Surname cannot contain numbers',
  },
  {
    validate: `(value) => ${/[А-Яа-яЁёa-zA-Z]+/}.test(value)`,
    message: 'Surame must contain at least one letter',
  },
];
export const cityValidator = [
  {
    validate: `(value) => !${/[!"#$%&'()*+\-\\,.:;<=>?@^_``{|}~]/}.test(value)`,
    message: 'City cannot contain special characters',
  },
  {
    validate: `(value) => !/[0-9]/.test(value)`,
    message: 'City cannot contain numbers',
  },
  {
    validate: `(value) => ${/[А-Яа-яЁёa-zA-Z]+/}.test(value)`,
    message: 'City must contain at least one letter',
  },
];
export const streetValidator = [
  {
    validate: '(value) => value.length > 0',
    message: 'Street must contain at least one character',
  },
];
export const dateOfBirthdayValidator = [
  {
    validate: `(value) => {
      const today = new Date();
      let reverseValue = value.replaceAll('.', '-').split('-').reverse().join('-')
      const birthDate = new Date(reverseValue);
      const minAgeLimit = 13;

      let age = today.getFullYear() - birthDate.getFullYear();

      if (today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
          age--;
      }

      return age >= minAgeLimit;
    }`,
    message: 'Must be over 13 years old',
  },
];
export const postalCodePolandValidator = [
  {
    validate: `(value) => ${/^\d{2}-\d{3}$/}.test(value)`,
    message: 'Must follow the format for the Poland(XX-XXX)',
  },
];
export const postalCodeRussiaValidator = [
  {
    validate: `(value) => ${/^\d{6}$/}.test(value)`,
    message: `Must follow the format for the Russia(XXXXXX) `,
  },
];
export const postalCodeBelarusValidator = [
  {
    validate: `(value) => ${/^\d{6}$/}.test(value)`,
    message: `Must follow the format for the Belarus(XXXXXX)`,
  },
];
