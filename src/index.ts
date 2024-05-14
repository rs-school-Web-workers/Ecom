import { createInputView } from './components/input/inputComponent';
const validations = [
  {
    validate: `(value) => ${/^\S+@\S+\.\S+$/}.test(value.trim())`,
    message: 'Invalid email address format',
  },
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
];
const inputElement = createInputView('email', ['email'], validations);
console.log(inputElement);
document.body.append(inputElement);
