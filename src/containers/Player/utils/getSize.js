export const getContainerSize = (containerRef, containerPadding) => {
  let containerWidth =
    window.innerWidth - containerRef.current.offsetLeft - containerPadding;
  let containerHeight = containerRef.current.offsetHeight;
  if (containerWidth > 800) {
    containerHeight = (containerHeight * 800) / containerWidth;
    containerWidth = 800;
  }
  return { containerWidth, containerHeight };
};
