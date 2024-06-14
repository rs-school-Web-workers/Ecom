import {
  cityValidator,
  dateOfBirthdayValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  postalCodeBelarusValidator,
  postalCodePolandValidator,
  postalCodeRussiaValidator,
  streetValidator,
  surnameValidator,
} from '../App/utils/validationsInputText';

describe('email validation functionality', () => {
  test(`validation`, async () => {
    expect(emailValidator[0].validate(' ')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(emailValidator[1].validate(' ')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(emailValidator[2].validate('asd@qwe')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(emailValidator[3].validate('asd@qwe')).not.toBeTruthy();
  });
});

describe('password validation functionality', () => {
  test(`validation`, async () => {
    expect(passwordValidator[0].validate('asd')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(passwordValidator[1].validate('ASD')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(passwordValidator[2].validate('asd')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(passwordValidator[3].validate('asd asd')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(passwordValidator[4].validate('asdasd')).not.toBeTruthy();
  });
});

describe('name validation functionality', () => {
  test(`validation`, async () => {
    expect(nameValidator[0].validate('as!@d')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(nameValidator[1].validate('AS123D')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(nameValidator[2].validate('')).not.toBeTruthy();
  });
});

describe('surname validation functionality', () => {
  test(`validation`, async () => {
    expect(surnameValidator[0].validate('as!@d')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(surnameValidator[1].validate('AS123D')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(surnameValidator[2].validate('')).not.toBeTruthy();
  });
});

describe('city validation functionality', () => {
  test(`validation`, async () => {
    expect(cityValidator[0].validate('as!@d')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(cityValidator[1].validate('AS123D')).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(cityValidator[2].validate('')).not.toBeTruthy();
  });
});

describe('street validation functionality', () => {
  test(`validation`, async () => {
    expect(streetValidator[0].validate('')).not.toBeTruthy();
  });
});

describe('date validation functionality', () => {
  test(`validation`, async () => {
    expect(dateOfBirthdayValidator[0].validate('01-01-2013')).not.toBeTruthy();
  });
});

describe('postal PL validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodePolandValidator[0].validate('123123123')).not.toBeTruthy();
  });
});

describe('postal RU validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeRussiaValidator[0].validate('123123123')).not.toBeTruthy();
  });
});

describe('postal BY validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeBelarusValidator[0].validate('123123123')).not.toBeTruthy();
  });
});
