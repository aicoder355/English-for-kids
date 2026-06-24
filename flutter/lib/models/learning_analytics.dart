import 'dart:convert';

class LearningAnalytics {
  final int? id;
  final String? date;                // Add date column
  final double learningSpeed;       // words mastered / reviewed per day/session
  final double retentionRate;       // fraction of cards retained (success_rate >= 0.6)
  final double accuracyPercentage;  // perfect or passing quality answers (>= 3) / total attempts
  final double accuracy;            // alias/column for accuracy
  final int activityMinutes;        // activity minutes column
  final String? weakCategory;       // weak category column
  final int timestamp;
  final List<String> weakCategories; // top weak categories
  final Map<String, int> dailyActivity; // daily event counts (hourly scale)
  final Map<String, int> weeklyActivity; // weekly event counts (day-of-week scale)

  LearningAnalytics({
    this.id,
    this.date,
    required this.timestamp,
    required this.learningSpeed,
    required this.retentionRate,
    required this.accuracyPercentage,
    double? accuracy,
    int? activityMinutes,
    this.weakCategory,
    required this.weakCategories,
    required this.dailyActivity,
    required this.weeklyActivity,
  })  : this.accuracy = accuracy ?? accuracyPercentage,
        this.activityMinutes = activityMinutes ?? dailyActivity.values.fold(0, (sum, val) => sum + val);

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

    final double speed = (map['learning_speed'] as num? ?? 0.0).toDouble();
    final double retention = (map['retention_rate'] as num? ?? 0.0).toDouble();
    final double accPct = (map['accuracy_percentage'] as num? ?? (map['accuracy'] as num? ?? 0.0)).toDouble();
    final double acc = (map['accuracy'] as num? ?? accPct).toDouble();
    final int actMins = map['activity_minutes'] as int? ?? daily.values.fold(0, (sum, val) => sum + val);
    final String? weakCat = map['weak_category'] as String? ?? (weakList.isNotEmpty ? weakList.first : null);

    return LearningAnalytics(
      id: map['id'] as int?,
      date: map['date'] as String? ?? (map['timestamp'] != null ? DateTime.fromMillisecondsSinceEpoch(map['timestamp'] as int).toIso8601String().split('T')[0] : null),
      timestamp: map['timestamp'] as int? ?? DateTime.now().millisecondsSinceEpoch,
      learningSpeed: speed,
      retentionRate: retention,
      accuracyPercentage: accPct,
      accuracy: acc,
      activityMinutes: actMins,
      weakCategory: weakCat,
      weakCategories: weakList,
      dailyActivity: daily,
      weeklyActivity: weekly,
    );
  }

  Map<String, dynamic> toMap() {
    final computedDate = date ?? DateTime.fromMillisecondsSinceEpoch(timestamp).toIso8601String().split('T')[0];
    final computedWeakCategory = weakCategory ?? (weakCategories.isNotEmpty ? weakCategories.first : "");

    return {
      if (id != null) 'id': id,
      'date': computedDate,
      'learning_speed': learningSpeed,
      'retention_rate': retentionRate,
      'accuracy': accuracy,
      'activity_minutes': activityMinutes,
      'weak_category': computedWeakCategory,
      'timestamp': timestamp,
      'accuracy_percentage': accuracyPercentage,
      'weak_categories': jsonEncode(weakCategories),
      'daily_activity': jsonEncode(dailyActivity),
      'weekly_activity': jsonEncode(weeklyActivity),
    };
  }
}
