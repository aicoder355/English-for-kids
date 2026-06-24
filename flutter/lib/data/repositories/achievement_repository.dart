import '../../models/achievement.dart';
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
