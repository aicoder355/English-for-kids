import 'package:flutter/material.dart';

/// Interactive high-fidelity Profile Screen for the young English learner.
/// Built with Material Design 3, glowing card containers, custom progress gauges,
/// a visual 7-day streak board, and achievements integration.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // Mock Data mimicking local database or profile state
  final String username = "Алексей";
  final int currentLevel = 12;
  final int currentXp = 4500;
  final int nextLevelXp = 6000;
  final int totalStars = 148;
  final int wordsLearned = 184;
  final int lessonsCompleted = 32;
  final int dailyStreak = 7;
  
  // Weekly streak status (Mon-Sun)
  final List<bool> weeklyStreakDays = [true, true, true, true, true, true, false];
  final List<String> weekDayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Achievements mock dataset
  final List<ProfileAchievement> recentAchievements = [
    ProfileAchievement(
      title: "Первый шаг",
      emoji: "🌱",
      isUnlocked: true,
      color: const Color(0xFF4ADE80),
    ),
    ProfileAchievement(
      title: "Книголюб",
      emoji: "📚",
      isUnlocked: true,
      color: const Color(0xFF38BDF8),
    ),
    ProfileAchievement(
      title: "Мега Мозг",
      emoji: "🔱",
      isUnlocked: true,
      color: const Color(0xFFFB923C),
    ),
    ProfileAchievement(
      title: "7 Дней Огня",
      emoji: "🔥",
      isUnlocked: true,
      color: const Color(0xFFF43F5E),
    ),
    ProfileAchievement(
      title: "Полиглот 500",
      emoji: "🥇",
      isUnlocked: false,
      color: const Color(0xFFA855F7),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final double xpPercentage = currentXp / nextLevelXp;
    
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Premium Slate background
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Elegant Sliver App Bar with parallax profile effects
          SliverAppBar(
            expandedHeight: 120.0,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF1E293B),
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.maybePop(context),
            ),
            title: const Text(
              "Мой Профиль",
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: 0.5,
              ),
            ),
            centerTitle: true,
            actions: [
              IconButton(
                icon: const Icon(Icons.settings, color: Colors.blueGrey),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Редактирование профиля доступно в настройках для родителей"),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
              ),
            ],
          ),
          
          // Body List content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Main Avatar, Username and Level badge card
                  _buildHeaderAvatarCard(xpPercentage),
                  const SizedBox(height: 20),
                  
                  // Primary statistics layout (Bento Grid style)
                  _buildBentoStatsGrid(),
                  const SizedBox(height: 24),
                  
                  // Interactive 7-Day Streak Panel
                  _buildStreakTrackCircleGrid(),
                  const SizedBox(height: 24),
                  
                  // Horizontal Achievements section with dynamic badge status
                  _buildAchievementsCarousel(),
                  const SizedBox(height: 24),
                  
                  // Secondary actions / stats audit logs
                  _buildSectionHeader("АКТИВНОСТЬ И ОБУЧЕНИЕ"),
                  const SizedBox(height: 10),
                  _buildModernStatRow(
                    label: "Пройденные Острова",
                    value: "4 / 6 островов",
                    icon: Icons.explore,
                    iconColor: const Color(0xFF38BDF8),
                  ),
                  const SizedBox(height: 8),
                  _buildModernStatRow(
                    label: "Средняя точность ответов",
                    value: "94%",
                    icon: Icons.insights,
                    iconColor: const Color(0xFF4ADE80),
                  ),
                  const SizedBox(height: 8),
                  _buildModernStatRow(
                    label: "Кубки в турнирах",
                    value: "14 кубков",
                    icon: Icons.emoji_events,
                    iconColor: const Color(0xFFFFB300),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Extracted Header Avatar component with Level badge overlay and glowing animations
  Widget _buildHeaderAvatarCard(double xpPercentage) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF38BDF8).withValues(alpha: 0.15), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF38BDF8).withValues(alpha: 0.04),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          Stack(
            alignment: Alignment.bottomCenter,
            children: [
              // Avatar glow wrapper
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFF38BDF8), Color(0xFF818CF8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF38BDF8).withValues(alpha: 0.3),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF0F172A),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: ClipOval(
                      child: Container(
                        color: const Color(0xFF1E293B),
                        child: const Center(
                          child: Text(
                            "🦊", // Cute animal avatar for children
                            style: TextStyle(fontSize: 48),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              
              // Level Badge badge
              Positioned(
                bottom: -2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFD97706)]),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFEF3C7), width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFD97706).withValues(alpha: 0.4),
                        blurRadius: 6,
                        spreadRadius: 1,
                      )
                    ],
                  ),
                  child: Text(
                    "Уровень $currentLevel",
                    style: const TextStyle(
                      color: Color(0xFF78350F),
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Username displaying beautifully
          Text(
            username,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          
          const Text(
            "Статус: Супер-Ученик Английского 🚀",
            style: TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          
          // XP interactive linear tracker
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Очки опыта (XP)",
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                "$currentXp / $nextLevelXp XP",
                style: const TextStyle(
                  color: Color(0xFF38BDF8),
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Container(
              height: 12,
              color: const Color(0xFF0F172A),
              child: Stack(
                children: [
                  FractionallySizedBox(
                    widthFactor: xpPercentage.clamp(0.0, 1.0),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF38BDF8), Color(0xFF4F46E5)],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF38BDF8).withValues(alpha: 0.5),
                            blurRadius: 4,
                            spreadRadius: 1,
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            "Осталось ${nextLevelXp - currentXp} XP до уровня ${currentLevel + 1}",
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 10, fontStyle: FontStyle.italic),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  /// Modern Bento-Style statistical cards grid
  Widget _buildBentoStatsGrid() {
    return LayoutBuilder(builder: (context, constraints) {
      final double cardWidth = (constraints.maxWidth - 12) / 2;
      return Column(
        children: [
          Row(
            children: [
              _buildFittedStatCard(
                title: "Изучено Слов",
                subtitle: "Active Words",
                value: "$wordsLearned",
                emoji: "📚",
                cardColor: const Color(0xFF0EA5E9).withValues(alpha: 0.12),
                borderColor: const Color(0xFF0EA5E9).withValues(alpha: 0.35),
                valueColor: const Color(0xFF38BDF8),
                width: cardWidth,
              ),
              const SizedBox(width: 12),
              _buildFittedStatCard(
                title: "Звезд Собрано",
                subtitle: "Gold Stars",
                value: "$totalStars",
                emoji: "⭐",
                cardColor: const Color(0xFFEAB308).withValues(alpha: 0.12),
                borderColor: const Color(0xFFEAB308).withValues(alpha: 0.35),
                valueColor: const Color(0xFFFACC15),
                width: cardWidth,
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildFittedStatCard(
                title: "Пройденой Уроков",
                subtitle: "Lessons",
                value: "$lessonsCompleted",
                emoji: "🎯",
                cardColor: const Color(0xFF10B981).withValues(alpha: 0.12),
                borderColor: const Color(0xFF10B981).withValues(alpha: 0.35),
                valueColor: const Color(0xFF4ADE80),
                width: cardWidth,
              ),
              const SizedBox(width: 12),
              _buildFittedStatCard(
                title: "Супер Серия",
                subtitle: "Streak Days",
                value: "$dailyStreak дн.",
                emoji: "⚡",
                cardColor: const Color(0xFFF43F5E).withValues(alpha: 0.12),
                borderColor: const Color(0xFFF43F5E).withValues(alpha: 0.35),
                valueColor: const Color(0xFFFB7185),
                width: cardWidth,
              ),
            ],
          ),
        ],
      );
    });
  }

  /// Grid elements builder
  Widget _buildFittedStatCard({
    required String title,
    required String subtitle,
    required String value,
    required String emoji,
    required Color cardColor,
    required Color borderColor,
    required Color valueColor,
    required double width,
  }) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor, width: 1.2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
      child: Stack(
        children: [
          Positioned(
            right: 0,
            top: 0,
            child: Text(
              emoji,
              style: const TextStyle(fontSize: 18),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFFCBD5E1),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                value,
                style: TextStyle(
                  color: valueColor,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Weekly calendar horizontal checkmarks tracker widget
  Widget _buildStreakTrackCircleGrid() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0).withValues(alpha: 0.06)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text(
                    "🔥 Ударный календарь",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF43F5E).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      "$dailyStreak Дней",
                      style: const TextStyle(
                        fontFamily: "monospace",
                        color: Color(0xFFFB7185),
                        fontWeight: FontWeight.bold,
                        fontSize: 8,
                      ),
                    ),
                  )
                ],
              ),
              const Text(
                "Твоя лучшая неделя!",
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w600,
                  fontSize: 10,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Row of week checkmarks
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              final bool isActive = weeklyStreakDays[index];
              final String label = weekDayLabels[index];
              
              return Expanded(
                child: Column(
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 9,
                        color: isActive ? const Color(0xFFFB7185) : const Color(0xFF475569),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isActive ? const Color(0xFFFFE4E6) : const Color(0xFF0F172A),
                        border: Border.all(
                          color: isActive ? const Color(0xFFF43F5E) : const Color(0xFF334155),
                          width: isActive ? 1.5 : 1.0,
                        ),
                        boxShadow: isActive
                            ? [
                                BoxShadow(
                                  color: const Color(0xFFF43F5E).withValues(alpha: 0.3),
                                  blurRadius: 6,
                                  spreadRadius: 1,
                                )
                              ]
                            : null,
                      ),
                      child: Icon(
                        isActive ? Icons.local_fire_department : Icons.radio_button_unchecked,
                        color: isActive ? const Color(0xFFE11D48) : const Color(0xFF475569),
                        size: isActive ? 18 : 12,
                      ),
                    ),
                  ],
                ),
              );
            }),
          )
        ],
      ),
    );
  }

  /// Achievements Horizontal slider element
  Widget _buildAchievementsCarousel() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildSectionHeader("НАГРАДЫ И БЕЙДЖИ"),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Смотрите все награды в основном оглавлении!")),
                );
              },
              child: const Text(
                "Все награды →",
                style: TextStyle(
                  color: Color(0xFF38BDF8),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        
        SizedBox(
          height: 104,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: recentAchievements.length,
            separatorBuilder: (context, index) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final ach = recentAchievements[index];
              return Container(
                width: 90,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: ach.isUnlocked 
                        ? ach.color.withValues(alpha: 0.3) 
                        : const Color(0xFF334155),
                    width: ach.isUnlocked ? 1.5 : 1.0,
                  ),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: ach.isUnlocked 
                            ? ach.color.withValues(alpha: 0.12) 
                            : const Color(0xFF0F172A),
                      ),
                      child: Center(
                        child: Opacity(
                          opacity: ach.isUnlocked ? 1.0 : 0.25,
                          child: Text(
                            ach.emoji,
                            style: const TextStyle(fontSize: 22),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      ach.title,
                      style: TextStyle(
                        color: ach.isUnlocked ? Colors.white : const Color(0xFF64748B),
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        overflow: TextOverflow.ellipsis,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  /// Auxiliary section title text builder
  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1.5,
        color: Color(0xFF64748B),
      ),
    );
  }

  /// Premium analytical info list row
  Widget _buildModernStatRow({
    required String label,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155).withValues(alpha: 0.5)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 16),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFFE2E8F0),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 12,
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}

/// Helper model for user profile achievements display
class ProfileAchievement {
  final String title;
  final String emoji;
  final bool isUnlocked;
  final Color color;

  ProfileAchievement({
    required this.title,
    required this.emoji,
    required this.isUnlocked,
    required this.color,
  });
}
