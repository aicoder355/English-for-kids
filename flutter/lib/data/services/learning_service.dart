import '../../models/user_profile.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../repositories/user_repository.dart';
import '../repositories/progress_repository.dart';
import '../repositories/achievement_repository.dart';

/// Core Service Class for Orchestrating Business Logic, Gamified Systems,
/// Streak Management, and Offline Database Syncing.
class LearningService {
  final UserRepository userRepository;
  final ProgressRepository progressRepository;
  final AchievementRepository achievementRepository;

  LearningService({
    UserRepository? userRepo,
    ProgressRepository? progressRepo,
    AchievementRepository? achievementRepo,
  })  : userRepository = userRepo ?? UserRepository(),
        progressRepository = progressRepo ?? ProgressRepository(),
        achievementRepository = achievementRepo ?? AchievementRepository();

  /// Checks and updates daily active streak on application launch.
  /// If the user logs in the following day, streak is incremented.
  /// If the lapse is > 48 hours, streak resets to 1.
  Future<Map<String, dynamic>> checkDailyStreak() async {
    final profile = await userRepository.fetchUserProfile();
    if (profile == null) return {'streak_updated': false, 'streak_count': 0};

    final now = DateTime.now();
    final todayMidnight = DateTime(now.year, now.month, now.day).millisecondsSinceEpoch;
    final lastActiveDate = DateTime.fromMillisecondsSinceEpoch(profile.lastActiveTimestamp);
    final lastActiveMidnight = DateTime(lastActiveDate.year, lastActiveDate.month, lastActiveDate.day).millisecondsSinceEpoch;

    const msInDay = 24 * 60 * 60 * 1000;
    final int diffMs = todayMidnight - lastActiveMidnight;

    bool streakUpdated = false;
    int actualStreak = profile.dailyStreakCount;

    if (diffMs == msInDay) {
      // It is exactly the next calendar day - increment the streak
      actualStreak += 1;
      streakUpdated = true;
    } else if (diffMs > msInDay) {
      // User forgot - reset streak to 1
      actualStreak = 1;
      streakUpdated = true;
    }

    final updatedProfile = profile.copyWith(
      dailyStreakCount: actualStreak,
      lastActiveTimestamp: now.millisecondsSinceEpoch,
    );
    await userRepository.saveUserProfile(updatedProfile);

    // Dynamic Achievement check for 7-day streaks
    if (actualStreak >= 7) {
      await achievementRepository.unlockAchievement('streak_7');
    }

    return {
      'streak_updated': streakUpdated,
      'streak_count': actualStreak,
    };
  }

  /// Records complete lesson success, updating stars, awarding XP and calculating Level up values
  Future<Map<String, dynamic>> completeLesson(String moduleCategory, int starsEarned) async {
    // 1. Update lesson stars and completion count in SQLite
    await progressRepository.updateStarsAndCompletion(moduleCategory, starsEarned);

    // 2. Award XP/Stars inside user profile
    int xpReward = starsEarned * 25;
    int starReward = starsEarned;

    final profile = await userRepository.fetchUserProfile();
    if (profile == null) return {'leveled_up': false};

    int currentXp = profile.accumulatedXp + xpReward;
    int currentLvl = profile.currentLevel;
    bool leveledUp = false;

    while (true) {
      int neededForNext = 100 * currentLvl * currentLvl - 50 * currentLvl;
      if (currentXp >= neededForNext) {
        currentXp -= neededForNext;
        currentLvl++;
        leveledUp = true;
      } else {
        break;
      }
    }

    final updatedProfile = profile.copyWith(
      accumulatedXp: currentXp,
      currentLevel: currentLvl,
      starBalance: profile.starBalance + starReward,
    );
    await userRepository.saveUserProfile(updatedProfile);

    // 3. Automated unlock check for Achievements
    if (starsEarned == 3) {
      await achievementRepository.unlockAchievement('perfect_score');
    }
    await achievementRepository.unlockAchievement('first_word');

    return {
      'leveled_up': leveledUp,
      'new_level': currentLvl,
      'xp_awarded': xpReward,
      'stars_awarded': starReward,
    };
  }
}
