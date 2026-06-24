/// Model to store game achievement unlock states.
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
}
