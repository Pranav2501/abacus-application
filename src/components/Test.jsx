// src/components/Test.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import Problem from './Problem';

const Test = () => {
  const { state } = useLocation();
  const { types, rows, problems, duration, includeNegatives, speechSpeed, delay } = state;
  const [currentProblem, setCurrentProblem] = useState(0);
  const [completedProblems, setCompletedProblems] = useState([]);
  const [lastProblem, setLastProblem] = useState(null);
  const navigate = useNavigate();

  const generateNumber = (type, currentTotal) => {
    let number;
    do {
      number = Math.floor(Math.random() * (Math.pow(10, type) - 1)) + 1; // Ensure no zeroes
      if (includeNegatives && Math.random() > 0.5) {
        number = -number;
      }
    } while (currentTotal + number < 0);
    return number;
  };

  const generateProblem = () => {
    let problem;
    do {
      let currentTotal = 0;
      problem = Array.from({ length: rows }, () => {
        const type = types[Math.floor(Math.random() * types.length)];
        const number = generateNumber(type, currentTotal);
        currentTotal += number;
        return number;
      });
    } while (
      lastProblem && 
      problem.join('') === lastProblem.join('')
    );
    setLastProblem(problem);
    return problem;
  };

  useEffect(() => {
    console.log(`Current Problem: ${currentProblem}`);
    if (currentProblem < problems && !completedProblems[currentProblem]) {
      const problem = generateProblem();
      setCompletedProblems((prevProblems) => [...prevProblems, { problem, correctAnswer: null }]);
    }
  }, [currentProblem, problems, completedProblems]);

  const handleNextProblem = () => {
    setCompletedProblems((prevCompletedProblems) => {
      const correctAnswer = prevCompletedProblems[currentProblem].problem.reduce((acc, val) => acc + val, 0);
      const updatedCompletedProblems = [...prevCompletedProblems];
      updatedCompletedProblems[currentProblem].correctAnswer = correctAnswer;
      return updatedCompletedProblems;
    });
    setCurrentProblem((prevCurrent) => prevCurrent + 1);
  };

  const handleFinishTest = () => {
    navigate('/results', { state: { completedProblems } });
  };

  useEffect(() => {
    console.log('Completed Problems:', completedProblems);
  }, [completedProblems]);

  useEffect(() => {
    console.log(`Current Problem: ${currentProblem}`);
  }, [currentProblem]);

  if (currentProblem >= problems) {
    return (
      <div>
        <h2>Test Completed</h2>
        <button onClick={handleFinishTest}>Finish Test</button>
      </div>
    );
  }

  return (
    <div>
      {completedProblems[currentProblem] && (
        <Problem
          key={currentProblem} // Ensuring Problem component re-renders with new problem
          problem={completedProblems[currentProblem].problem}
          duration={duration}
          speechSpeed={speechSpeed}
          delay={delay}
          onComplete={handleNextProblem}
        />
      )}
    </div>
  );
};

export default Test;
