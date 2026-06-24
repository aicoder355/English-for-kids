import '../../models/user_profile.dart';
import '../db/database_helper.dart';

/// Repository for handling user profile read/write states.
/// Encapsulates direct SQLite actions into safe asynchronous future operations.
class UserRepository {
  final DatabaseHelper _dbHelper;

  UserRepository({DatabaseHelper? dbHelper}) : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Fetches child profile.
  Future<UserProfile?> fetchUserProfile() async {
    return await _dbHelper.getUserProfile();
  }

  /// Updates or saves child profile data.
  Future<bool> saveUserProfile(UserProfile profile) async {
    final updated = await _dbHelper.updateUserProfile(profile);
    return updated > 0;
  }

  /// Sets current active lesson being explored.
  Future<bool> updateCurrentLesson(String lessonCategory) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(currentLesson: lessonCategory);
    return await saveUserProfile(updatedProfile);
  }

  /// Sets daily active streak.
  Future<bool> updateDailyStreak(int streakCount) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(dailyStreakCount: streakCount);
    return await saveUserProfile(updatedProfile);
  }

  /// Updates star balance.
  Future<bool> updateStarBalance(int change) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(
      starBalance: profile.starBalance + change,
    );
    return await saveUserProfile(updatedProfile);
  }

  /// Sets onboarding completion status.
  Future<bool> updateOnboardingStatus(int isCompleted) async {
    final profile = await fetchUserProfile();
    if (profile == null) return false;
    final updatedProfile = profile.copyWith(isOnboardingCompleted: isCompleted);
    return await saveUserProfile(updatedProfile);
  }
}
