export const styles = `
:host {
  display: flex;
  flex-direction: column;
  font-family: Satoshi;
}
.label-input {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.label-text {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.wrapper {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper-buttons {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}
.button {
  display: flex;
  padding: 0px;
  border: none;
  cursor: pointer;
  background-color: white;
}
.button[disabled] {
  opacity: 0.3;
  cursor: not-allowed;
}
.icon {
  width: 15px;
  height: 15px;
}
.input-field[disabled] {
  border-color: white;
  border-bottom: 2px solid #D9D9D9;
}
.input-field {
  outline: none;
  margin-bottom: 4px;
  border: 2px solid #D9D9D9;
  padding: 12px;
  border-radius: 8px;
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-family: Satoshi;
  color: #0b132b;
}
.input-field.success {
  border-color: #6fcf97;
}
.input-field[disabled].success {
  border-color: white;
  border-bottom: 2px solid #6fcf97;
}
.input-field.unsuccess {
  border-color: #ee5757;
}
.error-message {
  color: red;
  font-size: 10px;
  padding-left: 3px;
}
.error {
  margin-bottom: 4px;
}
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s;
}
`;
