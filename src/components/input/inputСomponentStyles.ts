export const styles = `
:host {
  display: flex;
  flex-direction: column;
  width: 250px;
    .input-field {
      outline: none;
      margin-bottom: 4px;
      border: 2px solid;
      padding: 8px;
      border-radius: 8px;
      font-size: 16px;
      &.success {
        border-color: #6fcf97;
      }
      &.unsuccess {
        border-color: #ee5757;
      }
    }
    .error-message {
      color: red;
      font-size: 8px;
      padding-left: 3px;
    }
    .error {
      margin-bottom: 4px;
    }
}
`;
