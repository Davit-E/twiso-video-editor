import { useState, useEffect, useRef } from 'react';

const useSingleAndDoubleClick = (onSingleClick, onDoubleClick, ref) => {
  const [clickCount, setClickCount] = useState(0);
  const isMounted = useRef(false);
  const timerRef = useRef(null);

  const clickHandler = (e) => {
    if (e.target.id === 'controls') setClickCount((prevSatate) => prevSatate + 1);
  };

  useEffect(() => {
    if (clickCount === 1) {
      timerRef.current = setTimeout(() => {
        if (isMounted.current) {
          setClickCount(0);
          onSingleClick();
        }
      }, 300);
    } else if (clickCount > 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setClickCount(0);
      onDoubleClick();
    }
  }, [clickCount, onSingleClick, onDoubleClick]);

  useEffect(() => {
    let target = ref.current;
    target.addEventListener('click', clickHandler);
    return () => target.removeEventListener('click', clickHandler);
  }, [ref]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
};

export default useSingleAndDoubleClick;
