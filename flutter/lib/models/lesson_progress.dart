/// Model to store individual module/island completion metadata.
class LessonProgress {
  final String moduleCategory; // e.g., 'animals', 'food'
  final int maximumStarsEarned; // 0 to 3 Stars
  final bool isCompletedAtLeastOnce;
  final int timesPracticed;
  final bool isUnlocked;

  LessonProgress({
    required this.moduleCategory,
    this.maximumStarsEarned = 0,
    this.isCompletedAtLeastOnce = false,
    this.timesPracticed = 0,
    this.isUnlocked = false,
  });

  factory LessonProgress.fromMap(Map<String, dynamic> json) {
    return LessonProgress(
      moduleCategory: json['module_category'] as String,
      maximumStarsEarned: json['maximum_stars_earned'] as int? ?? 0,
      isCompletedAtLeastOnce: (json['is_completed_at_least_once'] as int? ?? 0) == 1,
      timesPracticed: json['times_practiced'] as int? ?? 0,
      isUnlocked: (json['is_unlocked'] as int? ?? 0) == 1,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'module_category': moduleCategory,
      'maximum_stars_earned': maximumStarsEarned,
      'is_completed_at_least_once': isCompletedAtLeastOnce ? 1 : 0,
      'times_practiced': timesPracticed,
      'is_unlocked': isUnlocked ? 1 : 0,
    };
  }
}
