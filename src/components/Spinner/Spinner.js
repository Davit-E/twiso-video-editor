import React from 'react';
import './Spinner.css';

const Spinner = ({ style }) => {
  return (
    <div className='spinner'>
      <div className='loader' style={style}>
        Loading...
      </div>
    </div>
  );
};

export default Spinner;
