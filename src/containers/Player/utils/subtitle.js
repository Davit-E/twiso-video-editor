import { fabric } from 'fabric';

export const newSubtitle = (canvas, state) => {
  let zoom = canvas.getZoom();
  let canvasWidth = canvas.getWidth() / zoom;
  let canvasHeight = canvas.getHeight() / zoom;
  let width = 550 < canvasWidth / 2 ? 550 : canvasWidth / 2;
  let subtitle = new fabric.SubtitleWithResize(' ', {
    width,
    paddingX: 20,
    paddingY: 20,
    breakWords: true,
    // bgCornerRadius: 5,
    editable: false,
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
    ...state.subtitlesState,
    id: 'subtitle',
    excludeFromExport: true,
    prevTop: null,
    prevLeft: null,
    visible: false,
  });
  subtitle.left = canvasWidth / 2;
  subtitle.top = canvasHeight - subtitle.height - subtitle.paddingY;
  return subtitle;
};

export const displaySub = (fabricSub, currentSub) => {
  if (currentSub.val.silence) fabricSub.visible = false;
  else if (currentSub.val.active) {
    let text = '';
    for (let i = 0; i < currentSub.val.words.length; i++) {
      let word = currentSub.val.words[i];
      text += word.text;
    }
    fabricSub.set({ text, visible: true });
  }
};