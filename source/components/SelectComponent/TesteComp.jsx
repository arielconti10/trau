import React from 'react';
import ReactSelectize from 'react-selectize';

function TesteComp() {
  return (
    <ReactSelectize.SimpleSelect placeholder="Select a fruit">
      <option value="apple">apple</option>
      <option value="mango">mango</option>
      <option value="orange">orange</option>
      <option value="banana">banana</option>
    </ReactSelectize.SimpleSelect>);
}

export default TesteComp;
