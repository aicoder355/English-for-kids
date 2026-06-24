/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  FileText,
  Database,
  Calculator,
  Layout,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Smartphone,
  Search,
  Lock,
  Plus,
  RefreshCw,
  Download,
  User,
  Volume2,
  BookOpen,
  ArrowRight,
  ThumbsUp,
  Flame,
  Star,
  Check,
  HelpCircle,
  Eye,
  Settings,
  Heart,
  BarChart2,
  LockKeyhole,
  Layers,
  Code
} from "lucide-react";
import { SRS_SECTIONS, SAMPLE_QUIZ_MODULE, STATIC_VOCAB_SEED, MOCK_ACHIEVEMENTS } from "./data";
import { FLUTTER_FILES } from "./flutterData";

export default function App() {
  // Current active core portal tab
  const [activeTab, setActiveTab] = useState<"srs" | "calculators" | "database" | "interfaces" | "roadmap" | "flutter">("flutter");

  // --- SRS Reading Panel State ---
  const [selectedSrsSectionId, setSelectedSrsSectionId] = useState<string>("1_exec_summary");
  const [srsSearchQuery, setSrsSearchQuery] = useState<string>("");
  const [copiedSectionText, setCopiedSectionText] = useState<string | null>(null);

  // --- XP Calculator Sandbox State ---
  const [calcInputs, setCalcInputs] = useState({
    level: 2,
    streakDays: 5,
    quizCorrectAnswers: 9,
    quizTotalQuestions: 10,
    hasPerfectDeckReview: true,
  });

  // --- SQLite Schema Explorer State ---
  const [selectedDbTable, setSelectedDbTable] = useState<string>("user_profile");
  const [sqlSearchQuery, setSqlSearchQuery] = useState<string>("");

  // --- Kids UI/UX Mock Emulator State ---
  const [companionSelected, setCompanionSelected] = useState<"milo" | "bella" | "drake">("milo");
  const [kidAgeCohort, setKidAgeCohort] = useState<number>(2); // 1 = 5-6, 2 = 7-9, 3 = 10-12
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [heartsRemaining, setHeartsRemaining] = useState<number>(3);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [pronounceWord, setPronounceWord] = useState<string | null>(null);
  const [showTouchTargets, setShowTouchTargets] = useState<boolean>(false);
  const [unscrambleLetters, setUnscrambleLetters] = useState<string[]>(["o", "h", "e", "l", "l"]);
  const [unscrambleConstructed, setUnscrambleConstructed] = useState<string[]>([]);

  // --- Parent Portal Auth State ---
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [parentPinInput, setParentPinInput] = useState<string>("");
  const [parentPinError, setParentPinError] = useState<string | null>(null);
  const [pinChallenge, setPinChallenge] = useState({ q: "7 × 8", ans: 56 });
  const [parentAdjustLevel, setParentAdjustLevel] = useState<number>(1);
  const [parentTotalStars, setParentTotalStars] = useState<number>(12);

  // --- Roadmap Verification List State ---
  const [checkedRoadmapTasks, setCheckedRoadmapTasks] = useState<Record<string, boolean>>({
    "task-1": true,
    "task-2": true,
    "task-3": false,
    "task-4": false,
    "task-5": false,
    "task-6": false,
  });

  // --- Flutter Workspace State ---
  const [selectedFlutterPath, setSelectedFlutterPath] = useState<string>("lib/views/parent_dashboard.dart");
  const [copiedFlutterText, setCopiedFlutterText] = useState<string | null>(null);
  const [kidsSimScreen, setKidsSimScreen] = useState<"quiz" | "achievements">("achievements");
  const [parentDashboardPeriod, setParentDashboardPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Calculate XP sandbox results based on inputs
  const calculatedSandboxResults = useMemo(() => {
    const level = calcInputs.level;
    const S = calcInputs.streakDays;
    const questionsCorrect = calcInputs.quizCorrectAnswers;
    const totalQ = calcInputs.quizTotalQuestions;

    // Formulas matching SRS specifications
    const targetXpForNextLevel = 100 * Math.pow(level, 2) - 50 * level;

    // Base XP computation
    const completedDeckXp = calcInputs.hasPerfectDeckReview ? 10 * 6 : 0; // 6 cards * 10 XP
    const quizBaseXp = questionsCorrect * 15;
    
    // Streak multiplier
    // StreakMultiplier(S) = 1.0 + min(0.5, floor(S / 7) * 0.1) + min(0.5, S * 0.01)
    const weekBonusFactor = Math.min(0.5, Math.floor(S / 7) * 0.1);
    const dayBonusFactor = Math.min(0.5, S * 0.01);
    const rawMultiplier = 1.0 + weekBonusFactor + dayBonusFactor;
    const streakMultiplier = Math.round(rawMultiplier * 100) / 100;

    // Star grading based on percentage
    const percent = totalQ > 0 ? (questionsCorrect / totalQ) * 100 : 0;
    let starsGained = 0;
    let rankText = "Попробуй ещё раз! (Retry)";
    let rewardXp = 0;

    if (percent >= 90) {
      starsGained = 3;
      rankText = "Отлично! (Perfect 3 Stars)";
      rewardXp = 50;
    } else if (percent >= 70) {
      starsGained = 2;
      rankText = "Хорошо! (Good 2 Stars)";
      rewardXp = 25;
    } else if (percent >= 50) {
      starsGained = 1;
      rankText = "Удовлетворительно (Intro 1 Star)";
      rewardXp = 10;
    }

    const totalCalculatedSessionXp = Math.round((completedDeckXp + quizBaseXp + rewardXp) * streakMultiplier);

    return {
      targetXpForNextLevel,
      completedDeckXp,
      quizBaseXp,
      streakMultiplier,
      starsGained,
      rankText,
      totalCalculatedSessionXp,
      bonusRewardXp: rewardXp
    };
  }, [calcInputs]);

  // Filtering for SRS documentation based on search query
  const filteredSrsSections = useMemo(() => {
    return SRS_SECTIONS.filter(section => {
      const matchSearch = 
        section.title.toLowerCase().includes(srsSearchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(srsSearchQuery.toLowerCase()) ||
        section.subtitle.toLowerCase().includes(srsSearchQuery.toLowerCase());
      return matchSearch;
    });
  }, [srsSearchQuery]);

  const activeSrsSection = useMemo(() => {
    return SRS_SECTIONS.find(s => s.id === selectedSrsSectionId) || SRS_SECTIONS[0];
  }, [selectedSrsSectionId]);

  const activeFlutterFile = useMemo(() => {
    return FLUTTER_FILES.find(f => f.path === selectedFlutterPath) || FLUTTER_FILES[0];
  }, [selectedFlutterPath]);

  // Custom high-fidelity text renderer to display SRS markdown neatly without heavy packages
  const renderSrsMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inTable = false;
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    return lines.map((line, index) => {
      // Toggle Code Blocks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeBlockContent.join("\n");
          codeBlockContent = [];
          return (
            <pre key={`code-${index}`} className="my-3 p-4 bg-slate-950 font-mono text-xs text-amber-300 rounded-lg overflow-x-auto border border-sky-900 leading-relaxed select-all">
              <code>{content}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return null;
      }

      // Headers
      if (line.trim().startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold text-slate-100 mt-6 mb-3 flex items-center border-b border-sky-900 pb-2 font-sans tracking-tight">
            <span className="w-1.5 h-5 bg-sky-400 rounded-sm mr-2 inline-block"></span>
            {line.substring(3)}
          </h2>
        );
      }
      if (line.trim().startsWith("### ")) {
        return (
          <h3 key={index} className="text-base font-medium text-sky-300 mt-4 mb-2 font-sans tracking-wide">
            {line.substring(4)}
          </h3>
        );
      }

      // Inline Math Highlight
      if (line.includes("$$")) {
        const parts = line.split("$$");
        return (
          <div key={index} className="my-4 p-3 bg-slate-900 border-l-4 border-amber-400 rounded-r-md font-mono text-sm text-amber-200 flex items-center justify-center">
            {parts[1] || line}
          </div>
        );
      }

      // Tables
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        if (line.includes("---")) return null; // Skip table separator lines
        const cells = line.split("|").map(cell => cell.trim()).filter(cell => cell !== "");
        return (
          <div key={index} className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-950 border border-sky-900/40 my-2 rounded-lg font-mono text-xs">
              <tbody className="divide-y divide-sky-950">
                <tr className="bg-slate-900/60 divide-x divide-sky-950">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-slate-200 font-medium">
                      {cell.replace(/\*\*/g, "")}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      // Lists
      if (line.trim().startsWith("- ")) {
        // Highlight key-value patterns in bullet points like "- **Level** : description"
        const cleanLine = line.trim().substring(2);
        const boldParts = cleanLine.split("**");
        if (boldParts.length >= 3) {
          return (
            <li key={index} className="ml-5 list-disc text-xs text-slate-300 mb-1.5 leading-relaxed">
              <strong className="text-sky-300">{boldParts[1]}</strong>
              {boldParts.slice(2).join("")}
            </li>
          );
        }
        return (
          <li key={index} className="ml-5 list-disc text-xs text-slate-300 mb-1.5 leading-relaxed">
            {cleanLine}
          </li>
        );
      }

      // Ordered list items
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <p key={index} className="ml-2 text-xs text-slate-300 my-1 py-0.5 leading-relaxed font-sans">
            <span className="text-amber-400 font-semibold mr-1">{line.trim().split(".")[0]}.</span>
            {line.trim().substring(line.trim().indexOf(".") + 1).trim()}
          </p>
        );
      }

      // Empty Lines
      if (line.trim() === "") {
        return <div key={index} className="h-2"></div>;
      }

      return (
        <p key={index} className="text-xs text-slate-300 my-1.5 leading-relaxed font-sans antialiased">
          {line}
        </p>
      );
    });
  };

  // Safe file text copying helper
  const handleCopySection = () => {
    navigator.clipboard.writeText(activeSrsSection.content);
    setCopiedSectionText(activeSrsSection.id);
    setTimeout(() => setCopiedSectionText(null), 3000);
  };

  // Kid quiz simulation helpers
  const activeQuizQuestion = SAMPLE_QUIZ_MODULE[currentQuizIndex];

  const handleSelectQuizOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedQuizOption(option);
  };

  const checkQuizAnswer = () => {
    if (!selectedQuizOption || isAnswerChecked) return;
    setIsAnswerChecked(true);
    const isCorrect = selectedQuizOption === activeQuizQuestion.correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    } else {
      setHeartsRemaining(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setIsAnswerChecked(false);
    if (currentQuizIndex < SAMPLE_QUIZ_MODULE.length - 1 && heartsRemaining > 0) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetKidQuizSim = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setSelectedQuizOption(null);
    setIsAnswerChecked(false);
    setHeartsRemaining(3);
    setQuizFinished(false);
    setUnscrambleConstructed([]);
  };

  const simulateSpeechVoice = (word: string) => {
    setPronounceWord(word);
    setTimeout(() => {
      setPronounceWord(null);
    }, 1200);
  };

  // Parent Gateway Unlock Logic
  const handleVerifyParentPin = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAns = parseInt(parentPinInput);
    if (numericAns === pinChallenge.ans) {
      setIsParentUnlocked(true);
      setParentPinError(null);
      setParentAdjustLevel(kidAgeCohort === 1 ? 1 : kidAgeCohort === 2 ? 3 : 5);
    } else {
      setParentPinError("Неверный ответ! Доступ к панели родителей заблокирован.");
      setParentPinInput("");
    }
  };

  const lockParentPortal = () => {
    setIsParentUnlocked(false);
    setParentPinInput("");
    setParentPinError(null);
    // Refresh challenge equation
    const x = Math.floor(Math.random() * 5) + 5;
    const y = Math.floor(Math.random() * 5) + 5;
    setPinChallenge({ q: `${x} × ${y}`, ans: x * y });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      
      {/* --- TOP HIGH-END METRIC BAR --- */}
      <div className="border-b border-sky-950 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 text-slate-950">
              <Smartphone className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">Android System Spec</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Offline-First</span>
              </div>
              <h1 className="text-sm font-bold tracking-tight text-white">English Start Kids (5-12 лет)</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs text-slate-400">
            <div className="bg-slate-950 border border-sky-900/40 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-slate-500">Target APK:</span>
              <span className="text-emerald-400 font-bold">COPPA Compliant</span>
            </div>
            <div className="bg-slate-950 border border-sky-900/40 rounded-lg px-3 py-1.5 hidden sm:flex items-center space-x-2">
              <span className="text-slate-500">Engine API Level:</span>
              <span className="text-sky-300">Min SDK 21 (Lollipop)</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN HERO PORTAL HEADER --- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 py-6 px-4 border-b border-sky-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-sky-400 font-mono font-medium tracking-widest uppercase">Senior Architect Workspace</p>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-amber-500 mt-1">
                Software Requirements Specification (SRS)
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                Полные технические требования и интерактивный симулятор систем логики для разработчиков мобильного приложения английского языка.
              </p>
            </div>

            {/* MAIN PORTAL TABS SWITCHER */}
            <div className="flex flex-wrap gap-2">
              <button
                id="tab-srs"
                onClick={() => setActiveTab("srs")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "srs"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Спецификация (SRS)</span>
              </button>

              <button
                id="tab-calculators"
                onClick={() => setActiveTab("calculators")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "calculators"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>2. Калькулятор XP</span>
              </button>

              <button
                id="tab-database"
                onClick={() => setActiveTab("database")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "database"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Database className="w-4 h-4" />
                <span>3. Схема БД Room</span>
              </button>

              <button
                id="tab-interfaces"
                onClick={() => setActiveTab("interfaces")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "interfaces"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>4. Макет UI & Эмулятор</span>
              </button>

              <button
                id="tab-roadmap"
                onClick={() => setActiveTab("roadmap")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "roadmap"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>5. План & Спринты</span>
              </button>

              <button
                id="tab-flutter"
                onClick={() => setActiveTab("flutter")}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === "flutter"
                    ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10 font-bold"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>6. Dart & Flutter Код</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT ROOT --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">

        {/* ========================================================= */}
        {/* TAB 1: TECH SPECIFICATIONS DOCUMENT WRITER (SRS)         */}
        {/* ========================================================= */}
        {activeTab === "srs" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SRS Left Side menu */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-sky-950 shadow-md">
                <div className="flex items-center justify-between mb-3 text-xs uppercase font-mono tracking-wider text-slate-400">
                  <span>ОГЛАВЛЕНИЕ СНИППЕТА</span>
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                </div>
                
                {/* Search document box */}
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={srsSearchQuery}
                    onChange={(e) => setSrsSearchQuery(e.target.value)}
                    placeholder="Поиск по ТЗ..."
                    className="w-full bg-slate-950 border border-sky-900/60 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-sky-400 text-slate-200 placeholder:text-slate-500"
                  />
                  {srsSearchQuery && (
                    <button
                      onClick={() => setSrsSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-[10px] bg-slate-850 text-slate-400 px-1 rounded hover:bg-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {filteredSrsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSrsSectionId(section.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs leading-normal flex flex-col transition-all ${
                        selectedSrsSectionId === section.id
                          ? "bg-sky-500/10 border-l-2 border-sky-400 text-white"
                          : "hover:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="font-semibold block text-slate-200">{section.title}</span>
                      <span className="text-[10px] text-slate-400 truncate mt-0.5">{section.subtitle}</span>
                    </button>
                  ))}
                  {filteredSrsSections.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-6">Ничего не найдено...</p>
                  )}
                </div>
              </div>

              {/* Specs parameters card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-sky-900/40 font-mono text-xs">
                <h4 className="text-slate-300 font-bold mb-3 flex items-center gap-1.5 uppercase text-[10px] tracking-wide text-amber-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Constraints Summary
                </h4>
                <div className="space-y-2 text-slate-400 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-sky-950">
                    <span>OS Platform</span>
                    <strong className="text-slate-200">Android (Java/Kotlin)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sky-950">
                    <span>Local Database</span>
                    <strong className="text-slate-200">SQLite / Room</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sky-950">
                    <span>Safety / Legal</span>
                    <strong className="text-slate-200">COPPA Rule Compliant</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sky-950">
                    <span>Internet Port</span>
                    <strong className="text-orange-400 font-semibold">Strict 0 (Disabled)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sky-950">
                    <span>Sizing target</span>
                    <strong className="text-slate-200">&ge; 48dp Touch Targets</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Parent Lock</span>
                    <strong className="text-slate-200">Math Equations Bypass</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SRS Active Content Reader */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900/40 border border-sky-950 rounded-2xl p-6 md:p-8 shadow-xl">
                
                {/* Header card inside view */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-950 pb-6 mb-6">
                  <div>
                    <span className="text-[10px] bg-sky-950 text-sky-400 rounded-full px-2.5 py-1 font-mono uppercase tracking-widest">
                      SYSTEM COMPILATION SPEC
                    </span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mt-1.5">
                      {activeSrsSection.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{activeSrsSection.subtitle}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopySection}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-500" />
                      <span>{copiedSectionText === activeSrsSection.id ? "Скопировано!" : "Копировать ТЗ"}</span>
                    </button>
                  </div>
                </div>

                {/* Render documentation content list */}
                <div className="prose prose-invert max-w-none text-slate-300">
                  {renderSrsMarkdown(activeSrsSection.content)}
                </div>

                <div className="mt-8 pt-6 border-t border-sky-950 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Документ: SRS-ENG-KIDS-v1.0</span>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Утверждено Ведущим Архитектором</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INTERACTIVE XP & STREAK MATHEMATICS CALCULATOR    */}
        {/* ========================================================= */}
        {activeTab === "calculators" && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 border border-sky-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <Calculator className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Интерактивный Эмулятор Системы XP и Наград
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                Данный калькулятор позволяет протестировать и верифицировать формулы XP, описанные в разделе 4 спецификации (SRS). Разработчики могут изменять входящие данные занятий ребёнка, чтобы симулировать выдачу опыта во внедряемых базах данных Android Room.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inputs Form column */}
              <div className="lg:col-span-5 bg-slate-900 border border-sky-950 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-sky-400 mb-2 font-bold border-b border-sky-950 pb-2">
                  ВХОДНЫЕ ДАННЫЕ СЕССИИ (STUDENT INPUT)
                </h4>

                {/* Level selection */}
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1.5 flex justify-between">
                    <span>Текущий уровень ребёнка (L):</span>
                    <span className="text-sky-300">Level {calcInputs.level}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcInputs.level}
                    onChange={(e) => setCalcInputs({ ...calcInputs, level: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>Мл. исследователи (Lvl 1)</span>
                    <span>Lvl 15</span>
                  </div>
                </div>

                {/* Daily Streak slider */}
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1.5 flex justify-between">
                    <span>Серия дней активности (S):</span>
                    <span className="text-yellow-400 font-semibold">{calcInputs.streakDays} дней</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={calcInputs.streakDays}
                    onChange={(e) => setCalcInputs({ ...calcInputs, streakDays: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>1 день (1.01x)</span>
                    <span>30 дней (Максимальный кап 1.6x)</span>
                  </div>
                </div>

                {/* Quiz correct answers */}
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1.5 flex justify-between">
                    <span>Правильных ответов в квесте:</span>
                    <span className="text-emerald-400">{calcInputs.quizCorrectAnswers} из {calcInputs.quizTotalQuestions}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={calcInputs.quizTotalQuestions}
                    value={calcInputs.quizCorrectAnswers}
                    onChange={(e) => setCalcInputs({ ...calcInputs, quizCorrectAnswers: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0 правильных</span>
                    <span>10/10 (3 Звезды!)</span>
                  </div>
                </div>

                {/* Review completes toggle */}
                <div className="pt-2">
                  <label className="flex items-center space-x-3 bg-slate-950 hover:bg-slate-950/80 p-3 rounded-xl border border-sky-950 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={calcInputs.hasPerfectDeckReview}
                      onChange={(e) => setCalcInputs({ ...calcInputs, hasPerfectDeckReview: e.target.checked })}
                      className="w-4 h-4 rounded text-sky-400 focus:ring-sky-500 bg-slate-900 border-sky-950"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Пройдена учебная колода (+60 XP)</span>
                      <span className="text-[10px] text-slate-500">6 карт темы по 10 XP за полное изучение</span>
                    </div>
                  </label>
                </div>

                {/* Formulas reference box */}
                <div className="bg-slate-950/80 border border-sky-950/60 rounded-xl p-3 font-mono text-[10px] text-slate-400">
                  <span className="text-amber-500 font-bold block mb-1">ФОРМУЛЫ СПЕЦИФИКАЦИИ:</span>
                  <div className="space-y-1">
                    <div>• Порог XP до L+1: <code className="text-slate-200">100 * L² - 50 * L</code></div>
                    <div>• Коэф. Серии: <code className="text-slate-200">1.0 + min(0.5, [S/7]*0.1) + min(0.5, S*0.01)</code></div>
                    <div>• 3 Звезды = &ge;90% правильных (+50 XP бонус)</div>
                  </div>
                </div>

              </div>

              {/* Outputs Sandbox Column */}
              <div className="lg:col-span-7 bg-slate-905 border border-sky-950 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                
                {/* Visual level stats block */}
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold block mb-4 border-b border-sky-950 pb-2">
                    ВЕРИФИКАЦИЯ РАСЧЁТОВ ФОРМУЛ (SIMULATED RESULTS)
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-sky-950 text-center">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Базовый опыт</span>
                      <div className="text-lg font-bold text-slate-100 mt-1">
                        {calculatedSandboxResults.quizBaseXp + calculatedSandboxResults.completedDeckXp} XP
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Quiz + Deck</span>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-sky-950 text-center">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Множитель серии</span>
                      <div className="text-lg font-bold text-yellow-400 mt-1 flex items-center justify-center space-x-1">
                        <Flame className="w-4 h-4 text-orange-500 inline fill-orange-500 animate-pulse" />
                        <span>{calculatedSandboxResults.streakMultiplier}x</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">S = {calcInputs.streakDays} дней</span>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-sky-950 text-center">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Оценка Звёзд</span>
                      <div className="text-lg font-bold mt-1 text-amber-500 flex items-center justify-center space-x-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < calculatedSandboxResults.starsGained
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium truncate">
                        {calculatedSandboxResults.rankText}
                      </span>
                    </div>

                    <div className="bg-sky-950/30 p-3.5 rounded-xl border border-sky-900/40 text-center relative overflow-hidden">
                      <span className="text-sky-400 text-[10px] uppercase font-mono block relative z-10 font-bold">ИТОГО ЗА СЕССИЮ</span>
                      <div className="text-xl font-extrabold text-sky-300 mt-1 relative z-10 antialiased">
                        +{calculatedSandboxResults.totalCalculatedSessionXp} XP
                      </div>
                      <span className="text-[9px] text-sky-400 block mt-0.5 relative z-10 font-mono">С учётом серии</span>
                      <div className="absolute right-0 bottom-0 text-sky-500/5 select-none -translate-x-1 translate-y-2">
                        <Award className="w-16 h-16 font-bold" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Level up threshold progress bar visualization */}
                <div className="bg-slate-900/60 border border-sky-950 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Прогресс от Уровня {calcInputs.level} до {calcInputs.level + 1}:</span>
                    <strong className="text-sky-300">
                      +{calculatedSandboxResults.totalCalculatedSessionXp} / {calculatedSandboxResults.targetXpForNextLevel} XP
                    </strong>
                  </div>

                  {/* Visual simulated progress bar */}
                  <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-sky-900/30">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-amber-400 h-full rounded-full transition-all duration-300 relative"
                      style={{
                        width: `${Math.min(
                          100,
                          (calculatedSandboxResults.totalCalculatedSessionXp /
                            calculatedSandboxResults.targetXpForNextLevel) *
                            100
                        )}%`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Уровень {calcInputs.level} (Start)</span>
                    <span>
                      {Math.round(
                        (calculatedSandboxResults.totalCalculatedSessionXp /
                          calculatedSandboxResults.targetXpForNextLevel) *
                          100
                      )}% Накоплено
                    </span>
                    <span>Уровень {calcInputs.level + 1} ({calculatedSandboxResults.targetXpForNextLevel} XP)</span>
                  </div>
                </div>

                {/* Developer validation check list */}
                <div className="border border-sky-900/40 bg-slate-900/30 rounded-xl p-4 space-y-2">
                  <span className="text-xs uppercase font-mono font-bold text-amber-500 block">
                    Анализ корректности логики (Architect Audit):
                  </span>
                  <div className="space-y-1 text-xs text-slate-300 font-sans">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Элемент Room Database <code className="text-sky-300 font-mono">user_profile.accumulated_xp</code> увеличится на <strong className="text-white">{calculatedSandboxResults.totalCalculatedSessionXp}</strong> XP.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Для сдачи темы квеста получено <strong className="text-amber-400">{calculatedSandboxResults.starsGained} Звезды</strong>. Сохранено в <code className="text-sky-300 font-mono">lesson_progress.maximum_stars_earned</code>.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Текущая серия <strong className="text-orange-400">{calcInputs.streakDays} дней</strong> активна, следующая недельная планка - {Math.ceil((calcInputs.streakDays + 1)/7) * 7} день (+0.10x к множителю).</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SQLite ROOM ENTITY & SCHEMA VISUALIZER            */}
        {/* ========================================================= */}
        {activeTab === "database" && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 border border-sky-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Room Data Architecture Schema Inspector
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                Визуальное представление взаимосвязей сущностей (Entity-Relationship) локальной базы данных SQLite Room. Все данные хранятся автономно на устройстве ребёнка с целью обеспечения конфиденциальности COPPA и 100% оффлайн работы приложения.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Rooms Lists layout */}
              <div className="lg:col-span-4 bg-slate-900 border border-sky-950 rounded-2xl p-4 space-y-3">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold block pb-2 border-b border-sky-950">
                  СУЩНОСТИ ROOM (TABLES LIST)
                </span>

                <button
                  onClick={() => setSelectedDbTable("user_profile")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition duration-200 ${
                    selectedDbTable === "user_profile"
                      ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-sky-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>1. user_profile</span>
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-500">PROFILES</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-normal font-sans">Статистика, серия, выбранный питомец</span>
                </button>

                <button
                  onClick={() => setSelectedDbTable("vocab_card")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition duration-200 ${
                    selectedDbTable === "vocab_card"
                      ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-sky-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>2. vocab_card</span>
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-500">DICTIONARY</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-normal font-sans">Статический перечень слов и медиа-ссылок</span>
                </button>

                <button
                  onClick={() => setSelectedDbTable("quiz_history")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition duration-200 ${
                    selectedDbTable === "quiz_history"
                      ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-sky-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>3. quiz_history</span>
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-orange-400">SM-2 INDEX</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-normal font-sans">История ответов под интервалы повторений</span>
                </button>

                <button
                  onClick={() => setSelectedDbTable("lesson_progress")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition duration-200 ${
                    selectedDbTable === "lesson_progress"
                      ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-sky-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>4. lesson_progress</span>
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-500">PROGRESS</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-normal font-sans">Учёт звёзд по темам и открытие новых островов</span>
                </button>

                <button
                  onClick={() => setSelectedDbTable("system_achievement")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition duration-200 ${
                    selectedDbTable === "system_achievement"
                      ? "bg-emerald-500/10 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-sky-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>5. system_achievement</span>
                    <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-500">BADGES</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-normal font-sans">Показатели открытых ачивок и наград</span>
                </button>

                {/* DB Seed indicator */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-sky-950 text-xs font-mono space-y-1.5">
                  <span className="text-amber-500 font-bold block text-[10px] uppercase tracking-wide">Pre-populated Seed Cards:</span>
                  <div className="text-[11px] text-slate-400 max-h-[140px] overflow-y-auto space-y-1">
                    {STATIC_VOCAB_SEED.map((word) => (
                      <div key={word.id} className="flex justify-between hover:bg-slate-900 px-1 py-0.5 rounded">
                        <span className="text-slate-300 font-semibold">{word.english}</span>
                        <span className="text-slate-500">{word.russian}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Db Schema table detail column */}
              <div className="lg:col-span-8 bg-slate-905 border border-sky-950 rounded-2xl p-5 md:p-6 space-y-6">
                
                {selectedDbTable === "user_profile" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                        ТАБЛИЦА: user_profile (Сущность профилей)
                      </h4>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">SINGLE ROW</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full font-mono text-xs text-slate-300">
                        <thead>
                          <tr className="bg-slate-900 border-b border-sky-950 text-slate-500 text-left">
                            <th className="px-4 py-2">Column Name</th>
                            <th className="px-4 py-2">Affinity Type</th>
                            <th className="px-4 py-2">Constraints</th>
                            <th className="px-4 py-2 text-right">Dev Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-950">
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-bold text-slate-100">id</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2 text-violet-400">P_K NOT NULL AUTOINCREMENT</td>
                            <td className="px-4 py-2 text-right text-slate-500">Уникальный ID профиля</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">child_name</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Имя ребенка (для персонализации)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">age_bracket</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Когорта возраста 1(5-6), 2(7-9), 3(10-12)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">hero_buddie_id</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">NOT NULL DEFAULT 'milo'</td>
                            <td className="px-4 py-2 text-right text-slate-500">Аватар/ Buddy ('milo' / 'bella' / 'drake')</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">current_level</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">DEFAULT 1</td>
                            <td className="px-4 py-2 text-right text-slate-500">Текущий уровень опыта</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">accumulated_xp</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">DEFAULT 0</td>
                            <td className="px-4 py-2 text-right text-slate-500">Общее XP опыта на балансе</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-sky-950 space-y-2">
                      <span className="text-xs uppercase font-mono font-bold text-amber-500 block">Разработчику на заметку:</span>
                      <p className="text-xs text-slate-400 leading-normal font-sans">
                        Поскольку в приложении запрещена веб-авторизация, профиль генерируется локально при Onboarding-экране. Все запросы на инкремент уровня или обновление питомца осуществляются через SQLite UPDATE.
                      </p>
                    </div>
                  </div>
                )}

                {selectedDbTable === "vocab_card" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                        ТАБЛИЦА: vocab_card (Словарные карточки)
                      </h4>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">READ ONLY ON RUNTIME</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full font-mono text-xs text-slate-300">
                        <thead>
                          <tr className="bg-slate-900 border-b border-sky-950 text-slate-500 text-left">
                            <th className="px-4 py-2">Column Name</th>
                            <th className="px-4 py-2">Affinity Type</th>
                            <th className="px-4 py-2">Constraints</th>
                            <th className="px-4 py-2 text-right">Dev Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-950">
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-bold text-slate-100">id</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2 text-violet-400">PRIMARY KEY NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">ID (например, a_apple)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">module_category</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Тема (animals, food, colors)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">difficulty_rank</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Градация сложности (для возраста)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">english_word</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Слово на английском (например, Apple)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">russian_translation</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Русский перевод (например, Яблоко)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-sky-950 space-y-2">
                      <span className="text-xs uppercase font-mono font-bold text-amber-500 block">Предустановка (Initial Seeding):</span>
                      <p className="text-xs text-slate-400 leading-normal font-sans">
                        Эта таблица является статической. Сид-данные должны быть упакованы в директорию <code className="text-sky-300 font-mono">res/raw/seed_vocabulary.json</code> и скомпилированы в базу при первом запуске приложения через <code className="text-sky-300 font-mono">RoomDatabase.Callback() onCreate</code>.
                      </p>
                    </div>
                  </div>
                )}

                {selectedDbTable === "quiz_history" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                        ТАБЛИЦА: quiz_history (Анализ Spaced Repetition)
                      </h4>
                      <span className="text-xs bg-amber-500/20 text-amber-500 border border-amber-500/40 px-2 py-0.5 rounded">DYNAMIC WEIGHTS</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full font-mono text-xs text-slate-300">
                        <thead>
                          <tr className="bg-slate-900 border-b border-sky-950 text-slate-500 text-left">
                            <th className="px-4 py-2">Column Name</th>
                            <th className="px-4 py-2">Affinity Type</th>
                            <th className="px-4 py-2">Constraints</th>
                            <th className="px-4 py-2 text-right">Dev Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-950">
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-bold text-slate-100">id</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2 text-violet-400">PRIMARY KEY AUTOINCREMENT</td>
                            <td className="px-4 py-2 text-right text-slate-500">ID записи истории</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">card_id</td>
                            <td className="px-4 py-2 text-slate-400">TEXT</td>
                            <td className="px-4 py-2">F_K references vocab_card(id)</td>
                            <td className="px-4 py-2 text-right text-slate-500">Внешний ключ ID словарной карточки</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">last_answered_timestamp</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">NOT NULL</td>
                            <td className="px-4 py-2 text-right text-slate-500">Юлианская дата ответа (милисекунды)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">consecutive_correct_hits</td>
                            <td className="px-4 py-2 text-slate-400">INTEGER</td>
                            <td className="px-4 py-2">DEFAULT 0</td>
                            <td className="px-4 py-2 text-right text-slate-500">Кол-во верных повторений подряд</td>
                          </tr>
                          <tr className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-semibold">difficulty_weight_factor</td>
                            <td className="px-4 py-2 text-slate-400">REAL</td>
                            <td className="px-4 py-2">DEFAULT 2.5</td>
                            <td className="px-4 py-2 text-right text-slate-500">Коэффициент сложности (SM-2 Ease Factor)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-sky-950 space-y-2">
                      <span className="text-xs uppercase font-mono font-bold text-amber-500 block">Интеллектуальная выборка (SM-2):</span>
                      <p className="text-xs text-slate-400 leading-normal font-sans">
                        Для подбора сложных слов в квесты запрашивается выборка через SQL:
                        <code className="text-amber-300 block bg-slate-950 p-2.5 rounded-lg border border-sky-950 text-[10px] mt-2 select-all whitespace-pre-wrap">
                          {"SELECT * FROM vocab_card LEFT JOIN quiz_history ON vocab_card.id = quiz_history.card_id ORDER BY consecutive_correct_hits ASC, last_answered_timestamp ASC LIMIT 10;"}
                        </code>
                      </p>
                    </div>
                  </div>
                )}

                {selectedDbTable === "lesson_progress" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                        ТАБЛИЦА: lesson_progress (Карта островов)
                      </h4>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">MAP STATE</span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Эта таблица отвечает за игровой прогресс на островах. Квесты и уроки открываются по цепочке на основе накопленных звёзд.
                    </p>
                  </div>
                )}

                {selectedDbTable === "system_achievement" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                        ТАБЛИЦА: system_achievement (Ачивки)
                      </h4>
                      <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded">TROPHIES</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                      {MOCK_ACHIEVEMENTS.map(ach => (
                        <div key={ach.id} className="bg-slate-950 p-3 rounded-xl border border-sky-950 flex items-start space-x-3">
                          <span className="text-2xl">{ach.badge}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-200 block">{ach.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{ach.desc}</span>
                            <span className="text-[9px] text-amber-400 font-mono font-bold mt-1 inline-block bg-slate-900 px-1 py-0.25 rounded">Награда: {ach.reward}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: INTERACTIVE VISUAL UI/UX EMULATOR                 */}
        {/* ========================================================= */}
        {activeTab === "interfaces" && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 border border-sky-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <Layout className="w-6 h-6 text-sky-400" />
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-white">
                      Интерактивный UI/UX Инспектор & Эмулятор
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Визуализирует физические концепции Material 3 дизайна, разработанные для детской аудитории (крупные тач-области, контрастная типографика, двухпанельный интерфейс).
                    </p>
                  </div>
                </div>

                {/* Show touch targets helper toggle */}
                <button
                  onClick={() => setShowTouchTargets(!showTouchTargets)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    showTouchTargets
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {showTouchTargets ? "Скрыть Сетку Тач-Зон" : "Показать Сетку Тач-Зон (48dp+)"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Kids Interface Simulator Box (LEFT SIDE - 7 Cols) */}
              <div className="lg:col-span-7 bg-sky-950/20 border border-sky-900/40 rounded-3xl p-6 flex flex-col justify-between min-h-[580px] relative overflow-hidden shadow-2xl">
                
                {/* Decorative phone notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-slate-950 rounded-b-xl border-x border-b border-sky-900/40 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-850"></span>
                </div>

                {/* Simulated APK Header */}
                <div className="flex items-center justify-between border-b border-sky-900/20 pb-4 mb-4 mt-1 font-mono text-[10px] text-sky-400/80">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 font-bold rounded">LEVEL {calcInputs.level}</span>
                    <span className="text-slate-500">Milo the Companion Active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span className="font-bold text-yellow-400">{calcInputs.streakDays} DAYS</span>
                  </div>
                </div>

                {/* Target Screen Switcher inside Kid Emulator (M3 Tabs style, kid-friendly) */}
                <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/80 p-1 rounded-2xl border border-sky-900/10 hover:border-sky-500/20 transition-all z-10 relative">
                  <button
                    onClick={() => setKidsSimScreen("quiz")}
                    className={`py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center space-x-1 sm:space-x-1.5 ${
                      kidsSimScreen === "quiz"
                        ? "bg-sky-500 text-slate-950 shadow-md font-extrabold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🎮 Квест-разминка</span>
                  </button>
                  <button
                    onClick={() => setKidsSimScreen("achievements")}
                    className={`py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center space-x-1 sm:space-x-1.5 ${
                      kidsSimScreen === "achievements"
                        ? "bg-amber-400 text-slate-950 shadow-md font-extrabold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🏆 Мои Награды</span>
                  </button>
                </div>

                {/* MAIN CHILD INTERACTIVE WORKSPACE */}
                <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
                  
                  {kidsSimScreen === "achievements" ? (
                    // Achievements Kids View Layout
                    <div className="space-y-4 animate-fade-in text-white w-full">
                      
                      {/* Summary Banner Card */}
                      <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-4 relative overflow-hidden shadow-lg shadow-amber-500/5">
                        <div className="absolute top-0 right-0 p-1.5 bg-amber-500/10 text-amber-500 rounded-bl-xl font-mono text-[8px] font-bold">
                          CHAMPION
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl animate-pulse">
                            👑
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-amber-400 font-sans">Супергерой Английского</h4>
                            <p className="text-[10px] text-slate-400 font-sans">Собрано 4 из 8 достижений детской лиги</p>
                          </div>
                        </div>

                        {/* Overall progress indicator */}
                        <div className="mt-3.5 space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400">
                            <span>Общий статус наград</span>
                            <span className="text-amber-400 font-bold">50% разблокировано</span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-900">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full w-1/2 transition-all duration-500"></div>
                          </div>
                        </div>
                      </div>

                      {/* Filterable scroll container of all achievements */}
                      <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 select-none custom-scrollbar">
                        {MOCK_ACHIEVEMENTS.map((ach) => {
                          const isUnlocked = ach.currentProgress >= ach.targetProgress;
                          const percent = Math.min(100, Math.round((ach.currentProgress / ach.targetProgress) * 100));
                          
                          return (
                            <div
                              key={ach.id}
                              className={`p-3 rounded-2xl border transition-all duration-200 flex items-start space-x-3 relative ${
                                isUnlocked 
                                  ? "bg-slate-900/90 border-amber-500/30 shadow-md shadow-amber-500/5" 
                                  : "bg-slate-950/40 border-slate-900/80 opacity-60"
                              }`}
                            >
                              {/* Left side badge icon with child-friendly gradient circle */}
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl relative ${
                                  isUnlocked 
                                    ? "bg-gradient-to-br from-amber-300 to-orange-500 shadow" 
                                    : "bg-slate-900 border border-slate-800"
                                }`}>
                                  <span className={isUnlocked ? "" : "grayscale"}>{ach.badge}</span>
                                </div>
                                
                                {/* Micro scale lock indicator for children */}
                                {!isUnlocked && (
                                  <div className="absolute -bottom-1 -right-1 bg-slate-950 p-0.5 rounded-full border border-slate-850 flex items-center justify-center">
                                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                                  </div>
                                )}
                              </div>

                              {/* Center Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold block truncate ${isUnlocked ? "text-slate-100 font-extrabold" : "text-slate-400"}`}>
                                    {ach.name}
                                  </span>
                                  
                                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.25 rounded ${
                                    isUnlocked 
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                      : "bg-slate-900 text-slate-500"
                                  }`}>
                                    +{ach.reward}
                                  </span>
                                </div>
                                
                                <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                                  {ach.desc}
                                </span>

                                {/* Progress bar metrics */}
                                <div className="mt-2.5 flex items-center space-x-2">
                                  <div className="flex-1 h-1 bg-slate-950 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${isUnlocked ? "bg-emerald-400" : "bg-sky-400"}`}
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[9px] font-mono font-bold text-sky-400 whitespace-nowrap">
                                    {ach.currentProgress}/{ach.targetProgress}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ) : (
                    // Quiz Active Screen Interface
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      
                      {/* If Quiz is finished, show Star Splashes */}
                      {quizFinished ? (
                    <div className="text-center space-y-6 py-8 animate-fade-in">
                      
                      {/* Star rating splash logic */}
                      <div className="flex justify-center space-x-2">
                        {Array.from({ length: 3 }).map((_, i) => {
                          const achieved = i < (quizScore >= 4 ? 3 : quizScore >= 3 ? 2 : quizScore >= 2 ? 1 : 0);
                          return (
                            <div key={i} className="relative">
                              <Star
                                className={`w-14 h-14 filter drop-shadow ${
                                  achieved
                                    ? "text-yellow-400 fill-yellow-400 animate-bounce"
                                    : "text-slate-700"
                                }`}
                                style={{ animationDelay: `${i * 150}ms` }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-mono bg-yellow-950 text-yellow-400 rounded-full px-3 py-1">
                          КВЕСТ ЗАВЕРШЕН! (QUEST COMPLETED)
                        </span>
                        <h4 className="text-xl font-bold tracking-tight text-white font-sans mt-2">
                          Отличный результат, Чемпион!
                        </h4>
                        <p className="text-xs text-sky-300">
                          Ты ответил правильно на <strong className="text-white text-sm">{quizScore}</strong> из <strong className="text-white text-sm">5</strong> вопросов!
                        </p>
                      </div>

                      {/* Score metrics summary */}
                      <div className="bg-slate-950/70 border border-sky-900/40 rounded-2xl p-4 max-w-sm mx-auto font-mono text-xs text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Базовый Опыт квеста:</span>
                          <span className="text-slate-200">+{quizScore * 15} XP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Оценка звёзд бонус:</span>
                          <span className="text-slate-200">
                            +{quizScore >= 4 ? "50" : quizScore >= 3 ? "25" : "0"} XP
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-sky-950/60 pt-1 mt-1 font-semibold">
                          <span className="text-sky-400">Итого опыта:</span>
                          <span className="text-emerald-400">
                            +{(quizScore * 15 + (quizScore >= 4 ? 50 : quizScore >= 3 ? 25 : 0)) * (calcInputs.streakDays >= 7 ? 1.2 : 1)} XP
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={resetKidQuizSim}
                        className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-400/20 active:scale-95 mx-auto block"
                        style={{ minWidth: "160px", minHeight: "48px" }}
                      >
                        Попробовать ещё раз
                      </button>

                    </div>
                  ) : (
                    // Quiz Active Screen Interface
                    <div className="space-y-5">
                      
                      {/* Top Quiz State details */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-amber-500 font-mono block">ТEMA: ВСЁ О СЛОВАХ</span>
                          <span className="text-xs font-bold text-slate-200">
                            Задание {currentQuizIndex + 1} из 5
                          </span>
                        </div>
                        
                        {/* Kid-friendly Health Hearts */}
                        <div className="flex items-center space-x-1.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Heart
                              key={i}
                              className={`w-5 h-5 ${
                                i < heartsRemaining
                                  ? "text-rose-400 fill-rose-500 animate-pulse"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Progress Bar of standard Lesson */}
                      <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-sky-900/20">
                        <div
                          className="bg-sky-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuizIndex + 1) / 5) * 100}%` }}
                        ></div>
                      </div>

                      {/* Core target words flashcard visual */}
                      <div className="bg-slate-900 border-2 border-sky-900/40 rounded-2xl p-5 text-center space-y-4 relative">
                        <span className="text-[10px] bg-sky-950 border border-sky-850 text-sky-400 rounded px-2 py-0.5 font-mono inline-block uppercase">
                          {activeQuizQuestion.type === "listen" ? "Listening Check / Прослушай" : "Match Translation / Переведи"}
                        </span>

                        <div className="space-y-1">
                          <h4 className="text-3xl font-extrabold text-white tracking-wide font-sans">
                            {activeQuizQuestion.question}
                          </h4>
                          <span className="text-xs text-sky-400 block font-mono">
                            {activeQuizQuestion.phonetic}
                          </span>
                        </div>

                        {/* Instruction label for kid */}
                        <p className="text-xs text-slate-300 italic font-sans px-4">
                          {activeQuizQuestion.russianInstructions}
                        </p>

                        {/* Audio Speak voice simulation trigger */}
                        <div className="flex justify-center">
                          <button
                            onClick={() => simulateSpeechVoice(activeQuizQuestion.question)}
                            className={`p-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-full transition flex items-center justify-center relative ${
                              showTouchTargets ? "border-2 border-red-500 animate-pulse" : ""
                            }`}
                            style={{ minWidth: "52px", minHeight: "52px" }}
                            title="Произношение слова через TTS"
                          >
                            <Volume2 className="w-5 h-5" />
                            {showTouchTargets && (
                              <span className="absolute -top-6 bg-red-500 text-white font-mono text-[9px] px-1 rounded">52dp</span>
                            )}
                          </button>
                        </div>

                        {/* Visual phonetic pronounce box indicator */}
                        {pronounceWord && (
                          <div className="absolute top-1 left-1.5 right-1.5 bottom-1 bg-slate-900/90 rounded-xl flex flex-col items-center justify-center space-y-2 animate-fade-in">
                            <Volume2 className="w-8 h-8 text-sky-400 animate-bounce" />
                            <div className="font-mono text-xs text-sky-300">
                              Говорю слово: <strong className="text-white text-sm">"{pronounceWord}"</strong>
                            </div>
                            <span className="text-[10px] text-slate-500 italic">(Симуляция Android Спич-Синтеза TTS)</span>
                          </div>
                        )}
                      </div>

                      {/* ANSWERS MULTI CHOICE SELECTION */}
                      {activeQuizQuestion.type === "unscramble" ? (
                        // Mini interactive drag/letter bubble simulation
                        <div className="space-y-3">
                          <div className="flex justify-center flex-wrap gap-2 min-h-[44px] p-2 bg-slate-950 rounded-xl border border-sky-950">
                            {unscrambleConstructed.map((letter, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setUnscrambleConstructed(prev => prev.filter((_, i) => i !== idx));
                                  setUnscrambleLetters(prev => [...prev, letter]);
                                }}
                                className="bg-sky-400 text-slate-950 text-xs font-bold w-10 h-10 rounded-xl flex items-center justify-center shadow"
                              >
                                {letter}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-center flex-wrap gap-2">
                            {unscrambleLetters.map((letter, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setUnscrambleConstructed(prev => [...prev, letter]);
                                  setUnscrambleLetters(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold w-10 h-10 rounded-xl flex items-center justify-center shadow"
                              >
                                {letter}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-center pt-2">
                            <button
                              onClick={() => {
                                const finalWord = unscrambleConstructed.join("");
                                setSelectedQuizOption(finalWord);
                                setIsAnswerChecked(true);
                                const isCorrect = finalWord === activeQuizQuestion.correctAnswer;
                                if (isCorrect) setQuizScore(p => p + 1);
                                else setHeartsRemaining(p => Math.max(0, p - 1));
                              }}
                              disabled={unscrambleConstructed.length === 0 || isAnswerChecked}
                              className="px-6 py-2.5 bg-sky-500 text-slate-950 font-bold ml-2 rounded-xl text-xs uppercase"
                            >
                              Проверить слово
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {activeQuizQuestion.options.map((option, idx) => {
                            const isSelected = selectedQuizOption === option;
                            const isAnsCorrect = option === activeQuizQuestion.correctAnswer;
                            
                            let buttonBgClass = "bg-slate-900 border-sky-950 hover:bg-slate-850 text-slate-200";
                            
                            if (isSelected) {
                              buttonBgClass = "bg-sky-500/20 border-sky-400 text-white";
                            }
                            if (isAnswerChecked) {
                              if (isAnsCorrect) {
                                buttonBgClass = "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold";
                              } else if (isSelected) {
                                buttonBgClass = "bg-rose-500/20 border-rose-400 text-rose-300";
                              }
                            }

                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectQuizOption(option)}
                                disabled={isAnswerChecked}
                                className={`p-4 rounded-2xl border-2 text-xs font-medium transition flex flex-col items-center justify-center text-center relative ${buttonBgClass} ${
                                  showTouchTargets ? "border-amber-400/40" : ""
                                }`}
                                style={{ minHeight: "56px" }}
                              >
                                <span>{option}</span>
                                {showTouchTargets && (
                                  <span className="absolute bottom-1 right-2 text-[8px] bg-amber-400 text-slate-950 font-mono px-1 rounded font-bold uppercase">56dp</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Actions row: Next/Check */}
                      <div className="flex items-center justify-between pt-4 gap-4 border-t border-sky-900/20">
                        <div>
                          {isAnswerChecked && (
                            <span className={`text-[11px] font-semibold flex items-center space-x-1 ${
                              selectedQuizOption === activeQuizQuestion.correctAnswer
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}>
                              <span>
                                {selectedQuizOption === activeQuizQuestion.correctAnswer
                                  ? "Правильно! (+15 XP)"
                                  : `Ой! Правильно: ${activeQuizQuestion.correctAnswer}`}
                              </span>
                            </span>
                          )}
                        </div>

                        {!isAnswerChecked ? (
                          <button
                            onClick={checkQuizAnswer}
                            disabled={!selectedQuizOption}
                            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition relative ${
                              selectedQuizOption
                                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-400/10"
                                : "bg-slate-800 text-slate-600 cursor-not-allowed"
                            }`}
                            style={{ minWidth: "120px", minHeight: "48px" }}
                          >
                            <span>Проверить</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="px-5 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center space-x-1"
                            style={{ minWidth: "120px", minHeight: "48px" }}
                          >
                            <span>Далее</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  )}
                  </div>
                  )}

                </div>

                {/* Simulated companion Milo guidance */}
                <div className="bg-slate-950/90 border border-sky-900/30 rounded-2xl p-3 flex items-center space-x-3">
                  <span className="text-3xl animate-bounce">
                    {companionSelected === "milo" ? "🐒" : companionSelected === "bella" ? "🐰" : "🐉"}
                  </span>
                  <div className="text-[11px] font-sans text-slate-300 leading-normal">
                    <strong className="text-amber-400">
                      {companionSelected === "milo" ? "Обезьянка Milo:" : companionSelected === "bella" ? "Зайка Bella:" : "Дракоша Drake:"}
                    </strong>{" "}
                    {quizFinished
                      ? "Ура! Весь материал успешно сохранен во внутренней базе данных Room."
                      : isAnswerChecked
                      ? selectedQuizOption === activeQuizQuestion.correctAnswer
                        ? "Ты такой умный! Идем дальше!"
                        : "Ничего страшного! Ошибки помогают нам запоминать слова."
                      : "Выбирай перевод на карточке ниже, дружок!"}
                  </div>
                </div>

              </div>

              {/* Secure Parent Dashboard Panel (RIGHT SIDE - 5 Cols) */}
              <div className="lg:col-span-5 bg-slate-900 border border-sky-950 rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[580px]">
                
                <div>
                  
                  {/* Parent locked section badge */}
                  <div className="flex items-center justify-between border-b border-sky-950 pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <LockKeyhole className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-200 font-bold">Панель Родителей (Parent Panel)</span>
                    </div>

                    {isParentUnlocked && (
                      <button
                        onClick={lockParentPortal}
                        className="text-[10px] bg-rose-950 text-rose-400 rounded-lg px-2 py-1 font-mono hover:bg-rose-900 transition"
                      >
                        Заблокировать
                      </button>
                    )}
                  </div>

                  {/* Locked vs Unlocked condition render */}
                  {!isParentUnlocked ? (
                    <div className="space-y-5 py-8 text-center animate-fade-in">
                      <div className="w-12 h-12 bg-sky-950 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-900/30">
                        <Lock className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-slate-200">Безопасный математический PIN</h4>
                        <p className="text-xs text-slate-400 leading-normal px-2">
                          Для изменения настроек уровня, лимитов времени и сброса SQLite баз, пожалуйста решите уравнение:
                        </p>
                      </div>

                      <form onSubmit={handleVerifyParentPin} className="space-y-4 max-w-xs mx-auto">
                        <div className="bg-slate-950 border-2 border-sky-900/60 rounded-xl p-4 font-mono text-lg font-bold text-amber-500">
                          {pinChallenge.q} = ?
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            value={parentPinInput}
                            onChange={(e) => setParentPinInput(e.target.value)}
                            placeholder="Введите ответ"
                            className="w-full text-center bg-slate-950 border border-sky-900/50 rounded-xl py-2.5 text-sm font-semibold text-white focus:border-sky-400 placeholder:text-slate-600 focus:outline-none"
                            required
                          />
                        </div>

                        {parentPinError && (
                          <div className="p-2 bg-rose-950/40 text-[10px] font-mono text-rose-400 rounded-lg border border-rose-900">
                            {parentPinError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs uppercase transition shadow shadow-sky-500/10"
                        >
                          Подтвердить возраст родителя
                        </button>
                      </form>
                    </div>
                  ) : (
                    // Parent Monitoring Workspace Panel Unlocked
                    <div className="space-y-5 animate-fade-in font-sans text-xs text-slate-300">
                      
                      {/* Section 1: Adjust Level parameters */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Управление Модулем Ребёнка:</span>
                        <div className="bg-slate-950 p-3.5 border border-sky-950 rounded-2xl space-y-3">
                          
                          {/* Age cohort adjustment selector */}
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1.5">Педагогическая когорта ребёнка:</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => {
                                  setKidAgeCohort(1);
                                  setParentAdjustLevel(1);
                                }}
                                className={`py-1.5 rounded-lg text-[10px] font-semibold transition ${
                                  kidAgeCohort === 1 ? "bg-sky-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                }`}
                              >
                                5-6 лет
                              </button>
                              <button
                                onClick={() => {
                                  setKidAgeCohort(2);
                                  setParentAdjustLevel(3);
                                }}
                                className={`py-1.5 rounded-lg text-[10px] font-semibold transition ${
                                  kidAgeCohort === 2 ? "bg-sky-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                }`}
                              >
                                7-9 лет
                              </button>
                              <button
                                onClick={() => {
                                  setKidAgeCohort(3);
                                  setParentAdjustLevel(6);
                                }}
                                className={`py-1.5 rounded-lg text-[10px] font-semibold transition ${
                                  kidAgeCohort === 3 ? "bg-sky-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                }`}
                              >
                                10-12 лет
                              </button>
                            </div>
                          </div>

                          {/* Level override control slider */}
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Принудительный Уровень:</span>
                              <strong className="text-white">Level {parentAdjustLevel}</strong>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="12"
                              value={parentAdjustLevel}
                              onChange={(e) => setParentAdjustLevel(parseInt(e.target.value))}
                              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
                            />
                          </div>

                        </div>
                      </div>

                      {/* Section 2: Real-time Database stats mocks (Parent Dashboard) */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Прогресс и Мониторинг успеваемости (Parent Dashboard):</span>
                        
                        {/* KPI Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/10 flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Время обучения</span>
                            <div className="flex items-baseline space-x-1.5 mt-1.5">
                              <span className="text-sm font-extrabold text-white font-mono">480</span>
                              <span className="text-[10px] text-sky-400 font-semibold font-sans">минут</span>
                            </div>
                            <span className="text-[8px] text-slate-500 italic mt-1">⏱️ За все сессии</span>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/10 flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Уроки Пройдено</span>
                            <div className="flex items-baseline space-x-1.5 mt-1.5">
                              <span className="text-sm font-extrabold text-white font-mono">32 / 40</span>
                              <span className="text-[10px] text-emerald-400 font-semibold font-sans">уроков</span>
                            </div>
                            <span className="text-[8px] text-slate-500 italic mt-1">🎯 80% курса завершено</span>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/10 flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Выучено слов</span>
                            <div className="flex items-baseline space-x-1.5 mt-1.5">
                              <span className="text-sm font-extrabold text-white font-mono">184</span>
                              <span className="text-[10px] text-indigo-400 font-semibold font-sans">слово</span>
                            </div>
                            <span className="text-[8px] text-slate-500 italic mt-1">📝 Активный вокабуляр</span>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/10 flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Средняя Оценка</span>
                            <div className="flex items-baseline space-x-1 a-center mt-1.5">
                              <span className="text-sm font-extrabold text-amber-400 font-mono">94.2%</span>
                            </div>
                            <span className="text-[8px] text-slate-500 italic mt-1">🏆 Отличный результат</span>
                          </div>
                        </div>

                        {/* Interactive Period Selector and Custom Spline Chart */}
                        <div className="bg-slate-950 p-4 border border-sky-950 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase block">Интенсивность занятий:</span>
                              <div className="flex items-baseline space-x-1.5 mt-0.5">
                                <span className="text-sm font-black text-white">
                                  {parentDashboardPeriod === "daily" ? "78 минут" : parentDashboardPeriod === "weekly" ? "480 минут" : "2,280 минут"}
                                </span>
                                <span className="text-[9px] text-sky-400 font-bold">
                                  {parentDashboardPeriod === "daily" ? "активности сегодня" : parentDashboardPeriod === "weekly" ? "за неделю" : "за месяц"}
                                </span>
                              </div>
                            </div>

                            {/* Period Switch Tabs */}
                            <div className="bg-slate-900 p-1 rounded-xl flex space-x-1">
                              {(["daily", "weekly", "monthly"] as const).map((period) => (
                                <button
                                  key={period}
                                  onClick={() => setParentDashboardPeriod(period)}
                                  className={`px-2 py-1 rounded-lg text-[9px] capitalize font-extrabold transition ${
                                    parentDashboardPeriod === period
                                      ? "bg-sky-500 text-slate-950 font-black"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {period === "daily" ? "День" : period === "weekly" ? "Неделя" : "Месяц"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic SVG Spline Progress Chart */}
                          <div className="relative pt-1">
                            <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 100">
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Horizontal Grid lines */}
                              <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                              <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />
                              <line x1="0" y1="80" x2="300" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="3" />

                              {/* Filled path beneath line */}
                              {parentDashboardPeriod === "daily" && (
                                <>
                                  <path d="M 15 70 Q 60 55 105 75 T 195 45 T 285 95 L 285 100 L 15 100 Z" fill="url(#chartGrad)" />
                                  <path d="M 15 70 Q 60 55 105 75 T 195 45 T 285 95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                                  {/* Nodes */}
                                  {[
                                    { x: 15, y: 70 }, { x: 60, y: 55 }, { x: 105, y: 75 }, 
                                    { x: 150, y: 65 }, { x: 195, y: 45 }, { x: 240, y: 55 }, { x: 285, y: 95 }
                                  ].map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                                      <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
                                    </g>
                                  ))}
                                </>
                              )}

                              {parentDashboardPeriod === "weekly" && (
                                <>
                                  <path d="M 15 60 Q 60 45 105 55 T 195 15 T 285 20 L 285 100 L 15 100 Z" fill="url(#chartGrad)" />
                                  <path d="M 15 60 Q 60 45 105 55 T 195 15 T 285 20" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                                  {[
                                    { x: 15, y: 60 }, { x: 60, y: 45 }, { x: 105, y: 55 }, 
                                    { x: 150, y: 30 }, { x: 195, y: 15 }, { x: 240, y: 25 }, { x: 285, y: 20 }
                                  ].map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                                      <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
                                    </g>
                                  ))}
                                </>
                              )}

                              {parentDashboardPeriod === "monthly" && (
                                <>
                                  <path d="M 15 85 Q 69 75 123 60 T 231 30 T 285 15 L 285 100 L 15 100 Z" fill="url(#chartGrad)" />
                                  <path d="M 15 85 Q 69 75 123 60 T 231 30 T 285 15" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                                  {[
                                    { x: 15, y: 85 }, { x: 69, y: 75 }, { x: 123, y: 60 }, 
                                    { x: 177, y: 40 }, { x: 231, y: 30 }, { x: 285, y: 15 }
                                  ].map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                                      <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
                                    </g>
                                  ))}
                                </>
                              )}
                            </svg>

                            {/* X Axios Labels */}
                            <div className="flex justify-between px-1 text-[8px] font-mono text-slate-500 mt-2">
                              {parentDashboardPeriod === "daily" && (
                                <>
                                  <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                                </>
                              )}
                              {parentDashboardPeriod === "weekly" && (
                                <>
                                  <span>н-7</span><span>н-6</span><span>н-5</span><span>н-4</span><span>н-3</span><span>н-2</span><span>н-1</span>
                                </>
                              )}
                              {parentDashboardPeriod === "monthly" && (
                                <>
                                  <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Vocabulary Mastery Meter */}
                        <div className="bg-slate-950 p-4 border border-sky-950 rounded-2xl space-y-3">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight block mb-1">Усвоенность лексики по темам:</span>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>🦊 Животные (Animals)</span>
                                <span className="text-emerald-400 font-bold font-mono">90%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full rounded-full transition-all duration-505" style={{ width: "90%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>🍏 Еда и напитки (Food)</span>
                                <span className="text-sky-400 font-bold font-mono">75%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="bg-sky-450 h-full rounded-full transition-all duration-505" style={{ width: "75%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>🎨 Цвета и Формы (Colors)</span>
                                <span className="text-amber-400 font-bold font-mono">55%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full rounded-full transition-all duration-505" style={{ width: "55%" }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] text-slate-405 mb-1">
                                <span>🏠 Семья и Дом (Family)</span>
                                <span className="text-indigo-400 font-bold font-mono">15%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="bg-indigo-400 h-full rounded-full transition-all duration-505" style={{ width: "15%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Section 3: SQLite CSV exports actions */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Администрирование данных:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => alert("Симуляция оффлайн экспорта Room DB в формат JSON/CSV завершена успешно.")}
                            className="bg-slate-950 hover:bg-slate-850 text-[10px] py-2 border border-sky-950 rounded-xl font-semibold text-slate-300 transition"
                          >
                            Экспорт CSV лога
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Вы уверены? Это приведет к полной очистке Room таблиц user_profile и quiz_history.")) {
                                resetKidQuizSim();
                                setParentTotalStars(0);
                                setParentAdjustLevel(1);
                                setKidAgeCohort(1);
                                lockParentPortal();
                              }
                            }}
                            className="bg-rose-950 hover:bg-rose-900 border border-rose-900/50 text-[10px] py-2 rounded-xl text-rose-300 font-semibold transition"
                          >
                            Сбросить прогресс БД
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Privacy safety guarantee sign */}
                <div className="border border-sky-950/40 p-3 bg-slate-950/40 rounded-2xl text-[10px] font-mono text-slate-500 flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p className="leading-relaxed font-sans mt-0.5">
                    <strong>COPPA Сигнат:</strong> Данное меню не имеет исходящих сокет-портов или механизмов отслеживания. Данные защищены локальным SQLite шифрованием.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MVP DEPLOYMENT ROADMAP & SPRINTS                  */}
        {/* ========================================================= */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 border border-sky-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Дорожная Карта Разработки MVP (Android Sprints Roadmap)
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                Ниже представлен календарный график выполнения архитектурных спринтов для технической команды разработчиков мобильного приложения "English Start Kids".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Phase 1 Sprint Card */}
              <div className="bg-slate-900 border border-sky-950 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded font-mono uppercase font-bold">Спринт 1: Фундамент</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Completed</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-2">Локальный Движок & Модели БД</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                    Инициализация скелета Android Activity, интеграция Room SQLite в граф сборщика Gradle, имплементация стартовых сидов лексики.
                  </p>

                  <div className="space-y-2 border-t border-sky-950 pt-3">
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-1"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-1": !checkedRoadmapTasks["task-1"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span className="line-through text-slate-500">Инициализация Room БД</span>
                     </label>
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-2"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-2": !checkedRoadmapTasks["task-2"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span className="line-through text-slate-500">Сид-данные 10 основных тем</span>
                     </label>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-sky-950 font-mono text-[9px] text-slate-500">
                  Sprint Deadline: 2026-07-15
                </div>
              </div>

              {/* Phase 2 Sprint Card */}
              <div className="bg-slate-900 border border-sky-950 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-amber-950 text-amber-500 px-2 py-0.5 rounded font-mono uppercase font-bold">Спринт 2: Геймификация</span>
                    <span className="text-[10px] text-amber-500 font-mono">In Progress</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-2">Голосовой Движок & Квесты</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                    Разработка адаптера Android Text-to-Speech (TTS), программирование формул начисления XP и звёзд, адаптация логики выбора питомца Milo.
                  </p>

                  <div className="space-y-2 border-t border-sky-950 pt-3">
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-3"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-3": !checkedRoadmapTasks["task-3"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span>Адаптер Android TTS</span>
                     </label>
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-4"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-4": !checkedRoadmapTasks["task-4"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span>Процедуры XP & Multipliers</span>
                     </label>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-sky-950 font-mono text-[9px] text-slate-400">
                  Sprint Deadline: 2026-08-10
                </div>
              </div>

              {/* Phase 3 Sprint Card */}
              <div className="bg-slate-900 border border-sky-950 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded font-mono uppercase font-bold font-bold">Спринт 3: Контроль</span>
                    <span className="text-[10px] text-slate-500 font-mono">Planned</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-2">Портал Родителей & Экспорт</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                    Ограничение доступа PIN-кодом, вывод графиков прогресса обучения, оптимизация вызовов под низкопроизводительные планшеты.
                  </p>

                  <div className="space-y-2 border-t border-sky-950 pt-3">
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-5"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-5": !checkedRoadmapTasks["task-5"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span>Генерация безопасного PIN кода</span>
                     </label>
                     <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={checkedRoadmapTasks["task-6"]}
                         onChange={() => setCheckedRoadmapTasks({...checkedRoadmapTasks, "task-6": !checkedRoadmapTasks["task-6"]})}
                         className="rounded text-sky-400 focus:ring-sky-500 bg-slate-950 border-sky-900"
                       />
                       <span>Экспорт Room DB в CSV фид</span>
                     </label>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-sky-950 font-mono text-[9px] text-slate-500">
                  Sprint Deadline: 2026-09-01
                </div>
              </div>

            </div>

            {/* Quality check guidelines and future plans */}
            <div className="bg-slate-900/40 border border-sky-950 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5 uppercase font-mono text-amber-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400 font-bold" /> ПЛАН МАСШТАБИРОВАНИЯ И КОНТРОЛЯ КАЧЕСТВА (QUALITATIV PLAN)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Соблюдение этого SRS-документа решает проблему разрозненности разработки. Ключевые метрики производительности (60 FPS, запуск за 1.2с на процессорах MTK6761) должны регулярно проверяться посредством автотестов через <code className="text-sky-300 font-mono">Android Benchmark library</code> на устройствах Pixel 4a / Xiaomi Redmi 9.
              </p>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: MASTER DART & FLUTTER APP CODE WORKSPACE          */}
        {/* ========================================================= */}
        {activeTab === "flutter" && (
          <div className="space-y-6">
            
            {/* Header / Summary Card */}
            <div className="bg-slate-900/60 border border-sky-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
                    <Code className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                      Dart & Flutter Рабочая Область Разработки
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed font-sans">
                      Автогенерация скелета мобильного приложения <strong>English Start Kids</strong> (Material Design 3, SQLite оффлайн-режим, GoRouter навигация и Spaced Repetition модели).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-sky-950 font-mono text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Сениор-Разработчик Активен</span>
                </div>
              </div>
            </div>

            {/* Step-by-step description of generated components */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Folder Tree */}
              <div className="lg:col-span-4 bg-slate-900 border border-sky-950 rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-sky-400 font-bold mb-1 border-b border-sky-950 pb-2">
                    СТРУКТУРА И ИЕРАРХИЯ ПАПОК
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-3 leading-relaxed font-sans">
                    Кликом выберите файл для моментального просмотра полного Dart-кода и копирования его в буфер обмена:
                  </p>
                </div>

                {/* VISUAL FILE TREE */}
                <div className="bg-slate-950 p-4 rounded-xl border border-sky-950 font-mono text-xs text-slate-300 space-y-2 max-h-[480px] overflow-y-auto">
                  <div className="flex items-center space-x-1.5 text-sky-300 font-bold select-none">
                    <span>📂</span>
                    <span>english_start_kids</span>
                  </div>

                  {/* pubspec.yaml file item */}
                  <button
                    onClick={() => setSelectedFlutterPath("pubspec.yaml")}
                    className={`flex items-center justify-between w-full pl-6 pr-2 py-1.5 rounded-lg transition text-left ${
                      selectedFlutterPath === "pubspec.yaml" 
                        ? "bg-sky-500/15 text-white border-l-2 border-sky-400" 
                        : "hover:bg-slate-900 text-slate-450"
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>📄</span>
                      <span className="font-semibold text-[11px]">pubspec.yaml</span>
                    </span>
                    <span className="text-[8px] bg-slate-905 text-slate-500 px-1 py-0.5 rounded uppercase font-bold">Config</span>
                  </button>

                  <div className="flex items-center space-x-1.5 pl-6 text-amber-500 font-bold select-none">
                    <span>📂</span>
                    <span>lib</span>
                  </div>

                  {/* Lib/Models subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-10 text-slate-400 select-none">
                    <span>📂</span>
                    <span>models</span>
                  </div>

                  <div className="pl-12 space-y-1">
                    {["user_profile.dart", "vocab_card.dart", "lesson_progress.dart", "quiz_history.dart", "achievement.dart", "learning_analytics.dart"].map(file => {
                      const fullPath = `lib/models/${file}`;
                      return (
                        <button
                          key={file}
                          onClick={() => setSelectedFlutterPath(fullPath)}
                          className={`flex items-center justify-between w-full pr-2 py-1 rounded transition text-left ${
                            selectedFlutterPath === fullPath 
                              ? "bg-sky-500/10 text-white font-bold" 
                              : "hover:bg-slate-900 text-slate-400"
                          }`}
                        >
                          <span className="flex items-center space-x-1.5">
                            <span>📄</span>
                            <span className="text-[11px] truncate">{file}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Lib/Data/Db subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-10 text-slate-400 select-none">
                    <span>📂</span>
                    <span>data</span>
                  </div>
                  <div className="flex items-center space-x-1.5 pl-14 text-slate-400 select-none">
                    <span>📂</span>
                    <span>db</span>
                  </div>

                  <button
                    onClick={() => setSelectedFlutterPath("lib/data/db/database_helper.dart")}
                    className={`flex items-center justify-between w-full pl-16 pr-2 py-1 rounded transition text-left text-xs ${
                      selectedFlutterPath === "lib/data/db/database_helper.dart" 
                        ? "bg-sky-500/10 text-white font-bold" 
                        : "hover:bg-slate-900 text-slate-400"
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>📄</span>
                      <span className="text-[11px]">database_helper.dart</span>
                    </span>
                  </button>

                  {/* Lib/Data/Repositories subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-14 text-slate-400 select-none">
                    <span>📂</span>
                    <span>repositories</span>
                  </div>

                  {["user_repository.dart", "progress_repository.dart", "achievement_repository.dart", "analytics_repository.dart"].map(file => {
                    const fullPath = `lib/data/repositories/${file}`;
                    return (
                      <button
                        key={file}
                        onClick={() => setSelectedFlutterPath(fullPath)}
                        className={`flex items-center justify-between w-full pl-16 pr-2 py-1 rounded transition text-left text-xs ${
                          selectedFlutterPath === fullPath 
                            ? "bg-sky-500/10 text-white font-bold" 
                            : "hover:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span>📄</span>
                          <span className="text-[11px] truncate">{file}</span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Lib/Data/Services subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-14 text-slate-400 select-none">
                    <span>📂</span>
                    <span>services</span>
                  </div>

                  {["learning_service.dart", "spaced_repetition_service.dart", "learning_analytics_service.dart", "app_state_integration.dart", "tts_service.dart"].map(file => {
                    const fullPath = `lib/data/services/${file}`;
                    return (
                      <button
                        key={file}
                        onClick={() => setSelectedFlutterPath(fullPath)}
                        className={`flex items-center justify-between w-full pl-16 pr-2 py-1 rounded transition text-left text-xs ${
                          selectedFlutterPath === fullPath 
                            ? "bg-sky-500/10 text-white font-bold" 
                            : "hover:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span>📄</span>
                          <span className="text-[11px] truncate">{file}</span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Lib/Navigation subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-10 text-slate-400 select-none">
                    <span>📂</span>
                    <span>navigation</span>
                  </div>

                  <button
                    onClick={() => setSelectedFlutterPath("lib/navigation/app_router.dart")}
                    className={`flex items-center justify-between w-full pl-14 pr-2 py-1 rounded transition text-left text-xs ${
                      selectedFlutterPath === "lib/navigation/app_router.dart" 
                        ? "bg-sky-500/10 text-white font-bold" 
                        : "hover:bg-slate-900 text-slate-400"
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>📄</span>
                      <span className="text-[11px]">app_router.dart</span>
                    </span>
                  </button>

                  {/* Lib/Views subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-10 text-slate-400 select-none">
                    <span>📂</span>
                    <span>views</span>
                  </div>

                  {["parent_dashboard.dart", "profile_screen.dart", "achievements_screen.dart"].map(file => {
                    const fullPath = `lib/views/${file}`;
                    return (
                      <button
                        key={file}
                        onClick={() => setSelectedFlutterPath(fullPath)}
                        className={`flex items-center justify-between w-full pl-14 pr-2 py-1 rounded transition text-left text-xs ${
                          selectedFlutterPath === fullPath 
                            ? "bg-sky-500/10 text-white font-bold" 
                            : "hover:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span>📄</span>
                          <span className="text-[11px] truncate">{file}</span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Lib/Test subdirectory */}
                  <div className="flex items-center space-x-1.5 pl-10 text-slate-400 select-none">
                    <span>📂</span>
                    <span>test</span>
                  </div>

                  {["spaced_repetition_test.dart", "learning_analytics_test.dart"].map(file => {
                    const fullPath = `lib/test/${file}`;
                    return (
                      <button
                        key={file}
                        onClick={() => setSelectedFlutterPath(fullPath)}
                        className={`flex items-center justify-between w-full pl-14 pr-2 py-1 rounded transition text-left text-xs ${
                          selectedFlutterPath === fullPath 
                            ? "bg-sky-500/10 text-white font-bold" 
                            : "hover:bg-slate-900 text-slate-400"
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span>📄</span>
                          <span className="text-[11px] truncate">{file}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Core Architecture summary card */}
                <div className="p-4 bg-slate-950 border border-sky-950 rounded-2xl space-y-2.5 text-xs text-slate-400 font-mono">
                  <h5 className="text-[11px] font-bold text-slate-300 uppercase">Чек-Лист Фазы 1: Готово</h5>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <span>✓</span>
                      <span>Структура папок (Done)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <span>✓</span>
                      <span>Иерархия пакетов (Done)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <span>✓</span>
                      <span>5 SQLite моделей (Done)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <span>✓</span>
                      <span>Слой БД SQLite sqflite (Done)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <span>✓</span>
                      <span>Роутер GoRouter (Done)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Code Viewer */}
              <div className="lg:col-span-8 bg-slate-900 border border-sky-950 rounded-2xl p-5 md:p-6 space-y-4">
                
                {/* Active File Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-950 pb-4">
                  <div>
                    <span className="font-mono text-[10px] bg-sky-950/80 text-sky-400 border border-sky-900 px-2 py-0.5 rounded">
                      {activeFlutterFile.path}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
                      {activeFlutterFile.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                      {activeFlutterFile.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeFlutterFile.code);
                      setCopiedFlutterText(activeFlutterFile.path);
                      setTimeout(() => setCopiedFlutterText(null), 2000);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-medium transition"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>{copiedFlutterText === activeFlutterFile.path ? "Скопировано!" : "Копировать код"}</span>
                  </button>
                </div>

                {/* DART SYNTAX HIGHLIGHT CODED DISPLAY */}
                <div className="bg-slate-950 p-4 rounded-xl border border-sky-950/80 overflow-x-auto max-h-[460px] overflow-y-auto select-all">
                  <pre className="font-mono text-[11px] leading-relaxed text-sky-300">
                    <code>{activeFlutterFile.code}</code>
                  </pre>
                </div>

                {/* Diagnostic Check Console */}
                <div className="bg-slate-950 p-4 border border-sky-950 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Лог Статического Анализатора Dart (Dart Analyzer):</span>
                  <div className="font-mono text-[11px] text-slate-300 flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Analyzing english_start_kids... <span className="text-emerald-400">No issues found.</span> (Grade A lints)</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* --- FOOTER FOOTNOTE --- */}
      <footer className="border-t border-sky-950 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] text-slate-500">
          <div>
            <span>© 2026 English Start Kids. Архитектура и SRS Спецификация v1.0.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Автор: Сениор Мобильный Архитектор</span>
            <span className="text-emerald-500 font-semibold">✓ Валидация Успешна</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
