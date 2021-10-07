import { useCallback, useEffect, useState } from 'react';
import {
  drawVerticalLine,
  drawHorizontalLine,
  objectMovingObserver,
} from '../utils/aligningGuidelines';
import {
  showVerticalCenterLine,
  showHorizontalCenterLine,
  objectMovingCenterObserver,
} from '../utils/centeringGuidelines';

const useGuideLines = (
  state,
  isCanvasSet,
  canvas,
  eventState,
  eventDispatch,
  isCropMode
) => {
  const [ctx, setCtx] = useState(null);
  const [viewportTransform, setViewportTransform] = useState(null);
  const [verticalLines, setVerticalLines] = useState([]);
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [zoom, setZoom] = useState(1);

  const [canvasWidth, setCanvasWidth] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(null);
  const [canvasWidthCenterMap, setCanvasWidthCenterMap] = useState({});
  const [canvasHeightCenterMap, setCanvasHeightCenterMap] = useState({});
  const [isInVerticalCenter, setIsInVerticalCenter] = useState(null);
  const [isInHorizontalCenter, setIsInHorizontalCenter] = useState(null);

  const aligningLineOffset = 5;
  const aligningLineWidth = 1;
  const aligningLineMargin = 4;
  const centerLineMargin = 4;
  const aligningLineColor = 'rgb(111, 123, 208)';
  const centerLineWidth = 1;
  const centerLineColor = 'rgb(111, 123, 208)';

  const handleMouseDown = useCallback(() => {
    setViewportTransform(canvas.viewportTransform);
    setZoom(canvas.getZoom());
  }, [canvas]);

  const handleBeforeRender = useCallback(() => {
    canvas.clearContext(canvas.contextTop);
  }, [canvas]);

  const handleMoving = useCallback(
    (e) => {
      objectMovingObserver(
        e,
        canvas,
        viewportTransform,
        aligningLineOffset,
        setVerticalLines,
        setHorizontalLines,
        aligningLineMargin
      );
      objectMovingCenterObserver(
        e,
        canvas,
        setIsInVerticalCenter,
        setIsInHorizontalCenter,
        canvasWidthCenterMap,
        canvasHeightCenterMap,
        canvasWidth,
        canvasHeight
      );
    },
    [
      canvas,
      viewportTransform,
      canvasHeight,
      canvasHeightCenterMap,
      canvasWidth,
      canvasWidthCenterMap,
    ]
  );

  const handleAfterRender = useCallback(() => {
    for (let i = verticalLines.length; i--; ) {
      drawVerticalLine(
        verticalLines[i],
        ctx,
        aligningLineWidth,
        aligningLineColor,
        viewportTransform,
        zoom
      );
    }
    for (let i = horizontalLines.length; i--; ) {
      drawHorizontalLine(
        horizontalLines[i],
        ctx,
        aligningLineWidth,
        aligningLineColor,
        viewportTransform,
        zoom
      );
    }
    setVerticalLines([]);
    setHorizontalLines([]);
    if (isInVerticalCenter) {
      showVerticalCenterLine(
        canvasWidth / 2,
        canvasHeight,
        ctx,
        centerLineColor,
        centerLineWidth,
        viewportTransform
      );
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine(
        canvasHeight / 2,
        canvasWidth,
        ctx,
        centerLineColor,
        centerLineWidth,
        viewportTransform
      );
    }
  }, [
    ctx,
    viewportTransform,
    horizontalLines,
    verticalLines,
    zoom,
    canvasHeight,
    canvasWidth,
    isInHorizontalCenter,
    isInVerticalCenter,
  ]);

  const handleMouseUp = useCallback(() => {
    setVerticalLines([]);
    setHorizontalLines([]);
    setIsInVerticalCenter(null);
    setIsInHorizontalCenter(null);
    canvas.requestRenderAll();
  }, [canvas]);

  const initGuideLines = useCallback(() => {
    setCtx(canvas.getSelectionContext());
    setCanvasWidth(canvas.getWidth() / canvas.getZoom());
    setCanvasHeight(canvas.getHeight() / canvas.getZoom());
    let widthMap = {};
    let heightMap = {};
    for (
      let i = canvasWidth / 2 - centerLineMargin,
        len = canvasWidth / 2 + centerLineMargin;
      i <= len;
      i++
    ) {
      widthMap[Math.round(i)] = true;
    }
    for (
      let i = canvasHeight / 2 - centerLineMargin,
        len = canvasHeight / 2 + centerLineMargin;
      i <= len;
      i++
    ) {
      heightMap[Math.round(i)] = true;
    }
    setCanvasWidthCenterMap(widthMap);
    setCanvasHeightCenterMap(heightMap);
  }, [canvasHeight, canvasWidth, canvas]);

  const removelistneres = useCallback((canvas) => {
    canvas.off('mouse:down');
    canvas.off('object:moving');
    canvas.off('before:render');
    canvas.off('after:render');
    canvas.off('mouse:up');
  }, []);

  useEffect(() => {
    if (isCanvasSet) {
      initGuideLines();
    }
  }, [state.shouldUpdateCanvasSize, isCanvasSet, initGuideLines]);

  useEffect(() => {
    if (isCanvasSet && ctx && !isCropMode) {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('object:moving', (e) => {
        if (eventDispatch && !eventState.isMoving) {
          eventDispatch({ type: 'setIsMoving', data: true });
        }
        handleMoving(e);
      });
      canvas.on('before:render', handleBeforeRender);
      canvas.on('after:render', handleAfterRender);
      canvas.on('mouse:up', (e) => {
        if (eventDispatch && e.button === 3) {
          eventDispatch({ type: 'setRightClickEvent', data: e });
          e.e.preventDefault();
        }
        handleMouseUp(e);
      });
    } else if (isCropMode) removelistneres(canvas);
    return () => {
      if (isCanvasSet && ctx) removelistneres(canvas);
    };
  }, [
    eventState,
    eventDispatch,
    state.shouldUpdateCanvasSize,
    isCropMode,
    removelistneres,
    isCanvasSet,
    ctx,
    canvas,
    handleMouseUp,
    handleAfterRender,
    handleMoving,
    handleBeforeRender,
    handleMouseDown,
  ]);
};

export default useGuideLines;
