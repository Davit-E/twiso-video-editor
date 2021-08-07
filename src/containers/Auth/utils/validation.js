export const checkEmailValidity = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};