export const loginErrorMessage =
  'Invalid email or password. Please try again.';

const longValue = 'a'.repeat(1000);

export const invalidLoginCases = [
  {
    name: 'invalid email',
    email: 'invalid@gmail.com',
    password: '2020',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'invalid password',
    email: 'admin@admin.com',
    password: 'incorrect-password',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'invalid email and password',
    email: 'invalid@gmail.com',
    password: 'incorrect-password',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'empty email and password',
    email: '',
    password: '',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'empty email',
    email: '',
    password: '2020',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'empty password',
    email: 'admin@admin.com',
    password: '',
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'unusually long credentials',
    email: `${longValue}@example.com`,
    password: longValue,
    expectedMessage: loginErrorMessage,
  },
  {
    name: 'special characters',
    email: '<script>alert(1)</script>',
    password: '!@#$%^&*()',
    expectedMessage: loginErrorMessage,
  },
] as const;