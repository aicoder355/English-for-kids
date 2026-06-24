import 'package:flutter_test/flutter_test.dart';
import '../lib/models/learning_analytics.dart';

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
      
      // Verify SQLite specific columns exist in output map
      expect(map['date'], equals('2022-12-31'));
      expect(map['accuracy'], equals(88.5));
      expect(map['activity_minutes'], equals(14)); // 4 + 10
      expect(map['weak_category'], equals('food'));

      final reconstructed = LearningAnalytics.fromMap(map);
      expect(reconstructed.id, equals(42));
      expect(reconstructed.learningSpeed, equals(2.5));
      expect(reconstructed.weakCategories, contains('food'));
      expect(reconstructed.dailyActivity['12'], equals(10));
      
      expect(reconstructed.date, equals('2022-12-31'));
      expect(reconstructed.accuracy, equals(88.5));
      expect(reconstructed.activityMinutes, equals(14));
      expect(reconstructed.weakCategory, equals('food'));
    });
  });
}
