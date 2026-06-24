import '../../models/quiz_history.dart';
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
