import 'package:flutter/material.dart';

/// Senior-Developer-level High-Fidelity Parent Dashboard Screen.
/// Displays detailed educational analytics: active learning time, lessons completed,
/// vocabulary size, average scores, and interactive Daily/Weekly/Monthly activity charts
/// using a gorgeous custom spline-curve painter.
class ParentDashboardScreen extends StatefulWidget {
  const ParentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends State<ParentDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _periodTabController;
  
  // Custom states for interactive simulation
  String selectedChild = "Алексей (5 лет)";
  bool isAlertsEnabled = true;
  int dailyTimeLimitMinutes = 15;

  // Mock stats reflecting realistic persistence
  final int totalLearningMinutes = 480;
  final int lessonsCompleted = 32;
  final int totalLessons = 40;
  final int wordsLearned = 184;
  final double averageScorePercent = 94.2;
  final int currentStreak = 7;

  // Data ranges for charts
  final Map<int, List<double>> chartPointsByPeriod = {
    0: [10, 15, 8, 12, 18, 15, 0], // Daily data points (Mon-Sun active mins)
    1: [45, 60, 50, 75, 90, 80, 85], // Weekly data points (Last 7 weeks)
    2: [180, 240, 310, 390, 440, 480], // Monthly progression (Cumulative mins over 6 months)
  };

  final List<String> periodLabels = ["День", "Неделя", "Месяц"];

  @override
  void initState() {
    super.initState();
    _periodTabController = TabController(length: 3, vsync: this);
    _periodTabController.addListener(() {
      setState(() {}); // Redraw custom paint when tab changes
    });
  }

  @override
  void dispose() {
    _periodTabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark luxury slate background
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Кабинет Родителей",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              isAlertsEnabled ? Icons.notifications_active : Icons.notifications_off,
              color: isAlertsEnabled ? const Color(0xFF38BDF8) : Colors.blueGrey,
            ),
            onPressed: () {
              setState(() {
                isAlertsEnabled = !isAlertsEnabled;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isAlertsEnabled ? "Push-нотификации об успехах включены" : "Уведомления отключены",
                  ),
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Kid Profile Switcher Header
              _buildChildProfileSelectorCard(),
              const SizedBox(height: 16),

              // KPI Statistics Grid (4 indicators: Time, Lessons, Words, Score)
              _buildMetricStatsGrid(),
              const SizedBox(height: 20),

              // Interactive Activity Tabs (Daily, Weekly, Monthly)
              _buildActivityAnalysisCard(),
              const SizedBox(height: 20),

              // Spaced Repetition Vocabulary Mastery Card
              _buildVocabularyMasteryCard(),
              const SizedBox(height: 20),

              // Parent Time Limits Safety Settings Controller
              _buildParentalControlsCard(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  /// Dropdown simulation card representing multiclass profiles
  Widget _buildChildProfileSelectorCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF334155), width: 1.0),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(colors: [Color(0xFFFB923C), Color(0xFFF43F5E)]),
                ),
                child: const Center(
                  child: Text("🦊", style: TextStyle(fontSize: 22)),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Аналитика обучения",
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    selectedChild,
                    style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ],
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.swap_horiz, color: Color(0xFF38BDF8)),
            onSelected: (String child) {
              setState(() {
                selectedChild = child;
              });
            },
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            color: const Color(0xFF1E293B),
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'Алексей (5 лет)',
                child: Text('Алексей (5 лет)', style: TextStyle(color: Colors.white, fontSize: 13)),
              ),
              const PopupMenuItem<String>(
                value: 'Маша (8 лет)',
                child: Text('Маша (8 лет)', style: TextStyle(color: Colors.white, fontSize: 13)),
              ),
            ],
          )
        ],
      ),
    );
  }

  /// Four core stats layout displaying vital information requested
  Widget _buildMetricStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.8,
      children: [
        _buildStatBox(
          title: "Время обучения",
          subtitle: "Learning Time",
          value: "$totalLearningMinutes мин",
          emoji: "⏱️",
          color: const Color(0xFF0EA5E9),
        ),
        _buildStatBox(
          title: "Урок завершено",
          subtitle: "Lessons Done",
          value: "$lessonsCompleted/$totalLessons",
          emoji: "🎯",
          color: const Color(0xFF10B981),
        ),
        _buildStatBox(
          title: "Выучено слов",
          subtitle: "Words Learned",
          value: "$wordsLearned слов",
          emoji: "📝",
          color: const Color(0xFF818CF8),
        ),
        _buildStatBox(
          title: "Средняя оценка",
          subtitle: "Average Score",
          value: "${averageScorePercent.toStringAsFixed(1)}%",
          emoji: "🏆",
          color: const Color(0xFFF59E0B),
        ),
      ],
    );
  }

  Widget _buildStatBox({
    required String title,
    required String subtitle,
    required String value,
    required String emoji,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.2), width: 1.2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: Stack(
        children: [
          Positioned(
            right: 0,
            top: 0,
            child: Text(emoji, style: const TextStyle(fontSize: 16)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF475569), fontSize: 7, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Periodic Activity Chart Card (Custom Painting beautiful curved spline graph)
  Widget _buildActivityAnalysisCard() {
    final activeTabIndex = _periodTabController.index;
    final List<double> data = chartPointsByPeriod[activeTabIndex] ?? chartPointsByPeriod[0]!;
    
    // Summing values
    double totalPeriodMins = data.fold(0, (prev, val) => prev + val);
    String scopeUnit = activeTabIndex == 0 ? "минут сегодня" : activeTabIndex == 1 ? "минут за неделю" : "минут за месяц";

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "ИНТЕНСИВНОСТЬ ЗАНЯТИЙ",
                    style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      Text(
                        "${totalPeriodMins.round()} мин",
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        scopeUnit,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF38BDF8), fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
              
              // Standard segment layout
              Container(
                height: 30,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(10),
                ),
                padding: const EdgeInsets.all(2.0),
                child: Row(
                  children: List.generate(3, (index) {
                    final bool isSelected = activeTabIndex == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _periodTabController.animateTo(index);
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF38BDF8) : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          periodLabels[index],
                          style: TextStyle(
                            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                            fontSize: 9,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.normal,
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              )
            ],
          ),
          const SizedBox(height: 24),

          // Custom Spline Curve Graph
          SizedBox(
            height: 120,
            child: CustomPaint(
              size: Size.infinite,
              painter: ProgressChartPainter(
                dataPoints: data,
                color: const Color(0xFF38BDF8),
                fillColor: const Color(0xFF38BDF8).withValues(alpha: 0.06),
              ),
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Labeling dynamic X axes
          _buildChartLabelsRow(activeTabIndex),
        ],
      ),
    );
  }

  Widget _buildChartLabelsRow(int periodIdx) {
    List<String> labels = [];
    if (periodIdx == 0) {
      labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    } else if (periodIdx == 1) {
      labels = ["н-7", "н-6", "н-5", "н-4", "н-3", "н-2", "н-1"];
    } else {
      labels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: labels.map((lbl) => Text(
        lbl,
        style: const TextStyle(fontSize: 8, color: Color(0xFF475569), fontWeight: FontWeight.bold, fontFamily: 'monospace'),
      )).toList(),
    );
  }

  /// Spaced Repetition mastery table
  Widget _buildVocabularyMasteryCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            "УСВОЕНИЕ ТЕМАТИЧЕСКИХ СЛОВАРЕЙ",
            style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.2),
          ),
          const SizedBox(height: 16),

          _buildProgressBarRow("Животные (Animals)", 0.90, "90% слов", const Color(0xFF4ADE80)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Еда и Напитки (Food)", 0.75, "75% слов", const Color(0xFF38BDF8)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Цвета и Формы (Colors)", 0.55, "55% слов", const Color(0xFFFACC15)),
          const SizedBox(height: 12),
          _buildProgressBarRow("Семья и Дом (Family)", 0.15, "15% в процессе", const Color(0xFF818CF8)),
        ],
      ),
    );
  }

  Widget _buildProgressBarRow(String label, double valueFactor, String textVal, Color barColor) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontWeight: FontWeight.bold)),
            Text(textVal, style: TextStyle(color: barColor, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Container(
            height: 6,
            color: const Color(0xFF0F172A),
            child: Stack(
              children: [
                FractionallySizedBox(
                  widthFactor: valueFactor,
                  child: Container(color: barColor),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  /// Screen limits controls simulator
  Widget _buildParentalControlsCard() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF1E1B4B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF4F46E5).withValues(alpha: 0.3)),
      ),
      padding: const EdgeInsets.all(18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.security, color: Color(0xFF818CF8), size: 16),
              ),
              const SizedBox(width: 8),
              const Text(
                "БЕЗОПАСНОСТЬ И ЛИМИТЫ ЭКРАНА",
                style: TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFFC7D2FE), letterSpacing: 1.2),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Daily sliding limit
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Дневное игровое время:",
                style: TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                "$dailyTimeLimitMinutes мин / день",
                style: const TextStyle(color: Color(0xFFFF4E7E), fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
              ),
            ],
          ),
          Slider(
            value: dailyTimeLimitMinutes.toDouble(),
            min: 5,
            max: 60,
            divisions: 11,
            activeColor: const Color(0xFF4F46E5),
            inactiveColor: const Color(0xFF0F172A),
            onChanged: (double val) {
              setState(() {
                dailyTimeLimitMinutes = val.round();
              });
            },
          ),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Автоматическая блокировка", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
              Text(
                "Блокировать при превышении лимита",
                style: TextStyle(color: const Color(0xFF4DE80).withValues(alpha: 0.5), fontSize: 8, fontStyle: FontStyle.italic),
              )
            ],
          )
        ],
      ),
    );
  }
}

/// Custom spline graph painter to show beautiful visual charts without third party visual bloating
class ProgressChartPainter extends CustomPainter {
  final List<double> dataPoints;
  final Color color;
  final Color fillColor;

  ProgressChartPainter({
    required this.dataPoints,
    required this.color,
    required this.fillColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (dataPoints.isEmpty) return;

    final double width = size.width;
    final double height = size.height;
    final int itemsCount = dataPoints.length;

    // Finding bounds
    double maxValue = 1.0;
    for (var val in dataPoints) {
      if (val > maxValue) maxValue = val;
    }
    maxValue *= 1.15; // padding top

    final double stepX = width / (itemsCount - 1);
    
    // Path for drawing spline
    final Path path = Path();
    final Path filledPath = Path();

    // Starter point
    double x0 = 0;
    double y0 = height - (dataPoints[0] / maxValue) * height;
    path.moveTo(x0, y0);
    filledPath.moveTo(0, height);
    filledPath.lineTo(x0, y0);

    for (int i = 1; i < itemsCount; i++) {
      double x1 = i * stepX;
      double y1 = height - (dataPoints[i] / maxValue) * height;

      // Splined support control coordinates
      double cpX1 = x0 + (x1 - x0) / 2;
      double cpY1 = y0;
      double cpX2 = x0 + (x1 - x0) / 2;
      double cpY2 = y1;

      path.cubicTo(cpX1, cpY1, cpX2, cpY2, x1, y1);
      filledPath.cubicTo(cpX1, cpY1, cpX2, cpY2, x1, y1);

      x0 = x1;
      y0 = y1;
    }

    filledPath.lineTo(width, height);
    filledPath.close();

    // Painting shaded baseline
    final Paint fillPaint = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;
    canvas.drawPath(filledPath, fillPaint);

    // Painting line
    final Paint linePaint = Paint()
      ..color = color
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, linePaint);

    // Painting dots on peak coordinates
    final Paint dotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    
    final Paint dotOuterPaint = Paint()
      ..color = color
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < itemsCount; i++) {
      double circleX = i * stepX;
      double circleY = height - (dataPoints[i] / maxValue) * height;

      canvas.drawCircle(Offset(circleX, circleY), 4.5, dotOuterPaint);
      canvas.drawCircle(Offset(circleX, circleY), 3.0, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant ProgressChartPainter oldDelegate) {
    return oldDelegate.dataPoints != dataPoints || oldDelegate.color != color;
  }
}
