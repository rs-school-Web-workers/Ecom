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
import {
  BelarusPostalCodeValidateTrueValue,
  PolandPostalCodeValidateValue,
  RussiaPostalCodeValidateTrueValue,
  dateValidateValues,
  emailValidateValues,
  emptySpaceValidateValue,
  emptyValidateValue,
  nameValidateFalseValues,
  nameValidateTrueValue,
  passwordTrueValues,
  passwordValidateFalseValues,
  postalCodeValidateFalseValue,
} from './types';

describe('email validation functionality', () => {
  test(`validation`, async () => {
    expect(emailValidator[0].validate(emptySpaceValidateValue)).not.toBeTruthy();
  });
  test(`validation`, async () => {
    expect(emailValidator[1].validate(emptySpaceValidateValue)).not.toBeTruthy();
  });
  emailValidateValues.forEach((value) => {
    test(`validation`, async () => {
      expect(emailValidator[2].validate(value.value)).toBe(value.expected);
    });
    test(`validation`, async () => {
      expect(emailValidator[3].validate(value.value)).toBe(value.expected);
    });
  });
});

describe('password validation functionality', () => {
  passwordValidateFalseValues.forEach((password, index) => {
    test(`validation`, async () => {
      expect(passwordValidator[index].validate(password)).not.toBeTruthy();
    });
  });
  passwordTrueValues.forEach((password) => {
    for (let i = 0; i < 4; i++) {
      test(`validation`, async () => {
        expect(passwordValidator[i].validate(password)).toBeTruthy();
      });
    }
  });
});

describe('name validation functionality', () => {
  nameValidateFalseValues.forEach((name, index) => {
    test(`validation`, async () => {
      expect(nameValidator[index].validate(name)).not.toBeTruthy();
    });
    test(`validation`, async () => {
      expect(cityValidator[index].validate(nameValidateTrueValue)).toBeTruthy();
    });
  });
});

describe('surname validation functionality', () => {
  nameValidateFalseValues.forEach((surname, index) => {
    test(`validation`, async () => {
      expect(surnameValidator[index].validate(surname)).not.toBeTruthy();
    });
    test(`validation`, async () => {
      expect(cityValidator[index].validate(nameValidateTrueValue)).toBeTruthy();
    });
  });
});

describe('city validation functionality', () => {
  nameValidateFalseValues.forEach((city, index) => {
    test(`validation`, async () => {
      expect(cityValidator[index].validate(city)).not.toBeTruthy();
    });
    test(`validation`, async () => {
      expect(cityValidator[index].validate(nameValidateTrueValue)).toBeTruthy();
    });
  });
});

describe('street validation functionality', () => {
  test(`validation`, async () => {
    expect(streetValidator[0].validate(emptyValidateValue)).not.toBeTruthy();
  });
});

describe('date validation functionality', () => {
  dateValidateValues.forEach((date) => {
    test(`validation`, async () => {
      expect(dateOfBirthdayValidator[0].validate(date.value)).toBe(date.expected);
    });
  });
});

describe('postal PL validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodePolandValidator[0].validate(postalCodeValidateFalseValue)).not.toBeTruthy();
  });
});

describe('postal PL validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodePolandValidator[0].validate(PolandPostalCodeValidateValue)).toBeTruthy();
  });
});

describe('postal RU validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeRussiaValidator[0].validate(postalCodeValidateFalseValue)).not.toBeTruthy();
  });
});

describe('postal RU validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeRussiaValidator[0].validate(RussiaPostalCodeValidateTrueValue)).toBeTruthy();
  });
});

describe('postal BY validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeBelarusValidator[0].validate(postalCodeValidateFalseValue)).not.toBeTruthy();
  });
});

describe('postal BY validation functionality', () => {
  test(`validation`, async () => {
    expect(postalCodeBelarusValidator[0].validate(BelarusPostalCodeValidateTrueValue)).toBeTruthy();
  });
});
