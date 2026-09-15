"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { APTITUDE_QUESTIONS } from "@/lib/data/aptitude-questions";
import { CODING_QUESTIONS } from "@/lib/data/coding-questions";

type InterviewType = "aptitude" | "coding" | null;
type InterviewState = "select" | "setup" | "question" | "results";

interface UserAnswer {
  questionId: number;
  selectedOption?: number;
  isCorrect?: boolean;
}

export default function MockInterviewPage() {
  const [state, setState] = useState<InterviewState>("select");
  const [interviewType, setInterviewType] = useState<InterviewType>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(1);

  // Timer effect
  useEffect(() => {
    if (!isStarted || timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isStarted]);

  // Handle time up
  useEffect(() => {
    if (isStarted && timeLeft === 0 && state === "question") {
      handleTimeUp();
    }
  }, [timeLeft]);

  const handleSelectInterview = (type: "aptitude" | "coding") => {
    setInterviewType(type);
    setState("setup");
  };

  const handleStartInterview = () => {
    const selectedQuestions =
      interviewType === "aptitude"
        ? APTITUDE_QUESTIONS.slice(0, numQuestions)
        : CODING_QUESTIONS.slice(0, numQuestions);

    setQuestions(selectedQuestions);
    setTimeLeft(numQuestions * timePerQuestion * 60);
    setIsStarted(true);
    setState("question");
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correct;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      isCorrect
    };

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setUserAnswers(updatedAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      // Interview finished
      setState("results");
      setIsStarted(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleTimeUp = () => {
    setState("results");
    setIsStarted(false);
  };

  const calculateScore = () => {
    if (interviewType === "aptitude") {
      const correct = userAnswers.filter((ans) => ans.isCorrect).length;
      return Math.round((correct / userAnswers.length) * 100);
    }
    // For coding, just count attempted
    return Math.round((userAnswers.length / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SELECT STATE
  if (state === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎯 Mock Interview
            </h1>
            <p className="text-slate-300 text-lg">
              Prepare for technical interviews with aptitude and coding questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Aptitude Card */}
            <button
              onClick={() => handleSelectInterview("aptitude")}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left"
            >
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Aptitude Test
              </h2>
              <p className="text-blue-100 mb-6">
                Test your logical reasoning, quantitative skills, and verbal
                abilities
              </p>
              <div className="space-y-2 text-sm text-blue-200 mb-6">
                <p>✓ 30 Questions</p>
                <p>✓ Logical Reasoning</p>
                <p>✓ Quantitative</p>
                <p>✓ Verbal Ability</p>
              </div>
              <div className="inline-block bg-white text-blue-600 px-6 py-2 rounded font-semibold">
                Start Test →
              </div>
            </button>

            {/* Coding Card */}
            <button
              onClick={() => handleSelectInterview("coding")}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left"
            >
              <div className="text-4xl mb-4">💻</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Coding Questions
              </h2>
              <p className="text-purple-100 mb-6">
                Solve top 150 LeetCode questions across all categories
              </p>
              <div className="space-y-2 text-sm text-purple-200 mb-6">
                <p>✓ 150 Questions</p>
                <p>✓ Array/Strings</p>
                <p>✓ Trees & Graphs</p>
                <p>✓ DP & Algorithms</p>
              </div>
              <div className="inline-block bg-white text-purple-600 px-6 py-2 rounded font-semibold">
                Start Test →
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transitional"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SETUP STATE
  if (state === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-8">
              {interviewType === "aptitude"
                ? "📚 Aptitude Test Setup"
                : "💻 Coding Test Setup"}
            </h1>

            <div className="space-y-6">
              {/* Number of Questions */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Number of Questions
                </label>
                <input
                  type="range"
                  min="5"
                  max={interviewType === "aptitude" ? "30" : "150"}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-slate-300 mt-2 text-lg font-semibold">
                  {numQuestions} Questions
                </p>
              </div>

              {/* Time Per Question */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Time Per Question (Minutes)
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3, 5].map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimePerQuestion(time)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        timePerQuestion === time
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 mt-8">
                <h3 className="text-white font-semibold mb-3">Test Summary</h3>
                <div className="space-y-2 text-slate-300">
                  <p>
                    <span className="font-semibold text-white">Questions:</span>{" "}
                    {numQuestions}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      Total Time:
                    </span>{" "}
                    {numQuestions * timePerQuestion} minutes
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setState("select")}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleStartInterview}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION STATE
  if (state === "question" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestionIndex];
    const isAptitude = interviewType === "aptitude";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Timer */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">Progress</p>
                <p className="text-white text-xl font-bold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm">Time Remaining</p>
                <p
                  className={`text-3xl font-bold ${
                    timeLeft < 300 ? "text-red-500" : "text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Category</p>
                <p className="text-white text-lg font-semibold">
                  {currentQuestion.category}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">
                {isAptitude ? "📝" : "💻"}
              </span>
              {!isAptitude && (
                <span className="px-3 py-1 bg-yellow-900/50 text-yellow-200 rounded-full text-sm font-semibold">
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              {currentQuestion.question || currentQuestion.title}
            </h2>

            {!isAptitude && currentQuestion.description && (
              <p className="text-slate-300 mb-6 bg-slate-700/50 p-4 rounded">
                {currentQuestion.description}
              </p>
            )}

            {!isAptitude && currentQuestion.examples && (
              <div className="mb-6 bg-slate-900 border border-slate-700 rounded p-4">
                <h3 className="text-white font-semibold mb-2">Examples:</h3>
                <div className="space-y-2">
                  {currentQuestion.examples.map((ex: string, idx: number) => (
                    <p key={idx} className="text-slate-300 text-sm font-mono">
                      {ex}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {!isAptitude && currentQuestion.hints && (
              <div className="mb-6 bg-blue-900/20 border border-blue-700/50 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">💡 Hints:</h3>
                <ul className="space-y-1">
                  {currentQuestion.hints.map((hint: string, idx: number) => (
                    <li key={idx} className="text-blue-200 text-sm">
                      • {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Options/Answers */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                    currentAnswer?.selectedOption === idx
                      ? idx === currentQuestion.correct
                        ? "bg-green-900/50 border-2 border-green-500 text-green-100"
                        : "bg-red-900/50 border-2 border-red-500 text-red-100"
                      : idx === currentQuestion.correct && showExplanation
                        ? "bg-green-900/50 border-2 border-green-500 text-green-100"
                        : "bg-slate-700 border-2 border-slate-600 text-slate-200 hover:bg-slate-600"
                  } ${showExplanation ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                >
                  <span className="mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📖 Explanation</h3>
                <p className="text-blue-200">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              ← Previous
            </button>

            {!showExplanation && (
              <button
                onClick={() => setShowExplanation(true)}
                className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
              >
                Skip & Show Explanation
              </button>
            )}

            {showExplanation && (
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish Test"
                  : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS STATE
  if (state === "results") {
    const correctCount = userAnswers.filter((ans) => ans.isCorrect).length;
    const score = calculateScore();
    const percentage = Math.round(
      (userAnswers.filter((ans) => ans.isCorrect).length / userAnswers.length) *
        100
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SiteNavbar />
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-lg p-8 mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Test Completed! ✅
            </h1>
            <p className="text-green-200 text-lg mb-6">
              Great effort! Here are your results:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Score</p>
                <p className="text-4xl font-bold text-green-400">{percentage}%</p>
              </div>
              {interviewType === "aptitude" && (
                <div className="bg-slate-800/80 rounded-lg p-6">
                  <p className="text-slate-400 text-sm mb-2">Correct Answers</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {correctCount}/{userAnswers.length}
                  </p>
                </div>
              )}
              <div className="bg-slate-800/80 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Questions Attempted</p>
                <p className="text-4xl font-bold text-purple-400">
                  {userAnswers.length}/{questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Performance Summary</h2>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const answer = userAnswers[idx];
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      answer?.isCorrect
                        ? "bg-green-900/20 border-l-green-500"
                        : answer
                          ? "bg-red-900/20 border-l-red-500"
                          : "bg-slate-700/50 border-l-slate-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-semibold">
                          Q{idx + 1}. {q.question || q.title}
                        </p>
                        {answer && (
                          <p className="text-sm mt-2">
                            <span
                              className={
                                answer.isCorrect
                                  ? "text-green-300"
                                  : "text-red-300"
                              }
                            >
                              Your Answer:{" "}
                              {String.fromCharCode(65 + answer.selectedOption!)}
                            </span>
                          </p>
                        )}
                        {!answer && (
                          <p className="text-sm text-slate-400 mt-2">
                            Not answered
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        {answer?.isCorrect && (
                          <span className="text-2xl">✅</span>
                        )}
                        {answer && !answer.isCorrect && (
                          <span className="text-2xl">❌</span>
                        )}
                        {!answer && (
                          <span className="text-xl text-slate-500">⊘</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setState("select");
                setInterviewType(null);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setShowExplanation(false);
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Take Another Interview
            </button>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-semibold text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
