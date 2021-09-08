export const handleInputChange = (val, min, max, ref) => {
  ref.current.style.backgroundSize =
    ((val - min) * 100) / (max - min) + '% 100%';
};
