import React from 'react';
import './Spinner.css';

const Spinner = ({ size }) => {
  return (
    <div className='spinner'>
      <div className='loader' style={size}>
        Loading...
      </div>
    </div>
  );
};

export default Spinner;
