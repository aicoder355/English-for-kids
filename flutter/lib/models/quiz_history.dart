/// Model to maintain quiz score records on cards under Space Repetition (SM-2 adaptation).
class QuizHistory {
  final int? id;
  final String cardId;
  final int lastAnsweredTimestamp;
  final int consecutiveCorrectHits;
  final double difficultyWeightFactor; // Analogous to SM-2 Ease Factor (defaults to 2.5)
  final int repetitionIntervalDays;
  final int nextReviewTimestamp;
  final double successRate;

  QuizHistory({
    this.id,
    required this.cardId,
    required this.lastAnsweredTimestamp,
    this.consecutiveCorrectHits = 0,
    this.difficultyWeightFactor = 2.5,
    this.repetitionIntervalDays = 1,
    this.nextReviewTimestamp = 0,
    this.successRate = 0.0,
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
      successRate: (json['success_rate'] as num? ?? 0.0).toDouble(),
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
}
