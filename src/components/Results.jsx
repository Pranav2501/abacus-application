// src/components/Results.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Results = () => {
  const { state } = useLocation();
  const { completedProblems } = state;

  return (
    <div>
      <h2>Results</h2>
      <ul>
        {completedProblems.map((p, index) => (
          <li key={index}>
            Problem {index + 1}:  {p.correctAnswer} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
