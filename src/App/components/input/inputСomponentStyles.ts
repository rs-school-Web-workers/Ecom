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
  .input-field {
    outline: none;
    margin-bottom: 4px;
    border: 2px solid #D9D9D9;
    padding: 12px;
    border-radius: 8px;
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-family: Satoshi;
    &.success {
      border-color: #6fcf97;
    }
    &.unsuccess {
      border-color: #ee5757;
    }
  }
  .error-message {
    color: red;
    font-size: 10px;
    padding-left: 3px;
  }
  .error {
    margin-bottom: 4px;
  }
`;
