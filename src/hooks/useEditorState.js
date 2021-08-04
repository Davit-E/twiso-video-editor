import { useReducer } from 'react';

const initialState = {
  canvasState: {
    initialWidth: 0,
    initialHeight: 0,
    width: 0,
    height: 0,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  shouldUpdateCanvas: false,
  shouldUpdateCanvasSize: false,
  shapeToAdd: null,
  imageToAdd: null,
  currentCoords: null,
  showToolbar: false,
  shapeState: {
    fill: 'rgba(196,196,196,1)',
    stroke: 'rgba(255,255,255,1)',
    strokeWidth: 0,
    rx: 0,
    ry: 0,
  },
  imageState: {
    cornerRadius: 0,
    isSvg: false,
  },
  isSubtitles: false,
  isCropMode: false,
  shouldCropImage: false,
  isImageDropdown: false,
  isSubtitlesDropdown: false,
  isShapeDropdown: false,
  isResizeDropdown: false,
  isCanvasBgColorDropdown: false,
  isDownloadDropdown: false,
  shouldAddText: false,
  shouldUpdateText: false,
  shouldUpdateSubtitles: false,
  shouldUpdateShape: false,
  shouldUpdateImage: false,
  shouldReplaceImage: false,
  currentObject: {
    type: '',
    object: null,
  },
  textState: {
    fontFamily: 'Inter',
    fontStyle: 'Normal',
    fontWeight: 'Normal',
    fontSize: 30,
    fill: 'rgba(0,0,0,1)',
    textAlign: 'left',
  },
  subtitlesState: {
    fontFamily: 'Inter',
    fontStyle: 'Normal',
    fontWeight: 'Normal',
    fontSize: 24,
    fill: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(255,255,255,1)',
    initialBackground: 'rgba(255,255,255,1)',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCanvasState':
      return { ...state, canvasState: action.data };
    case 'setIsDownloadDropdown':
      return { ...state, isDownloadDropdown: action.data };
    case 'setIsSubtitles':
      return { ...state, isSubtitles: action.data, isSubtitlesDropdown: false };
    case 'setIsCropMode':
      return { ...state, isCropMode: action.data };
    case 'setShouldCropImage':
      return { ...state, shouldCropImage: action.data };
    case 'setIsImageDropdown':
      return { ...state, isImageDropdown: action.data };
    case 'setIsSubtitlesDropdown':
      return { ...state, isSubtitlesDropdown: action.data };
    case 'setIsShapeDropdown':
      return { ...state, isShapeDropdown: action.data };
    case 'setIsResizeDropdown':
      return { ...state, isResizeDropdown: action.data };
    case 'setIsCanvasBgColorDropdown':
      return { ...state, isCanvasBgColorDropdown: action.data };
    case 'setCurrentCoords':
      return { ...state, currentCoords: action.data };
    case 'setShowToolbar':
      return { ...state, showToolbar: action.data };
    case 'setShowCanvasToolbar':
      return { ...state, showCanvasToolbar: action.data };
    case 'setShouldAddText':
      return { ...state, shouldAddText: action.data };
    case 'setShouldUpdateText':
      return { ...state, shouldUpdateText: action.data };
    case 'setShouldUpdateSubtitles':
      return { ...state, shouldUpdateSubtitles: action.data };
    case 'setShouldUpdateShape':
      return { ...state, shouldUpdateShape: action.data };
    case 'setShouldUpdateImage':
      return { ...state, shouldUpdateImage: action.data };
    case 'setShouldUpdateCanvas':
      return { ...state, shouldUpdateCanvas: action.data };
    case 'setShouldUpdateCanvasSize':
      return { ...state, shouldUpdateCanvasSize: action.data };
    case 'setCurrentObject':
      return { ...state, currentObject: action.data };
    case 'setShapeToAdd':
      return { ...state, shapeToAdd: action.data, isShapeDropdown: false };
    case 'setImageToAdd':
      return { ...state, imageToAdd: action.data, isImageDropdown: false };
    case 'setShapeState':
      return { ...state, shapeState: { ...action.data } };
    case 'setImageState':
      return { ...state, imageState: { ...action.data } };
    case 'setTextState':
      return { ...state, textState: { ...action.data } };
    case 'setSubtitlesState':
      return { ...state, subtitlesState: { ...action.data } };
    case 'setShouldReplaceImage':
      return { ...state, shouldReplaceImage: action.data };
    case 'setCanvasBackgroundColor':
      return {
        ...state,
        shouldUpdateCanvas: true,
        canvasState: {
          ...state.canvasState,
          backgroundColor: action.data,
        },
      };
    case 'setCanvasSize':
      return {
        ...state,
        shouldUpdateCanvasSize: true,
        canvasState: {
          ...state.canvasState,
          width: action.data.width,
          height: action.data.height,
        },
      };
    case 'setCanvasInitialSize':
      return {
        ...state,
        canvasState: {
          ...state.canvasState,
          initialWidth: action.data.initialWidth,
          initialHeight: action.data.initialHeight,
          width: action.data.width,
          height: action.data.height,
        },
      };
    case 'setImageCornerRadius':
      return {
        ...state,
        shouldUpdateImage: true,
        imageState: {
          ...state.imageState,
          cornerRadius: action.data,
        },
      };
    case 'setShapeRadius':
      return {
        ...state,
        shouldUpdateShape: true,
        shapeState: {
          ...state.shapeState,
          rx: action.data,
          ry: action.data,
        },
      };
    case 'setShapeFill':
      return {
        ...state,
        shouldUpdateShape: true,
        shapeState: {
          ...state.shapeState,
          fill: action.data,
        },
      };
    case 'setShapeStroke':
      return {
        ...state,
        shouldUpdateShape: true,
        shapeState: {
          ...state.shapeState,
          stroke: action.data,
        },
      };
    case 'setShapeStrokeWidth':
      return {
        ...state,
        shouldUpdateShape: true,
        shapeState: {
          ...state.shapeState,
          strokeWidth: action.data,
        },
      };

    case 'setFontFamily':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          fontFamily: action.data,
        },
      };
    case 'setFontStyle':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          fontStyle: action.data,
        },
      };
    case 'setFontWeight':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          fontWeight: action.data,
        },
      };
    case 'setFontSize':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          fontSize: action.data,
        },
      };
    case 'setTextFill':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          fill: action.data,
        },
      };
    case 'setTextAlign':
      return {
        ...state,
        shouldUpdateText: true,
        textState: {
          ...state.textState,
          textAlign: action.data,
        },
      };

    case 'setSubtitlesbackgroundColor':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          backgroundColor: action.data,
        },
      };
    case 'setSubtitlesFontFamily':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          fontFamily: action.data,
        },
      };
    case 'setSubtitlesFontStyle':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          fontStyle: action.data,
        },
      };
    case 'setSubtitlesFontWeight':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          fontWeight: action.data,
        },
      };
    case 'setSubtitlesFontSize':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          fontSize: action.data,
        },
      };
    case 'setSubtitlesTextFill':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          fill: action.data,
        },
      };
    case 'setSubtitlesTextAlign':
      return {
        ...state,
        shouldUpdateSubtitles: true,
        subtitlesState: {
          ...state.subtitlesState,
          textAlign: action.data,
        },
      };

    default:
      return state;
  }
};

const useEditorState = () => {
  const [editorState, editorDispatch] = useReducer(reducer, initialState);
  return [editorState, editorDispatch];
};

export default useEditorState;
