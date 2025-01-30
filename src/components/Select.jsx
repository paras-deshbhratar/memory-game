/* eslint-disable react/prop-types */
import { data } from '../data/data';
import Option from './Option';

function Select({ handleChange }) {
  const selectEl = Object.entries(data).map(([key, value]) => (
    <div className="form__inner-wrapper" key={key}>
      <label htmlFor={key}>Select a {key}</label>
      <select name={key} id={key} onChange={handleChange}>
        <Option valueArray={value} />
      </select>
    </div>
  ));
  return <>{selectEl}</>;
}

export default Select;
