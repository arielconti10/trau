const validate = (values) => {
  const errors = {};
  const passwordValue = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/gm;


  if (!passwordValue.test(values.password)) {
    errors.password = 'A senha é inválida, ela deve conter 8 caracteres com letras maiúsculas, minúsculas e números.';
  } else {
    errors.password = null;
  }
  if (!values.password) {
    errors.password = 'O campo de senha é obrigatório.';
  }
  if (!values.passwordRepeat) {
    errors.passwordRepeat = 'O campo de confirmação de senha é obrigatório.';
  }
  if (values.password !== values.passwordRepeat) {
    errors.passwordRepeat = 'Senhas informadas são diferentes.';
  }
  return errors;
};

export default validate;
