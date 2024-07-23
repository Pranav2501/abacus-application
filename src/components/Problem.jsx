// src/components/Problem.jsx
import React, { useEffect, useState } from 'react';

const Problem = ({ problem, duration, speechSpeed, delay, onComplete }) => {
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [problemComplete, setProblemComplete] = useState(false);

  useEffect(() => {
    const speak = (text, onEndCallback) => {
      console.log(`Speaking: ${text}`);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechSpeed; // Set the speech speed
      utterance.onend = onEndCallback;
      speechSynthesis.speak(utterance);
    };

    if (problem.length > 0 && currentDigitIndex === 0 && !problemComplete) {
      setTimeout(() => {
        speak("New problem", () => {
          speak(problem[currentDigitIndex], () => {
            setCurrentDigitIndex((prevIndex) => prevIndex + 1);
          });
        });
      }, 1000); // 1-second delay before speaking "New problem"
    } else if (problem.length > 0 && currentDigitIndex > 0 && currentDigitIndex < problem.length && !problemComplete) {
      speak(problem[currentDigitIndex], () => {
        setTimeout(() => {
          setCurrentDigitIndex((prevIndex) => prevIndex + 1);
        }, duration); // Delay for the duration between digits
      });
    } else if (problemComplete && currentDigitIndex >= problem.length) {
      const timer = setTimeout(() => {
        speak("answer", onComplete);
      }, 1000); // 1-second delay before speaking "answer"
      return () => clearTimeout(timer);
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, [currentDigitIndex, problem, duration, speechSpeed, problemComplete, onComplete, delay]);

  useEffect(() => {
    if (currentDigitIndex === problem.length) {
      setProblemComplete(true);
    }
  }, [currentDigitIndex, problem.length]);

  useEffect(() => {
    setCurrentDigitIndex(0);
    setProblemComplete(false);
  }, [problem]);

  return (
    <div style={styles.container}>
      <h3 style={styles.digit}>{problemComplete ? '?' : problem[currentDigitIndex]}</h3>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  digit: {
    fontSize: '50vh', // Adjust the font size to be large but manageable
    margin: 0,
  },
};

export default Problem;
