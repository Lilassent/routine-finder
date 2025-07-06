import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start.jsx';
import Question from './pages/Question.jsx';
import Results from './pages/Results.jsx';
import { QuestionContext } from './context/QuestionContext.jsx';
import { questions as importedQuestions } from './data/questions.js';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setQuestions(importedQuestions);
  }, []);

  function updateAnswer(questionId, answer) {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }

  if (questions.length === 0) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <QuestionContext.Provider value={{ questions, answers, updateAnswer }}>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/question/:id" element={<Question />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </QuestionContext.Provider>
  );
}
