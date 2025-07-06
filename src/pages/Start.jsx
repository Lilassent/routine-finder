import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionContext } from '../context/QuestionContext.jsx';
import '../styles/Start.css';
import bgImage from '../assets/fon-first-page.png';

export default function Start() {
  const navigate = useNavigate();
  const { questions } = useContext(QuestionContext);

  if (!questions || questions.length === 0) {
    return <div style={{ padding: '2rem' }}>Loading questions...</div>;
  }

  function handleStart() {
    navigate(`/question/${questions[0].id}`);
  }

  return (
    <div className="start-wrapper">
      <div
        className="top-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <div className="start-content">
            <h1>
              Build a self care routine <br /> suitable for you
            </h1>
            <p>
              Take out test to get a personalised self care routine based on
              your needs.
            </p>
            <button onClick={handleStart}>Start the quiz</button>
          </div>
        </div>
      </div>
      <div className="bottom-section"></div>
    </div>
  );
}
