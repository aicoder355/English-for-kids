import 'package:flutter/material.dart';
import '../../models/user_profile.dart';
import '../../models/lesson_progress.dart';
import '../../models/achievement.dart';
import 'learning_service.dart';

/// App State Integration provider using ChangeNotifier to present local SQLite
/// models dynamically to the user interface. Inherits Senior best practices.
class LearningAppState extends ChangeNotifier {
  final LearningService _service;

  UserProfile? _profile;
  List<LessonProgress> _lessons = [];
  List<SystemAchievement> _achievements = [];
  bool _isLoading = false;

  LearningAppState({LearningService? service})
      : _service = service ?? LearningService() {
    initializeLocalState();
  }

  UserProfile? get profile => _profile;
  List<LessonProgress> get lessons => _lessons;
  List<SystemAchievement> get achievements => _achievements;
  bool get isLoading => _isLoading;

  /// Loads profiles, checks daily active streaks, and caches state datasets
  Future<void> initializeLocalState() async {
    _isLoading = true;
    notifyListeners();

    _profile = await _service.userRepository.fetchUserProfile();
    
    // Check and trigger daily active streak updater on start
    await _service.checkDailyStreak();
    
    // Re-fetch profile to keep UI in synchronous sync
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();

    _isLoading = false;
    notifyListeners();
  }

  /// Sets current active lesson being explored
  Future<void> setCurrentLesson(String moduleCategory) async {
    if (_profile == null) return;
    final success = await _service.userRepository.updateCurrentLesson(moduleCategory);
    if (success) {
      _profile = _profile!.copyWith(currentLesson: moduleCategory);
      notifyListeners();
    }
  }

  /// Syncs completed lesson activity down to SQLite and alerts UI of updates
  Future<void> handleLessonCompleted(String module, int stars) async {
    final result = await _service.completeLesson(module, stars);
    
    // Re-fetch datasets
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();
    
    notifyListeners();
  }

  /// Completes the onboarding flow, saving the user profile details and PIN code to SQLite.
  Future<void> completeOnboarding({
    required String childName,
    required int ageBracket,
    required String heroBuddy,
    required String parentalPin,
  }) async {
    _isLoading = true;
    notifyListeners();

    final List<Map<String, dynamic>> maps = await (await _service.userRepository.fetchUserProfile() != null
        ? Future.value([])
        : Future.value([])); // dummy guard

    final exProfile = await _service.userRepository.fetchUserProfile();
    final freshProfile = UserProfile(
      id: exProfile?.id ?? 1,
      childName: childName,
      ageBracket: ageBracket,
      heroBuddyId: heroBuddy,
      lastActiveTimestamp: DateTime.now().millisecondsSinceEpoch,
      parentalPin: parentalPin,
      isOnboardingCompleted: 1,
      currentLevel: exProfile?.currentLevel ?? 1,
      accumulatedXp: exProfile?.accumulatedXp ?? 0,
      starBalance: exProfile?.starBalance ?? 0,
      dailyStreakCount: exProfile?.dailyStreakCount ?? 1,
      currentLesson: exProfile?.currentLesson ?? 'animals',
    );

    await _service.userRepository.saveUserProfile(freshProfile);

    // Re-initialize state
    _profile = await _service.userRepository.fetchUserProfile();
    _lessons = await _service.progressRepository.fetchAllLessonProgress();
    _achievements = await _service.achievementRepository.fetchAllAchievements();

    _isLoading = false;
    notifyListeners();
  }
}
