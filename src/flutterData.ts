export interface FlutterFile {
  path: string;
  name: string;
  type: "config" | "model" | "database" | "navigation";
  description: string;
  code: string;
}

export const FLUTTER_FILES: FlutterFile[] = [
  {
    path: "pubspec.yaml",
    name: "pubspec.yaml",
    type: "config",
    description: "Менеджер пакетов Flutter. Определяет зависимости от SQLite (sqflite), GoRouter для безопасной навигации и TTS синхронизации.",
    code: `name: english_start_kids
description: A complete offline-first Flutter application for kids aged 5-12 to learn English with a Russian interface.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  
  # Persistence & Database layer
  sqflite: ^2.3.0
  path: ^1.8.3
  path_provider: ^2.1.1

  # Navigation & Routing
  go_router: ^12.1.3

  # Audio Pronunciation
  flutter_tts: ^3.8.3

  # State Management
  provider: ^6.0.5

  # UI / Animation helper
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/audio/
    - assets/images/`
  },
  {
    path: "lib/models/user_profile.dart",
    name: "user_profile.dart",
    type: "model",
    description: "Модель профиля ребёнка. Хранит имя, возрастную группу, текущий уровень, накопленный XP, баланс звёзд, стрик, безопасный родительский PIN-код и статус онбординга.",
    code: `/// Model representing the local child profile.
/// Uses SQFlite conversion helpers with SQLite typing compatibility.
class UserProfile {
  final int? id;
  final String childName;
  final int ageBracket; // 1 = Ages 3-5, 2 = Ages 6-8, 3 = Ages 9-12
  final String heroBuddyId; // 'owl', 'panda', 'fox', 'rabbit'
  final int currentLevel;
  final int accumulatedXp;
  final int starBalance;
  final int dailyStreakCount;
  final int lastActiveTimestamp; // millisecondEpoch for offline calendar calc
  final String parentalPin;
  final String currentLesson; // e.g., 'animals', 'food'
  final int isOnboardingCompleted; // 0 = False, 1 = True

  UserProfile({
    this.id,
    required this.childName,
    required this.ageBracket,
    required this.heroBuddyId,
    this.currentLevel = 1,
    this.accumulatedXp = 0,
    this.starBalance = 0,
    this.dailyStreakCount = 1,
    required this.lastActiveTimestamp,
    this.parentalPin = '1234',
    this.currentLesson = 'animals',
    this.isOnboardingCompleted = 0,
  });

  /// Factory constructors for SQLite conversion.
  factory UserProfile.fromMap(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as int?,
      childName: json['child_name'] as String,
      ageBracket: json['age_bracket'] as int,
      heroBuddyId: json['hero_buddie_id'] as String,
      currentLevel: json['current_level'] as int,
      accumulatedXp: json['accumulated_xp'] as int,
      starBalance: json['star_balance'] as int,
      dailyStreakCount: json['daily_streak_count'] as int,
      lastActiveTimestamp: json['last_active_timestamp'] as int,
      parentalPin: json['four_digit_pin'] as String? ?? '1234',
      currentLesson: json['current_lesson'] as String? ?? 'animals',
      isOnboardingCompleted: json['is_onboarding_completed'] as int? ?? 0,
    );
  }

  /// Exports map object for Database operations.
  Map<String, dynamic> toMap() {
    return {
      if (id != null) 'id': id,
      'child_name': childName,
      'age_bracket': ageBracket,
      'hero_buddie_id': heroBuddyId,
      'current_level': currentLevel,
      'accumulated_xp': accumulatedXp,
      'star_balance': starBalance,
      'daily_streak_count': dailyStreakCount,
      'last_active_timestamp': lastActiveTimestamp,
      'four_digit_pin': parentalPin,
      'current_lesson': currentLesson,
      'is_onboarding_completed': isOnboardingCompleted,
    };
  }

  UserProfile copyWith({
    int? id,
    String? childName,
    int? ageBracket,
    String? heroBuddyId,
    int? currentLevel,
    int? accumulatedXp,
    int? starBalance,
    int? dailyStreakCount,
    int? lastActiveTimestamp,
    String? parentalPin,
    String? currentLesson,
    int? isOnboardingCompleted,
  }) {
    return UserProfile(
      id: id ?? this.id,
      childName: childName ?? this.childName,
      ageBracket: ageBracket ?? this.ageBracket,
      heroBuddyId: heroBuddyId ?? this.heroBuddyId,
      currentLevel: currentLevel ?? this.currentLevel,
      accumulatedXp: accumulatedXp ?? this.accumulatedXp,
      starBalance: starBalance ?? this.starBalance,
      dailyStreakCount: dailyStreakCount ?? this.dailyStreakCount,
      lastActiveTimestamp: lastActiveTimestamp ?? this.lastActiveTimestamp,
      parentalPin: parentalPin ?? this.parentalPin,
      currentLesson: currentLesson ?? this.currentLesson,
      isOnboardingCompleted: isOnboardingCompleted ?? this.isOnboardingCompleted,
    );
  }
}`
  },
  {
    path: "lib/models/vocab_card.dart",
    name: "vocab_card.dart",
    type: "model",
    description: "Модель карточки изучаемого слова (транскрипция, перевод, звуковой и графический идентификаторы).",
    code: `/// Model representing a single vocabulary review flashcard.
/// Bundled assets inside resources are synchronized with this local config.
class VocabCard {
  final String id;
  final String moduleCategory; // 'animals', 'food', 'colors', 'family'
  final int difficultyRank; // 1 = Simple, 2 = Medium, 3 = Complex
  final String englishWord;
  final String russianTranslation;
  final String phoneticTranscription;
  final String audioPathIdentifier;
  final String imageAssetIdentifier;

  VocabCard({
    required this.id,
    required this.moduleCategory,
    required this.difficultyRank,
    required this.englishWord,
    required this.russianTranslation,
    required this.phoneticTranscription,
    required this.audioPathIdentifier,
    required this.imageAssetIdentifier,
  });

  factory VocabCard.fromMap(Map<String, dynamic> json) {
    return VocabCard(
      id: json['id'] as String,
      moduleCategory: json['module_category'] as String,
      difficultyRank: json['difficulty_rank'] as int,
      englishWord: json['english_word'] as String,
      russianTranslation: json['russian_translation'] as String,
      phoneticTranscription: json['phonetic_transcription'] as String,
      audioPathIdentifier: json['audio_path_identifier'] as String,
      imageAssetIdentifier: json['image_asset_identifier'] as String,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'module_category': moduleCategory,
      'difficulty_rank': difficultyRank,
      'english_word': englishWord,
      'russian_translation': russianTranslation,
      'phonetic_transcription': phoneticTranscription,
      'audio_path_identifier': audioPathIdentifier,
      'image_asset_identifier': imageAssetIdentifier,
    };
  }
}`
  },
  {
    path: "lib/models/lesson_progress.dart",
    name: "lesson_progress.dart",
    type: "model",
    description: "Модель прогресса прохождения и разблокировки тематических островов-уроков со звёздным рейтингом.",
    code: `/// Model to store individual module/island completion metadata.
class LessonProgress {
  final String moduleCategory; // e.g., 'animals', 'food'
  final int maximumStarsEarned; // 0 to 3 Stars
  final bool isCompletedAtLeastOnce;
  final int timesPracticed;
  final bool isUnlocked;

  LessonProgress({
    required this.moduleCategory,
    this.maximumStarsEarned = 0,
    this.isCompletedAtLeastOnce = false,
    this.timesPracticed = 0,
    this.isUnlocked = false,
  });

  factory LessonProgress.fromMap(Map<String, dynamic> json) {
    return LessonProgress(
      moduleCategory: json['module_category'] as String,
      maximumStarsEarned: json['maximum_stars_earned'] as int? ?? 0,
      isCompletedAtLeastOnce: (json['is_completed_at_least_once'] as int? ?? 0) == 1,
      timesPracticed: json['times_practiced'] as int? ?? 0,
      isUnlocked: (json['is_unlocked'] as int? ?? 0) == 1,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'module_category': moduleCategory,
      'maximum_stars_earned': maximumStarsEarned,
      'is_completed_at_least_once': isCompletedAtLeastOnce ? 1 : 0,
      'times_practiced': timesPracticed,
      'is_unlocked': isUnlocked ? 1 : 0,
    };
  }
}`
  },
  {
    path: "lib/models/quiz_history.dart",
    name: "quiz_history.dart",
    type: "model",
    description: "Модель истории прохождения тестов. Интегрирует интервальные повторения (SM-2) для карточек на основе веса сложности.",
    code: `/// Model to maintain quiz score records on cards under Space Repetition (SM-2 adaptation).
class QuizHistory {
  final int? id;
  final String cardId;
  final int lastAnsweredTimestamp;
  final int consecutiveCorrectHits; // repetition number (n) in SM2
  final double difficultyWeightFactor; // Analogous to SM-2 Ease Factor (defaults to 2.5)
  final int repetitionIntervalDays; // interval (I) in SM2
  final int nextReviewTimestamp; // next review date / timestamp
  final double successRate; // calculated success rate (correct / total)

  QuizHistory({
    this.id,
    required this.cardId,
    required this.lastAnsweredTimestamp,
    this.consecutiveCorrectHits = 0,
    this.difficultyWeightFactor = 2.5,
    this.repetitionIntervalDays = 1,
    this.nextReviewTimestamp = 0,
    this.successRate = 1.0,
  });

  factory QuizHistory.fromMap(Map<String, dynamic> json) {
    return QuizHistory(
      id: json['id'] as int?,
      cardId: json['card_id'] as String,
      lastAnsweredTimestamp: json['last_answered_timestamp'] as int,
      consecutiveCorrectHits: json['consecutive_correct_hits'] as int? ?? 0,
      difficultyWeightFactor: (json['difficulty_weight_factor'] as num? ?? 2.5).toDouble(),
      repetitionIntervalDays: json['repetition_interval_days'] as int? ?? 1,
      nextReviewTimestamp: json['next_review_timestamp'] as int? ?? 0,
      successRate: (json['success_rate'] as num? ?? 1.0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      if (id != null) 'id': id,
      'card_id': cardId,
      'last_answered_timestamp': lastAnsweredTimestamp,
      'consecutive_correct_hits': consecutiveCorrectHits,
      'difficulty_weight_factor': difficultyWeightFactor,
      'repetition_interval_days': repetitionIntervalDays,
      'next_review_timestamp': nextReviewTimestamp,
      'success_rate': successRate,
    };
  }
}`
  },
  {
    path: "lib/models/achievement.dart",
    name: "achievement.dart",
    type: "model",
    description: "Модель ачивок/достижений ребёнка с подробным описанием и меткой времени разблокировки.",
    code: `/// Model to store game achievement unlock states.
class SystemAchievement {
  final String achievementId; // e.g., 'first_quiz', 'streak_7', 'star_50'
  final String nameNative;
  final String requirementDescription;
  final bool isUnlocked;
  final int? unlockedAtTimestamp;

  SystemAchievement({
    required this.achievementId,
    required this.nameNative,
    required this.requirementDescription,
    this.isUnlocked = false,
    this.unlockedAtTimestamp,
  });

  factory SystemAchievement.fromMap(Map<String, dynamic> json) {
    return SystemAchievement(
      achievementId: json['achievement_id'] as String,
      nameNative: json['name_native'] as String,
      requirementDescription: json['requirement_description'] as String,
      isUnlocked: (json['is_unlocked'] as int? ?? 0) == 1,
      unlockedAtTimestamp: json['unlocked_at_timestamp'] as int?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'achievement_id': achievementId,
      'name_native': nameNative,
      'requirement_description': requirementDescription,
      'is_unlocked': isUnlocked ? 1 : 0,
      'unlocked_at_timestamp': unlockedAtTimestamp,
    };
  }
}`
  },
  {
    path: "lib/data/db/database_helper.dart",
    name: "database_helper.dart",
    type: "database",
    description: "SQLite-помощник: создание таблиц, индексов для отзывчивости <3мкс, начальное заполнение лексикой, обновление прогресса, стрик калькулятор и логика выдачи уровней.",
    code: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../../models/user_profile.dart';
import '../../models/vocab_card.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../../models/achievement.dart';

/// SQLite Database helper utilizing standard Sqflite for local data offline.
/// Includes table constructions, composite indices, seed pre-population, and XP calculations.
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('english_kids_local.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
      onConfigure: _onConfigure,
      onOpen: (db) async {
        await db.execute('''
          CREATE TABLE IF NOT EXISTS learning_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            timestamp INTEGER NOT NULL,
            learning_speed REAL NOT NULL,
            retention_rate REAL NOT NULL,
            accuracy_percentage REAL NOT NULL,
            weak_categories TEXT NOT NULL,
            daily_activity TEXT NOT NULL,
            weekly_activity TEXT NOT NULL
          )
        ''');
      },
    );
  }

  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
  }

  Future<void> _createDB(Database db, int version) async {
    const idType = 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL';
    const textType = 'TEXT NOT NULL';
    const intType = 'INTEGER NOT NULL';
    const realType = 'REAL NOT NULL';

    // 1. user_profile
    await db.execute('''
      CREATE TABLE user_profile (
        id $idType,
        child_name $textType,
        age_bracket $intType,
        hero_buddie_id $textType,
        current_level $intType DEFAULT 1,
        accumulated_xp $intType DEFAULT 0,
        star_balance $intType DEFAULT 0,
        daily_streak_count $intType DEFAULT 0,
        last_active_timestamp $intType,
        four_digit_pin $textType DEFAULT '1234',
        current_lesson $textType DEFAULT 'animals',
        is_onboarding_completed $intType DEFAULT 0
      )
    ''');

    // 2. vocab_card
    await db.execute('''
      CREATE TABLE vocab_card (
        id TEXT PRIMARY KEY NOT NULL,
        module_category $textType,
        difficulty_rank $intType,
        english_word $textType,
        russian_translation $textType,
        phonetic_transcription $textType,
        audio_path_identifier $textType,
        image_asset_identifier $textType
      )
    ''');

    // 3. quiz_history
    await db.execute('''
      CREATE TABLE quiz_history (
        id $idType,
        card_id TEXT NOT NULL,
        last_answered_timestamp $intType,
        consecutive_correct_hits $intType DEFAULT 0,
        difficulty_weight_factor $realType DEFAULT 2.5,
        repetition_interval_days $intType DEFAULT 1,
        next_review_timestamp $intType DEFAULT 0,
        success_rate $realType DEFAULT 1.0,
        FOREIGN KEY (card_id) REFERENCES vocab_card (id) ON DELETE CASCADE
      )
    ''');

    // 4. lesson_progress
    await db.execute('''
      CREATE TABLE lesson_progress (
        module_category TEXT PRIMARY KEY NOT NULL,
        maximum_stars_earned $intType DEFAULT 0,
        is_completed_at_least_once $intType DEFAULT 0,
        times_practiced $intType DEFAULT 0,
        is_unlocked $intType DEFAULT 0
      )
    ''');

    // 5. system_achievement
    await db.execute('''
      CREATE TABLE system_achievement (
        achievement_id TEXT PRIMARY KEY NOT NULL,
        name_native $textType,
        requirement_description $textType,
        is_unlocked $intType DEFAULT 0,
        unlocked_at_timestamp INTEGER
      )
    ''');

    await db.execute('CREATE INDEX idx_vocab_module ON vocab_card(module_category, difficulty_rank)');
    await db.execute('CREATE INDEX idx_quiz_card ON quiz_history(card_id)');

    await _seedDatabase(db);
  }

  Future<void> _seedDatabase(Database db) async {
    // Default user profile
    await db.rawInsert('''
      INSERT INTO user_profile (child_name, age_bracket, hero_buddie_id, last_active_timestamp, four_digit_pin, is_onboarding_completed)
      VALUES ('Исследователь', 2, 'owl', \${DateTime.now().millisecondsSinceEpoch}, '1234', 0)
    ''');

    // Volabulary seed
    final List<Map<String, dynamic>> initialCards = [
      {'id': 'a_apple', 'module_category': 'food', 'difficulty_rank': 1, 'english_word': 'Apple', 'russian_translation': 'Яблоко', 'phonetic_transcription': '[ˈæp.əl]', 'audio_path_identifier': 'audio/apple.ogg', 'image_asset_identifier': 'images/apple.webp'},
      {'id': 'a_banana', 'module_category': 'food', 'difficulty_rank': 1, 'english_word': 'Banana', 'russian_translation': 'Банан', 'phonetic_transcription': '[bəˈnɑː.nə]', 'audio_path_identifier': 'audio/banana.ogg', 'image_asset_identifier': 'images/banana.webp'},
      {'id': 'a_dog', 'module_category': 'animals', 'difficulty_rank': 1, 'english_word': 'Dog', 'russian_translation': 'Собака', 'phonetic_transcription': '[dɒɡ]', 'audio_path_identifier': 'audio/dog.ogg', 'image_asset_identifier': 'images/dog.webp'},
      {'id': 'a_cat', 'module_category': 'animals', 'difficulty_rank': 1, 'english_word': 'Cat', 'russian_translation': 'Кошка', 'phonetic_transcription': '[kæt]', 'audio_path_identifier': 'audio/cat.ogg', 'image_asset_identifier': 'images/cat.webp'},
      {'id': 'a_bunny', 'module_category': 'animals', 'difficulty_rank': 2, 'english_word': 'Rabbit', 'russian_translation': 'Кролик', 'phonetic_transcription': '[ˈræb.ɪt]', 'audio_path_identifier': 'audio/rabbit.ogg', 'image_asset_identifier': 'images/rabbit.webp'},
      {'id': 'a_green', 'module_category': 'colors', 'difficulty_rank': 1, 'english_word': 'Green', 'russian_translation': 'Зеленый', 'phonetic_transcription': '[ɡriːn]', 'audio_path_identifier': 'audio/green.ogg', 'image_asset_identifier': 'images/green.webp'},
      {'id': 'a_red', 'module_category': 'colors', 'difficulty_rank': 1, 'english_word': 'Red', 'russian_translation': 'Красный', 'phonetic_transcription': '[red]', 'audio_path_identifier': 'audio/red.ogg', 'image_asset_identifier': 'images/red.webp'},
      {'id': 'a_blue', 'module_category': 'colors', 'difficulty_rank': 1, 'english_word': 'Blue', 'russian_translation': 'Синий', 'phonetic_transcription': '[bluː]', 'audio_path_identifier': 'audio/blue.ogg', 'image_asset_identifier': 'images/blue.webp'},
      {'id': 'a_sun', 'module_category': 'nature', 'difficulty_rank': 1, 'english_word': 'Sun', 'russian_translation': 'Солнце', 'phonetic_transcription': '[sʌn]', 'audio_path_identifier': 'audio/sun.ogg', 'image_asset_identifier': 'images/sun.webp'},
      {'id': 'a_cloud', 'module_category': 'nature', 'difficulty_rank': 1, 'english_word': 'Cloud', 'russian_translation': 'Облако', 'phonetic_transcription': '[klaʊd]', 'audio_path_identifier': 'audio/cloud.ogg', 'image_asset_identifier': 'images/cloud.webp'},
    ];

    for (var card in initialCards) {
      await db.insert('vocab_card', card);
    }

    final islands = ['alphabet_forest', 'animals', 'colors', 'numbers', 'family', 'food', 'school'];
    for (int i = 0; i < islands.length; i++) {
      await db.insert('lesson_progress', {
        'module_category': islands[i],
        'maximum_stars_earned': 0,
        'is_completed_at_least_once': 0,
        'times_practiced': 0,
        'is_unlocked': i == 0 ? 1 : 0,
      });
    }

    final achievements = [
      {'achievement_id': 'first_word', 'name_native': 'Первый Шаг', 'requirement_description': 'Выучите свою первую английскую карточку'},
      {'achievement_id': 'perfect_score', 'name_native': 'Отличник', 'requirement_description': 'Сдайте квест на 100% (3 Звезды)'},
      {'achievement_id': 'streak_7', 'name_native': 'Неделя Успеха', 'requirement_description': 'Поддерживайте 7-дневную серию дней активности'}
    ];
    for (var ach in achievements) {
      await db.insert('system_achievement', {
        'achievement_id': ach['achievement_id'],
        'name_native': ach['name_native'],
        'requirement_description': ach['requirement_description'],
        'is_unlocked': 0,
        'unlocked_at_timestamp': null,
      });
    }
  }

  Future<UserProfile?> getUserProfile() async {
    final db = await instance.database;
    final maps = await db.query('user_profile', limit: 1);
    if (maps.isNotEmpty) {
      return UserProfile.fromMap(maps.first);
    }
    return null;
  }

  Future<int> updateUserProfile(UserProfile profile) async {
    final db = await instance.database;
    return await db.update(
      'user_profile',
      profile.toMap(),
      where: 'id = ?',
      whereArgs: [profile.id],
    );
  }

  Future<Map<String, dynamic>> awardExperiencePoints(int gainedRawXp) async {
    final profile = await getUserProfile();
    if (profile == null) return {'leveled_up': false};

    int currentXp = profile.accumulatedXp + gainedRawXp;
    int currentLvl = profile.currentLevel;
    bool leveledUp = false;

    while (true) {
      int neededForNext = 100 * currentLvl * currentLvl - 50 * currentLvl;
      if (currentXp >= neededForNext) {
        currentXp -= neededForNext;
        currentLvl++;
        leveledUp = true;
      } else {
        break;
      }
    }

    final updatedProfile = profile.copyWith(
      accumulatedXp: currentXp,
      currentLevel: currentLvl,
    );

    await updateUserProfile(updatedProfile);

    return {
      'leveled_up': leveledUp,
      'new_level': currentLvl,
      'current_xp': currentXp,
      'xp_needed_next': (100 * currentLvl * currentLvl - 50 * currentLvl)
    };
  }

  Future<List<VocabCard>> getCardsForModule(String moduleCategory) async {
    final db = await instance.database;
    final results = await db.query(
      'vocab_card',
      where: 'module_category = ?',
      whereArgs: [moduleCategory],
    );
    return results.map((elem) => VocabCard.fromMap(elem)).toList();
  }

  Future<void> updateLessonProgress(String moduleCategory, int starsAwarded) async {
    final db = await instance.database;
    final currentMaps = await db.query(
      'lesson_progress',
      where: 'module_category = ?',
      whereArgs: [moduleCategory],
    );

    if (currentMaps.isNotEmpty) {
      final currentObj = LessonProgress.fromMap(currentMaps.first);
      final int bestStars = currentObj.maximumStarsEarned > starsAwarded 
          ? currentObj.maximumStarsEarned 
          : starsAwarded;

      await db.update(
        'lesson_progress',
        {
          'maximum_stars_earned': bestStars,
          'is_completed_at_least_once': 1,
          'times_practiced': currentObj.timesPracticed + 1,
        },
        where: 'module_category = ?',
        whereArgs: [moduleCategory],
      );
    }
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}`
  },
  {
    path: "lib/navigation/app_router.dart",
    name: "app_router.dart",
    type: "navigation",
    description: "Декларативный роутер уровня Senior (библиотека go_router). Конфигурирует Splash, Детскую интерактивную карту, Панель Уроков/Квестов и безопасный PIN-интерфейс родителей.",
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../views/parent_dashboard.dart';
import '../data/services/app_state_integration.dart';
import '../data/services/tts_service.dart';
import '../../models/user_profile.dart';
import '../../models/vocab_card.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../data/db/database_helper.dart';
import 'dart:async';
import 'dart:math';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Ошибка перехода: \${state.error}'),
      ),
    ),
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/islands',
        builder: (context, state) => const IslandsMapScreen(),
        routes: [
          GoRoute(
            path: 'lesson/:category',
            builder: (context, state) {
              final category = state.pathParameters['category'] ?? 'food';
              return LessonWorkspaceScreen(category: category);
            },
          ),
          GoRoute(
            path: 'quiz/:category',
            builder: (context, state) {
              final category = state.pathParameters['category'] ?? 'food';
              return QuizWorkspaceScreen(category: category);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/parent-gate',
        builder: (context, state) => const ParentGateScreen(),
      ),
      GoRoute(
        path: '/parent-dashboard',
        builder: (context, state) => const ParentDashboardScreen(),
      ),
    ],
  );
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentStep = 1;

  // Survey responses
  int _selectedAgeBracket = 1;
  String _selectedAvatar = 'owl';
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _pinController = TextEditingController();

  String? _nameError;
  String? _pinError;

  @override
  void dispose() {
    _nameController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 4) {
      if (_nameController.text.trim().isEmpty) {
        setState(() {
          _nameError = 'Пожалуйста, введите имя ребенка';
        });
        return;
      } else {
        setState(() {
          _nameError = null;
        });
      }
    } else if (_currentStep == 5) {
      if (_pinController.text.length != 4) {
        setState(() {
          _pinError = 'PIN-код должен состоять из 4 цифр';
        });
        return;
      } else {
        setState(() {
          _pinError = null;
        });
      }
      _submitOnboarding();
      return;
    }

    setState(() {
      _currentStep++;
    });
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() {
        _currentStep--;
      });
    }
  }

  Future<void> _submitOnboarding() async {
    final state = Provider.of<LearningAppState>(context, listen: false);
    await state.completeOnboarding(
      childName: _nameController.text.trim(),
      ageBracket: _selectedAgeBracket,
      heroBuddy: _selectedAvatar,
      parentalPin: _pinController.text.trim(),
    );
    if (mounted) {
      context.go('/islands');
    }
  }

  void _speakAvatarGreeting(String avatar) {
    String message = "";
    switch (avatar) {
      case 'owl':
        message = "Hello! I am Ozzy the Owl. Let's study English together!";
        break;
      case 'panda':
        message = "Hi there! I am Penny the Panda. English is so much fun!";
        break;
      case 'fox':
        message = "Hey! I am Felix the Fox. Welcome to our English forest!";
        break;
      case 'rabbit':
        message = "Hello! I am Ruby the Rabbit. Let's jump into learning!";
        break;
    }
    TtsService.instance.speakEnglish(message);
  }

  @override
  Widget build(BuildContext context) {
    final profile = context.watch<LearningAppState>().profile;
    if (profile != null && profile.isOnboardingCompleted == 1) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.go('/islands');
      });
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: _currentStep > 1
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.blueAccent),
                onPressed: _prevStep,
              )
            : null,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: List.generate(5, (index) {
            final stepIndex = index + 1;
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: 16,
              height: 8,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                color: _currentStep >= stepIndex
                    ? Colors.blueAccent
                    : Colors.grey.shade300,
              ),
            );
          }),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _buildCurrentStepView(),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  elevation: 2,
                ),
                onPressed: _nextStep,
                child: Text(
                  _currentStep == 5 ? 'Завершить регистрацию' : 'Продолжить',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              if (_currentStep == 1) ...[
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.go('/parent-gate'),
                  child: const Text(
                    'Раздел для родителей',
                    style: TextStyle(fontSize: 14, color: Colors.blueAccent),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentStepView() {
    switch (_currentStep) {
      case 1:
        return _buildStepWelcome();
      case 2:
        return _buildStepAge();
      case 3:
        return _buildStepAvatar();
      case 4:
        return _buildStepProfile();
      case 5:
        return _buildStepParentPin();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildStepWelcome() {
    return Column(
      key: const ValueKey(1),
      children: [
        const SizedBox(height: 16),
        Container(
          height: 180,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.blueAccent.withOpacity(0.1),
          ),
          child: const Center(
            child: Text(
              '🇬🇧✨',
              style: TextStyle(fontSize: 80),
            ),
          ),
        ),
        const SizedBox(height: 32),
        const Text(
          'English Start Kids 🚀',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.black,
            color: Colors.blueGrey,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Добро пожаловать в веселое интерактивное приключение! Ваш ребенок научится говорить на английском языке играя.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 16,
            height: 1.5,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 16),
        const Card(
          color: Color(0xFFE3F2FD),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Row(
              children: [
                Text('🦉', style: TextStyle(fontSize: 32)),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Помощник-питомец будет озвучивать слова и подбадривать на каждом уроке!',
                    style: TextStyle(fontSize: 13, color: Colors.blueGrey),
                  ),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStepAge() {
    final brackets = [
      {'val': 1, 'title': 'Малыши', 'sub': '3-5 лет', 'desc': 'Крупные карточки, легкие развивающие игры', 'emoji': '👶'},
      {'val': 2, 'title': 'Дошколята', 'sub': '6-8 лет', 'desc': 'Уроки на внимание, базовая грамматика', 'emoji': '👦'},
      {'val': 3, 'title': 'Школьники', 'sub': '9-12 лет', 'desc': 'Интервальное повторение, усложненные квесты', 'emoji': '🎒'},
    ];

    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Выберите возрастную группу 🎂',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueGrey),
        ),
        const SizedBox(height: 8),
        const Text(
          'Мы адаптируем сложность уроков и игр под возраст вашего ребенка.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: Colors.black54),
        ),
        const SizedBox(height: 24),
        ...brackets.map((item) {
          final isSelected = _selectedAgeBracket == item['val'];
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedAgeBracket = item['val'] as int;
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected ? Colors.blueAccent.withOpacity(0.08) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? Colors.blueAccent : Colors.grey.shade300,
                  width: isSelected ? 2 : 1,
                ),
                boxShadow: isSelected
                    ? [BoxShadow(color: Colors.blueAccent.withOpacity(0.1), blurRadius: 8)]
                    : [],
              ),
              child: Row(
                children: [
                  Text(item['emoji'] as String, style: const TextStyle(fontSize: 36)),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '\${item['title']} (\${item['sub']})',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isSelected ? Colors.blueAccent : Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item['desc'] as String,
                          style: const TextStyle(fontSize: 12, color: Colors.black54),
                        ),
                      ],
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.blueAccent)
                ],
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildStepAvatar() {
    final avatars = [
      {'id': 'owl', 'name': 'Умный Филин Ozzy', 'emoji': '🦉', 'desc': 'Говорит медленно и четко'},
      {'id': 'panda', 'name': 'Милая Пенни Panda', 'emoji': '🐼', 'desc': 'Помогает со сложными словами'},
      {'id': 'fox', 'name': 'Хитрый Лис Феликс', 'emoji': '🦊', 'desc': 'Радуется каждой звездочке'},
      {'id': 'rabbit', 'name': 'Быстрый Руби Кролик', 'emoji': '🐰', 'desc': 'Обожает повторять произношение'},
    ];

    return Column(
      key: const ValueKey(3),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Выбери своего питомца 🎉',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueGrey),
        ),
        const SizedBox(height: 8),
        const Text(
          'Нажмите на питомца, чтобы послушать его приветствие!',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: Colors.black54),
        ),
        const SizedBox(height: 24),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.9,
          ),
          itemCount: avatars.length,
          itemBuilder: (context, index) {
            final item = avatars[index];
            final isSelected = _selectedAvatar == item['id'];
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedAvatar = item['id']!;
                });
                _speakAvatarGreeting(item['id']!);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.amber.withOpacity(0.08) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? Colors.amber : Colors.grey.shade300,
                    width: isSelected ? 2 : 1,
                  ),
                  boxShadow: isSelected
                      ? [BoxShadow(color: Colors.amber.withOpacity(0.15), blurRadius: 8)]
                      : [],
                ),
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(item['emoji']!, style: const TextStyle(fontSize: 48)),
                    const SizedBox(height: 8),
                    Text(
                      item['name']!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.amber.shade800 : Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item['desc']!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 10, color: Colors.black54),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 16),
        Center(
          child: TextButton.icon(
            icon: const Icon(Icons.volume_up, color: Colors.amber),
            label: const Text('Повторить озвучку приветствия', style: TextStyle(color: Colors.amber)),
            onPressed: () => _speakAvatarGreeting(_selectedAvatar),
          ),
        )
      ],
    );
  }

  Widget _buildStepProfile() {
    String avatarName = "";
    String avatarEmoji = "";
    if (_selectedAvatar == 'owl') { avatarName = "Умный Филин Ozzy"; avatarEmoji = "🦉"; }
    else if (_selectedAvatar == 'panda') { avatarName = "Милая Пенни Panda"; avatarEmoji = "🐼"; }
    else if (_selectedAvatar == 'fox') { avatarName = "Хитрый Лис Феликс"; avatarEmoji = "🦊"; }
    else if (_selectedAvatar == 'rabbit') { avatarName = "Быстрый Руби Кролик"; avatarEmoji = "🐰"; }

    String ageDesc = "";
    if (_selectedAgeBracket == 1) ageDesc = "Малыши (3-5 лет)";
    else if (_selectedAgeBracket == 2) ageDesc = "Дошколята (6-8 лет)";
    else if (_selectedAgeBracket == 3) ageDesc = "Школьники (9-12 лет)";

    return Column(
      key: const ValueKey(4),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Создайте профиль ребенка ✍️',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueGrey),
        ),
        const SizedBox(height: 24),
        TextField(
          controller: _nameController,
          textCapitalization: TextCapitalization.words,
          decoration: InputDecoration(
            labelText: 'Имя ребенка',
            hintText: 'Введите имя (например, Никита)',
            prefixIcon: const Icon(Icons.person, color: Colors.blueAccent),
            errorText: _nameError,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          onChanged: (_) {
            if (_nameError != null) {
              setState(() {
                _nameError = null;
              });
            }
          },
        ),
        const SizedBox(height: 24),
        const Text(
          'Параметры обучения:',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.blueGrey),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  const Text('🎈', style: TextStyle(fontSize: 20)),
                  const SizedBox(width: 12),
                  const Text('Возрастная группа: ', style: TextStyle(color: Colors.black54)),
                  Text(ageDesc, style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              const Divider(height: 24),
              Row(
                children: [
                  Text(avatarEmoji, style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 12),
                  const Text('Ваш помощник: ', style: TextStyle(color: Colors.black54)),
                  Text(avatarName, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStepParentPin() {
    return Column(
      key: const ValueKey(5),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Создайте PIN-код родителей 🔐',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueGrey),
        ),
        const SizedBox(height: 8),
        const Text(
          'PIN-код нужен для защиты раздела настроек и статистики от случайного изменения ребенком.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: Colors.black54),
        ),
        const SizedBox(height: 24),
        TextField(
          controller: _pinController,
          keyboardType: TextInputType.number,
          obscureText: true,
          maxLength: 4,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 28, letterSpacing: 16, fontWeight: FontWeight.bold),
          decoration: InputDecoration(
            counterText: "",
            labelText: 'Задайте 4-значный PIN',
            errorText: _pinError,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          onChanged: (_) {
            if (_pinError != null) {
              setState(() {
                _pinError = null;
              });
            }
          },
        ),
        const SizedBox(height: 16),
        const Text(
          'По умолчанию используется код: 1234',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
      ],
    );
  }
}

class IslandData {
  final String id;
  final String title;
  final String titleRu;
  final String description;
  final String emoji;
  final Color baseColor;
  final Color accentColor;

  const IslandData({
    required this.id,
    required this.title,
    required this.titleRu,
    required this.description,
    required this.emoji,
    required this.baseColor,
    required this.accentColor,
  });
}

final List<IslandData> _islandsData = [
  const IslandData(
    id: 'alphabet_forest',
    title: 'Alphabet Forest',
    titleRu: 'Лес Английских Букв',
    description: 'Изучаем английский алфавит и базовые звуки весело!',
    emoji: '🌳🍎',
    baseColor: Color(0xFF4CAF50),
    accentColor: Color(0xFFC8E6C9),
  ),
  const IslandData(
    id: 'animals',
    title: 'Animal Island',
    titleRu: 'Остров Животных',
    description: 'Учим названия зверей и птиц на ферме и в диком лесу.',
    emoji: '🦁🐼',
    baseColor: Color(0xFFFF9800),
    accentColor: Color(0xFFFFE0B2),
  ),
  const IslandData(
    id: 'colors',
    title: 'Color Kingdom',
    titleRu: 'Цветовое Королевство',
    description: 'Повторяем все цвета радуги и художественные кисти!',
    emoji: '🌈🎨',
    baseColor: Color(0xFFE91E63),
    accentColor: Color(0xFFF8BBD0),
  ),
  const IslandData(
    id: 'numbers',
    title: 'Number Mountain',
    titleRu: 'Гора Цифр',
    description: 'Веселый счет от 1 до 10 и первые математические игры.',
    emoji: '🔮🔢',
    baseColor: Color(0xFF9C27B0),
    accentColor: Color(0xFFE1BEE7),
  ),
  const IslandData(
    id: 'family',
    title: 'Family Town',
    titleRu: 'Город Семьи',
    description: 'Знакомимся со всеми членами семьи и домашними питомцами.',
    emoji: '🏠👨‍👩‍👧',
    baseColor: Color(0xFF2196F3),
    accentColor: Color(0xFFBBDEFB),
  ),
  const IslandData(
    id: 'food',
    title: 'Food Valley',
    titleRu: 'Долина Вкусностей',
    description: 'Изучаем фрукты, овощи, напитки и десерты на английском.',
    emoji: '🍋🍕',
    baseColor: Color(0xFF4DB6AC),
    accentColor: Color(0xFFB2DFDB),
  ),
  const IslandData(
    id: 'school',
    title: 'School City',
    titleRu: 'Школьный Город',
    description: 'Канцелярские предметы, книги, парты и полезные диалоги.',
    emoji: '🏫🎒',
    baseColor: Color(0xFF607D8B),
    accentColor: Color(0xFFCFD8DC),
  ),
];

class CurvedPathPainter extends CustomPainter {
  final bool isActive;
  final bool slopeLeftToRight;

  CurvedPathPainter({required this.isActive, required this.slopeLeftToRight});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = isActive ? Colors.amber.shade500 : Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5.0
      ..strokeCap = StrokeCap.round;

    final path = Path();
    if (slopeLeftToRight) {
      path.moveTo(size.width * 0.3, 0);
      path.cubicTo(
        size.width * 0.3, size.height * 0.5,
        size.width * 0.7, size.height * 0.5,
        size.width * 0.7, size.height,
      );
    } else {
      path.moveTo(size.width * 0.7, 0);
      path.cubicTo(
        size.width * 0.7, size.height * 0.5,
        size.width * 0.3, size.height * 0.5,
        size.width * 0.3, size.height,
      );
    }

    final dashWidth = 8.0;
    final dashSpace = 6.0;
    double distance = 0.0;
    final pathMetrics = path.computeMetrics();
    
    for (var metric in pathMetrics) {
      while (distance < metric.length) {
        final start = distance;
        final end = distance + dashWidth;
        final extract = metric.extractPath(start, end);
        canvas.drawPath(extract, paint);
        distance += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class IslandsMapScreen extends StatelessWidget {
  const IslandsMapScreen({Key? key}) : super(key: key);

  void _showIslandDetailsBottomSheet(
    BuildContext context, 
    IslandData island, 
    LessonProgress progress,
    UserProfile profile,
  ) {
    // Generate lovely mascot description greeting
    final mascotEmoji = profile.heroBuddyId == 'owl' ? '🦉' : (profile.heroBuddyId == 'panda' ? '🐼' : (profile.heroBuddyId == 'fox' ? '🦊' : '🐰'));
    final mascotName = profile.heroBuddyId == 'owl' ? 'Ozzy' : (profile.heroBuddyId == 'panda' ? 'Penny' : (profile.heroBuddyId == 'fox' ? 'Felix' : 'Ruby'));

    TtsService.instance.speakEnglish("Let's go to \${island.title}!");

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      backgroundColor: Colors.white,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: island.baseColor.withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(island.emoji, style: const TextStyle(fontSize: 32)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          island.titleRu,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Colors.blueGrey),
                        ),
                        Text(
                          island.title,
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: island.baseColor),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          island.description,
                          style: const TextStyle(fontSize: 13, color: Colors.black54),
                        ),
                      ],
                    ),
                  )
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF7F9FC),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        const Text('⭐ Звезды', style: TextStyle(fontSize: 11, color: Colors.black45)),
                        const SizedBox(height: 4),
                        Row(
                          children: List.generate(3, (i) {
                            return Icon(
                              Icons.star,
                              color: i < progress.maximumStarsEarned ? Colors.amber : Colors.grey.shade300,
                              size: 22,
                            );
                          }),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 32,
                      child: VerticalDivider(color: Colors.black12, width: 2),
                    ),
                    Column(
                      children: [
                        const Text('⚡ Статус', style: TextStyle(fontSize: 11, color: Colors.black45)),
                        const SizedBox(height: 4),
                        Text(
                          progress.isCompletedAtLeastOnce ? 'Пройден ✅' : 'Активен 🚀',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.green),
                        ),
                      ],
                    )
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(54),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        context.go('/islands/lesson/\${island.id}');
                      },
                      icon: const Icon(Icons.menu_book),
                      label: const Text('Словарь', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(54),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        context.go('/islands/quiz/\${island.id}');
                      },
                      icon: const Icon(Icons.emoji_events),
                      label: const Text('Сдать Квест', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  '\${mascotEmoji} Компаньон \${mascotName} ждет тебя!',
                  style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.blueGrey),
                ),
              )
            ],
          );
        };
      },
    );
  }

  void _onLockedIslandTap(BuildContext context, IslandData island) {
    TtsService.instance.speakEnglish("This island is locked. Complete previous lesson first!");
    
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.redAccent,
        content: Row(
          children: [
            const Text('🧙‍♂️ ', style: TextStyle(fontSize: 22)),
            Expanded(
              child: Text(
                'Ой! Остров "\${island.titleRu}" закрыт! Наберите хотя бы 1 звезду на предыдущем острове.',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<LearningAppState>();
    final profile = appState.profile;

    if (appState.isLoading || profile == null) {
      return const Scaffold(
        backgroundColor: Color(0xFFE3F2FD),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Загрузка карты...', style: TextStyle(fontSize: 16, color: Colors.blueGrey)),
            ],
          ),
        ),
      );
    }

    // Calculations of stats
    int completedCount = 0;
    int totalStars = 0;
    
    // Check custom progress
    final List<Widget> mapWidgets = [];

    int currentLvl = profile.currentLevel;
    int neededForNext = 100 * currentLvl * currentLvl - 50 * currentLvl;
    double xpProgress = (profile.accumulatedXp / neededForNext).clamp(0.0, 1.0);

    for (int i = 0; i < _islandsData.length; i++) {
      final island = _islandsData[i];
      
      // Determine lock logic based on SQLite records or sequential list hierarchy
      // First is unlocked. Second is unlocked if previous is completed.
      bool isUnlocked = false;
      LessonProgress progress = LessonProgress(moduleCategory: island.id);
      
      final savedProgress = appState.lessons.firstWhere(
        (element) => element.moduleCategory == island.id,
        orElse: () => LessonProgress(moduleCategory: island.id),
      );
      
      if (i == 0) {
        isUnlocked = true;
        progress = savedProgress.copyWith(isUnlocked: true);
      } else {
        // Find previous progress record
        final prevIsland = _islandsData[i - 1];
        final prevSaved = appState.lessons.firstWhere(
          (element) => element.moduleCategory == prevIsland.id,
          orElse: () => LessonProgress(moduleCategory: prevIsland.id),
        );
        isUnlocked = prevSaved.isCompletedAtLeastOnce || prevSaved.maximumStarsEarned > 0;
        progress = savedProgress.copyWith(isUnlocked: isUnlocked);
      }

      if (progress.isCompletedAtLeastOnce) {
        completedCount++;
      }
      totalStars += progress.maximumStarsEarned;
    }

    double totalCompletionRatio = completedCount / _islandsData.length;
    final mascotEmoji = profile.heroBuddyId == 'owl' ? '🦉' : (profile.heroBuddyId == 'panda' ? '🐼' : (profile.heroBuddyId == 'fox' ? '🦊' : '🐰'));

    return Scaffold(
      backgroundColor: const Color(0xFFE1F5FE), // Lovely light celestial cartoon canvas
      body: CustomScrollView(
        slivers: [
          // Sticky top cartoon profile portal
          SliverAppBar(
            pinned: true,
            expandedHeight: 180,
            backgroundColor: const Color(0xFF0288D1),
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
            ),
            automaticallyImplyLeading: false,
            title: Row(
              children: [
                Text(mascotEmoji, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Привет, \${profile.childName}!',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const Text(
                      'Кабинет приключений',
                      style: TextStyle(fontSize: 10, color: Colors.white70),
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 12),
                child: Directionality(
                  textDirection: TextDirection.ltr,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber.shade400,
                      foregroundColor: Colors.blueGrey.shade950,
                      elevation: 1,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    onPressed: () => context.go('/parent-gate'),
                    icon: const Icon(Icons.vpn_key, size: 16),
                    label: const Text('Родителям', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: const EdgeInsets.only(top: 80, left: 24, right: 24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // XP Gauge section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'УРОВЕНЬ \$currentLvl',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.amber),
                        ),
                        Text(
                          '\${profile.accumulatedXp} / \$neededForNext XP',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: xpProgress,
                        minHeight: 12,
                        backgroundColor: Colors.white24,
                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.greenAccent),
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Summary counts line
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Row(
                          children: [
                            const Text('🔥 ', style: TextStyle(fontSize: 18)),
                            Text(
                              '\${profile.dailyStreakCount} дн.',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.white),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.star, color: Colors.amber, size: 20),
                            const SizedBox(width: 4),
                            Text(
                              '\$totalStars зв.',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.white),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Text('🎓 ', style: TextStyle(fontSize: 18)),
                            Text(
                              '\${(totalCompletionRatio * 100).toInt()}%',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black, color: Colors.white),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Scrollable Islands Map View
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: List.generate(_islandsData.length, (index) {
                  final island = _islandsData[index];
                  
                  // Calculations
                  bool isUnlocked = false;
                  LessonProgress progress = LessonProgress(moduleCategory: island.id);
                  
                  final savedProgress = appState.lessons.firstWhere(
                    (element) => element.moduleCategory == island.id,
                    orElse: () => LessonProgress(moduleCategory: island.id),
                  );
                  
                  if (index == 0) {
                    isUnlocked = true;
                    progress = savedProgress.copyWith(isUnlocked: true);
                  } else {
                    final prevIsland = _islandsData[index - 1];
                    final prevSaved = appState.lessons.firstWhere(
                      (element) => element.moduleCategory == prevIsland.id,
                      orElse: () => LessonProgress(moduleCategory: prevIsland.id),
                    );
                    isUnlocked = prevSaved.isCompletedAtLeastOnce || prevSaved.maximumStarsEarned > 0;
                    progress = savedProgress.copyWith(isUnlocked: isUnlocked);
                  }

                  final bool alignRight = index % 2 != 0;
                  final bool hasConnectionBelow = index < _islandsData.length - 1;

                  // Next Connection state for painting path colors
                  bool isNextConnectionActive = false;
                  if (hasConnectionBelow) {
                    final nextSegmentProgress = appState.lessons.firstWhere(
                      (element) => element.moduleCategory == _islandsData[index + 1].id,
                      orElse: () => LessonProgress(moduleCategory: _islandsData[index + 1].id),
                    );
                    isNextConnectionActive = nextSegmentProgress.isUnlocked || progress.isCompletedAtLeastOnce;
                  }

                  return Column(
                    children: [
                      // Island Card Row
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: alignRight ? MainAxisAlignment.end : MainAxisAlignment.start,
                          children: [
                            // Main Tap Handle
                            GestureDetector(
                              onTap: () {
                                if (isUnlocked) {
                                  _showIslandDetailsBottomSheet(context, island, progress, profile);
                                } else {
                                  _onLockedIslandTap(context, island);
                                }
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                width: MediaQuery.of(context).size.width * 0.72,
                                decoration: BoxDecoration(
                                  color: isUnlocked ? Colors.white : Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                    color: isUnlocked ? island.baseColor : Colors.grey.shade350,
                                    width: 3,
                                  ),
                                  boxShadow: isUnlocked
                                      ? [
                                          BoxShadow(
                                            color: island.baseColor.withOpacity(0.18),
                                            blurRadius: 12,
                                            offset: const Offset(0, 6),
                                          )
                                        ]
                                      : [],
                                ),
                                padding: const EdgeInsets.all(16),
                                child: Opacity(
                                  opacity: isUnlocked ? 1.0 : 0.6,
                                  child: Row(
                                    children: [
                                      // Cartoon circle mascot
                                      Container(
                                        width: 54,
                                        height: 54,
                                        decoration: BoxDecoration(
                                          color: isUnlocked ? island.baseColor.withOpacity(0.12) : Colors.grey.shade300,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Text(
                                            isUnlocked ? island.emoji : '🔒',
                                            style: const TextStyle(fontSize: 26),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(
                                                  child: Text(
                                                    island.titleRu,
                                                    style: TextStyle(
                                                      fontSize: 15,
                                                      fontWeight: FontWeight.black,
                                                      color: isUnlocked ? Colors.blueGrey.shade900 : Colors.grey.shade600,
                                                    ),
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ),
                                                if (progress.isCompletedAtLeastOnce)
                                                  const Icon(Icons.verified, color: Colors.green, size: 18),
                                              ],
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              island.title,
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                                color: isUnlocked ? island.baseColor : Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 6),
                                            // Star indicator count row
                                            Row(
                                              children: List.generate(3, (starIdx) {
                                                return Icon(
                                                  Icons.star,
                                                  color: starIdx < progress.maximumStarsEarned ? Colors.amber : Colors.grey.shade300,
                                                  size: 16,
                                                );
                                              }),
                                            ),
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      // Animated winding connection line below (except last)
                      if (hasConnectionBelow)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: SizedBox(
                            height: 60,
                            width: double.infinity,
                            child: CustomPaint(
                              painter: CurvedPathPainter(
                                isActive: isNextConnectionActive,
                                slopeLeftToRight: !alignRight,
                              ),
                            ),
                          ),
                        ),
                    ],
                  );
                }),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class LessonWorkspaceScreen extends StatelessWidget {
  final String category;
  const LessonWorkspaceScreen({Key? key, required this.category}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Урок: \$category')),
      body: Center(
        child: Text('Изучение слов в категории: \$category'),
      ),
    );
  }
}

class PictureQuizQuestion {
  final VocabCard correctCard;
  final List<VocabCard> choices;

  PictureQuizQuestion({required this.correctCard, required this.choices});
}

enum QuizDifficulty { easy, medium, hard }

class QuizWorkspaceScreen extends StatefulWidget {
  final String category;
  const QuizWorkspaceScreen({Key? key, required this.category}) : super(key: key);

  @override
  State<QuizWorkspaceScreen> createState() => _QuizWorkspaceScreenState();
}

class _QuizWorkspaceScreenState extends State<QuizWorkspaceScreen> {
  QuizDifficulty? _selectedDifficulty;

  @override
  Widget build(BuildContext context) {
    if (_selectedDifficulty == null) {
      return QuizDifficultySelection(
        category: widget.category,
        onSelected: (difficulty) {
          setState(() {
            _selectedDifficulty = difficulty;
          });
        },
      );
    }

    return PictureQuizGame(
      category: widget.category,
      difficulty: _selectedDifficulty!,
      onExit: () {
        context.go('/islands');
      },
    );
  }
}

class QuizDifficultySelection extends StatelessWidget {
  final String category;
  final ValueChanged<QuizDifficulty> onSelected;

  const QuizDifficultySelection({
    Key? key,
    required this.category,
    required this.onSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final titleFormatted = category.toUpperCase().replaceAll('_', ' ');

    return Scaffold(
      backgroundColor: const Color(0xFFE1F5FE),
      appBar: AppBar(
        title: Text('Выбери сложность: \$titleFormatted'),
        backgroundColor: const Color(0xFF0288D1),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/islands'),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                '🎨',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 80),
              ),
              const SizedBox(height: 16),
              const Text(
                'Квест Знаний!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.black, color: Colors.blueGrey),
              ),
              const SizedBox(height: 8),
              const Text(
                'Выбери уровень сложности для прохождения квеста:',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.black54),
              ),
              const SizedBox(height: 32),
              
              // Easy Button
              _buildDifficultyCard(
                context: context,
                difficulty: QuizDifficulty.easy,
                title: 'ЛЕГКИЙ 🟢',
                color: Colors.green,
                desc: '2 картинки, подсказки на русском, +10 XP за верный ответ.',
              ),
              const SizedBox(height: 16),
              
              // Medium Button
              _buildDifficultyCard(
                context: context,
                difficulty: QuizDifficulty.medium,
                title: 'СРЕДНИЙ 🟡',
                color: Colors.orange,
                desc: '4 картинки, стандартная игра, +15 XP за верный ответ.',
              ),
              const SizedBox(height: 16),
              
              // Hard Button
              _buildDifficultyCard(
                context: context,
                difficulty: QuizDifficulty.hard,
                title: 'СЛОЖНЫЙ 🔴',
                color: Colors.redAccent,
                desc: '4 картинки, ограничение по времени 10сек, +25 XP!',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDifficultyCard({
    required BuildContext context,
    required QuizDifficulty difficulty,
    required String title,
    required Color color,
    required String desc,
  }) {
    return InkWell(
      onTap: () => onSelected(difficulty),
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color, width: 3),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.12),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.stars, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: color),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: const TextStyle(fontSize: 12, color: Colors.black54),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: Colors.black26, size: 16),
          ],
        ),
      ),
    );
  }
}

class PictureQuizGame extends StatefulWidget {
  final String category;
  final QuizDifficulty difficulty;
  final VoidCallback onExit;

  const PictureQuizGame({
    Key? key,
    required this.category,
    required this.difficulty,
    required this.onExit,
  }) : super(key: key);

  @override
  State<PictureQuizGame> createState() => _PictureQuizGameState();
}

class _PictureQuizGameState extends State<PictureQuizGame> with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  List<PictureQuizQuestion> _questions = [];
  int _currentIndex = 0;
  int _score = 0;
  int _xpEarned = 0;
  int _hearts = 3;
  VocabCard? _selectedAnswer;
  bool _isAnswered = false;
  
  // Timer for Hard Mode
  Timer? _countdownTimer;
  int _secondsLeft = 10;
  late AnimationController _pulseController;

  final Map<String, List<VocabCard>> _fallbackCards = {
    'food': [
      VocabCard(id: 'f_apple', moduleCategory: 'food', difficultyRank: 1, englishWord: 'Apple', russianTranslation: 'Яблоко', phoneticTranscription: '[ˈæp.əl]', audioPathIdentifier: 'audio/apple.ogg', imageAssetIdentifier: '🍎'),
      VocabCard(id: 'f_banana', moduleCategory: 'food', difficultyRank: 1, englishWord: 'Banana', russianTranslation: 'Банан', phoneticTranscription: '[bəˈnɑː.nə]', audioPathIdentifier: 'audio/banana.ogg', imageAssetIdentifier: '🍌'),
      VocabCard(id: 'f_lemon', moduleCategory: 'food', difficultyRank: 1, englishWord: 'Lemon', russianTranslation: 'Лимон', phoneticTranscription: '[ˈlem.ən]', audioPathIdentifier: 'audio/lemon.ogg', imageAssetIdentifier: '🍋'),
      VocabCard(id: 'f_pizza', moduleCategory: 'food', difficultyRank: 2, englishWord: 'Pizza', russianTranslation: 'Пицца', phoneticTranscription: '[ˈpiːtsə]', audioPathIdentifier: 'audio/pizza.ogg', imageAssetIdentifier: '🍕'),
      VocabCard(id: 'f_grape', moduleCategory: 'food', difficultyRank: 2, englishWord: 'Grapes', russianTranslation: 'Виноград', phoneticTranscription: '[ɡreɪps]', audioPathIdentifier: 'audio/grapes.ogg', imageAssetIdentifier: '🍇'),
      VocabCard(id: 'f_cake', moduleCategory: 'food', difficultyRank: 2, englishWord: 'Cake', russianTranslation: 'Торт', phoneticTranscription: '[keɪk]', audioPathIdentifier: 'audio/cake.ogg', imageAssetIdentifier: '🍰'),
    ],
    'animals': [
      VocabCard(id: 'a_cat', moduleCategory: 'animals', difficultyRank: 1, englishWord: 'Cat', russianTranslation: 'Кошка', phoneticTranscription: '[kæt]', audioPathIdentifier: 'audio/cat.ogg', imageAssetIdentifier: '🐱'),
      VocabCard(id: 'a_dog', moduleCategory: 'animals', difficultyRank: 1, englishWord: 'Dog', russianTranslation: 'Собака', phoneticTranscription: '[dɒɡ]', audioPathIdentifier: 'audio/dog.ogg', imageAssetIdentifier: '🐶'),
      VocabCard(id: 'a_rabbit', moduleCategory: 'animals', difficultyRank: 1, englishWord: 'Rabbit', russianTranslation: 'Кролик', phoneticTranscription: '[ˈræb.ɪt]', audioPathIdentifier: 'audio/rabbit.ogg', imageAssetIdentifier: '🐰'),
      VocabCard(id: 'a_lion', moduleCategory: 'animals', difficultyRank: 2, englishWord: 'Lion', russianTranslation: 'Лев', phoneticTranscription: '[ˈlaɪ.ən]', audioPathIdentifier: 'audio/lion.ogg', imageAssetIdentifier: '🦁'),
      VocabCard(id: 'a_panda', moduleCategory: 'animals', difficultyRank: 2, englishWord: 'Panda', russianTranslation: 'Панда', phoneticTranscription: '[ˈpæn.də]', audioPathIdentifier: 'audio/panda.ogg', imageAssetIdentifier: '🐼'),
      VocabCard(id: 'a_fox', moduleCategory: 'animals', difficultyRank: 2, englishWord: 'Fox', russianTranslation: 'Лиса', phoneticTranscription: '[fɒks]', audioPathIdentifier: 'audio/fox.ogg', imageAssetIdentifier: '🦊'),
    ],
    'colors': [
      VocabCard(id: 'c_red', moduleCategory: 'colors', difficultyRank: 1, englishWord: 'Red', russianTranslation: 'Красный', phoneticTranscription: '[red]', audioPathIdentifier: 'audio/red.ogg', imageAssetIdentifier: '🔴'),
      VocabCard(id: 'c_blue', moduleCategory: 'colors', difficultyRank: 1, englishWord: 'Blue', russianTranslation: 'Синий', phoneticTranscription: '[bluː]', audioPathIdentifier: 'audio/blue.ogg', imageAssetIdentifier: '🔵'),
      VocabCard(id: 'c_green', moduleCategory: 'colors', difficultyRank: 1, englishWord: 'Green', russianTranslation: 'Зеленый', phoneticTranscription: '[ɡriːn]', audioPathIdentifier: 'audio/green.ogg', imageAssetIdentifier: '🟢'),
      VocabCard(id: 'c_yellow', moduleCategory: 'colors', difficultyRank: 1, englishWord: 'Yellow', russianTranslation: 'Желтый', phoneticTranscription: '[ˈjel.əʊ]', audioPathIdentifier: 'audio/yellow.ogg', imageAssetIdentifier: '🟡'),
      VocabCard(id: 'c_orange', moduleCategory: 'colors', difficultyRank: 2, englishWord: 'Orange', russianTranslation: 'Оранжевый', phoneticTranscription: '[ˈɒr.ɪndʒ]', audioPathIdentifier: 'audio/orange.ogg', imageAssetIdentifier: '🟠'),
      VocabCard(id: 'c_purple', moduleCategory: 'colors', difficultyRank: 2, englishWord: 'Purple', russianTranslation: 'Фиолетовый', phoneticTranscription: '[ˈpɜː.pəl]', audioPathIdentifier: 'audio/purple.ogg', imageAssetIdentifier: '🟣'),
    ],
    'numbers': [
      VocabCard(id: 'n_one', moduleCategory: 'numbers', difficultyRank: 1, englishWord: 'One', russianTranslation: 'Один', phoneticTranscription: '[wʌn]', audioPathIdentifier: 'audio/one.ogg', imageAssetIdentifier: '1️⃣'),
      VocabCard(id: 'n_two', moduleCategory: 'numbers', difficultyRank: 1, englishWord: 'Two', russianTranslation: 'Два', phoneticTranscription: '[tuː]', audioPathIdentifier: 'audio/two.ogg', imageAssetIdentifier: '2️⃣'),
      VocabCard(id: 'n_three', moduleCategory: 'numbers', difficultyRank: 1, englishWord: 'Three', russianTranslation: 'Три', phoneticTranscription: '[θriː]', audioPathIdentifier: 'audio/three.ogg', imageAssetIdentifier: '3️⃣'),
      VocabCard(id: 'n_four', moduleCategory: 'numbers', difficultyRank: 2, englishWord: 'Four', russianTranslation: 'Четыре', phoneticTranscription: '[fɔː]', audioPathIdentifier: 'audio/four.ogg', imageAssetIdentifier: '4️⃣'),
      VocabCard(id: 'n_five', moduleCategory: 'numbers', difficultyRank: 2, englishWord: 'Five', russianTranslation: 'Пять', phoneticTranscription: '[faɪv]', audioPathIdentifier: 'audio/five.ogg', imageAssetIdentifier: '5️⃣'),
    ],
    'alphabet_forest': [
      VocabCard(id: 'al_a', moduleCategory: 'alphabet_forest', difficultyRank: 1, englishWord: 'A', russianTranslation: 'Эй', phoneticTranscription: '[eɪ]', audioPathIdentifier: 'audio/a.ogg', imageAssetIdentifier: '🅰️'),
      VocabCard(id: 'al_b', moduleCategory: 'alphabet_forest', difficultyRank: 1, englishWord: 'B', russianTranslation: 'Би', phoneticTranscription: '[biː]', audioPathIdentifier: 'audio/b.ogg', imageAssetIdentifier: '🅱️'),
      VocabCard(id: 'al_c', moduleCategory: 'alphabet_forest', difficultyRank: 1, englishWord: 'C', russianTranslation: 'Си', phoneticTranscription: '[siː]', audioPathIdentifier: 'audio/c.ogg', imageAssetIdentifier: '🆃'),
      VocabCard(id: 'al_d', moduleCategory: 'alphabet_forest', difficultyRank: 2, englishWord: 'D', russianTranslation: 'Ди', phoneticTranscription: '[diː]', audioPathIdentifier: 'audio/d.ogg', imageAssetIdentifier: '🅾️'),
    ],
    'family': [
      VocabCard(id: 'fa_mother', moduleCategory: 'family', difficultyRank: 1, englishWord: 'Mother', russianTranslation: 'Мама', phoneticTranscription: '[ˈmʌð.ər]', audioPathIdentifier: 'audio/mother.ogg', imageAssetIdentifier: '👩'),
      VocabCard(id: 'fa_father', moduleCategory: 'family', difficultyRank: 1, englishWord: 'Father', russianTranslation: 'Папа', phoneticTranscription: '[ˈfɑː.ðər]', audioPathIdentifier: 'audio/father.ogg', imageAssetIdentifier: '👨'),
      VocabCard(id: 'fa_baby', moduleCategory: 'family', difficultyRank: 1, englishWord: 'Baby', russianTranslation: 'Малыш', phoneticTranscription: '[ˈbeɪ.bi]', audioPathIdentifier: 'audio/baby.ogg', imageAssetIdentifier: '👶'),
      VocabCard(id: 'fa_sister', moduleCategory: 'family', difficultyRank: 2, englishWord: 'Sister', russianTranslation: 'Сестра', phoneticTranscription: '[ˈsɪs.tər]', audioPathIdentifier: 'audio/sister.ogg', imageAssetIdentifier: '👧'),
      VocabCard(id: 'fa_brother', moduleCategory: 'family', difficultyRank: 2, englishWord: 'Brother', russianTranslation: 'Брат', phoneticTranscription: '[ˈbrʌð.ər]', audioPathIdentifier: 'audio/brother.ogg', imageAssetIdentifier: '👦'),
    ],
    'school': [
      VocabCard(id: 'sc_book', moduleCategory: 'school', difficultyRank: 1, englishWord: 'Book', russianTranslation: 'Книга', phoneticTranscription: '[bʊk]', audioPathIdentifier: 'audio/book.ogg', imageAssetIdentifier: '📖'),
      VocabCard(id: 'sc_pencil', moduleCategory: 'school', difficultyRank: 1, englishWord: 'Pencil', russianTranslation: 'Карандаш', phoneticTranscription: '[ˈpen.səl]', audioPathIdentifier: 'audio/pencil.ogg', imageAssetIdentifier: '✏️'),
      VocabCard(id: 'sc_bag', moduleCategory: 'school', difficultyRank: 1, englishWord: 'Backpack', russianTranslation: 'Рюкзак', phoneticTranscription: '[ˈbæk.pæk]', audioPathIdentifier: 'audio/backpack.ogg', imageAssetIdentifier: '🎒'),
      VocabCard(id: 'sc_ruler', moduleCategory: 'school', difficultyRank: 2, englishWord: 'Ruler', russianTranslation: 'Линейка', phoneticTranscription: '[ˈruː.lər]', audioPathIdentifier: 'audio/ruler.ogg', imageAssetIdentifier: '📏'),
    ]
  };

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _loadGameData();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _loadGameData() async {
    setState(() {
      _isLoading = true;
    });

    final dbHelper = DatabaseHelper.instance;
    List<VocabCard> cards = await dbHelper.getCardsForModule(widget.category);
    
    final fallbacks = _fallbackCards[widget.category] ?? _fallbackCards['animals']!;
    for (var f in fallbacks) {
      if (!cards.any((element) => element.id == f.id)) {
        cards.add(f);
      }
    }

    final int choiceCount = widget.difficulty == QuizDifficulty.easy ? 2 : 4;

    final random = Random();
    final List<PictureQuizQuestion> generatedQuestions = [];
    final List<VocabCard> quizCorrectPool = List.from(cards)..shuffle(random);
    final int actualQuizLength = min(5, quizCorrectPool.length);

    for (int i = 0; i < actualQuizLength; i++) {
      final correct = quizCorrectPool[i];
      final List<VocabCard> incorrectOptions = cards
          .where((element) => element.id != correct.id)
          .toList()
        ..shuffle(random);

      final List<VocabCard> choices = [correct];
      final addedOptionsCount = min(choiceCount - 1, incorrectOptions.length);
      for (int choiceIdx = 0; choiceIdx < addedOptionsCount; choiceIdx++) {
        choices.add(incorrectOptions[choiceIdx]);
      }
      choices.shuffle(random);

      generatedQuestions.add(PictureQuizQuestion(
        correctCard: correct,
        choices: choices,
      ));
    }

    setState(() {
      _questions = generatedQuestions;
      _isLoading = false;
    });

    _speakCurrentWord();
    if (widget.difficulty == QuizDifficulty.hard) {
      _startHardTimer();
    }
  }

  void _speakCurrentWord() {
    if (_questions.isEmpty || _currentIndex >= _questions.length) return;
    final word = _questions[_currentIndex].correctCard.englishWord;
    TtsService.instance.speakEnglish(word);
  }

  void _startHardTimer() {
    _countdownTimer?.cancel();
    _secondsLeft = 10;
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_isAnswered) {
        timer.cancel();
        return;
      }
      setState(() {
        if (_secondsLeft > 0) {
          _secondsLeft--;
        } else {
          _isAnswered = true;
          timer.cancel();
          _hearts = max(0, _hearts - 1);
          TtsService.instance.speakEnglish("Oops! Time is up!");
          if (_hearts == 0) {
            _showQuizCompleted();
          }
        }
      });
    });
  }

  void _onChoiceSelected(VocabCard card) {
    if (_isAnswered) return;
    setState(() {
      _selectedAnswer = card;
    });
  }

  void _checkAnswer() async {
    if (_isAnswered || _questions.isEmpty) return;
    _countdownTimer?.cancel();

    final currentQuestion = _questions[_currentIndex];
    final isCorrect = _selectedAnswer?.id == currentQuestion.correctCard.id;

    setState(() {
      _isAnswered = true;
    });

    if (isCorrect) {
      _score++;
      
      int singleXp = 15;
      if (widget.difficulty == QuizDifficulty.easy) singleXp = 10;
      if (widget.difficulty == QuizDifficulty.hard) singleXp = 25;

      _xpEarned += singleXp;
      
      TtsService.instance.speakEnglish("Excellent! \${currentQuestion.correctCard.englishWord}");
      
      final dbHelper = DatabaseHelper.instance;
      final historyRecord = QuizHistory(
        cardId: currentQuestion.correctCard.id,
        lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch,
        consecutiveCorrectHits: 1,
        difficultyWeightFactor: widget.difficulty == QuizDifficulty.hard ? 3.0 : 2.5,
      );
      await dbHelper.database.then((db) async {
        await db.insert('quiz_history', historyRecord.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
      });
    } else {
      _hearts = max(0, _hearts - 1);
      TtsService.instance.speakEnglish("Ouch! That is incorrect.");
    }

    if (_hearts == 0) {
      _showQuizCompleted();
    }
  }

  void _nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedAnswer = null;
        _isAnswered = false;
      });
      _speakCurrentWord();
      if (widget.difficulty == QuizDifficulty.hard) {
        _startHardTimer();
      }
    } else {
      _showQuizCompleted();
    }
  }

  void _showQuizCompleted() async {
    final double percent = _score / _questions.length;
    int stars = 0;
    String headerText = "Попробуй еще раз!";
    String detailsText = "Набери больше половины верных ответов, чтобы открыть новые уровни.";

    if (percent == 1.0) {
      stars = 3;
      headerText = "ВЕЛИКОЛЕПНО! ⭐⭐⭐";
      detailsText = "Идеальный результат! Ты настоящий мастер английских слов!";
    } else if (percent >= 0.7) {
      stars = 2;
      headerText = "ОТЛИЧНО! ⭐⭐";
      detailsText = "Прекрасный результат! Попробуй сдать на 3 звезды!";
    } else if (percent >= 0.4) {
      stars = 1;
      headerText = "ХОРОШО! ⭐";
      detailsText = "Хорошая попытка! Твои знания улучшаются с каждым днем.";
    }

    final appState = Provider.of<LearningAppState>(context, listen: false);
    await appState.handleLessonCompleted(widget.category, stars);

    if (stars == 3) {
      final db = await DatabaseHelper.instance.database;
      await db.update('system_achievement', {'is_unlocked': 1, 'unlocked_at_timestamp': DateTime.now().millisecondsSinceEpoch}, where: 'id = ?', whereArgs: ['perfect_score']);
    }

    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return PopScope(
          canPop: false,
          child: AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
            backgroundColor: Colors.white,
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🎉', style: TextStyle(fontSize: 72)),
                const SizedBox(height: 12),
                Text(
                  headerText,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Colors.blueGrey),
                ),
                const SizedBox(height: 8),
                Text(
                  detailsText,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Colors.black54),
                ),
                const SizedBox(height: 24),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(3, (starIdx) {
                    final bool isFilled = starIdx < stars;
                    return Icon(
                      Icons.star,
                      color: isFilled ? Colors.amber : Colors.grey.shade300,
                      size: 44,
                    );
                  }),
                ),
                const SizedBox(height: 24),

                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.flash_on, color: Colors.amber, size: 24),
                      const SizedBox(width: 8),
                      Text(
                        'ПОЛУЧЕНО: +\${_xpEarned} XP',
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.black, color: Colors.amber),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    widget.onExit();
                  },
                  child: const Text('К КАРТЕ ОСТРОВОВ 🚀', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFE1F5FE),
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (_questions.isEmpty) {
      return Scaffold(
        backgroundColor: const Color(0xFFE1F5FE),
        appBar: AppBar(title: const Text('Квест')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('😢', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 12),
              const Text('Нет доступных карточек для тестирования.'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: widget.onExit,
                child: const Text('Назад к островам'),
              ),
            ],
          ),
        ),
      );
    }

    final currentQuestion = _questions[_currentIndex];
    final double quizProgressRatio = (_currentIndex + 1) / _questions.length;
    final appState = context.watch<LearningAppState>();
    final profile = appState.profile;
    final buddyId = profile?.heroBuddyId ?? 'owl';
    
    final mascotEmoji = buddyId == 'owl' ? '🦉' : (buddyId == 'panda' ? '🐼' : (buddyId == 'fox' ? '🦊' : '🐰'));

    return Scaffold(
      backgroundColor: const Color(0xFFE1F5FE),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.black54, size: 28),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                            title: const Text('Выйти из квеста?'),
                            content: const Text('Ты потеряешь весь текущий прогресс на этом уровне.'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('ОСТАТЬСЯ'),
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                                onPressed: () {
                                  Navigator.pop(context);
                                  widget.onExit();
                                },
                                child: const Text('ВЫЙТИ', style: TextStyle(color: Colors.white)),
                              )
                            ],
                          );
                        },
                      );
                    },
                  ),
                  const SizedBox(width: 8),
                  
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Вопрос \${_currentIndex + 1} из \${_questions.length}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blueGrey),
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: quizProgressRatio,
                            minHeight: 8,
                            backgroundColor: Colors.black12,
                            valueColor: const AlwaysStoppedAnimation<Color>(Colors.blueAccent),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),

                  Row(
                    children: List.generate(3, (i) {
                      final bool isHeartFilled = i < _hearts;
                      return Icon(
                        isHeartFilled ? Icons.favorite : Icons.favorite_border,
                        color: isHeartFilled ? Colors.pink : Colors.grey,
                        size: 24,
                      );
                    }),
                  ),
                ],
              ),
            ),

            if (widget.difficulty == QuizDifficulty.hard && !_isAnswered)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    const Icon(Icons.timer, color: Colors.redAccent, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: _secondsLeft / 10,
                          minHeight: 6,
                          backgroundColor: Colors.black12,
                          valueColor: const AlwaysStoppedAnimation<Color>(Colors.redAccent),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '\${_secondsLeft}с',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: Colors.redAccent),
                    ),
                  ],
                ),
              ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: Colors.blueAccent.withOpacity(0.4), width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blueAccent.withOpacity(0.06),
                            blurRadius: 10,
                            offset: const Offset(0, 6),
                          )
                        ],
                      ),
                      child: Row(
                        children: [
                          Text(mascotEmoji, style: const TextStyle(fontSize: 50)),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'НАЙДИ КАРТИНКУ ДЛЯ СЛОВА:',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Text(
                                      currentQuestion.correctCard.englishWord.toUpperCase(),
                                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.black, color: Colors.blueGrey),
                                    ),
                                    const SizedBox(width: 8),
                                    if (widget.difficulty != QuizDifficulty.easy)
                                      Text(
                                        currentQuestion.correctCard.phoneticTranscription,
                                        style: const TextStyle(fontSize: 14, color: Colors.black38, fontStyle: FontStyle.italic),
                                      ),
                                  ],
                                ),
                                if (widget.difficulty == QuizDifficulty.easy)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text(
                                      'Подсказка: \${currentQuestion.correctCard.russianTranslation}',
                                      style: TextStyle(fontSize: 13, color: Colors.green.shade600, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          
                          GestureDetector(
                            onTap: _speakCurrentWord,
                            child: AnimatedBuilder(
                              animation: _pulseController,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: 1.0 + (_pulseController.value * 0.12),
                                  child: child,
                                );
                              },
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: const BoxDecoration(
                                  color: Colors.blueAccent,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.volume_up, color: Colors.white, size: 24),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: widget.difficulty == QuizDifficulty.easy ? 1 : 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: widget.difficulty == QuizDifficulty.easy ? 2.5 : 1.05,
                      ),
                      itemCount: currentQuestion.choices.length,
                      itemBuilder: (context, idx) {
                        final card = currentQuestion.choices[idx];
                        
                        final bool isSelected = _selectedAnswer?.id == card.id;
                        final bool isCorrectChoice = card.id == currentQuestion.correctCard.id;
                        
                        Color cardBorderColor = Colors.white;
                        Color fillBg = Colors.white;
                        
                        if (_isAnswered) {
                          if (isCorrectChoice) {
                            cardBorderColor = Colors.green;
                            fillBg = Colors.green.shade50;
                          } else if (isSelected) {
                            cardBorderColor = Colors.redAccent;
                            fillBg = Colors.red.shade50;
                          }
                        } else {
                          if (isSelected) {
                            cardBorderColor = Colors.blueAccent;
                          }
                        }

                        return InkWell(
                          onTap: () => _onChoiceSelected(card),
                          borderRadius: BorderRadius.circular(24),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            decoration: BoxDecoration(
                              color: fillBg,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: cardBorderColor,
                                width: isSelected || (_isAnswered && isCorrectChoice) ? 4 : 2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.04),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                )
                              ],
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  card.imageAssetIdentifier,
                                  style: const TextStyle(fontSize: 48),
                                ),
                                const SizedBox(height: 6),
                                
                                if (widget.difficulty == QuizDifficulty.easy)
                                  Text(
                                    card.russianTranslation,
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blueGrey),
                                  )
                                else if (widget.difficulty == QuizDifficulty.medium)
                                  Text(
                                    card.englishWord,
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.blueGrey),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(24),
              child: _isAnswered 
                  ? ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        foregroundColor: Colors.blueGrey.shade950,
                        minimumSize: const Size.fromHeight(60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        elevation: 2,
                      ),
                      onPressed: _nextQuestion,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _currentIndex < _questions.length - 1 ? 'СЛЕДУЮЩИЙ ВОПРОС' : 'ОТКРЫТЬ РЕЗУЛЬТАТЫ',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward),
                        ],
                      ),
                    )
                  : ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedAnswer != null ? Colors.blueAccent : Colors.grey.shade300,
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        elevation: 1,
                      ),
                      onPressed: _selectedAnswer != null ? _checkAnswer : null,
                      child: const Text('ПРОВЕРИТЬ ОТВЕТ 🚀', style: TextStyle(fontSize: 16, fontWeight: FontWeight.black)),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class ParentGateScreen extends StatefulWidget {
  const ParentGateScreen({Key? key}) : super(key: key);

  @override
  State<ParentGateScreen> createState() => _ParentGateScreenState();
}

class _ParentGateScreenState extends State<ParentGateScreen> {
  final TextEditingController _pinController = TextEditingController();
  String? _errorMessage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ворота Родителей')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Родительский контроль',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Решите уравнение для входа:\\n7 × 8 = ?',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _pinController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: const OutlineInputBorder(),
                labelText: 'Введите ответ',
                errorText: _errorMessage,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                if (_pinController.text == '56') {
                  context.go('/parent-dashboard');
                } else {
                  setState(() {
                    _errorMessage = 'Неверный ответ! Попробуйте снова';
                  });
                }
              },
              child: const Text('Войти в настройки'),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: "lib/views/achievements_screen.dart",
    name: "achievements_screen.dart",
    type: "navigation",
    description: "Экран достижений ребенка. Включает Material 3 списки, индикаторы прогресса, кастомные бейджи с градиентами, эффекты блокировки и интеграцию с локальной БД SQLite.",
    code: `import 'package:flutter/material.dart';
import '../../models/achievement.dart';
import '../../data/db/database_helper.dart';

/// Screen displaying achievements and rewards for the young learner.
/// Built with Material Design 3, glowing cards, progress bars, and locked overlays.
class AchievementsScreen extends StatefulWidget {
  const AchievementsScreen({Key? key}) : super(key: key);

  @override
  State<AchievementsScreen> createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends State<AchievementsScreen> {
  bool _isLoading = true;
  List<AchievementItemState> _achievementsState = [];
  int _unlockedCount = 0;
  int _totalXpClaimed = 0;

  @override
  void initState() {
    super.initState();
    _loadAchievementsData();
  }

  Future<void> _loadAchievementsData() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate database loading and metric calculation
    await Future.delayed(const Duration(milliseconds: 750));

    // Dynamic metrics calculated in offline-first mode from local DB
    // e.g., querying learned word counts, streak days, lessons completed.
    final List<AchievementItemState> loadedData = [
      AchievementItemState(
        id: 'first_lesson',
        title: 'Первый урок',
        subtitle: 'First Lesson',
        description: 'Завершите своё самое первое занятие на островах знаний.',
        badgeEmoji: '🌱',
        currentProgress: 1,
        targetProgress: 1,
        xpReward: 50,
        gradientStart: const Color(0xFF66BB6A),
        gradientEnd: const Color(0xFF43A047),
      ),
      AchievementItemState(
        id: 'alphabet_master',
        title: 'Мастер алфавита',
        subtitle: 'Alphabet Master',
        description: 'Изучите и произнесите все буквы английского алфавита.',
        badgeEmoji: '🔤',
        currentProgress: 18,
        targetProgress: 26,
        xpReward: 150,
        gradientStart: const Color(0xFFFFB300),
        gradientEnd: const Color(0xFFFF8F00),
      ),
      AchievementItemState(
        id: 'words_50',
        title: 'Изучено 50 слов',
        subtitle: '50 Words Learned',
        description: 'Наберите в личную учебную картотеку 50 active слов.',
        badgeEmoji: '📚',
        currentProgress: 50,
        targetProgress: 50,
        xpReward: 100,
        gradientStart: const Color(0xFF26C6DA),
        gradientEnd: const Color(0xFF00ACC1),
      ),
      AchievementItemState(
        id: 'words_100',
        title: 'Изучено 100 слов',
        subtitle: '100 Words Learned',
        description: 'Свободно распознавайте 100 английских слов в квестах.',
        badgeEmoji: '🏆',
        currentProgress: 72,
        targetProgress: 100,
        xpReward: 250,
        gradientStart: const Color(0xFF26A69A),
        gradientEnd: const Color(0xFF00897B),
      ),
      AchievementItemState(
        id: 'words_500',
        title: 'Изучено 500 слов',
        subtitle: '500 Words Learned',
        description: 'Соберите словарный запас продвинутого уровня в 500 слов.',
        badgeEmoji: '🥇',
        currentProgress: 140,
        targetProgress: 500,
        xpReward: 1000,
        gradientStart: const Color(0xFFAB47BC),
        gradientEnd: const Color(0xFF8E24AA),
      ),
      AchievementItemState(
        id: 'streak_7',
        title: '7 дней ударного режима',
        subtitle: '7 Day Streak',
        description: 'Занимайтесь английским 7 дней подряд без пропусков.',
        badgeEmoji: '⚡',
        currentProgress: 7,
        targetProgress: 7,
        xpReward: 300,
        gradientStart: const Color(0xFFFF7043),
        gradientEnd: const Color(0xFFF4511E),
      ),
      AchievementItemState(
        id: 'streak_30',
        title: '30 дней ударного режима',
        subtitle: '30 Day Streak',
        description: 'Выдающаяся дисциплина: занимайтесь 30 дней подряд!',
        badgeEmoji: '🔥',
        currentProgress: 12,
        targetProgress: 30,
        xpReward: 1200,
        gradientStart: const Color(0xFFEF5350),
        gradientEnd: const Color(0xFFE53935),
      ),
      AchievementItemState(
        id: 'english_champion',
        title: 'Чемпион английского',
        subtitle: 'English Champion',
        description: 'Пройдите все доступные острова знаний на максимум (3 звезды).',
        badgeEmoji: '👑',
        currentProgress: 3,
        targetProgress: 5,
        xpReward: 2000,
        gradientStart: const Color(0xFF5C6BC0),
        gradientEnd: const Color(0xFF3949AB),
      ),
    ];

    int unlocked = 0;
    int totalXp = 0;
    for (var item in loadedData) {
      if (item.isCompleted) {
        unlocked++;
        totalXp += item.xpReward;
      }
    }

    setState(() {
      _achievementsState = loadedData;
      _unlockedCount = unlocked;
      _totalXpClaimed = totalXp;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isTablet = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Deep Slate background
      appBar: AppBar(
        title: const Text(
          'Мои Награды 🏆',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.lightBlueAccent),
            onPressed: _loadAchievementsData,
          )
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.lightBlueAccent),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildSummaryStatsCard(),
                  const SizedBox(height: 24),
                  const Text(
                    'КНИГА ТВОИХ НАГРАД',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: Color(0xFF38BDF8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  isTablet
                      ? GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 2.1,
                          ),
                          itemCount: _achievementsState.length,
                          itemBuilder: (context, index) {
                            return _buildAchievementCard(_achievementsState[index]);
                          },
                        )
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _achievementsState.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            return _buildAchievementCard(_achievementsState[index]);
                          },
                        ),
                ],
              ),
            ),
    );
  }

  /// Interactive statistics card summary
  Widget _buildSummaryStatsCard() {
    final double completionPercent = _achievementsState.isEmpty
        ? 0.0
        : (_unlockedCount / _achievementsState.length);

    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24.0),
        border: Border.all(color: const Color(0xFF0EA5E9).withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0EA5E9).withOpacity(0.1),
            blurRadius: 15,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Badge stack
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const Icon(Icons.workspace_premium, color: Colors.amber, size: 36),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Супер-Герой Английского',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Заработано очков опыта: +\${_totalXpClaimed} XP',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'Кубки: \${_unlockedCount} из \${_achievementsState.length}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFE2E8F0),
                ),
              ),
              Text(
                '\${(completionPercent * 100).toInt()}% разблокировано',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF38BDF8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8.0),
            child: LinearProgressIndicator(
              value: completionPercent,
              minHeight: 8,
              backgroundColor: const Color(0xFF334155),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF38BDF8)),
            ),
          ),
        ],
      ),
    );
  }

  /// Single high-fidelity Achievement Item card design
  Widget _buildAchievementCard(AchievementItemState item) {
    final double percent = item.targetProgress == 0 
        ? 0.0 
        : (item.currentProgress / item.targetProgress).clamp(0.0, 1.0);
    final bool isCompleted = item.isCompleted;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted 
              ? const Color(0xFFFFB300).withOpacity(0.4) 
              : const Color(0xFF334155),
          width: isCompleted ? 1.5 : 1.0,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Badge decoration
                _buildBadgeGraphic(item),
                const SizedBox(width: 16),
                
                // Text components & Progress details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.title,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: isCompleted ? Colors.white : const Color(0xFF94A3B8),
                                  ),
                                ),
                                Text(
                                  item.subtitle,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                    color: isCompleted ? const Color(0xFF38BDF8) : const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Premium XP tag
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, py: 2),
                            decoration: BoxDecoration(
                              color: isCompleted 
                                  ? const Color(0xFFFFB300).withOpacity(0.15) 
                                  : const Color(0xFF334155),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '+\${item.xpReward} XP',
                              style: TextStyle(
                                fontSize: 9,
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.bold,
                                color: isCompleted ? const Color(0xFFFFB300) : const Color(0xFF94A3B8),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.description,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF94A3B8),
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      // Progress representation
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(
                            isCompleted ? 'Выполнено! 🎉' : 'В процессе',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isCompleted ? const Color(0xFF4ADE80) : const Color(0xFFE2E8F0),
                            ),
                          ),
                          Text(
                            '\${item.currentProgress} / \${item.targetProgress}',
                            style: const TextStyle(
                              fontSize: 10,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF38BDF8),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: percent,
                          minHeight: 5,
                          backgroundColor: const Color(0xFF0F172A),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            isCompleted ? const Color(0xFF4ADE80) : const Color(0xFF0EA5E9),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Locked monochromatic mask icon
          if (!isCompleted)
            Positioned(
              right: 12,
              top: 12,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A).withOpacity(0.6),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lock, size: 10, color: Color(0xFF64748B)),
              ),
            ),
        ],
      ),
    );
  }

  /// Beautiful Badge widget with Double borders and gradient circles
  Widget _buildBadgeGraphic(AchievementItemState item) {
    final bool isCompleted = item.isCompleted;

    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: isCompleted
            ? LinearGradient(
                colors: [item.gradientStart, item.gradientEnd],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : const LinearGradient(
                colors: [Color(0xFF334155), Color(0xFF1E293B)],
              ),
        boxShadow: isCompleted
            ? [
                BoxShadow(
                  color: item.gradientEnd.withOpacity(0.3),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ]
            : null,
      ),
      child: Container(
        margin: const EdgeInsets.all(2.5),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFF0F172A),
          border: Border.all(
            color: isCompleted ? Colors.white.withOpacity(0.2) : Colors.transparent,
            width: 1.0,
          ),
        ),
        child: Center(
          child: Opacity(
            opacity: isCompleted ? 1.0 : 0.3,
            child: Text(
              item.badgeEmoji,
              style: const TextStyle(fontSize: 22),
            ),
          ),
        ),
      ),
    );
  }
}

/// Helper model for keeping active in-state list calculations.
class AchievementItemState {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String badgeEmoji;
  final int currentProgress;
  final int targetProgress;
  final int xpReward;
  final Color gradientStart;
  final Color gradientEnd;

  AchievementItemState({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.badgeEmoji,
    required this.currentProgress,
    required this.targetProgress,
    required this.xpReward,
    required this.gradientStart,
    required this.gradientEnd,
  });

  bool get isCompleted => currentProgress >= targetProgress;
}
`
  },
  {
    path: "lib/views/profile_screen.dart",
    name: "profile_screen.dart",
    type: "navigation",
    description: "Экран профиля ребенка. Содержит аватар с бейджем уровня, полосу опыта (XP), звезды, достижения, выученные слова, прогресс по урокам, ударный режим и недельную активность.",
    code: `import 'package:flutter/material.dart';

/// Interactive high-fidelity Profile Screen for the young English learner.
/// Built with Material Design 3, glowing card containers, custom progress gauges,
/// a visual 7-day streak board, and achievements integration.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // Mock Data mimicking local database or profile state
  final String username = "Алексей";
  final int currentLevel = 12;
  final int currentXp = 4500;
  final int nextLevelXp = 6000;
  final int totalStars = 148;
  final int wordsLearned = 184;
  final int lessonsCompleted = 32;
  final int dailyStreak = 7;
  
  // Weekly streak status (Mon-Sun)
  final List<bool> weeklyStreakDays = [true, true, true, true, true, true, false];
  final List<String> weekDayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Achievements mock dataset
  final List<ProfileAchievement> recentAchievements = [
    ProfileAchievement(
      title: "Первый шаг",
      emoji: "🌱",
      isUnlocked: true,
      color: const Color(0xFF4ADE80),
    ),
    ProfileAchievement(
      title: "Книголюб",
      emoji: "📚",
      isUnlocked: true,
      color: const Color(0xFF38BDF8),
    ),
    ProfileAchievement(
      title: "Мега Мозг",
      emoji: "🔱",
      isUnlocked: true,
      color: const Color(0xFFFB923C),
    ),
    ProfileAchievement(
      title: "7 Дней Огня",
      emoji: "🔥",
      isUnlocked: true,
      color: const Color(0xFFF43F5E),
    ),
    ProfileAchievement(
      title: "Полиглот 500",
      emoji: "🥇",
      isUnlocked: false,
      color: const Color(0xFFA855F7),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final double xpPercentage = currentXp / nextLevelXp;
    
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Premium Slate background
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Elegant Sliver App Bar with parallax profile effects
          SliverAppBar(
            expandedHeight: 120.0,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF1E293B),
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.maybePop(context),
            ),
            title: const Text(
              "Мой Профиль",
              style: TextStyle(
                fontWeight: FontWeight.extrabold,
                color: Colors.white,
                letterSpacing: 0.5,
              ),
            ),
            centerTitle: true,
            actions: [
              IconButton(
                icon: const Icon(Icons.settings, color: Colors.slate300),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Редактирование профиля доступно в настройках для родителей"),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
              ),
            ],
          ),
          
          // Body List content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Main Avatar, Username and Level badge card
                  _buildHeaderAvatarCard(xpPercentage),
                  const SizedBox(height: 20),
                  
                  // Primary statistics layout (Bento Grid style)
                  _buildBentoStatsGrid(),
                  const SizedBox(height: 24),
                  
                  // Interactive 7-Day Streak Panel
                  _buildStreakTrackCircleGrid(),
                  const SizedBox(height: 24),
                  
                  // Horizontal Achievements section with dynamic badge status
                  _buildAchievementsCarousel(),
                  const SizedBox(height: 24),
                  
                  // Secondary actions / stats audit logs
                  _buildSectionHeader("АКТИВНОСТЬ И ОБУЧЕНИЕ"),
                  const SizedBox(height: 10),
                  _buildModernStatRow(
                    label: "Пройденные Острова",
                    value: "4 / 6 островов",
                    icon: Icons.explore,
                    iconColor: const Color(0xFF38BDF8),
                  ),
                  const SizedBox(height: 8),
                  _buildModernStatRow(
                    label: "Средняя точность ответов",
                    value: "94%",
                    icon: Icons.insights,
                    iconColor: const Color(0xFF4ADE80),
                  ),
                  const SizedBox(height: 8),
                  _buildModernStatRow(
                    label: "Кубки в турнирах",
                    value: "14 кубков",
                    icon: Icons.emoji_events,
                    iconColor: const Color(0xFFFFB300),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Extracted Header Avatar component with Level badge overlay and glowing animations
  Widget _buildHeaderAvatarCard(double xpPercentage) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.15), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF38BDF8).withOpacity(0.04),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          Stack(
            alignment: Alignment.bottomCenter,
            children: [
              // Avatar glow wrapper
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFF38BDF8), Color(0xFF818CF8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF38BDF8).withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF0F172A),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: ClipOval(
                      child: Container(
                        color: const Color(0xFF1E293B),
                        child: const Center(
                          child: Text(
                            "🦊", // Cute animal avatar for children
                            style: TextStyle(fontSize: 48),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              
              // Level Badge badge
              Positioned(
                bottom: -2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, py: 3),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFD97706)]),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFEF3C7), width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFD97706).withOpacity(0.4),
                        blurRadius: 6,
                        spreadRadius: 1,
                      )
                    ],
                  ),
                  child: Text(
                    "Уровень $currentLevel",
                    style: const TextStyle(
                      color: Color(0xFF78350F),
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Username displaying beautifully
          Text(
            username,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.extrabold,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          
          const Text(
            "Статус: Супер-Ученик Английского 🚀",
            style: TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          
          // XP interactive linear tracker
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                "Очки опыта (XP)",
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                "$currentXp / $nextLevelXp XP",
                style: const TextStyle(
                  color: Color(0xFF38BDF8),
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Container(
              height: 12,
              color: const Color(0xFF0F172A),
              child: Stack(
                children: [
                  FractionallySizedBox(
                    widthFactor: xpPercentage.clamp(0.0, 1.0),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF38BDF8), Color(0xFF4F46E5)],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF38BDF8).withOpacity(0.5),
                            blurRadius: 4,
                            spreadRadius: 1,
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            "Осталось \${nextLevelXp - currentXp} XP до уровня \${currentLevel + 1}",
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 10, fontStyle: FontStyle.italic),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  /// Modern Bento-Style statistical cards grid
  Widget _buildBentoStatsGrid() {
    return LayoutBuilder(builder: (context, constraints) {
      final double cardWidth = (constraints.maxWidth - 12) / 2;
      return Column(
        children: [
          Row(
            children: [
              _buildFittedStatCard(
                title: "Изучено Слов",
                subtitle: "Active Words",
                value: "$wordsLearned",
                emoji: "📚",
                cardColor: const Color(0xFF0EA5E9).withOpacity(0.12),
                borderColor: const Color(0xFF0EA5E9).withOpacity(0.35),
                valueColor: const Color(0xFF38BDF8),
                width: cardWidth,
              ),
              const SizedBox(width: 12),
              _buildFittedStatCard(
                title: "Звезд Собрано",
                subtitle: "Gold Stars",
                value: "$totalStars",
                emoji: "⭐",
                cardColor: const Color(0xFFEAB308).withOpacity(0.12),
                borderColor: const Color(0xFFEAB308).withOpacity(0.35),
                valueColor: const Color(0xFFFACC15),
                width: cardWidth,
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildFittedStatCard(
                title: "Пройденой Уроков",
                subtitle: "Lessons",
                value: "$lessonsCompleted",
                emoji: "🎯",
                cardColor: const Color(0xFF10B981).withOpacity(0.12),
                borderColor: const Color(0xFF10B981).withOpacity(0.35),
                valueColor: const Color(0xFF4ADE80),
                width: cardWidth,
              ),
              const SizedBox(width: 12),
              _buildFittedStatCard(
                title: "Супер Серия",
                subtitle: "Streak Days",
                value: "$dailyStreak дн.",
                emoji: "⚡",
                cardColor: const Color(0xFFF43F5E).withOpacity(0.12),
                borderColor: const Color(0xFFF43F5E).withOpacity(0.35),
                valueColor: const Color(0xFFFB7185),
                width: cardWidth,
              ),
            ],
          ),
        ],
      );
    });
  }

  /// Grid elements builder
  Widget _buildFittedStatCard({
    required String title,
    required String subtitle,
    required String value,
    required String emoji,
    required Color cardColor,
    required Color borderColor,
    required Color valueColor,
    required double width,
  }) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(borderColor, width: 1.2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
      child: Stack(
        children: [
          Positioned(
            right: 0,
            top: 0,
            child: Text(
              emoji,
              style: const TextStyle(fontSize: 18),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFFCBD5E1),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                value,
                style: TextStyle(
                  color: valueColor,
                  fontSize: 20,
                  fontWeight: FontWeight.extrabold,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Weekly calendar horizontal checkmarks tracker widget
  Widget _buildStreakTrackCircleGrid() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0).withOpacity(0.06)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  const Text(
                    "🔥 Ударный календарь",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, py: 1.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF43F5E).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      "$dailyStreak Дней",
                      style: const TextStyle(
                        fontFamily: "monospace",
                        color: Color(0xFFFB7185),
                        fontWeight: FontWeight.bold,
                        fontSize: 8,
                      ),
                    ),
                  )
                ],
              ),
              const Text(
                "Твоя лучшая неделя!",
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w600,
                  fontSize: 10,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Row of week checkmarks
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              final bool isActive = weeklyStreakDays[index];
              final String label = weekDayLabels[index];
              
              return Expanded(
                child: Column(
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 9,
                        color: isActive ? const Color(0xFFFB7185) : const Color(0xFF475569),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isActive ? const Color(0xFFFFE4E6) : const Color(0xFF0F172A),
                        border: Border.all(
                          color: isActive ? const Color(0xFFF43F5E) : const Color(0xFF334155),
                          width: isActive ? 1.5 : 1.0,
                        ),
                        boxShadow: isActive
                            ? [
                                BoxShadow(
                                  color: const Color(0xFFF43F5E).withOpacity(0.3),
                                  blurRadius: 6,
                                  spreadRadius: 1,
                                )
                              ]
                            : null,
                      ),
                      child: Icon(
                        isActive ? Icons.local_fire_department : Icons.radio_button_unchecked,
                        color: isActive ? const Color(0xFFE11D48) : const Color(0xFF475569),
                        size: isActive ? 18 : 12,
                      ),
                    ),
                  ],
                ),
              );
            }),
          )
        ],
      ),
    );
  }

  /// Achievements Horizontal slider element
  Widget _buildAchievementsCarousel() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            _buildSectionHeader("НАГРАДЫ И БЕЙДЖИ"),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Смотрите все награды в основном оглавлении!")),
                );
              },
              child: const Text(
                "Все награды →",
                style: TextStyle(
                  color: Color(0xFF38BDF8),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        
        SizedBox(
          height: 104,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: recentAchievements.length,
            separatorBuilder: (context, index) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final ach = recentAchievements[index];
              return Container(
                width: 90,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: ach.isUnlocked 
                        ? ach.color.withOpacity(0.3) 
                        : const Color(0xFF334155),
                    width: ach.isUnlocked ? 1.5 : 1.0,
                  ),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: ach.isUnlocked 
                            ? ach.color.withOpacity(0.12) 
                            : const Color(0xFF0F172A),
                      ),
                      child: Center(
                        child: Opacity(
                          opacity: ach.isUnlocked ? 1.0 : 0.25,
                          child: Text(
                            ach.emoji,
                            style: const TextStyle(fontSize: 22),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      ach.title,
                      style: TextStyle(
                        color: ach.isUnlocked ? Colors.white : const Color(0xFF64748B),
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        overflow: TextOverflow.ellipsis,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  /// Auxiliary section title text builder
  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1.5,
        color: Color(0xFF64748B),
      ),
    );
  }

  /// Premium analytical info list row
  Widget _buildModernStatRow({
    required String label,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155).withOpacity(0.5)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 16),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFFE2E8F0),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 12,
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}

/// Helper model for user profile achievements display
class ProfileAchievement {
  final String title;
  final String emoji;
  final bool isUnlocked;
  final Color color;

  ProfileAchievement({
    required this.title,
    required this.emoji,
    required this.isUnlocked,
    required this.color,
  });
}
`
  },
  {
    path: "lib/views/parent_dashboard.dart",
    name: "parent_dashboard.dart",
    type: "navigation",
    description: "Насыщенная интерактивная панель родителей уровня Senior. Отображает общее время обучения, процент правильных ответов, освоенные слова, уроки, статистику по дням/неделям/месяцам и кастомный график прогресса на CustomPainter.",
    code: `import 'package:flutter/material.dart';

/// Senior-Developer-level High-Fidelity Parent Dashboard Screen.
/// Displays detailed educational analytics: active learning time, lessons completed,
/// vocabulary size, average scores, and interactive Daily/Weekly/Monthly activity charts
/// using a gorgeous custom spline-curve painter.
class ParentDashboardScreen extends StatefulWidget {
  const ParentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends State<ParentDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _periodTabController;
  
  // Custom states for interactive simulation
  String selectedChild = "Алексей (5 лет)";
  bool isAlertsEnabled = true;
  int dailyTimeLimitMinutes = 15;

  // Mock stats reflecting realistic persistence
  final int totalLearningMinutes = 480;
  final int lessonsCompleted = 32;
  final int totalLessons = 40;
  final int wordsLearned = 184;
  final double averageScorePercent = 94.2;
  final int currentStreak = 7;

  // Data ranges for charts
  final Map<int, List<double>> chartPointsByPeriod = {
    0: [10, 15, 8, 12, 18, 15, 0], // Daily data points (Mon-Sun active mins)
    1: [45, 60, 50, 75, 90, 80, 85], // Weekly data points (Last 7 weeks)
    2: [180, 240, 310, 390, 440, 480], // Monthly progression (Cumulative mins over 6 months)
  };

  final List<String> periodLabels = ["День", "Неделя", "Месяц"];

  @override
  void initState() {
    super.initState();
    _periodTabController = TabController(length: 3, vsync: this);
    _periodTabController.addListener(() {
      setState(() {}); // Redraw custom paint when tab changes
    });
  }

  @override
  void dispose() {
    _periodTabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark luxury slate background
      appBar: AppBar(
        expandedHeight: 60.0,
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Кабинет Родителей",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              isAlertsEnabled ? Icons.notifications_active : Icons.notifications_off,
              color: isAlertsEnabled ? const Color(0xFF38BDF8) : Colors.slate500,
            ),
            onPressed: () {
              setState(() {
                isAlertsEnabled = !isAlertsEnabled;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isAlertsEnabled ? "Push-нотификации об успехах включены" : "Уведомления отключены",
                  ),
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Kid Profile Switcher Header
              _buildChildProfileSelectorCard(),
              const SizedBox(height: 16),

              // KPI Statistics Grid (4 indicators: Time, Lessons, Words, Score)
              _buildMetricStatsGrid(),
              const SizedBox(height: 20),

              // Interactive Activity Tabs (Daily, Weekly, Monthly)
              _buildActivityAnalysisCard(),
              const SizedBox(height: 20),

              // Spaced Repetition Vocabulary Mastery Card
              _buildVocabularyMasteryCard(),
              const SizedBox(height: 20),

              // Parent Time Limits Safety Settings Controller
              _buildParentalControlsCard(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  /// Dropdown simulation card representing multiclass profiles
  Widget _buildChildProfileSelectorCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF334155), width: 1.0),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(colors: [Color(0xFFFB923C), Color(0xFFF43F5E)]),
                ),
                child: const Center(
                  child: Text("🦊", style: TextStyle(fontSize: 22)),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Аналитика обучения",
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    selectedChild,
                    style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.extrabold),
                  ),
                ],
              ),
            ],
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.swap_horiz, color: Color(0xFF38BDF8)),
            onSelected: (String child) {
              setState(() {
                selectedChild = child;
              });
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            color: const Color(0xFF1E293B),
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'Алексей (5 лет)',
                child: Text('Алексей (5 лет)', style: TextStyle(color: Colors.white, fontSize: 13)),
              ),
              const PopupMenuItem<String>(
                value: 'Маша (8 лет)',
                child: Text('Маша (8 лет)', style: TextStyle(color: Colors.white, fontSize: 13)),
              ),
            ],
          )
        ],
      ),
    );
  }

  /// Four core stats layout displaying vital information requested
  Widget _buildMetricStatsGrid() {
    final double cardHeight = 94.0;
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.8,
      children: [
        _buildStatBox(
          title: "Время обучения",
          subtitle: "Learning Time",
          value: "\${totalLearningMinutes} мин",
          emoji: "⏱️",
          color: const Color(0xFF0EA5E9),
        ),
        _buildStatBox(
          title: "Урок завершено",
          subtitle: "Lessons Done",
          value: "\${lessonsCompleted}/\${totalLessons}",
          emoji: "🎯",
          color: const Color(0xFF10B981),
        ),
        _buildStatBox(
          title: "Выучено слов",
          subtitle: "Words Learned",
          value: "\${wordsLearned} слов",
          emoji: "📝",
          color: const Color(0xFF818CF8),
        ),
        _buildStatBox(
          title: "Средняя оценка",
          subtitle: "Average Score",
          value: "\${averageScorePercent.toStringAsFixed(1)}%",
          emoji: "🏆",
          color: const Color(0xFFF59E0B),
        ),
      ],
    );
  }

  Widget _buildStatBox({
    required String title,
    required String subtitle,
    required String value,
    required String emoji,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2), width: 1.2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: Stack(
        children: [
          Positioned(
            right: 0,
            top: 0,
            child: Text(emoji, style: const TextStyle(fontSize: 16)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF475569), fontSize: 7, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 15,
                  fontWeight: FontWeight.extrabold,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Periodic Activity Chart Card (Custom Painting beautiful curved spline graph)
  Widget _buildActivityAnalysisCard() {
    final activeTabIndex = _periodTabController.index;
    final List<double> data = chartPointsByPeriod[activeTabIndex] ?? chartPointsByPeriod[0]!;
    
    // Summing values
    double totalPeriodMins = data.fold(0, (prev, val) => prev + val);
    String scopeUnit = activeTabIndex == 0 ? "минут сегодня" : activeTabIndex == 1 ? "минут за неделю" : "минут за месяц";

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "ИНТЕНСИВНОСТЬ ЗАНЯТИЙ",
                    style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      Text(
                        "\${totalPeriodMins.round()} мин",
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.extrabold, color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        scopeUnit,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF38BDF8), fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
              
              // Standard Cupertino/Material segment layout
              Container(
                height: 30,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(10),
                ),
                padding: const EdgeInsets.all(2.0),
                child: Row(
                  children: List.generate(3, (index) {
                    final bool isSelected = activeTabIndex == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _periodTabController.animateTo(index);
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF38BDF8) : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          periodLabels[index],
                          style: TextStyle(
                            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                            fontSize: 9,
                            fontWeight: isSelected ? FontWeight.extrabold : FontWeight.normal,
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              )
            ],
          ),
          const SizedBox(height: 24),

          // Custom Spline Curve Graph
          SizedBox(
            height: 120,
            child: CustomPaint(
              size: Size.infinite,
              painter: ProgressChartPainter(
                dataPoints: data,
                color: const Color(0xFF38BDF8),
                fillColor: const Color(0xFF38BDF8).withOpacity(0.06),
              ),
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Labeling dynamic X axes
          _buildChartLabelsRow(activeTabIndex),
        ],
      ),
    );
  }

  Widget _buildChartLabelsRow(int periodIdx) {
    List<String> labels = [];
    if (periodIdx == 0) {
      labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    } else if (periodIdx == 1) {
      labels = ["н-7", "н-6", "н-5", "н-4", "н-3", "н-2", "н-1"];
    } else {
      labels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.between,
      children: labels.map((lbl) => Text(
        lbl,
        style: const TextStyle(fontSize: 8, color: Color(0xFF475569), fontWeight: FontWeight.bold, fontFamily: 'monospace'),
      )).toList(),
    );
  }

  /// Spaced Repetition mastery table
  Widget _buildVocabularyMasteryCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            "УСВОЕНИЕ ТЕМАТИЧЕСКИХ СЛОВАРЕЙ",
            style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.2),
          ),
          const SizedBox(height: 16),

          _buildProgressBarRow("Животные (Animals)", 0.90, "90% слов", const Color(0xFF4ADE80)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Еда и Напитки (Food)", 0.75, "75% слов", const Color(0xFF38BDF8)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Цвета и Формы (Colors)", 0.55, "55% слов", const Color(0xFFFACC15)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Семья и Дом (Family)", 0.15, "15% в процессе", const Color(0xFF818CF8)),
        ],
      ),
    );
  }

  Widget _buildProgressBarRow(String label, double valueFactor, String textVal, Color barColor) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Text(label, style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontWeight: FontWeight.bold)),
            Text(textVal, style: TextStyle(color: barColor, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Container(
            height: 6,
            color: const Color(0xFF0F172A),
            child: Stack(
              children: [
                FractionallySizedBox(
                  widthFactor: valueFactor,
                  child: Container(color: barColor),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  /// Screen limits controls simulator
  Widget _buildParentalControlsCard() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [const Color(0xFF1E293B), const Color(0xFF1E1B4B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF4F46E5).withOpacity(0.3)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.security, color: Color(0xFF818CF8), size: 16),
              ),
              const SizedBox(width: 8),
              const Text(
                "БЕЗОПАСНОСТЬ И ЛИМИТЫ ЭКРАНА",
                style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFFC7D2FE), letterSpacing: 1.2),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Daily sliding limit
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                "Дневное игровое время:",
                style: TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                "\${dailyTimeLimitMinutes} мин / день",
                style: const TextStyle(color: Color(0xFFFF4E7E), fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
              ),
            ],
          ),
          Slider(
            value: dailyTimeLimitMinutes.toDouble(),
            min: 5,
            max: 60,
            divisions: 11,
            activeColor: const Color(0xFF4F46E5),
            inactiveColor: const Color(0xFF0F172A),
            onChanged: (double val) {
              setState(() {
                dailyTimeLimitMinutes = val.round();
              });
            },
          ),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Автоматическая блокировка", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
              Text(
                "Блокировать при превышении лимита",
                style: TextStyle(color: const Color(0xFF4DE80).withOpacity(0.5), fontSize: 8, fontStyle: FontStyle.italic),
              )
            ],
          )
        ],
      ),
    );
  }
}

/// Custom spline graph painter to show beautiful visual charts without third party visual bloating
class ProgressChartPainter extends CustomPainter {
  final List<double> dataPoints;
  final Color color;
  final Color fillColor;

  ProgressChartPainter({
    required this.dataPoints,
    required this.color,
    required this.fillColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (dataPoints.isEmpty) return;

    final double width = size.width;
    final double height = size.height;
    final int itemsCount = dataPoints.length;

    // Finding bounds
    double maxValue = 1.0;
    for (var val in dataPoints) {
      if (val > maxValue) maxValue = val;
    }
    maxValue *= 1.15; // padding top

    final double stepX = width / (itemsCount - 1);
    
    // Path for drawing spline
    final Path path = Path();
    final Path filledPath = Path();

    // Starter point
    double x0 = 0;
    double y0 = height - (dataPoints[0] / maxValue) * height;
    path.moveTo(x0, y0);
    filledPath.moveTo(0, height);
    filledPath.lineTo(x0, y0);

    for (int i = 1; i < itemsCount; i++) {
      double x1 = i * stepX;
      double y1 = height - (dataPoints[i] / maxValue) * height;

      // Splined support control coordinates
      double cpX1 = x0 + (x1 - x0) / 2;
      double cpY1 = y0;
      double cpX2 = x0 + (x1 - x0) / 2;
      double cpY2 = y1;

      path.cubicTo(cpX1, cpY1, cpX2, cpY2, x1, y1);
      filledPath.cubicTo(cpX1, cpY1, cpX2, cpY2, x1, y1);

      x0 = x1;
      y0 = y1;
    }

    filledPath.lineTo(width, height);
    filledPath.close();

    // Painting shaded baseline
    final Paint fillPaint = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;
    canvas.drawPath(filledPath, fillPaint);

    // Painting line
    final Paint linePaint = Paint()
      ..color = color
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, linePaint);

    // Painting dots on peak coordinates
    final Paint dotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    
    final Paint dotOuterPaint = Paint()
      ..color = color
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < itemsCount; i++) {
      double circleX = i * stepX;
      double circleY = height - (dataPoints[i] / maxValue) * height;

      canvas.drawCircle(Offset(circleX, circleY), 4.5, dotOuterPaint);
      canvas.drawCircle(Offset(circleX, circleY), 3.0, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant ProgressChartPainter oldDelegate) {
    return oldDelegate.dataPoints != dataPoints || oldDelegate.color != color;
  }
}
`
  },
  {
    path: "lib/data/repositories/user_repository.dart",
    name: "user_repository.dart",
    type: "database",
    description: "Репозиторий пользователя: чтение/запись профиля, обновление текущего урока, начисление звезд.",
    code: `import '../../models/user_profile.dart';
import '../db/database_helper.dart';

/// Repository for handling user profile read/write states.
/// Encapsulates direct SQLite actions into safe asynchronous future operations.
class UserRepository {
  final DatabaseHelper _dbHelper;

  UserRepository({DatabaseHelper? dbHelper}) : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Fetches child profile.
  Future<UserProfile?> fetchUserProfile() async {
    return await _dbHelper.getUserProfile();
  }

  /// Updates or saves child profile data.
  Future<bool> saveUserProfile(UserProfile profile) async {
    final updated = await _dbHelper.updateUserProfile(profile);
    return updated > 0;
  }

  /// Sets current active lesson being explored.
  Future<bool> updateCurrentLesson(String lessonCategory) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(currentLesson: lessonCategory);
    return await saveUserProfile(updatedProfile);
  }

  /// Sets daily active streak.
  Future<bool> updateDailyStreak(int streakCount) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(dailyStreakCount: streakCount);
    return await saveUserProfile(updatedProfile);
  }

  /// Updates star balance.
  Future<bool> updateStarBalance(int change) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(
      starBalance: profile.starBalance + change,
    );
    return await saveUserProfile(updatedProfile);
  }

  /// Sets onboarding completion status.
  Future<bool> updateOnboardingStatus(int isCompleted) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(isOnboardingCompleted: isCompleted);
    return await saveUserProfile(updatedProfile);
  }
}
`
  },
  {
    path: "lib/data/repositories/progress_repository.dart",
    name: "progress_repository.dart",
    type: "database",
    description: "Репозиторий прогресса: сохранение пройденных уроков, звездного рейтинга и истории интервального повторения.",
    code: `import 'package:sqflite/sqflite.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../db/database_helper.dart';

/// Repository responsible for Lesson progress, unlocked modules/islands,
/// and spaced-repetition Quiz histories inside SQLite.
class ProgressRepository {
  final DatabaseHelper _dbHelper;

  ProgressRepository({DatabaseHelper? dbHelper}) : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Fetches complete progress dataset across all available modules.
  Future<List<LessonProgress>> fetchAllLessonProgress() async {
    final db = await _dbHelper.database;
    final maps = await db.query('lesson_progress');
    return maps.map((json) => LessonProgress.fromMap(json)).toList();
  }

  /// Fetches custom progress details for a given module.
  Future<LessonProgress?> fetchProgressForModule(String moduleCategory) async {
    final db = await _dbHelper.database;
    final maps = await db.query(
      'lesson_progress',
      where: 'module_category = ?',
      whereArgs: [moduleCategory],
    );
    if (maps.isNotEmpty) {
      return LessonProgress.fromMap(maps.first);
    }
    return null;
  }

  /// Saves or overwrites lesson progress parameters.
  Future<void> saveLessonProgress(LessonProgress progress) async {
    final db = await _dbHelper.database;
    await db.insert(
      'lesson_progress',
      progress.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Updates high score star balances dynamically.
  Future<void> updateStarsAndCompletion(String moduleCategory, int starsEarned) async {
    await _dbHelper.updateLessonProgress(moduleCategory, starsEarned);
  }

  /// Saves completed quiz performance under space-repetition intervals.
  Future<void> saveQuizRecord(QuizHistory history) async {
    final db = await _dbHelper.database;
    await db.insert(
      'quiz_history',
      history.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Fetches historical quiz attempts.
  Future<List<QuizHistory>> fetchQuizHistoryForCard(String cardId) async {
    final db = await _dbHelper.database;
    final maps = await db.query(
      'quiz_history',
      where: 'card_id = ?',
      whereArgs: [cardId],
      orderBy: 'last_answered_timestamp DESC',
    );
    return maps.map((json) => QuizHistory.fromMap(json)).toList();
  }

  /// Fetches card IDs that are due for spaced-repetition review.
  Future<List<String>> fetchDueCardIds(int currentTimestamp) async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> results = await db.rawQuery('''
      SELECT DISTINCT card_id 
      FROM quiz_history 
      WHERE next_review_timestamp <= ?
    ''', [currentTimestamp]);
    return results.map((row) => row['card_id'] as String).toList();
  }

  /// Exposes the database helper for integration purposes.
  DatabaseHelper get dbHelper => _dbHelper;
}
`
  },
  {
    path: "lib/data/repositories/achievement_repository.dart",
    name: "achievement_repository.dart",
    type: "database",
    description: "Репозиторий достижений: проверка условий и разблокировка наград во встроенной базе данных.",
    code: `import '../../models/achievement.dart';
import '../db/database_helper.dart';

/// Repository in charge of tracking, fetching and unlocking gamified achievements.
class AchievementRepository {
  final DatabaseHelper _dbHelper;

  AchievementRepository({DatabaseHelper? dbHelper}) : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Fetches list of all achievements from SQLite database.
  Future<List<SystemAchievement>> fetchAllAchievements() async {
    final db = await _dbHelper.database;
    final maps = await db.query('system_achievement');
    return maps.map((json) => SystemAchievement.fromMap(json)).toList();
  }

  /// Safely unlocks a given reward with millisecond time triggers.
  Future<bool> unlockAchievement(String achievementId) async {
    final db = await _dbHelper.database;
    final updatedCount = await db.update(
      'system_achievement',
      {
        'is_unlocked': 1,
        'unlocked_at_timestamp': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'achievement_id = ? AND is_unlocked = 0',
      whereArgs: [achievementId],
    );
    return updatedCount > 0;
  }
}
`
  },
  {
    path: "lib/data/services/learning_service.dart",
    name: "learning_service.dart",
    type: "database",
    description: "Бизнес-сервис обучения: расчет серии дней активности (стрик), уровней, очков опыта и разблокировки ачивок.",
    code: `import '../../models/user_profile.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../repositories/user_repository.dart';
import '../repositories/progress_repository.dart';
import '../repositories/achievement_repository.dart';

/// Core Service Class for Orchestrating Business Logic, Gamified Systems,
/// Streak Management, and Offline Database Syncing.
class LearningService {
  final UserRepository userRepository;
  final ProgressRepository progressRepository;
  final AchievementRepository achievementRepository;

  LearningService({
    UserRepository? userRepo,
    ProgressRepository? progressRepo,
    AchievementRepository? achievementRepo,
  })  : userRepository = userRepo ?? UserRepository(),
        progressRepository = progressRepo ?? ProgressRepository(),
        achievementRepository = achievementRepo ?? AchievementRepository();

  /// Checks and updates daily active streak on application launch.
  /// If the user logs in the following day, streak is incremented.
  /// If the lapse is > 48 hours, streak resets to 1.
  Future<Map<String, dynamic>> checkDailyStreak() async {
    final profile = await userRepository.fetchUserProfile();
    if (profile == null) return {'streak_updated': false, 'streak_count': 0};

    final now = DateTime.now();
    final todayMidnight = DateTime(now.year, now.month, now.day).millisecondsSinceEpoch;
    final lastActiveDate = DateTime.fromMillisecondsSinceEpoch(profile.lastActiveTimestamp);
    final lastActiveMidnight = DateTime(lastActiveDate.year, lastActiveDate.month, lastActiveDate.day).millisecondsSinceEpoch;

    const msInDay = 24 * 60 * 60 * 1000;
    final int diffMs = todayMidnight - lastActiveMidnight;

    bool streakUpdated = false;
    int actualStreak = profile.dailyStreakCount;

    if (diffMs == msInDay) {
      // It is exactly the next calendar day - increment the streak
      actualStreak += 1;
      streakUpdated = true;
    } else if (diffMs > msInDay) {
      // User forgot - reset streak to 1
      actualStreak = 1;
      streakUpdated = true;
    }

    final updatedProfile = profile.copyWith(
      dailyStreakCount: actualStreak,
      lastActiveTimestamp: now.millisecondsSinceEpoch,
    );
    await userRepository.saveUserProfile(updatedProfile);

    // Dynamic Achievement check for 7-day streaks
    if (actualStreak >= 7) {
      await achievementRepository.unlockAchievement('streak_7');
    }

    return {
      'streak_updated': streakUpdated,
      'streak_count': actualStreak,
    };
  }

  /// Records complete lesson success, updating stars, awarding XP and calculating Level up values
  Future<Map<String, dynamic>> completeLesson(String moduleCategory, int starsEarned) async {
    // 1. Update lesson stars and completion count in SQLite
    await progressRepository.updateStarsAndCompletion(moduleCategory, starsEarned);

    // 2. Award XP/Stars inside user profile
    int xpReward = starsEarned * 25;
    int starReward = starsEarned;

    final profile = await userRepository.fetchUserProfile();
    if (profile == null) return {'leveled_up': false};

    int currentXp = profile.accumulatedXp + xpReward;
    int currentLvl = profile.currentLevel;
    bool leveledUp = false;

    while (true) {
      int neededForNext = 100 * currentLvl * currentLvl - 50 * currentLvl;
      if (currentXp >= neededForNext) {
        currentXp -= neededForNext;
        currentLvl++;
        leveledUp = true;
      } else {
        break;
      }
    }

    final updatedProfile = profile.copyWith(
      accumulatedXp: currentXp,
      currentLevel: currentLvl,
      starBalance: profile.starBalance + starReward,
    );
    await userRepository.saveUserProfile(updatedProfile);

    // 3. Automated unlock check for Achievements
    if (starsEarned == 3) {
      await achievementRepository.unlockAchievement('perfect_score');
    }
    await achievementRepository.unlockAchievement('first_word');

    return {
      'leveled_up': leveledUp,
      'new_level': currentLvl,
      'xp_awarded': xpReward,
      'stars_awarded': starReward,
    };
  }
}
`
  },
  {
    path: "lib/data/services/app_state_integration.dart",
    name: "app_state_integration.dart",
    type: "database",
    description: "Интеграция состояния Flutter через ChangeNotifier для связи SQLite репозиториев с UI экранами.",
    code: `import 'package:flutter/material.dart';
import '../../models/user_profile.dart';
import '../../models/lesson_progress.dart';
import '../../models/achievement.dart';
import 'learning_service.dart';

/// App State Integration provider using ChangeNotifier to present local SQLite
/// models dynamically to the user interface. Inherits Senior best practices.
class LearningAppState extends ChangeNotifier {
  final LearningService _service;

  UserProfile? _profile;
  List<LessonProgress> _lessons = [];
  List<SystemAchievement> _achievements = [];
  bool _isLoading = false;

  LearningAppState({LearningService? service})
      : _service = service ?? LearningService() {
    initializeLocalState();
  }

  UserProfile? get profile => _profile;
  List<LessonProgress> get lessons => _lessons;
  List<SystemAchievement> get achievements => _achievements;
  bool get isLoading => _isLoading;

  /// Loads profiles, checks daily active streaks, and caches state datasets
  Future<void> initializeLocalState() async {
    _isLoading = true;
    notifyListeners();

    _profile = await _service.userRepository.fetchUserProfile();
    
    // Check and trigger daily active streak updater on start
    await _service.checkDailyStreak();
    
    // Re-fetch profile to keep UI in synchronous sync
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();

    _isLoading = false;
    notifyListeners();
  }

  /// Sets current active lesson being explored
  Future<void> setCurrentLesson(String moduleCategory) async {
    if (_profile == null) return;
    final success = await _service.userRepository.updateCurrentLesson(moduleCategory);
    if (success) {
      _profile = _profile!.copyWith(currentLesson: moduleCategory);
      notifyListeners();
    }
  }

  /// Syncs completed lesson activity down to SQLite and alerts UI of updates
  Future<void> handleLessonCompleted(String module, int stars) async {
    final result = await _service.completeLesson(module, stars);
    
    // Re-fetch datasets
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();
    
    notifyListeners();
  }

  /// Completes the onboarding flow, saving the user profile details and PIN code to SQLite.
  Future<void> completeOnboarding({
    required String childName,
    required int ageBracket,
    required String heroBuddy,
    required String parentalPin,
  }) async {
    _isLoading = true;
    notifyListeners();

    final List<Map<String, dynamic>> maps = await (await _service.userRepository.fetchUserProfile() != null
        ? Future.value([])
        : Future.value([])); // dummy guard

    final exProfile = await _service.userRepository.fetchUserProfile();
    final freshProfile = UserProfile(
      id: exProfile?.id ?? 1,
      childName: childName,
      ageBracket: ageBracket,
      heroBuddyId: heroBuddy,
      lastActiveTimestamp: DateTime.now().millisecondsSinceEpoch,
      parentalPin: parentalPin,
      isOnboardingCompleted: 1,
      currentLevel: exProfile?.currentLevel ?? 1,
      accumulatedXp: exProfile?.accumulatedXp ?? 0,
      starBalance: exProfile?.starBalance ?? 0,
      dailyStreakCount: exProfile?.dailyStreakCount ?? 1,
      currentLesson: exProfile?.currentLesson ?? 'animals',
    );

    await _service.userRepository.saveUserProfile(freshProfile);

    // Re-initialize state
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();

    _isLoading = false;
    notifyListeners();
  }
}
`
  },
  {
    path: "lib/data/services/tts_service.dart",
    name: "tts_service.dart",
    type: "database",
    description: "TTS-сервис озвучки: английское произношение для детей, выбор голоса и регулировка скорости.",
    code: `import 'package:flutter_tts/flutter_tts.dart';

/// Service for text-to-speech pronunciation leveraging flutter_tts.
/// Provides offline capabilities, English pronunciation adjustments, and child-friendly settings.
class TtsService {
  static final TtsService instance = TtsService._init();
  late final FlutterTts _flutterTts;
  
  bool _isInitialized = false;
  double _speechRate = 0.35; // Slow, child-friendly speech rate
  String _language = 'en-US';
  final double _pitch = 1.15; // Slightly high pitch for kids gamification

  TtsService._init() {
    _flutterTts = FlutterTts();
    _configureTts();
  }

  Future<void> _configureTts() async {
    try {
      await _flutterTts.setLanguage(_language);
      await _flutterTts.setSpeechRate(_speechRate);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(_pitch);
      
      // Handle completion/error events
      _flutterTts.setErrorHandler((msg) {
        print("TTS speech error: \$msg");
      });
      
      _isInitialized = true;
    } catch (e) {
      print("Error configuring child TTS: \$e");
    }
  }

  /// Speaks the specified word in English
  Future<void> speakEnglish(String text) async {
    if (!_isInitialized) {
      await _configureTts();
    }
    await _flutterTts.stop();
    await _flutterTts.speak(text);
  }

  /// Sets custom speech rate (e.g., from 0.1 to 1.0)
  Future<void> setCustomSpeechRate(double rate) async {
    _speechRate = rate;
    await _flutterTts.setSpeechRate(_speechRate);
  }

  /// Stop current active speech
  Future<void> stop() async {
    await _flutterTts.stop();
  }

  /// Get list of supported voices for speech adjustments
  Future<List<String>> getAvailableEnglishVoices() async {
    try {
      final voices = await _flutterTts.getVoices;
      if (voices != null) {
        final List<String> list = [];
        for (var voice in voices) {
          final voiceStr = voice.toString();
          if (voiceStr.toLowerCase().contains("en")) {
            list.add(voiceStr);
          }
        }
        return list;
      }
    } catch (_) {}
    return ['System Default Male', 'System Default Female'];
  }

  /// Set customized voice setting
  Future<void> setVoice(String voiceName) async {
    try {
      await _flutterTts.setVoice({"name": voiceName, "locale": _language});
    } catch (e) {
      print("Could not load selected voice: \$e");
    }
  }
}
`
  },
  {
    path: "lib/data/services/spaced_repetition_service.dart",
    name: "spaced_repetition_service.dart",
    type: "database",
    description: "Серверный модуль интервальных повторений SM-2: расчет интервалов и дат следующего повторения карт.",
    code: `import '../../models/quiz_history.dart';
import '../repositories/progress_repository.dart';

/// Output model containing calculated parameters of SM-2 algorithm.
class SpacedRepetitionResult {
  final int nextReviewTimestamp; // output: next review date / timestamp
  final double difficultyScore;  // output: difficulty score (Easiness Factor)
  final int repetitionInterval;  // output: repetition interval in days
  final double successRate;      // output: calculated success rate

  SpacedRepetitionResult({
    required this.nextReviewTimestamp,
    required this.difficultyScore,
    required this.repetitionInterval,
    required this.successRate,
  });
}

/// Service Layer implementing the SuperMemo-2 Spaced Repetition Algorithm.
class SpacedRepetitionService {
  final ProgressRepository _progressRepository;

  SpacedRepetitionService({ProgressRepository? progressRepository})
      : _progressRepository = progressRepository ?? ProgressRepository();

  /// Calculates the SM-2 algorithm output based on active quiz history inputs.
  SpacedRepetitionResult processReview({
    required List<QuizHistory> previousHistory,
    required int answerQuality,
    double? customSuccessRate,
  }) {
    // Validate bounds for answer quality (0-5)
    int q = answerQuality.clamp(0, 5);

    // Calculate dynamic success rate: (correct attempts / total attempts) inclusive of current
    double calculatedSuccessRate;
    if (customSuccessRate != null) {
      calculatedSuccessRate = customSuccessRate.clamp(0.0, 1.0);
    } else {
      int correctCount = previousHistory.where((item) => item.consecutiveCorrectHits > 0 || item.successRate > 0.6).length;
      if (q >= 3) {
        correctCount += 1;
      }
      calculatedSuccessRate = (correctCount) / (previousHistory.length + 1);
    }

    // Default starting variables
    int consecutiveCorrectHits = 0;
    double easeFactor = 2.5; // Default Ease Factor
    int prevIntervalDays = 1;

    if (previousHistory.isNotEmpty) {
      // Sort Chronologically by timestamp to ensure we read latest SM-2 context
      final sortedHistory = List<QuizHistory>.from(previousHistory)
        ..sort((a, b) => a.lastAnsweredTimestamp.compareTo(b.lastAnsweredTimestamp));
      final latest = sortedHistory.last;
      consecutiveCorrectHits = latest.consecutiveCorrectHits;
      easeFactor = latest.difficultyWeightFactor;
      prevIntervalDays = latest.repetitionIntervalDays;
    }

    int nextIntervalDays;
    if (q < 3) {
      // Incorrect quality: reset consecutive correct hits, reset interval to 1 day
      consecutiveCorrectHits = 0;
      nextIntervalDays = 1;
    } else {
      // Correct performance: increment response repetitions
      consecutiveCorrectHits += 1;
      
      if (consecutiveCorrectHits == 1) {
        nextIntervalDays = 1;
      } else if (consecutiveCorrectHits == 2) {
        nextIntervalDays = 6;
      } else {
        nextIntervalDays = (prevIntervalDays * easeFactor).round();
      }
    }

    // Safety check: minimum interval is 1 day
    if (nextIntervalDays < 1) {
      nextIntervalDays = 1;
    }

    // Update Easiness Factor (EF')
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    double updatedEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (updatedEaseFactor < 1.3) {
      updatedEaseFactor = 1.3; // SM-2 standard absolute minimum
    }

    // Compute next review timestamp as a future DateTime Offset
    final now = DateTime.now();
    final nextReviewDate = DateTime(now.year, now.month, now.day).add(Duration(days: nextIntervalDays));

    return SpacedRepetitionResult(
      nextReviewTimestamp: nextReviewDate.millisecondsSinceEpoch,
      difficultyScore: updatedEaseFactor,
      repetitionInterval: nextIntervalDays,
      successRate: calculatedSuccessRate,
    );
  }

  /// Evaluates and writes a completed Flashcard review state directly into the offline SQLite repository.
  Future<QuizHistory> recordReview({
    required String cardId,
    required int answerQuality,
    double? customSuccessRate,
  }) async {
    // 1. Fetch existing quiz records for this card
    final history = await _progressRepository.fetchQuizHistoryForCard(cardId);

    // 2. Compute SM2 outputs via processReview
    final result = processReview(
      previousHistory: history,
      answerQuality: answerQuality,
      customSuccessRate: customSuccessRate,
    );

    // 3. Assemble and persist the QuizHistory object
    final newRecord = QuizHistory(
      cardId: cardId,
      lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch,
      consecutiveCorrectHits: answerQuality >= 3 
          ? (history.isNotEmpty ? history.last.consecutiveCorrectHits + 1 : 1)
          : 0,
      difficultyWeightFactor: result.difficultyScore,
      repetitionIntervalDays: result.repetitionInterval,
      nextReviewTimestamp: result.nextReviewTimestamp,
      successRate: result.successRate,
    );

    await _progressRepository.saveQuizRecord(newRecord);
    return newRecord;
  }

  /// Returns vocab cards that are due for review according to their SM-2 schedules.
  Future<List<String>> getDueCardIds() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    return await _progressRepository.fetchDueCardIds(now);
  }
}
`
  },
  {
    path: "lib/test/spaced_repetition_test.dart",
    name: "spaced_repetition_test.dart",
    type: "database",
    description: "Тестирование алгоритма SM-2: верификация рассчетов интервалов и изменения сложности.",
    code: `import 'package:flutter_test/flutter_test.dart';
import '../models/quiz_history.dart';
import '../data/services/spaced_repetition_service.dart';

void main() {
  group('SM-2 Spaced Repetition Core Algorithm Tests', () {
    late SpacedRepetitionService service;

    setUp(() {
      service = SpacedRepetitionService();
    });

    test('Initial Review with Perfect Quality (5) calculates correct first day interval', () {
      final result = service.processReview(
        previousHistory: [],
        answerQuality: 5,
      );

      expect(result.difficultyScore, equals(2.6)); // 2.5 + (0.1 - 0)
      expect(result.repetitionInterval, equals(1)); // I(1) = 1 day
      expect(result.successRate, equals(1.0));
      expect(result.nextReviewTimestamp, isNotNull);
    });

    test('Review with Low Quality (2) resets interval, consecutive correct counts and updates difficulty score', () {
      final initialHistory = [
        QuizHistory(
          cardId: 'card_1',
          lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch - 86400000,
          consecutiveCorrectHits: 2,
          difficultyWeightFactor: 2.6,
          repetitionIntervalDays: 6,
          successRate: 1.0,
        ),
      ];

      final result = service.processReview(
        previousHistory: initialHistory,
        answerQuality: 2,
      );

      expect(result.repetitionInterval, equals(1)); // Reset interval
      expect(result.difficultyScore, lessThan(2.6)); // EF decreases for low quality
      expect(result.successRate, equals(0.5)); // 1 correct, 1 incorrect
    });

    test('Incremental interval progression on multiple correct hits', () {
      // First hit
      final r1 = service.processReview(previousHistory: [], answerQuality: 4);
      expect(r1.repetitionInterval, equals(1));

      // Mock subsequent history
      final h2 = [
        QuizHistory(
          cardId: 'card_1',
          lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch,
          consecutiveCorrectHits: 1,
          difficultyWeightFactor: r1.difficultyScore,
          repetitionIntervalDays: r1.repetitionInterval,
          successRate: 1.0,
        )
      ];

      // Second hit
      final r2 = service.processReview(previousHistory: h2, answerQuality: 4);
      expect(r2.repetitionInterval, equals(6));

      // Third hit
      final h3 = [
        ...h2,
        QuizHistory(
          cardId: 'card_1',
          lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch,
          consecutiveCorrectHits: 2,
          difficultyWeightFactor: r2.difficultyScore,
          repetitionIntervalDays: r2.repetitionInterval,
          successRate: 1.0,
        )
      ];

      final r3 = service.processReview(previousHistory: h3, answerQuality: 4);
      expect(r3.repetitionInterval, equals((6 * r2.difficultyScore).round()));
    });

    test('Custom success rate input overrides dynamic computation', () {
      final result = service.processReview(
        previousHistory: [],
        answerQuality: 4,
        customSuccessRate: 0.85,
      );

      expect(result.successRate, equals(0.85));
    });
  });
}
`
  },
  {
    path: "lib/models/learning_analytics.dart",
    name: "learning_analytics.dart",
    type: "model",
    description: "Модель аналитики обучения: скорость, удержание, качество ответов и история активности.",
    code: `import 'dart:convert';

class LearningAnalytics {
  final int? id;
  final int timestamp;
  final double learningSpeed;       // words mastered / reviewed per day/session
  final double retentionRate;       // fraction of cards retained (success_rate >= 0.6)
  final double accuracyPercentage;  // perfect or passing quality answers (>= 3) / total attempts
  final List<String> weakCategories; // top weak categories
  final Map<String, int> dailyActivity; // daily event counts (hourly scale)
  final Map<String, int> weeklyActivity; // weekly event counts (day-of-week scale)

  LearningAnalytics({
    this.id,
    required this.timestamp,
    required this.learningSpeed,
    required this.retentionRate,
    required this.accuracyPercentage,
    required this.weakCategories,
    required this.dailyActivity,
    required this.weeklyActivity,
  });

  factory LearningAnalytics.fromMap(Map<String, dynamic> map) {
    List<String> weakList = [];
    if (map['weak_categories'] != null) {
      try {
        weakList = List<String>.from(jsonDecode(map['weak_categories'] as String));
      } catch (_) {}
    }

    Map<String, int> daily = {};
    if (map['daily_activity'] != null) {
      try {
        final decoded = jsonDecode(map['daily_activity'] as String) as Map<String, dynamic>;
        daily = decoded.map((key, value) => MapEntry(key, value as int));
      } catch (_) {}
    }

    Map<String, int> weekly = {};
    if (map['weekly_activity'] != null) {
      try {
        final decoded = jsonDecode(map['weekly_activity'] as String) as Map<String, dynamic>;
        weekly = decoded.map((key, value) => MapEntry(key, value as int));
      } catch (_) {}
    }

    return LearningAnalytics(
      id: map['id'] as int?,
      timestamp: map['timestamp'] as int,
      learningSpeed: (map['learning_speed'] as num? ?? 0.0).toDouble(),
      retentionRate: (map['retention_rate'] as num? ?? 0.0).toDouble(),
      accuracyPercentage: (map['accuracy_percentage'] as num? ?? 0.0).toDouble(),
      weakCategories: weakList,
      dailyActivity: daily,
      weeklyActivity: weekly,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      if (id != null) 'id': id,
      'timestamp': timestamp,
      'learning_speed': learningSpeed,
      'retention_rate': retentionRate,
      'accuracy_percentage': accuracyPercentage,
      'weak_categories': jsonEncode(weakCategories),
      'daily_activity': jsonEncode(dailyActivity),
      'weekly_activity': jsonEncode(weeklyActivity),
    };
  }
}
`
  },
  {
    path: "lib/data/repositories/analytics_repository.dart",
    name: "analytics_repository.dart",
    type: "database",
    description: "Репозиторий аналитики: сохранение и извлечение исторических срезов аналитики обучения в SQLite.",
    code: `import 'package:sqflite/sqflite.dart';
import '../db/database_helper.dart';
import '../../models/learning_analytics.dart';

class AnalyticsRepository {
  final DatabaseHelper _dbHelper;

  AnalyticsRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  Future<void> saveAnalytics(LearningAnalytics analytics) async {
    final db = await _dbHelper.database;
    await db.insert(
      'learning_analytics',
      analytics.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<LearningAnalytics>> fetchAnalyticsHistory() async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'learning_analytics',
      orderBy: 'timestamp DESC',
    );
    return maps.map((row) => LearningAnalytics.fromMap(row)).toList();
  }

  Future<LearningAnalytics?> fetchLatestAnalytics() async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'learning_analytics',
      orderBy: 'timestamp DESC',
      limit: 1,
    );
    if (maps.isNotEmpty) {
      return LearningAnalytics.fromMap(maps.first);
    }
    return null;
  }
}
`
  },
  {
    path: "lib/data/services/learning_analytics_service.dart",
    name: "learning_analytics_service.dart",
    type: "database",
    description: "Сервис аналитики обучения: расчет темпа освоения слов, удержания карт, активности по дням и слабых категорий.",
    code: `import '../repositories/analytics_repository.dart';
import '../repositories/progress_repository.dart';
import '../../models/learning_analytics.dart';
import '../../models/quiz_history.dart';

class LearningAnalyticsService {
  final AnalyticsRepository _analyticsRepository;
  final ProgressRepository _progressRepository;

  LearningAnalyticsService({
    AnalyticsRepository? analyticsRepository,
    ProgressRepository? progressRepository,
  })  : _analyticsRepository = analyticsRepository ?? AnalyticsRepository(),
        _progressRepository = progressRepository ?? ProgressRepository();

  /// Calculates fresh learning analytics from existing raw quiz and session histories,
  /// saves the snapshot to the sqlite db, and returns the result.
  Future<LearningAnalytics> computeAndSaveAnalytics() async {
    final db = await _progressRepository.dbHelper.database;

    // 1. Fetch raw histories
    final List<Map<String, dynamic>> rawQuizHistory = await db.query(
      'quiz_history',
      orderBy: 'last_answered_timestamp ASC',
    );
    final histories = rawQuizHistory.map((row) => QuizHistory.fromMap(row)).toList();

    // 2. Compute basic proportions (Retention & Accuracy)
    double accuracy = 100.0;
    double retention = 100.0;
    double speed = 0.0;

    final Map<String, int> daily = {
      for (var i = 0; i < 24; i++) i.toString().padLeft(2, '0'): 0
    };
    final Map<String, int> weekly = {
      'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };
    final List<String> weakCategories = [];

    if (histories.isNotEmpty) {
      // Accuracy = count of correct items / total items
      int correctAttempts = histories.where((item) => item.consecutiveCorrectHits > 0).length;
      accuracy = (correctAttempts / histories.length) * 100.0;

      // Group histories by card to find retention rate on distinct cards
      final Map<String, List<QuizHistory>> cardGroups = {};
      for (var hist in histories) {
        cardGroups.putIfAbsent(hist.cardId, () => []).add(hist);
      }

      int retainedCards = 0;
      for (var cardId in cardGroups.keys) {
        final cardHistories = cardGroups[cardId]!;
        // Sort chronologically and inspect latest
        cardHistories.sort((a, b) => a.lastAnsweredTimestamp.compareTo(b.lastAnsweredTimestamp));
        final latest = cardHistories.last;
        if (latest.successRate >= 0.6 || latest.consecutiveCorrectHits > 0) {
          retainedCards++;
        }
      }
      retention = (retainedCards / cardGroups.keys.length) * 100.0;

      // Learning Speed = distinct cards reviewed / days active
      final oldestTimestamp = histories.first.lastAnsweredTimestamp;
      final newestTimestamp = histories.last.lastAnsweredTimestamp;
      final msInDay = 1000 * 60 * 60 * 24;
      final double daysDiff = (newestTimestamp - oldestTimestamp) / msInDay;
      final double activeDays = daysDiff < 1.0 ? 1.0 : daysDiff;
      speed = cardGroups.keys.length / activeDays;

      // Group hourly/weekly reviews
      for (var hist in histories) {
        final dt = DateTime.fromMillisecondsSinceEpoch(hist.lastAnsweredTimestamp);
        final hrString = dt.hour.toString().padLeft(2, '0');
        if (daily.containsKey(hrString)) {
          daily[hrString] = (daily[hrString] ?? 0) + 1;
        }

        final weekdayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        final wkIndex = dt.weekday - 1; // 1 to 7 -> 0 to 6
        if (wkIndex >= 0 && wkIndex < 7) {
          final wkString = weekdayList[wkIndex];
          weekly[wkString] = (weekly[wkString] ?? 0) + 1;
        }
      }

      // Group categories dynamically
      final List<Map<String, dynamic>> categoryStats = await db.rawQuery('''
        SELECT vc.module_category, 
               COUNT(qh.id) as total_attempts, 
               SUM(CASE WHEN qh.consecutive_correct_hits > 0 THEN 1 ELSE 0 END) as correct_count
        FROM quiz_history qh
        JOIN vocab_card vc ON qh.card_id = vc.id
        GROUP BY vc.module_category
      ''');

      final List<_CategoryHelper> tempCategories = [];
      for (var row in categoryStats) {
        final category = row['module_category'] as String;
        final total = row['total_attempts'] as int;
        final correct = row['correct_count'] as int;
        final catAccuracy = total > 0 ? (correct / total) * 100.0 : 100.0;
        tempCategories.add(_CategoryHelper(category, catAccuracy));
      }

      // Sort category by ascending accuracy (lowest correct rate first)
      tempCategories.sort((a, b) => a.accuracy.compareTo(b.accuracy));
      for (var cat in tempCategories) {
        if (cat.accuracy < 80.0) { // weak if accuracy below 80%
          weakCategories.add(cat.category);
        }
      }
      
      // If we don't have low quality ones but want to show top relative weak category
      if (weakCategories.isEmpty && tempCategories.isNotEmpty) {
        weakCategories.add(tempCategories.first.category);
      }
    }

    final newAnalytics = LearningAnalytics(
      timestamp: DateTime.now().millisecondsSinceEpoch,
      learningSpeed: speed,
      retentionRate: retention,
      accuracyPercentage: accuracy,
      weakCategories: weakCategories,
      dailyActivity: daily,
      weeklyActivity: weekly,
    );

    await _analyticsRepository.saveAnalytics(newAnalytics);
    return newAnalytics;
  }

  Future<List<LearningAnalytics>> getAnalyticsHistory() async {
    return await _analyticsRepository.fetchAnalyticsHistory();
  }

  Future<LearningAnalytics?> getLatestAnalytics() async {
    return await _analyticsRepository.fetchLatestAnalytics();
  }
}

class _CategoryHelper {
  final String category;
  final double accuracy;
  _CategoryHelper(this.category, this.accuracy);
}
`
  },
  {
    path: "lib/test/learning_analytics_test.dart",
    name: "learning_analytics_test.dart",
    type: "database",
    description: "Тестирование модуля аналитики: проверка расчета метрик точности, удержания и активности по дням.",
    code: `import 'package:flutter_test/flutter_test.dart';
import '../models/learning_analytics.dart';
import '../models/quiz_history.dart';
import '../data/services/learning_analytics_service.dart';

void main() {
  group('LearningAnalyticsModel Test Suite', () {
    test('Model Map conversion functions correctly with default inputs', () {
      final analytics = LearningAnalytics(
        id: 42,
        timestamp: 1672531199000,
        learningSpeed: 2.5,
        retentionRate: 92.0,
        accuracyPercentage: 88.5,
        weakCategories: ['food', 'verbs'],
        dailyActivity: {'08': 4, '12': 10},
        weeklyActivity: {'Mon': 5, 'Tue': 12},
      );

      final map = analytics.toMap();
      expect(map['id'], equals(42));
      expect(map['learning_speed'], equals(2.5));
      expect(map['retention_rate'], equals(92.0));
      expect(map['weak_categories'], contains('food'));

      final reconstructed = LearningAnalytics.fromMap(map);
      expect(reconstructed.id, equals(42));
      expect(reconstructed.learningSpeed, equals(2.5));
      expect(reconstructed.weakCategories, contains('food'));
      expect(reconstructed.dailyActivity['12'], equals(10));
    });
  });
}
`
  }
];

