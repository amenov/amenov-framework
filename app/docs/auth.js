// SIGN-UP
exports.signUp = {
  description: 'Регистрация',
  bodyUI: true,
  body: {
    email: {
      type: 'string',
      required: true,
      value: 'user@domain.zone'
    },

    password: {
      type: 'string',
      required: true,
      value: 'some-password'
    },
    passwordConfirm: {
      type: 'string',
      required: true,
      value: 'some-password'
    }
  }
}

// SIGN-IN
exports.signIn = {
  description: 'Авторизация',
  bodyUI: true,
  body: {
    email: {
      type: 'string',
      required: true,
      value: 'admin@domain.zone'
    },
    password: {
      type: 'string',
      required: true,
      value: 'change-me'
    }
  }
}
