import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../data/db/database_helper.dart';
import '../data/services/tts_service.dart';
import '../data/services/spaced_repetition_service.dart';
import '../data/services/learning_analytics_service.dart';
import '../data/services/app_state_integration.dart';
import '../models/vocab_card.dart';

class QuizWorkspaceScreen extends StatefulWidget {
  final String category;
  const QuizWorkspaceScreen({Key? key, required this.category}) : super(key: key);

  @override
  State<QuizWorkspaceScreen> createState() => _QuizWorkspaceScreenState();
}

class _QuizWorkspaceScreenState extends State<QuizWorkspaceScreen> {
  final SpacedRepetitionService _srService = SpacedRepetitionService();
  final LearningAnalyticsService _analyticsService = LearningAnalyticsService();

  bool _isLoading = true;
  List<VocabCard> _cards = [];
  int _currentIndex = 0;
  
  List<String> _currentOptions = [];
  String? _selectedOption;
  bool _isAnswered = false;
  bool _isCorrect = false;
  int _score = 0;

  @override
  void initState() {
    super.initState();
    _loadQuiz();
  }

  Future<void> _loadQuiz() async {
    try {
      final cards = await DatabaseHelper.instance.getCardsForModule(widget.category);
      setState(() {
        _cards = cards;
        _isLoading = false;
      });
      if (cards.isNotEmpty) {
        _prepareQuestion();
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _prepareQuestion() {
    final correctCard = _cards[_currentIndex];
    
    // Auto speak English word on question entry
    TtsService.instance.speakEnglish(correctCard.englishWord);

    // Dynamic distractors generation
    final List<String> options = [correctCard.russianTranslation];
    final otherTranslations = _cards
        .where((c) => c.id != correctCard.id)
        .map((c) => c.russianTranslation)
        .toList();
    otherTranslations.shuffle();
    for (var translation in otherTranslations) {
      if (options.length < 3) {
        options.add(translation);
      }
    }
    
    // Fallback static options in case there are fewer words on the island
    final fallbackDistractors = ['Яблоко', 'Кот', 'Собака', 'Красный', 'Облако', 'Кролик'];
    for (var dist in fallbackDistractors) {
      if (options.length < 3 && !options.contains(dist) && dist != correctCard.russianTranslation) {
        options.add(dist);
      }
    }
    options.shuffle();

    setState(() {
      _currentOptions = options;
      _selectedOption = null;
      _isAnswered = false;
      _isCorrect = false;
    });
  }

  void _submitAnswer(String option) async {
    if (_isAnswered) return;

    final correctCard = _cards[_currentIndex];
    final isCorrect = option == correctCard.russianTranslation;

    setState(() {
      _selectedOption = option;
      _isAnswered = true;
      _isCorrect = isCorrect;
      if (isCorrect) {
        _score++;
      }
    });

    // Save record under Spaced-repetition history in SQL
    final answerQuality = isCorrect ? 5 : 1;
    await _srService.recordReview(
      cardId: correctCard.id,
      answerQuality: answerQuality,
    );
  }

  void _goToNextQuestion() {
    if (_currentIndex < _cards.length - 1) {
      setState(() {
        _currentIndex++;
      });
      _prepareQuestion();
    } else {
      _finishQuizQuest();
    }
  }

  void _finishQuizQuest() async {
    final appState = Provider.of<LearningAppState>(context, listen: false);
    
    // Calculate final score percentage
    final double accuracy = _score / _cards.length;
    int stars = 0;
    if (accuracy == 1.0) {
      stars = 3;
    } else if (accuracy >= 0.70) {
      stars = 2;
    } else if (accuracy >= 0.40) {
      stars = 1;
    }

    // Award XP/Stars inside user profile in SQLite
    await appState.handleLessonCompleted(widget.category, stars);

    // Compute and save fresh sqlite analytical metrics
    await _analyticsService.computeAndSaveAnalytics();

    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) {
          final isPerfect = stars == 3;
          final rewardXp = stars * 35;
          return AlertDialog(
            backgroundColor: const Color(0xFF1E293B),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            title: Text(
              isPerfect ? 'Победный Квест! 🏆' : 'Квест Завершен! 🌟',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isPerfect ? Icons.emoji_events : Icons.verified,
                  color: isPerfect ? Colors.amber : Colors.blueAccent,
                  size: 80,
                ),
                const SizedBox(height: 16),
                Text(
                  'Результат: $_score из ${_cards.length} правильных ответов!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  stars > 0
                      ? 'Поздравляем! Ты получил звездную награду!'
                      : 'Попробуй еще раз, чтобы получить звезды!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white70),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    3,
                    (i) => Icon(
                      Icons.star,
                      color: i < stars ? Colors.amber : Colors.white10,
                      size: 36,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                if (stars > 0)
                  Text(
                    'Получено: +$rewardXp XP | +$stars 🌟',
                    style: const TextStyle(
                      color: Colors.emeraldAccent,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
              ],
            ),
            actions: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white30),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      setState(() {
                        _currentIndex = 0;
                        _score = 0;
                      });
                      _prepareQuestion();
                    },
                    child: const Text('Сначала 🔄'),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0EA5E9),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      context.go('/islands'); // Exit to islands map
                    },
                    child: const Text('Выход 🏝️'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
            ],
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF38BDF8)),
        ),
      );
    }

    if (_cards.isEmpty) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => context.go('/islands'),
          ),
        ),
        body: const Center(
          child: Text(
            'На этом острове пока нет квестов!',
            style: TextStyle(color: Colors.white70, fontSize: 18),
          ),
        ),
      );
    }

    final card = _cards[_currentIndex];
    final progressVal = (_currentIndex) / _cards.length;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Испытание: ${widget.category}',
          style: const TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => context.go('/islands'),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Progress Header Row
              Row(
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: progressVal,
                        minHeight: 10,
                        backgroundColor: Colors.white12,
                        color: Colors.amberAccent,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Квест ${_currentIndex + 1}/${_cards.length}',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Question Slate Card
              Expanded(
                flex: 4,
                child: Card(
                  elevation: 6,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  color: const Color(0xFF1E293B),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Sound Play Trigger
                      Positioned(
                        top: 20,
                        right: 20,
                        child: IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.05),
                            foregroundColor: Colors.white,
                          ),
                          icon: const Icon(Icons.volume_up, size: 28),
                          onPressed: () => TtsService.instance.speakEnglish(card.englishWord),
                        ),
                      ),
                      
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'КАК ПЕРЕВОДИТСЯ СЛОВО:',
                            style: TextStyle(
                              fontSize: 13,
                              letterSpacing: 1.5,
                              color: Colors.white50,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            card.englishWord,
                            style: const TextStyle(
                              fontSize: 44,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            card.phoneticTranscription,
                            style: const TextStyle(
                              fontSize: 20,
                              fontFamily: 'monospace',
                              color: Color(0xFF38BDF8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Multiple options choice buttons
              Expanded(
                flex: 5,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: _currentOptions.map((option) {
                    final isSelected = _selectedOption == option;
                    final isCorrectOption = option == card.russianTranslation;
                    
                    Color buttonColor = const Color(0xFF1E293B);
                    Color textColor = Colors.white;
                    IconData? optionIcon;

                    if (_isAnswered) {
                      if (isCorrectOption) {
                        buttonColor = Colors.green.withOpacity(0.2);
                        textColor = Colors.greenAccent;
                        optionIcon = Icons.check_circle;
                      } else if (isSelected) {
                        buttonColor = Colors.red.withOpacity(0.2);
                        textColor = Colors.redAccent;
                        optionIcon = Icons.cancel;
                      } else {
                        buttonColor = const Color(0xFF1E293B).withOpacity(0.5);
                        textColor = Colors.white38;
                      }
                    }

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: buttonColor,
                          foregroundColor: textColor,
                          elevation: isSelected ? 4 : 0,
                          side: BorderSide(
                            color: isSelected 
                                ? (isCorrectOption ? Colors.green : Colors.red) 
                                : Colors.white10,
                            width: 2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 18),
                        ),
                        onPressed: _isAnswered ? null : () => _submitAnswer(option),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (optionIcon != null) ...[
                              Icon(optionIcon, color: textColor),
                              const SizedBox(width: 10),
                            ],
                            Text(
                              option,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              // Active Answer Advice Panel
              if (_isAnswered)
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: _isCorrect ? Colors.green.withOpacity(0.12) : Colors.red.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _isCorrect ? Colors.green.withOpacity(0.3) : Colors.red.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        _isCorrect ? '🐾' : '🐱',
                        style: const TextStyle(fontSize: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _isCorrect
                              ? 'Верно! Ты настоящий молодец!'
                              : 'Ой! Правильный перевод: ${card.russianTranslation}. Запомни его!',
                          style: TextStyle(
                            color: _isCorrect ? Colors.greenAccent : Colors.redAccent,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // Bottom proceed control action button
              if (_isAnswered)
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0EA5E9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                  ),
                  onPressed: _goToNextQuestion,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _currentIndex == _cards.length - 1 ? 'Завершить Квест' : 'Следующий вопрос',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
