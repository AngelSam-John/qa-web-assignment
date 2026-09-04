import { users } from '../js/users.js';

export type Credentials = {
  readonly email: string;
  readonly password: string;
};

export const validUsers: readonly Credentials[] = users;

const primaryUser = validUsers[0];
const secondaryUser = validUsers[1];

if (!primaryUser || !secondaryUser) {
  throw new Error('At least two valid users are required.');
}

export const PRIMARY_USER = primaryUser;
const SECONDARY_USER = secondaryUser;

export type InvalidLoginCase = Credentials & {
  readonly name: string;
  readonly expectedMessage: string;
};

export const LOGIN_ERROR_MESSAGE =
  'Invalid email or password. Please try again.';

const OVERLONG_VALUE = 'a'.repeat(1000);

export const invalidLoginCases: readonly InvalidLoginCase[] = [
  {
    name: 'an unknown email address',
    email: 'invalid@gmail.com',
    password: PRIMARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'a known email with the wrong password',
    email: PRIMARY_USER.email,
    password: 'incorrect-password',
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'both email and password wrong',
    email: 'invalid@gmail.com',
    password: 'incorrect-password',
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: "one account's email with another account's password",
    email: PRIMARY_USER.email,
    password: SECONDARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'empty email and empty password',
    email: '',
    password: '',
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'empty email with a valid password',
    email: '',
    password: PRIMARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'valid email with empty password',
    email: PRIMARY_USER.email,
    password: '',
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'a valid email padded with whitespace',
    email: `  ${PRIMARY_USER.email}  `,
    password: PRIMARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'a valid email in a different letter case',
    email: PRIMARY_USER.email.toUpperCase(),
    password: PRIMARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'a malformed email address',
    email: 'not-an-email',
    password: PRIMARY_USER.password,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'credentials containing 1000-character values',
    email: `${OVERLONG_VALUE}@example.com`,
    password: OVERLONG_VALUE,
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'a SQL-like injection string',
    email: "' OR '1'='1",
    password: "' OR '1'='1",
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
  {
    name: 'an XSS-style input',
    email: '<script>alert(1)</script>',
    password: '!@#$%^&*()',
    expectedMessage: LOGIN_ERROR_MESSAGE,
  },
];