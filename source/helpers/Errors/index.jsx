const errors = (values) => {
  switch (values) {
    case 'EMAIL_TAKEN':
      return 'Email já cadastrado';
    case 'CPF_TAKEN':
      return 'CPF já cadastrado';
    case 'email.already_exists':
      return 'Email já cadastrado';
    case 'name.invalid_value':
      return 'O nome é inválido, deve conter nome e sobrenome';
    case 'cpf.already_exists':
      return 'CPF já cadastrado';
    case 'password.invalid_value':
      return 'A senha é inválida, ela deve conter 8 caracteres com letras e numeros.';
    case 'zipcode_not_from_sao_paulo':
      return 'CEP fora da área de cobertura. Atualmente as lojas na Lua operam apenas no estado de São Paulo.';
    case 'resettoken.invalid_value':
      return 'Seu link de redefinição de senha expirou.';
    case 'cpf.required_field':
      return '';
    default:
      break;
  }
  return values;
};

export default errors;
