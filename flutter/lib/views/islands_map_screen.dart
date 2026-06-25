import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../data/services/app_state_integration.dart';
import '../models/lesson_progress.dart';

class IslandsMapScreen extends StatelessWidget {
  const IslandsMapScreen({Key? key}) : super(key: key);

  String _getIslandTitle(String category) {
    switch (category.toLowerCase()) {
      case 'animals':
        return 'Остров Животных 🦁';
      case 'food':
        return 'Остров Еды 🍕';
      case 'colors':
        return 'Остров Цветов 🎨';
      case 'family':
        return 'Остров Семьи 👨‍👩‍👧‍👦';
      case 'nature':
        return 'Остров Природы 🌲';
      case 'numbers':
        return 'Остров Чисел 🔢';
      case 'school':
        return 'Остров Школы 🏫';
      case 'clothes':
        return 'Остров Одежды 👕';
      case 'transport':
        return 'Остров Транспорта 🚗';
      case 'verbs':
        return 'Остров Действий 🏃';
      default:
        return 'Забытый Остров 🏝️';
    }
  }

  String _getIslandDescription(String category) {
    switch (category.toLowerCase()) {
      case 'animals':
        return 'Изучай названия веселых животных и птиц!';
      case 'food':
        return 'Вкусное изучение фруктов, овощей и блюд!';
      case 'colors':
        return 'Разукрась мир волшебными цветами!';
      case 'family':
        return 'Поговорим о маме, папе и друзьях!';
      case 'nature':
        return 'Деревья, погода, горы вокруг нас!';
      case 'numbers':
        return 'Научись считать от 1 до 100 легко!';
      case 'school':
        return 'Все школьные принадлежности и уроки!';
      case 'clothes':
        return 'Давай наряжаться и учить названия одежды!';
      case 'transport':
        return 'Машины, самолеты, поезда и ракеты!';
      case 'verbs':
        return 'Бегай, прыгай, читай! Изучай важные глаголы!';
      default:
        return 'Тайное знание ждет тебя здесь!';
    }
  }

  Color _getIslandColor(String category) {
    switch (category.toLowerCase()) {
      case 'animals':
        return Colors.orangeAccent;
      case 'food':
        return Colors.amber;
      case 'colors':
        return Colors.pinkAccent;
      case 'family':
        return Colors.purpleAccent;
      case 'nature':
        return Colors.green;
      case 'numbers':
        return Colors.blueAccent;
      case 'school':
        return Colors.teal;
      case 'clothes':
        return Colors.deepOrangeAccent;
      case 'transport':
        return Colors.cyan;
      case 'verbs':
        return Colors.redAccent;
      default:
        return Colors.blueAccent;
    }
  }

  void _showIslandOptions(BuildContext context, LessonProgress progress) {
    final title = _getIslandTitle(progress.moduleCategory);
    final color = _getIslandColor(progress.moduleCategory);

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _getIslandDescription(progress.moduleCategory),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 24),
                
                // Mode selection
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: color.withValues(alpha: 0.2),
                          foregroundColor: color,
                          side: BorderSide(color: color, width: 2),
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          context.go('/islands/lesson/${progress.moduleCategory}');
                        },
                        child: Column(
                          children: const [
                            Icon(Icons.menu_book, size: 32),
                            SizedBox(height: 8),
                            Text(
                              'Изучать слова 📚',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blueAccent.withValues(alpha: 0.2),
                          foregroundColor: Colors.blueAccent,
                          side: const BorderSide(color: Colors.blueAccent, width: 2),
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          context.go('/islands/quiz/${progress.moduleCategory}');
                        },
                        child: Column(
                          children: const [
                            Icon(Icons.extension, size: 32),
                            SizedBox(height: 8),
                            Text(
                              'Пройти Квест 🧩',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                if (progress.maximumStarsEarned > 0)
                  Text(
                    'Рекорд на этом острове: ' + '⭐' * progress.maximumStarsEarned,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.amber,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appState = Provider.of<LearningAppState>(context);

    if (appState.isLoading || appState.profile == null) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF38BDF8)),
        ),
      );
    }

    final profile = appState.profile!;
    final lessons = appState.lessons;

    String buddyEmoji = '🐶';
    if (profile.heroBuddyId == 'bella') buddyEmoji = '🐱';
    if (profile.heroBuddyId == 'drake') buddyEmoji = '🐉';

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Column(
          children: [
            // Top Kid Stats Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              child: Row(
                children: [
                  // Profile Icon & XP
                  GestureDetector(
                    onTap: () => context.go('/profile'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.blueAccent.withValues(alpha: 0.2),
                            child: Text(
                              buddyEmoji,
                              style: const TextStyle(fontSize: 18),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                profile.childName,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                'Уровень ${profile.currentLevel}',
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Spacer(),
                  
                  // Streak badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.orangeAccent.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.flash_on, color: Colors.orangeAccent, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          '${profile.dailyStreakCount} дн.',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.orangeAccent,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Stars balance
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.amber.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          '${profile.starBalance}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.amber,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Parent control gate button
                  IconButton(
                    icon: const Icon(Icons.admin_panel_settings, color: Colors.indigoAccent),
                    onPressed: () => context.go('/parent-gate'),
                  ),
                ],
              ),
            ),
            
            // Map Content Area
            Expanded(
              child: Stack(
                children: [
                  // Space/Sky Background Decor
                  Positioned.fill(
                    child: Opacity(
                      opacity: 0.1,
                      child: Container(
                        decoration: const BoxDecoration(
                          image: DecorationImage(
                            image: NetworkReferrerImage(
                              'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600',
                            ),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  // Interactive Islands Road ListView
                  ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 30.0, horizontal: 24.0),
                    itemCount: lessons.length,
                    itemBuilder: (context, index) {
                      final progress = lessons[index];
                      final isUnlocked = progress.isUnlocked;
                      final color = _getIslandColor(progress.moduleCategory);
                      final title = _getIslandTitle(progress.moduleCategory);
                      
                      // Calculate sine wave curves to produce a zigzag path!
                      final alignment = (index % 2 == 0) 
                          ? Alignment.centerLeft 
                          : Alignment.centerRight;

                      return Container(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: Align(
                          alignment: alignment,
                          child: FractionallySizedBox(
                            widthFactor: 0.8,
                            child: Material(
                              elevation: isUnlocked ? 8 : 1,
                              shadowColor: color.withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(24),
                              color: isUnlocked 
                                  ? const Color(0xFF1E293B) 
                                  : const Color(0xFF0F172A).withValues(alpha: 0.5),
                              child: InkWell(
                                borderRadius: BorderRadius.circular(24),
                                onTap: () {
                                  if (isUnlocked) {
                                    _showIslandOptions(context, progress);
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        backgroundColor: Colors.redAccent,
                                        content: Text(
                                          'Остров заблокирован! Набери звезды на предыдущих островах, чтобы открыть его.',
                                          style: const TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                        duration: const Duration(seconds: 2),
                                      ),
                                    );
                                  }
                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(18.0),
                                  child: Row(
                                    children: [
                                      // Island Icon and Stars
                                      Stack(
                                        alignment: Alignment.center,
                                        children: [
                                          Container(
                                            width: 54,
                                            height: 54,
                                            decoration: BoxDecoration(
                                              color: isUnlocked 
                                                  ? color.withValues(alpha: 0.15) 
                                                  : Colors.white.withValues(alpha: 0.05),
                                              shape: BoxShape.circle,
                                              border: Border.all(
                                                color: isUnlocked ? color : Colors.white24,
                                                width: 2,
                                              ),
                                            ),
                                            child: Center(
                                              child: Opacity(
                                                opacity: isUnlocked ? 1.0 : 0.4,
                                                child: Text(
                                                  title.split(' ').last,
                                                  style: const TextStyle(fontSize: 26),
                                                ),
                                              ),
                                            ),
                                          ),
                                          if (!isUnlocked)
                                            Container(
                                              width: 54,
                                              height: 54,
                                              decoration: BoxDecoration(
                                                color: Colors.black.withValues(alpha: 0.4),
                                                shape: BoxShape.circle,
                                              ),
                                              child: const Icon(
                                                Icons.lock,
                                                color: Colors.white54,
                                                size: 20,
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(width: 16),
                                      
                                      // Title & Description
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              title.substring(0, title.length - 2),
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: isUnlocked ? Colors.white : Colors.white38,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              isUnlocked 
                                                  ? 'Количество звезд: ' + (progress.maximumStarsEarned > 0 ? '⭐' * progress.maximumStarsEarned : 'нет')
                                                  : 'Пройдите предыдущие уроки',
                                              style: TextStyle(
                                                fontSize: 11,
                                                color: isUnlocked ? Colors.white70 : Colors.white38,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      
                                      // Chevron Right
                                      if (isUnlocked)
                                        Icon(
                                          Icons.chevron_right,
                                          color: color,
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Fallback utility to safely refer to Network images inside constraints
class NetworkReferrerImage extends NetworkImage {
  const NetworkReferrerImage(String url, {Map<String, String>? headers})
      : super(url, headers: headers);
}
