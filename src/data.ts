export interface SRSSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: "overview" | "features" | "technical" | "ui-ux";
}

export const SRS_SECTIONS: SRSSection[] = [
  {
    id: "1_exec_summary",
    title: "1. Executive Summary & Core Mission",
    subtitle: "System overview, target audience demographics, and core functional assumptions.",
    category: "overview",
    content: `## 1.1 Project Introduction
"English Start Kids" is a highly interactive, local-first Android educational application designed to teach English to children aged 5-12 whose native language is Russian. The application relies on gamification, auditory-visual reinforcement, and cognitive retention algorithms to deliver an immersive, self-paced learning journey without requiring an active internet connection.

## 1.2 Target Audience Cohort Analysis
The system divides users into three distinct pedagogical levels to match cognitive capabilities:
- **Little Explorers (Ages 5-6):** Focuses on visual pairing, simple audio reproduction, basic colors, animals, and physical objects. Heavy reliance on phonics and microscale feedback loops.
- **Young Learners (Ages 7-9):** Introduces interactive word building, verb basics, conversational phrases, and basic spelling challenges.
- **Junior Achievers (Ages 10-12):** Features advanced vocabulary, conversational dialogue reading, syntactic structuring, and contextual quizzes with strict timing constraints.

## 1.3 Key Architectural Mandates
1. **Zero-Network Policy:** Fully functional offline (all database, assets, and voice capabilities must compile inside the APK).
2. **COPPA / GDPR-K Compliance:** Strictly no third-party telemetry, trackers, or cloud-side data ingestion. All profile data stays on-device in SQLite.
3. **Double Dashboard Paradigm:** Dedicated child interface (gamified, visual, whimsical) and a separate parent gate (analytical, structural, system monitoring with safety PIN protection).`
  },
  {
    id: "2_system_screens",
    title: "2. Full Screen Catalog & Navigation",
    subtitle: "Exhaustive description of screen behaviors, states, and action items.",
    category: "features",
    content: `## 2.1 The Screen Matrix
The Android application must expose exactly six primary screen canvases:

### Screen 1: Onboarding Gate & Hero Companion Choice
- **Functional Goal:** Establish the user profile, set learning age brackets, compile the local DB, and invite the child to select a virtual buddy.
- **Interactive Elements:**
  - Carousels of friendly hand-drawn cartoon buddies (Milo the Monkey, Bella the Bunny, Drake the Dragon).
  - Child-friendly age selector with illustration assets.
  - Parents bypass gate (holding gesture or basic arithmetic PIN test).
- **Core State Transitions:** Transition to Home Hub once the Room profile is initialized.

### Screen 2: Interactive Home Hub (Island Path map)
- **Functional Goal:** A visual progression map shaped like floating fantasy islands (e.g., Alleys, Forests, Cloud Castles), mapping to English modules (e.g., Food, Family, Colors).
- **Interactive Elements:**
  - Animated daily streak counter representing fire or a growing flower.
  - Active island buttons depicting user lock/unlock states.
  - Float-out Profile drawer showing stars, total accumulated XP, current level badge, and parent doorway.

### Screen 3: Gamified Lesson Workspace
- **Functional Goal:** Teach 6-8 new vocabulary words or interactive phrases through multisensory cards.
- **Interactive Elements:**
  - High-definition illustration panel with toggleable translation (Russian <-> English).
  - Triggerable "Speaker Icon" button mapping to the internal Android Text-To-Speech API.
  - Interactive "Mic Icon" with kid-friendly pitch detection or simulated local phonics matching.
  - Progress tracker showing the sequence of flashcards.

### Screen 4: Multivariant Quiz Console
- **Functional Goal:** Validate module retention through diverse evaluation modalities (written, read, heard).
- **Interactive Modal Types:**
  - **Listening Builder:** Audio triggers English word, child selects matching image from four options.
  - **Word Unscramble:** Interactive bubble letters that snap to target slots to form the correct translation.
  - **Memory Match:** A 3x4 grid card matching game (Russian word to English word card).
  - **Spelling Challenge:** Letter selector keys displaying instant micro-animations for incorrect inputs.

### Screen 5: XP & Reward Elevation Stage
- **Functional Goal:** Provide highly stylized, audio-visual feedback on lesson success, motivating repeating loops.
- **Visual Mechanics:**
  - Staggered entrance of 1, 2, or 3 glowing vector Stars based on score percentage.
  - Growing container fill animation indicating XP progression.
  - Unlock screens showing badges and newly available islands.

### Screen 6: Parent Monitoring Control Center
- **Functional Goal:** Give parents deep structural insights into the child's learning velocity without letting the child modify settings.
- **Secured Authentication:** Require a 4-digit safety math PIN (e.g., "7 x 8 = ?").
- **Key Features:**
  - Module mastery statistics (success ratios in charts).
  - Daily active time logs and study frequency analytics.
  - Database Reset console and Level Adjuster slider.
  - Export SQL backup trigger.`
  },
  {
    id: "3_lesson_quiz_logic",
    title: "3. Lesson & Quiz Algorithmic Engine",
    subtitle: "Pedagogical models, card progression mechanisms, and quiz scoring.",
    category: "features",
    content: `## 3.1 Pedagogical Structure of a Unit
Each theme (e.g., "Animals", "Food") represents a module consisting of exactly 3 components:
1. **Teaching Deck (Учебная Колода):** 6 target items. Visual representation, phonetic transcript, native audio track, Russian meaning. Requires at least 1 visual review and 1 speaker trigger per card to mark the deck completed.
2. **Interactive Practice (Практикум):** Mini activities requiring matching and spelling. Non-punitive, infinite retries, provides +5 XP per successful step.
3. **Module Quiz (Контрольный Квест):** 10 randomized questions based on the deck. Deducts "Health Hearts" (total 3) on errors. Completing the Quiz triggers the star grading metrics.

## 3.2 Dynamic Question Distribution
Quizzes dynamically fetch cards with high "mistake weight" from the local Room database using modified SuperMemo-2 elements:
- Cards with review intervals overdue are injected first.
- Audio-only validation makes up exactly 30% of questions.
- Word construction/spelling makes up exactly 40%.
- Visual Association makes up exactly 30%.`
  },
  {
    id: "4_xp_level_metrics",
    title: "4. Gamification, Streak & XP Math",
    subtitle: "Concrete mathematical parameters governing levels, streak multipliers, and rewards.",
    category: "technical",
    content: `## 4.1 The Experience Curve (XP) Formula
XP determines levels using a quadratic scale to maintain challenge and progressive goals. The XP threshold to reach Level $L$ is calculated as:
$$\\text{TargetXP}(L) = 100 \\times L^2 - 50 \\times L$$

### Progressive Experience Requirements Table:
| Current Level | Base XP Required for Level Up | Cumulative XP Needed |
| :---: | :---: | :---: |
| **1** | 50 XP | 50 XP |
| **2** | 300 XP | 350 XP |
| **3** | 750 XP | 1,100 XP |
| **4** | 1,400 XP | 2,500 XP |
| **5** | 2,250 XP | 4,750 XP |
| **10** | 9,500 XP | 32,500 XP |

## 4.2 Actionable XP Allocations
- 完成/Complete Teaching Deck Card: **+10 XP**
- Correct Quiz Answer (First Attempt): **+15 XP**
- Completed Lesson Modality Perfect Run (100%): **+50 Bonus XP**
- Completed Lesson Modality Very Good Run (90%+): **+25 Bonus XP**

## 4.3 Daily Streak Multiplier Calculation
Active consecutive days translate directly to multipliers for all XP earned during lessons:
$$\\text{StreakMultiplier}(S) = 1.0 + \\min(0.5, \\lfloor S / 7 \\rfloor \\times 0.1) + \\min(0.5, S \\times 0.01)$$

- **Streak 1-2 days:** $1.0\\times$ multiplier
- **Streak 7 days:** $1.17\\times$ multiplier (Includes +0.1 for crossing weeks milestone, +0.07 daily compounding)
- **Streak 30 days:** $1.6\\times$ maximum cap multiplier

## 4.4 Star Grading System
At the completion of a module quiz of $Q$ questions (where $Q=10$):
- **3 Stars (Gold Confetti):** Perfect or near-perfect accuracy (\\ge 90\\% correct).
- **2 Stars (Silver Sparkles):** Solid comprehension (70\\% - 89\\% correct).
- **1 Star (Bronze Accent):** Introductory level (50\\% - 69\\% correct).
- **0 Stars (Retry Stage):** Below 50% correct. Heart capacity depleted. Prompts child to review matching teaching deck.`
  },
  {
    id: "5_db_entity_schema",
    title: "5. SQLite / Room Database Architecture",
    subtitle: "Complete relational tables, indexes, data relationships, and initialization schemas.",
    category: "technical",
    content: `## 5.1 Room Database Schema Diagram
The persistence engine operates via SQLite Room. It contains 5 tightly coupled entities. Below is the structural layout of DB Tables:

\`\`\`sql
-- 1. Table: user_profile
-- Stores child statistics, state, selected hero companion
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    child_name TEXT NOT NULL,
    age_bracket INTEGER NOT NULL, -- 5-6 (1), 7-9 (2), 10-12 (3)
    hero_buddie_id TEXT NOT NULL, -- 'milo', 'bella', 'drake'
    current_level INTEGER NOT NULL DEFAULT 1,
    accumulated_xp INTEGER NOT NULL DEFAULT 0,
    star_balance INTEGER NOT NULL DEFAULT 0,
    daily_streak_count INTEGER NOT NULL DEFAULT 0,
    last_active_timestamp INTEGER NOT NULL,
    four_digit_pin TEXT NOT NULL DEFAULT '1234'
);

-- 2. Table: vocab_card
-- Master static vocabulary deck bundled locally inside resources raw/assets folders
CREATE TABLE vocab_card (
    id TEXT PRIMARY KEY NOT NULL,
    module_category TEXT NOT NULL, -- 'animals', 'food', 'colors', 'family'
    difficulty_rank INTEGER NOT NULL, -- 1, 2, 3
    english_word TEXT NOT NULL,
    russian_translation TEXT NOT NULL,
    phonetic_transcription TEXT NOT NULL,
    audio_path_identifier TEXT NOT NULL,
    image_asset_identifier TEXT NOT NULL
);

-- 3. Table: quiz_history
-- Tracks historic records of user performance for Spaced Repetition (SM-2 adaptation)
CREATE TABLE quiz_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    card_id TEXT NOT NULL,
    last_answered_timestamp INTEGER NOT NULL,
    consecutive_correct_hits INTEGER NOT NULL DEFAULT 0,
    difficulty_weight_factor REAL NOT NULL DEFAULT 2.5, -- analogous to SM-2 Ease Factor
    FOREIGN KEY(card_id) REFERENCES vocab_card(id) ON DELETE CASCADE
);

-- 4. Table: lesson_progress
-- Tracks star thresholds and unlock states of islands
CREATE TABLE lesson_progress (
    module_category TEXT PRIMARY KEY NOT NULL,
    maximum_stars_earned INTEGER NOT NULL DEFAULT 0,
    is_completed_at_least_once INTEGER NOT NULL DEFAULT 0,
    times_practiced INTEGER NOT NULL DEFAULT 0,
    is_unlocked INTEGER NOT NULL DEFAULT 0
);

-- 5. Table: system_achievement
-- Local achievement tracker state
CREATE TABLE system_achievement (
    achievement_id TEXT PRIMARY KEY NOT NULL, -- 'streak_7', 'first_quiz', 'star_50'
    name_native TEXT NOT NULL,
    requirement_description TEXT NOT NULL,
    is_unlocked INTEGER NOT NULL DEFAULT 0,
    unlocked_at_timestamp INTEGER
);
\`\`\`

## 5.2 SQLite Optimization & Indices
Ensure foreign key triggers are enabled on database load. Add composite index on \`vocab_card(module_category, difficulty_rank)\` to ensure instant fetch under $3\\text{ms}$ when loading lessons.`
  },
  {
    id: "6_offline_security",
    title: "6. Offline Optimization & Media Sync",
    subtitle: "Strict offline requirements, asset compilation, and TTS implementation.",
    category: "technical",
    content: `## 6.1 Local Asset Packaging Strategy
- **Image Formats:** Highly compressed vector-based drawable WebP templates. All assets must go under \`/res/drawable-nodpi/\` to prevent memory blowups on target tablets or cheap child phones.
- **Audio Clips:** Native pronuncation sound bites in single-channel OGG Vorbis layout (44.1kHz sample rate, 64kbps bit rate). Compiles into raw resources workspace.

## 6.2 Implementation of Text-to-Speech (TTS) Fallbacks
If pre-rendered audio asset files do not exist for advanced modules, the system must interact natively with Android's TTS engine:
\`\`\`kotlin
class PhoneticAudioPlayer(private val context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech = TextToSpeech(context, this)

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(Locale.US) // English instruction mandatory
            tts.setSpeechRate(0.75f) // Slower speech specifically calibrated for kid ears
            tts.setPitch(1.1f) // Slightly higher friendly pitch
        }
    }
    
    fun readWord(word: String) {
        tts.speak(word, TextToSpeech.QUEUE_FLUSH, null, "vocab_tts_id")
    }
}
\`\`\`

## 6.3 Security Boundaries & Data Isolation
No network permissions (\`<uses-permission android:name=\"android.permission.INTERNET\" />\`) should exist inside the \`AndroidManifest.xml\`. Direct local SQLite Room databases represent the sole source of truth.`
  },
  {
    id: "7_ui_ux_styleguide",
    title: "7. Gamified Kids-First UI/UX Guide",
    subtitle: "Aesthetic directions, styling specifications, Material 3 guidelines, and contrast.",
    category: "ui-ux",
    content: `## 7.1 Visual Paradigm
Unlike corporate business tools, "English Start Kids" must mimic tactile visual systems. Components look like soft clay, padded physical cards, or organic floating bubbles.

### 7.2 Core Color Board (Kid-Friendly Palette):
- **Skyline Canvas:** Light sky blue (\`#E3F2FD\` to \`#BBDEFB\`) for primary backgrounds, evoking openness.
- **Milo Jungle Green:** Playful warm green (\`#AEEA00\` / \`#C6FF00\`) for primary progress components, CTA, and successful buttons.
- **Cheer Amber Yellow:** Gold star amber (\`#FFD600\` / \`#FFEA00\`) representing achievements, sparks, and XP boosts.
- **Chubby Charcoal:** Deep tactile ink (\`#37474F\`) used for displays and readable headers. Offers 7.5:1 contrast against light sky backgrounds.
- **Heartbeat Red:** Coral crimson (\`#FF8A80\`) for health bar statuses and mistakes.

### 7.3 Sensory Contrast & Touch Calibration
- **No Small Touch Zones:** All interactives MUST adhere to a minimum size of **48dp x 48dp** (typically target **56dp** grid alignment).
- **Typography Sizing:** Headings should be styled using large playful display tracking:
  - Header displays: 28sp to 34sp
  - Body text: 16sp to 18sp
  - Never include tiny caption text (less than 14sp is strictly banned).
- **Physical Feedback:** Micro-vibrations triggers on word selection (using native \`HapticFeedbackConstants\`).`
  },
  {
    id: "8_perf_compliance",
    title: "8. Performance, Battery, & Regulatory COPPA",
    subtitle: "Telemetry rules, startup goals, and memory metrics.",
    category: "technical",
    content: `## 8.1 Performance Metric Budgets
- **Startup Launch Time:** Main UI must reach responsive state in **less than 1.2 seconds** on low-end budget phones (e.g., MTK6761 base processor, 3GB RAM).
- **Frame Rate Integrity:** Stable **60 FPS** on interactive path transitions and canvas animations. Heavy rely on hardware accelerators inside native Canvas draws.
- **Memory Footprint Ceiling:** Absolute memory allocation limit when actively running must not exceed **80MB** (guarded closely against memory leaks).

## 8.2 Battery Safety Mandates
To prevent overheating kid tablets, heavy physics calculations are banned. The game path must lock drawing threads when idle. Background wake-locks or polling are strictly forbidden.

## 8.3 COPPA / Parents Compliance Registry
- No data leaves the physical mobile device.
- Microtransactions or third-party ads are physically omitted from standard builds.
- All outbound safety gates (e.g., SQLite CSV progress export) require the 4-digit generated math PIN.`
  }
];

export interface QuestItem {
  question: string;
  russianInstructions: string;
  options: string[];
  correctAnswer: string;
  type: "choice" | "unscramble" | "listen";
  phonetic: string;
}

export const SAMPLE_QUIZ_MODULE: QuestItem[] = [
  {
    question: "Apple",
    russianInstructions: "Выберите правильный перевод для этого фрукта:",
    options: ["Яблоко", "Апельсин", "Банан", "Груша"],
    correctAnswer: "Яблоко",
    type: "choice",
    phonetic: "[ˈæp.əl]"
  },
  {
    question: "Dog",
    russianInstructions: "Какое это животное?",
    options: ["Кошка", "Собака", "Кролик", "Обезьяна"],
    correctAnswer: "Собака",
    type: "choice",
    phonetic: "[dɒɡ]"
  },
  {
    question: "Green",
    russianInstructions: "Какой этот цвет?",
    options: ["Красный", "Синий", "Зеленый", "Желтый"],
    correctAnswer: "Зеленый",
    type: "choice",
    phonetic: "[ɡriːn]"
  },
  {
    question: "Hello",
    russianInstructions: "Сложите английское слово 'Привет' из букв:",
    options: ["h", "e", "l", "l", "o"],
    correctAnswer: "hello",
    type: "unscramble",
    phonetic: "[həˈləʊ]"
  },
  {
    question: "Cat",
    russianInstructions: "Прослушайте произношение и сопоставьте:",
    options: ["Кот / Кошка", "Птица", "Лошадь", "Курица"],
    correctAnswer: "Кот / Кошка",
    type: "listen",
    phonetic: "[kæt]"
  }
];

export const STATIC_VOCAB_SEED = [
  { id: "a_apple", english: "Apple", russian: "Яблоко", transc: "[ˈæp.əl]", group: "Fruits" },
  { id: "a_banana", english: "Banana", russian: "Банан", transc: "[bəˈnɑː.nə]", group: "Fruits" },
  { id: "a_dog", english: "Dog", russian: "Собака", transc: "[dɒɡ]", group: "Animals" },
  { id: "a_cat", english: "Cat", russian: "Кошка", transc: "[kæt]", group: "Animals" },
  { id: "a_bunny", english: "Rabbit", russian: "Кролик", transc: "[ˈræb.ɪt]", group: "Animals" },
  { id: "a_green", english: "Green", russian: "Зеленый", transc: "[ɡriːn]", group: "Colors" },
  { id: "a_red", english: "Red", russian: "Красный", transc: "[red]", group: "Colors" },
  { id: "a_blue", english: "Blue", russian: "Синий", transc: "[bluː]", group: "Colors" },
  { id: "a_sun", english: "Sun", russian: "Солнце", transc: "[sʌn]", group: "Nature" },
  { id: "a_cloud", english: "Cloud", russian: "Облако", transc: "[klaʊd]", group: "Nature" },
];

export const MOCK_ACHIEVEMENTS = [
  { id: "first_lesson", name: "Первый урок (First Lesson)", desc: "Завершите своё самое первое занятие на островах знаний", reward: "50 XP", badge: "🌱", currentProgress: 1, targetProgress: 1 },
  { id: "alphabet_master", name: "Мастер алфавита (Alphabet Master)", desc: "Изучите и произнесите все буквы английского алфавита", reward: "150 XP", badge: "🔤", currentProgress: 18, targetProgress: 26 },
  { id: "words_50", name: "Изучено 50 слов (50 Words Learned)", desc: "Наберите в личную учебную картотеку 50 активных слов", reward: "100 XP", badge: "📚", currentProgress: 50, targetProgress: 50 },
  { id: "words_100", name: "Изучено 100 слов (100 Words Learned)", desc: "Свободно распознавайте 100 английских слов в квестах", reward: "250 XP", badge: "🏆", currentProgress: 72, targetProgress: 100 },
  { id: "words_500", name: "Изучено 500 слов (500 Words Learned)", desc: "Достигните словарного запаса продвинутого уровня в 500 слов", reward: "1000 XP", badge: "🥇", currentProgress: 140, targetProgress: 500 },
  { id: "streak_7", name: "7 дней ударного режима (7 Day Streak)", desc: "Поддерживайте серию занятий английским 7 дней подряд без пропусков", reward: "300 XP", badge: "⚡", currentProgress: 7, targetProgress: 7 },
  { id: "streak_30", name: "30 дней ударного режима (30 Day Streak)", desc: "Выдающаяся дисциплина: занимайтесь 30 дней подряд", reward: "1200 XP", badge: "🔥", currentProgress: 12, targetProgress: 30 },
  { id: "english_champion", name: "Чемпион английского (English Champion)", desc: "Успешно пройдите все золотые квесты со звёздами", reward: "2000 XP", badge: "👑", currentProgress: 3, targetProgress: 5 },
];
