"use client";

import { useState, useEffect } from "react";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface AptitudeQuizProps {
  onBack: () => void;
}

export function AptitudeQuiz({ onBack }: AptitudeQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/api/aptitude-quiz");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load questions");
        }

        setQuestions(data.data);
        setSelectedAnswers(new Array(data.data.length).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  if (loading) {
    return (
      <section className="section-pad flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[var(--primary)]"></div>
          <p className="text-slate-600">Loading aptitude quiz...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          <button
            onClick={onBack}
            className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            ← Back
          </button>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-heading text-lg font-bold text-red-900">Error</h2>
            <p className="mt-2 text-red-700">{error}</p>
            <button
              onClick={onBack}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Back to Prep
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (questions.length === 0) {
    return (
      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          <p className="text-slate-600">No questions available.</p>
          <button
            onClick={onBack}
            className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Prep
          </button>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answered = selectedAnswers[currentIndex] !== null;
  const score = selectedAnswers.reduce<number>((count, answer, idx) => {
    if (answer === null) return count;
    return answer === questions[idx].correctAnswer ? count + 1 : count;
  }, 0);
  const percentage = Math.round((score / questions.length) * 100);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  if (showResults) {
    return (
      <section className="section-pad">
        <div className="container-shell max-w-2xl">
          <button
            onClick={onBack}
            className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            ← Back to Prep
          </button>

          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 p-8">
              <h2 className="font-heading text-3xl font-bold text-slate-950">Quiz Complete!</h2>

              <div className="mt-8 flex items-center gap-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[var(--primary)]">{percentage}%</div>
                  <p className="mt-2 text-sm text-slate-600">Score</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-slate-950">
                    {score} out of {questions.length}
                  </p>
                  <p className="mt-1 text-slate-600">questions answered correctly</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-[var(--primary)]"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-slate-950">Review Your Answers</h3>
              {questions.map((question, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isAnswerCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-950">
                          {idx + 1}. {question.question}
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold text-slate-600">Your answer:</p>
                          <p className={`text-sm ${isAnswerCorrect ? "text-emerald-700" : "text-red-700"}`}>
                            {userAnswer !== null ? question.options[userAnswer] : "Not answered"}
                          </p>
                        </div>
                        {!isAnswerCorrect && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-semibold text-slate-600">Correct answer:</p>
                            <p className="text-sm text-emerald-700">{question.options[question.correctAnswer]}</p>
                          </div>
                        )}
                        <div className="mt-3 rounded bg-slate-50 p-3">
                          <p className="text-xs font-semibold text-slate-600">Explanation:</p>
                          <p className="mt-1 text-sm text-slate-700">{question.explanation}</p>
                        </div>
                      </div>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${isAnswerCorrect ? "bg-emerald-600" : "bg-red-600"}`}>
                        {isAnswerCorrect ? "✓" : "✗"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="pill flex-1 border border-[var(--line)] bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBack}
                className="pill flex-1 bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:brightness-110"
              >
                Back to Prep
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="container-shell max-w-2xl">
        <button
          onClick={onBack}
          className="inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          ← Back to Prep
        </button>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-slate-600">
                {answered ? "Answered" : "Not answered"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-6">
            <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </div>

            <h2 className="mt-4 font-heading text-2xl font-bold text-slate-950">
              {currentQuestion.question}
            </h2>

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isOpt = selectedAnswers[currentIndex] === optIdx;
                const correct = optIdx === currentQuestion.correctAnswer;
                const answerShow = answered || selectedAnswers[currentIndex] !== null;
                
                let btnStyle = "border-slate-200";
                if (!answerShow && isOpt) btnStyle = "border-[var(--primary)] bg-blue-50";
                else if (answerShow && isOpt && correct) btnStyle = "border-emerald-500 bg-emerald-50";
                else if (answerShow && isOpt && !correct) btnStyle = "border-red-500 bg-red-50";
                else if (answerShow && correct) btnStyle = "border-emerald-500 bg-emerald-50";

                let circleStyle = "border-slate-300";
                if (!answerShow && isOpt) circleStyle = "border-[var(--primary)] bg-[var(--primary)] text-white";
                else if (answerShow && isOpt && correct) circleStyle = "border-emerald-500 bg-emerald-500 text-white";
                else if (answerShow && isOpt && !correct) circleStyle = "border-red-500 bg-red-500 text-white";
                else if (answerShow && correct) circleStyle = "border-emerald-500 bg-emerald-500 text-white";

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 font-semibold ${circleStyle}`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1 text-slate-900">{option}</span>
                      {answerShow && correct && <span className="text-lg">✓</span>}
                      {answerShow && isOpt && !correct && <span className="text-lg">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-900">Explanation</p>
                <p className="mt-2 text-sm text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="pill flex-1 border border-[var(--line)] bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!answered}
              className="pill flex-1 bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Questions</p>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {selectedAnswers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-8 w-8 items-center justify-center rounded text-xs font-semibold ${
                    idx === currentIndex
                      ? "bg-[var(--primary)] text-white"
                      : answer === null
                      ? "border border-slate-300 text-slate-600"
                      : answer === questions[idx].correctAnswer
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
