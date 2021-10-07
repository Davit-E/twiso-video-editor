export const getContainerSize = (
  containerRef,
  setContainerSize,
  containerPadding
) => {
  let width =
    window.innerWidth - containerRef.current.offsetLeft - containerPadding;
  let height = containerRef.current.offsetHeight;
  if (width > 800) {
    height = (height * 800) / width;
    width = 800;
  }
  setContainerSize({ width, height });
};

export const getVideoSize = (videoRef, setVideoSize) => {
  let width = videoRef.current.videoWidth;
  let height = videoRef.current.videoHeight;
  setVideoSize({ width, height });
};