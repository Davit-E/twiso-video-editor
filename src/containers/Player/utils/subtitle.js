import { fabric } from 'fabric';

export const newSubtitle = (canvas, state) => {
  let subtitle = new fabric.SubtitleWithResize(' ', {
    paddingX: 20,
    paddingY: 20,
    width: 550,
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
  let x = canvas.getWidth() / (canvas.getZoom() * 2);
  let y =
    canvas.getHeight() / canvas.getZoom() - subtitle.height - subtitle.paddingY;
  subtitle.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
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