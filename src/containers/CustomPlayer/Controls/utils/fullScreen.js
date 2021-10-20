const openFullScreen = (el) => {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
};

const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

export const fullScreenHanlder = (container, video, className) => {
  if (!document.fullscreenElement) {
    openFullScreen(container);
    if (video) video.classList.add(className);
  } else {
    closeFullscreen();
    if (video) video.classList.remove(className);
  }
};
