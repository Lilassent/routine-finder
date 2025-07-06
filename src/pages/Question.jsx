import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionContext } from '../context/QuestionContext.jsx';
import '../styles/Question.css';
import arrow from '../assets/arrow.png';

export default function Question() {
  const { questions, answers, updateAnswer } = useContext(QuestionContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const questionId = Number(id);
  const index = questions.findIndex(q => q.id === questionId);
  const question = questions[index];

  const isMultiple = question.multiple;

  if (!question) {
    return <div className="question-wrapper">Question not found.</div>;
  }

  function handleSelect(option) {
    const updated = {
      ...answers,
      [question.id]: question.multiple
        ? [...(answers[question.id] || [])].includes(option)
          ? answers[question.id].filter(o => o !== option)
          : [...(answers[question.id] || []), option]
        : option,
    };
    updateAnswer(question.id, updated[question.id]);
    localStorage.setItem('userAnswers', JSON.stringify(updated));
  }

  function handleNext() {
    if (index + 1 < questions.length) {
      navigate(`/question/${questions[index + 1].id}`);
    } else {
      navigate('/results');
    }
  }

  function handleBack() {
    if (index > 0) {
      navigate(`/question/${questions[index - 1].id}`);
    } else {
      navigate('/');
    }
  }

  const isSelected = (option) => {
    const currentAnswer = answers[question.id];
    return isMultiple
      ? Array.isArray(currentAnswer) && currentAnswer.includes(option)
      : currentAnswer === option;
  };

  return (
    <div className="question-wrapper">
      <div className="question-layout">
        <div className="question-content">
          <h2 className="question-title">{question.question}</h2>

          <div className="question-options">
            {question.options.map((option, i) => (
              <button
                key={option}
                className={`option-button ${isSelected(option) ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {String.fromCharCode(97 + i)}. {option}
              </button>
            ))}
          </div>

          <div className="question-navigation">
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <button className="next-button" onClick={handleNext}>
              Next question
              <img src={arrow} alt="arrow" className="next-arrow" />
            </button>
          </div>
        </div>

        <div className="question-progress">
          <svg width="101" height="101" className="progress-ring">
            <g transform="rotate(-90 50.5 50.5)">
              <circle className="ring-bg" cx="50.5" cy="50.5" r="45" />
              <circle
                className="ring"
                cx="50.5"
                cy="50.5"
                r="45"
                style={{
                  strokeDashoffset:
                    2 * Math.PI * 45 * (1 - (index + 1) / questions.length),
                }}
              />
            </g>
            <text x="50.5" y="55" textAnchor="middle" className="ring-text">
              {`${index + 1}/${questions.length}`}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
