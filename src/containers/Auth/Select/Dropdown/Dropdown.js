import React, { useEffect, useCallback } from 'react';
import styles from './Dropdown.module.css';
import checkMark from '../../../../assets/auth/checkMark.svg';

const Dropdown = ({ options, value, setValue, setIsDropdown }) => {
  const clickHandler = useCallback(() => setIsDropdown(false), [setIsDropdown]);

  useEffect(() => {
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [clickHandler]);

  return (
    <ul className={styles.Dropdown}>
      {options.map((option) => {
        let isCurrent = value && value.id === option.id;
        return (
          <li
            key={option.id}
            id={option.id}
            className={[styles.Option, isCurrent ? styles.Current : null].join(
              ' '
            )}
            onClick={() => setValue((prevState) => ({ ...prevState, value: option }))}
          >
            <span className={styles.CheckMark}>
              {isCurrent ? <img src={checkMark} alt='check mark' /> : null}
            </span>

            {option.type}
          </li>
        );
      })}
    </ul>
  );
};

export default Dropdown;
