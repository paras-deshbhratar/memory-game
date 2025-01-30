/* eslint-disable react/prop-types */
import RegularButton from './RegularButton';
import { useEffect, useRef } from 'react';

function GameOver({ handleClick }) {
  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.focus();
  }, []);
  return (
    <div className="wrapper wrapper--accent" ref={divRef} tabIndex={-1}>
      <p className="p--large">Congratulations!</p>
      <p className="p--large">You have matched all the memory cards!</p>
      <RegularButton handleClick={handleClick}>Play again</RegularButton>
    </div>
  );
}
export default GameOver;
