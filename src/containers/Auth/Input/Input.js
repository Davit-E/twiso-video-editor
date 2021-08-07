import React from 'react';
import styles from './Input.module.css';

const Input = ({
  placeholder,
  type,
  invalid,
  setValue,
  value,
  errorMessage,
}) => {
  const blurHandler = () => {
    let isEmpty = value.trim() === '';
    if (invalid && !isEmpty)
      setValue((prevState) => ({ ...prevState, invalid: false }));
  };
  
  const focusHandler = () => {
    if (invalid) setValue((prevState) => ({ ...prevState, value: '' }));
  };

  return (
    <div className={styles.InputContainer}>
      <input
        className={[styles.Input, invalid ? styles.Invalid : null].join(' ')}
        placeholder={placeholder}
        type={type}
        value={value}
        onBlur={blurHandler}
        onFocus={focusHandler}
        onChange={(e) =>
          setValue((prevState) => ({ ...prevState, value: e.target.value }))
        }
      ></input>
      {invalid ? (
        <div className={styles.ErrorMessage}>{errorMessage}</div>
      ) : null}
    </div>
  );
};

export default Input;
