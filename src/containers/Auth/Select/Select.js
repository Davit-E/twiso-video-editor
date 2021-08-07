import React, { useState } from 'react';
import styles from './Select.module.css';
import downArrow from '../../../assets/auth/downArrow.svg';
import Dropdown from './Dropdown/Dropdown';

const Select = ({ options, invalid, value, setValue, errorMessage }) => {
  const [isDropdown, setIsDropdown] = useState(null);

  const clickHandler = () => {
    if (invalid) setValue((prevState) => ({ ...prevState, invalid: false }));
    setIsDropdown(true);
  };

  return (
    <div className={styles.SelectContainer}>
      <div
        className={[styles.Select, invalid ? styles.Invalid : null].join(' ')}
        onClick={clickHandler}
      >
        <p
          className={[
            styles.Selected,
            value.id !== 'placeholder' ? styles.Valid : null,
          ].join(' ')}
        >
          {value.type}
        </p>
        <img src={downArrow} alt='arrow' />
        {isDropdown ? (
          <Dropdown
            options={options}
            value={value}
            setValue={setValue}
            setIsDropdown={setIsDropdown}
          />
        ) : null}
      </div>
      {invalid ? (
        <div className={styles.ErrorMessage}>{errorMessage}</div>
      ) : null}
    </div>
  );
};

export default Select;
