import 'package:sqflite/sqflite.dart';
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
