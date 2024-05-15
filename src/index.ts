import { createInputView, createInputCntrl } from './components/input/inputComponent';
const validations = [
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
const inputElement = createInputView('email', ['email'], validations);
const elem = createInputCntrl('email', validations);
console.log(inputElement, elem);
document.body.append(inputElement, elem);
