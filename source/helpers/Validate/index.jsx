function validateCpf(cpfString) {
  const cpf = cpfString.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 ||
   cpf === '00000000000' ||
   cpf === '11111111111' ||
   cpf === '22222222222' ||
   cpf === '33333333333' ||
   cpf === '44444444444' ||
   cpf === '55555555555' ||
   cpf === '66666666666' ||
   cpf === '77777777777' ||
   cpf === '88888888888' ||
   cpf === '99999999999') {
    return false;
  }
  let add = 0;
  for (let i = 0; i < 9; i += 1) {
    add += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9), 10)) {
    return false;
  }
  add = 0;
  for (let i = 0; i < 10; i += 1) {
    add += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(10), 10)) {
    return false;
  }
  return true;
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'O campo de nome é obrigatório.';
  }
  if (!values.username) {
    errors.username = 'O campo de email é obrigatório.';
  } else if (values.username && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
    errors.username = 'O email digitado é ínvalido.';
  }
  if (!values.cpf) {
    errors.cpf = 'O campo de CPF é obrigatório.';
  } else if (values.cpf.length !== 11) {
    errors.cpf = 'O campo de CPF deve conter 11 caracteres.';
  } else if (!validateCpf(values.cpf)) {
    errors.cpf = 'O CPF é inválido.';
  }
  if (!values.cel_phone) {
    errors.cel_phone = 'O campo de Telefone é obrigatório.';
  }
  if (!values.password) {
    errors.password = 'O campo de senha é obrigatório.';
  }
  if (!values.confirmpassword) {
    errors.confirmpassword = 'O campo de confirmação de senha é obrigatório.';
  }
  if (values.password !== values.confirmpassword) {
    errors.confirmpassword = 'Senhas informadas são diferentes.';
  }
  return errors;
};

export default validate;
