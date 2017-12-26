const normalizeCEP = (value) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  if (onlyNums.length >= 8) {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 8)}`;
  }
  return onlyNums;
};

export default normalizeCEP;
