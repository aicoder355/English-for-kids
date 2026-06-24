import 'package:flutter/material.dart';
import '../../models/achievement.dart';
import '../../data/db/database_helper.dart';

/// Screen displaying achievements and rewards for the young learner.
/// Built with Material Design 3, glowing cards, progress bars, and locked overlays.
class AchievementsScreen extends StatefulWidget {
  const AchievementsScreen({Key? key}) : super(key: key);

  @override
  State<AchievementsScreen> createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends State<AchievementsScreen> {
  bool _isLoading = true;
  List<AchievementItemState> _achievementsState = [];
  int _unlockedCount = 0;
  int _totalXpClaimed = 0;

  @override
  void initState() {
    super.initState();
    _loadAchievementsData();
  }

  Future<void> _loadAchievementsData() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate database loading and metric calculation
    await Future.delayed(const Duration(milliseconds: 750));

    // Dynamic metrics calculated in offline-first mode from local DB
    // e.g., querying learned word counts, streak days, lessons completed.
    final List<AchievementItemState> loadedData = [
      AchievementItemState(
        id: 'first_lesson',
        title: 'Первый урок',
        subtitle: 'First Lesson',
        description: 'Завершите своё самое первое занятие на островах знаний.',
        badgeEmoji: '🌱',
        currentProgress: 1,
        targetProgress: 1,
        xpReward: 50,
        gradientStart: const Color(0xFF66BB6A),
        gradientEnd: const Color(0xFF43A047),
      ),
      AchievementItemState(
        id: 'alphabet_master',
        title: 'Мастер алфавита',
        subtitle: 'Alphabet Master',
        description: 'Изучите и произнесите все буквы английского алфавита.',
        badgeEmoji: '🔤',
        currentProgress: 18,
        targetProgress: 26,
        xpReward: 150,
        gradientStart: const Color(0xFFFFB300),
        gradientEnd: const Color(0xFFFF8F00),
      ),
      AchievementItemState(
        id: 'words_50',
        title: 'Изучено 50 слов',
        subtitle: '50 Words Learned',
        description: 'Наберите в личную учебную картотеку 50 active слов.',
        badgeEmoji: '📚',
        currentProgress: 50,
        targetProgress: 50,
        xpReward: 100,
        gradientStart: const Color(0xFF26C6DA),
        gradientEnd: const Color(0xFF00ACC1),
      ),
      AchievementItemState(
        id: 'words_100',
        title: 'Изучено 100 слов',
        subtitle: '100 Words Learned',
        description: 'Свободно распознавайте 100 английских слов в квестах.',
        badgeEmoji: '🏆',
        currentProgress: 72,
        targetProgress: 100,
        xpReward: 250,
        gradientStart: const Color(0xFF26A69A),
        gradientEnd: const Color(0xFF00897B),
      ),
      AchievementItemState(
        id: 'words_500',
        title: 'Изучено 500 слов',
        subtitle: '500 Words Learned',
        description: 'Соберите словарный запас продвинутого уровня в 500 слов.',
        badgeEmoji: '🥇',
        currentProgress: 140,
        targetProgress: 500,
        xpReward: 1000,
        gradientStart: const Color(0xFFAB47BC),
        gradientEnd: const Color(0xFF8E24AA),
      ),
      AchievementItemState(
        id: 'streak_7',
        title: '7 дней ударного режима',
        subtitle: '7 Day Streak',
        description: 'Занимайтесь английским 7 дней подряд без пропусков.',
        badgeEmoji: '⚡',
        currentProgress: 7,
        targetProgress: 7,
        xpReward: 300,
        gradientStart: const Color(0xFFFF7043),
        gradientEnd: const Color(0xFFF4511E),
      ),
      AchievementItemState(
        id: 'streak_30',
        title: '30 дней ударного режима',
        subtitle: '30 Day Streak',
        description: 'Выдающаяся дисциплина: занимайтесь 30 дней подряд!',
        badgeEmoji: '🔥',
        currentProgress: 12,
        targetProgress: 30,
        xpReward: 1200,
        gradientStart: const Color(0xFFEF5350),
        gradientEnd: const Color(0xFFE53935),
      ),
      AchievementItemState(
        id: 'english_champion',
        title: 'Чемпион английского',
        subtitle: 'English Champion',
        description: 'Пройдите все доступные острова знаний на максимум (3 звезды).',
        badgeEmoji: '👑',
        currentProgress: 3,
        targetProgress: 5,
        xpReward: 2000,
        gradientStart: const Color(0xFF5C6BC0),
        gradientEnd: const Color(0xFF3949AB),
      ),
    ];

    int unlocked = 0;
    int totalXp = 0;
    for (var item in loadedData) {
      if (item.isCompleted) {
        unlocked++;
        totalXp += item.xpReward;
      }
    }

    setState(() {
      _achievementsState = loadedData;
      _unlockedCount = unlocked;
      _totalXpClaimed = totalXp;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isTablet = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Deep Slate background
      appBar: AppBar(
        title: const Text(
          'Мои Награды 🏆',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.lightBlueAccent),
            onPressed: _loadAchievementsData,
          )
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.lightBlueAccent),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildSummaryStatsCard(),
                  const SizedBox(height: 24),
                  const Text(
                    'КНИГА ТВОИХ НАГРАД',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: Color(0xFF38BDF8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  isTablet
                      ? GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 2.1,
                          ),
                          itemCount: _achievementsState.length,
                          itemBuilder: (context, index) {
                            return _buildAchievementCard(_achievementsState[index]);
                          },
                        )
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _achievementsState.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            return _buildAchievementCard(_achievementsState[index]);
                          },
                        ),
                ],
              ),
            ),
    );
  }

  /// Interactive statistics card summary
  Widget _buildSummaryStatsCard() {
    final double completionPercent = _achievementsState.isEmpty
        ? 0.0
        : (_unlockedCount / _achievementsState.length);

    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24.0),
        border: Border.all(color: const Color(0xFF0EA5E9).withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0EA5E9).withOpacity(0.1),
            blurRadius: 15,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Badge stack
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const Icon(Icons.workspace_premium, color: Colors.amber, size: 36),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Супер-Герой Английского',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Заработано очков опыта: +${_totalXpClaimed} XP',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'Кубки: ${_unlockedCount} из ${_achievementsState.length}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFE2E8F0),
                ),
              ),
              Text(
                '${(completionPercent * 100).toInt()}% разблокировано',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF38BDF8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8.0),
            child: LinearProgressIndicator(
              value: completionPercent,
              minHeight: 8,
              backgroundColor: const Color(0xFF334155),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF38BDF8)),
            ),
          ),
        ],
      ),
    );
  }

  /// Single high-fidelity Achievement Item card design
  Widget _buildAchievementCard(AchievementItemState item) {
    final double percent = item.targetProgress == 0 
        ? 0.0 
        : (item.currentProgress / item.targetProgress).clamp(0.0, 1.0);
    final bool isCompleted = item.isCompleted;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted 
              ? const Color(0xFFFFB300).withOpacity(0.4) 
              : const Color(0xFF334155),
          width: isCompleted ? 1.5 : 1.0,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Badge decoration
                _buildBadgeGraphic(item),
                const SizedBox(width: 16),
                
                // Text components & Progress details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.title,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: isCompleted ? Colors.white : const Color(0xFF94A3B8),
                                  ),
                                ),
                                Text(
                                  item.subtitle,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                    color: isCompleted ? const Color(0xFF38BDF8) : const Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Premium XP tag
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, py: 2),
                            decoration: BoxDecoration(
                              color: isCompleted 
                                  ? const Color(0xFFFFB300).withOpacity(0.15) 
                                  : const Color(0xFF334155),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '+${item.xpReward} XP',
                              style: TextStyle(
                                fontSize: 9,
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.bold,
                                color: isCompleted ? const Color(0xFFFFB300) : const Color(0xFF94A3B8),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.description,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF94A3B8),
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      // Progress representation
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(
                            isCompleted ? 'Выполнено! 🎉' : 'В процессе',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isCompleted ? const Color(0xFF4ADE80) : const Color(0xFFE2E8F0),
                            ),
                          ),
                          Text(
                            '${item.currentProgress} / ${item.targetProgress}',
                            style: const TextStyle(
                              fontSize: 10,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF38BDF8),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: percent,
                          minHeight: 5,
                          backgroundColor: const Color(0xFF0F172A),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            isCompleted ? const Color(0xFF4ADE80) : const Color(0xFF0EA5E9),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Locked monochromatic mask icon
          if (!isCompleted)
            Positioned(
              right: 12,
              top: 12,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A).withOpacity(0.6),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lock, size: 10, color: Color(0xFF64748B)),
              ),
            ),
        ],
      ),
    );
  }

  /// Beautiful Badge widget with Double borders and gradient circles
  Widget _buildBadgeGraphic(AchievementItemState item) {
    final bool isCompleted = item.isCompleted;

    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: isCompleted
            ? LinearGradient(
                colors: [item.gradientStart, item.gradientEnd],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : const LinearGradient(
                colors: [Color(0xFF334155), Color(0xFF1E293B)],
              ),
        boxShadow: isCompleted
            ? [
                BoxShadow(
                  color: item.gradientEnd.withOpacity(0.3),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ]
            : null,
      ),
      child: Container(
        margin: const EdgeInsets.all(2.5),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFF0F172A),
          border: Border.all(
            color: isCompleted ? Colors.white.withOpacity(0.2) : Colors.transparent,
            width: 1.0,
          ),
        ),
        child: Center(
          child: Opacity(
            opacity: isCompleted ? 1.0 : 0.3,
            child: Text(
              item.badgeEmoji,
              style: const TextStyle(fontSize: 22),
            ),
          ),
        ),
      ),
    );
  }
}

/// Helper model for keeping active in-state list calculations.
class AchievementItemState {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String badgeEmoji;
  final int currentProgress;
  final int targetProgress;
  final int xpReward;
  final Color gradientStart;
  final Color gradientEnd;

  AchievementItemState({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.badgeEmoji,
    required this.currentProgress,
    required this.targetProgress,
    required this.xpReward,
    required this.gradientStart,
    required this.gradientEnd,
  });

  bool get isCompleted => currentProgress >= targetProgress;
}
