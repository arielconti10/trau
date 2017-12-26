const normalizePhone = (value) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  if (onlyNums.length === 11) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 7)}-${onlyNums.slice(7)}`;
  }
  if (onlyNums.length === 10) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 6)}-${onlyNums.slice(6)}`;
  }
  if (onlyNums.length === 9) {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`;
  }
  if (onlyNums.length === 8) {
    return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
  }
  return onlyNums;
};

export default normalizePhone;
