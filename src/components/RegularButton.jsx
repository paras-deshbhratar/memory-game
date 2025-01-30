/* eslint-disable react/prop-types */
export default function RegularButton({ children, handleClick }) {
  return (
    <button type="button" className="btn btn--text" onClick={handleClick}>
      {children}
    </button>
  );
}
