import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../views/onboarding_screen.dart';
import '../views/islands_map_screen.dart';
import '../views/lesson_workspace_screen.dart';
import '../views/quiz_workspace_screen.dart';
import '../views/parent_gate_screen.dart';
import '../views/parent_dashboard.dart';
import '../views/profile_screen.dart';
import '../views/achievements_screen.dart';

/// GoRouter architecture configuring clean declarative navigation for both interfaces:
/// Child Hub (Islands Map, Lesson cards, Quiz modes) and PIN protected Parental control suite.
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    errorBuilder: (context, state) => Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Center(
        child: Text(
          'Ошибка перехода: ${state.error}',
          style: const TextStyle(color: Colors.white70),
        ),
      ),
    ),
    routes: [
      // 1. Splash screen or Onboarding Gate
      GoRoute(
        path: '/',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // 2. Main Child Explorer Hub Screen (Island view)
      GoRoute(
        path: '/islands',
        builder: (context, state) => const IslandsMapScreen(),
        routes: [
          // Subroute: Individual Lesson Flashcard deck
          GoRoute(
            path: 'lesson/:category',
            builder: (context, state) {
              final category = state.pathParameters['category'] ?? 'food';
              return LessonWorkspaceScreen(category: category);
            },
          ),
          
          // Subroute: Module Quiz validation console
          GoRoute(
            path: 'quiz/:category',
            builder: (context, state) {
              final category = state.pathParameters['category'] ?? 'food';
              return QuizWorkspaceScreen(category: category);
            },
          ),
        ],
      ),

      // 3. Parent Gate (Secure Math Pin Challenge Screen)
      GoRoute(
        path: '/parent-gate',
        builder: (context, state) => const ParentGateScreen(),
      ),

      // 4. Parent Control Panel (Only routes here if math challenge passes)
      GoRoute(
        path: '/parent-dashboard',
        builder: (context, state) => const ParentDashboardScreen(),
      ),

      // 5. Interactive Learner Profile Screen
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),

      // 6. Achievements Panel and Rewards Screen
      GoRoute(
        path: '/achievements',
        builder: (context, state) => const AchievementsScreen(),
      ),
    ],
  );
}
