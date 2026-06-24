import '../repositories/analytics_repository.dart';
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
