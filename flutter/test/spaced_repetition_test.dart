import 'package:flutter_test/flutter_test.dart';
import '../lib/models/quiz_history.dart';
import '../lib/data/services/spaced_repetition_service.dart';

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
      final result = service.processReview(
        previousHistory: [
          QuizHistory(
            cardId: 'card_1',
            lastAnsweredTimestamp: DateTime.now().millisecondsSinceEpoch - 100000,
            consecutiveCorrectHits: 3,
            difficultyWeightFactor: 2.5,
            repetitionIntervalDays: 6,
            nextReviewTimestamp: DateTime.now().millisecondsSinceEpoch,
            successRate: 0.8,
          ),
        ],
        answerQuality: 2,
        customSuccessRate: 0.5,
      );

      expect(result.difficultyScore, lessThan(2.5)); // Decreased from 2.5 on poor quality
      expect(result.repetitionInterval, equals(1)); // Reset to 1 day on quality < 3
      expect(result.successRate, equals(0.5));
    });
  });
}
