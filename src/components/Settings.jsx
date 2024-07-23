// src/components/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [type1, setType1] = useState(false);
  const [type2, setType2] = useState(false);
  const [type3, setType3] = useState(false);
  const [type4, setType4] = useState(false);
  const [type5, setType5] = useState(false);
  const [includeNegatives, setIncludeNegatives] = useState(false);
  const [rows, setRows] = useState(1);
  const [problems, setProblems] = useState(1);
  const [duration, setDuration] = useState(1000); // Default duration between numbers
  const [speechSpeed, setSpeechSpeed] = useState(1); // Default speech speed
  const [delay, setDelay] = useState(2000); // Default delay before moving to the next problem

  const navigate = useNavigate();

  const startTest = () => {
    const types = [];
    if (type1) types.push(1);
    if (type2) types.push(2);
    if (type3) types.push(3);
    if (type4) types.push(4);
    if (type5) types.push(5);
    navigate('/test', { state: { types, rows, problems, duration, includeNegatives, speechSpeed, delay } });
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input type="checkbox" checked={type1} onChange={() => setType1(!type1)} />
        1-digit
      </label>
      <label>
        <input type="checkbox" checked={type2} onChange={() => setType2(!type2)} />
        2-digit
      </label>
      <label>
        <input type="checkbox" checked={type3} onChange={() => setType3(!type3)} />
        3-digit
      </label>
      <label>
        <input type="checkbox" checked={type4} onChange={() => setType4(!type4)} />
        4-digit
      </label>
      <label>
        <input type="checkbox" checked={type5} onChange={() => setType5(!type5)} />
        5-digit
      </label>
      <label>
        <input type="checkbox" checked={includeNegatives} onChange={() => setIncludeNegatives(!includeNegatives)} />
        Include negative numbers
      </label>
      <label>
        Rows per problem:
        <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} />
      </label>
      <label>
        Problems per test:
        <input type="number" value={problems} onChange={(e) => setProblems(Number(e.target.value))} />
      </label>
      <label>
        Duration per digit (ms):
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
      </label>
      <label>
        Speech speed (0.5 to 2):
        <input type="number" value={speechSpeed} min="0.5" max="2" step="0.1" onChange={(e) => setSpeechSpeed(Number(e.target.value))} />
      </label>
      <label>
        Delay before next problem (ms):
        <input type="number" value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
      </label>
      <button onClick={startTest}>Start Test</button>
    </div>
  );
};

export default Settings;
