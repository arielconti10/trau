const validate = (address) => {
  const errors = {};
  if (address.name === undefined || address.name.length === 0) {
    errors.name = 'O campo de Nome é obrigatório.';
  }
  if (address.complement === undefined || address.complement.length === 0) {
    errors.complement = 'O campo de Complemento é obrigatório.';
  }
  if (address.city === undefined || address.city.length === 0) {
    errors.city = 'O campo de Cidade é obrigatório.';
  }
  if (address.number === undefined || address.number.length === 0) {
    errors.number = 'O campo de Número é obrigatório.';
  }
  if (address.cep === undefined || address.cep.length === 0) {
    errors.cep = 'O campo de CEP é obrigatório.';
  }
  if (address.address === undefined || address.address.length === 0) {
    errors.address = 'O campo de Endereço é obrigatório.';
  }
  if (address.neighborhood === undefined || address.neighborhood.length === 0) {
    errors.neighborhood = 'O campo de Bairro é obrigatório.';
  }
  if (address.telephone === undefined || address.telephone.length === 0) {
    errors.telephone = 'O campo de Telefone é obrigatório.';
  }
  return errors;
};

export default validate;
