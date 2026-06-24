import 'package:sqflite/sqflite.dart';
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
