import { errors as errorsHelper } from 'Helpers/Errors';

const ZipcodeValidation = (zipcode) => {
  const errors = {};
  const saoPauloZipcode = /^[01][0-9]{7}$/gm;

  if (!saoPauloZipcode.test(zipcode)) {
    errors.message = errorsHelper('zipcode_not_from_sao_paulo');
  }
  window.console.log('ERRORS ->', errors);
  return errors;
};

export default ZipcodeValidation;
