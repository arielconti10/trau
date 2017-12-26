import React from 'react';
import ReactSelectize from 'react-selectize';
import './SelectColor.css';

function SelectColor() {
  function randomColor() {
    const color = [0, 0, 0].map(() => Math.floor(Math.random() * 255));
    color.push(Math.floor(Math.random() * 10) / 10);
    return `rgba(${color.join(',')})`;
  }
  const options = [];
  options.push({ label: randomColor(), value: randomColor() },
  { label: randomColor(), value: randomColor() },
  { label: randomColor(), value: randomColor() },
  { label: randomColor(), value: randomColor() });

  return (
    <div className="col-md-12 example">
      <label htmlFor="select" className="label">
          React-selectize multiselect with dismissable tags
      </label>
      <ReactSelectize.SimpleSelect
        name="select"
        options={options}
        placeholder="Selecione a cor"
        renderOption={item => (
          <div className="simple-option" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ backgroundColor: item.label, borderRadius: '50%', width: 24, height: 24 }} />
            <div style={{ marginLeft: 10 }}>{!item.newOption ? `Add ${item.label} ...` : item.label}</div>
          </div>
          )
        }
        renderValue={item => (
          <div className="simple-value">
            <span style={{ backgroundColor: item.label, borderRadius: '50%', verticalAlign: 'middle', width: 24, height: 24 }} />
            <span style={{ marginLeft: 10, verticalAlign: 'middle' }}>{item.label}</span>
          </div>
          )
        }
      />
    </div>
  );
}

export default SelectColor;
