import { createInputView } from './components/input/inputView';
const inputElement = createInputView('password', ['password']);
console.log(inputElement);
document.body.append(inputElement);
