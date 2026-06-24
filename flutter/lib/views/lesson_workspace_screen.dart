import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../data/db/database_helper.dart';
import '../data/services/tts_service.dart';
import '../data/services/app_state_integration.dart';
import '../models/vocab_card.dart';

class LessonWorkspaceScreen extends StatefulWidget {
  final String category;
  const LessonWorkspaceScreen({Key? key, required this.category}) : super(key: key);

  @override
  State<LessonWorkspaceScreen> createState() => _LessonWorkspaceScreenState();
}

class _LessonWorkspaceScreenState extends State<LessonWorkspaceScreen> {
  bool _isLoading = true;
  List<VocabCard> _cards = [];
  int _currentIndex = 0;
  bool _isFlipped = false;
  bool _hasSpoken = false;

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  Future<void> _loadCards() async {
    try {
      final cards = await DatabaseHelper.instance.getCardsForModule(widget.category);
      setState(() {
        _cards = cards;
        _isLoading = false;
      });
      if (cards.isNotEmpty) {
        _speakEnglishWord(cards[0].englishWord);
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _speakEnglishWord(String word) {
    TtsService.instance.speakEnglish(word);
    setState(() {
      _hasSpoken = true;
    });
  }

  void _flipCard() {
    setState(() {
      _isFlipped = !_isFlipped;
    });
  }

  void _goToNextWord() {
    if (_currentIndex < _cards.length - 1) {
      setState(() {
        _currentIndex++;
        _isFlipped = false;
        _hasSpoken = false;
      });
      _speakEnglishWord(_cards[_currentIndex].englishWord);
    } else {
      _completeLesson();
    }
  }

  void _goToPreviousWord() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
        _isFlipped = false;
        _hasSpoken = false;
      });
      _speakEnglishWord(_cards[_currentIndex].englishWord);
    }
  }

  void _completeLesson() async {
    final appState = Provider.of<LearningAppState>(context, listen: false);
    
    // Default to awarding 3 stars for lesson review completion
    const starsEarned = 3;
    await appState.handleLessonCompleted(widget.category, starsEarned);

    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) {
          final profile = appState.profile;
          return AlertDialog(
            backgroundColor: const Color(0xFF1E293B),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            title: const Text(
              'Урок Завершен! 🎉',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.stars,
                  color: Colors.amber,
                  size: 80,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Отличная работа! Ты выучил все слова на этом острове!',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white70),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    3,
                    (i) => const Icon(
                      Icons.star,
                      color: Colors.amber,
                      size: 32,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  'Получено: +75 XP 🚀 | +3 🌟',
                  style: const TextStyle(
                    color: Colors.greenAccent,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            actions: [
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0EA5E9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  onPressed: () {
                    Navigator.pop(context); // Close dialog
                    context.go('/islands'); // Go back to islands map
                  },
                  child: const Text(
                    'Вернуться на Карту 🏝️',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
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
            'На этом острове пока нет слов!',
            style: TextStyle(color: Colors.white70, fontSize: 18),
          ),
        ),
      );
    }

    final card = _cards[_currentIndex];
    final progressVal = (_currentIndex + 1) / _cards.length;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Изучаем слова: ${widget.category}',
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
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
              // Core Progress Indicator bar
              Row(
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: progressVal,
                        minHeight: 10,
                        backgroundColor: Colors.white12,
                        color: const Color(0xFF38BDF8),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    '${_currentIndex + 1}/${_cards.length}',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),

              // Word Interactive Flashcard Area
              Expanded(
                child: GestureDetector(
                  onTap: _flipCard,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (Widget child, Animation<double> val) {
                      final isBack = child.key == const ValueKey(false);
                      return AnimatedBuilder(
                        animation: val,
                        builder: (context, _) {
                          // Standard beautiful flip animation rotation angle calculation
                          final angle = val.value * 3.14159;
                          return Transform(
                            transform: Matrix4.identity()
                              ..setEntry(3, 2, 0.001)
                              ..rotateY(angle),
                            alignment: Alignment.center,
                            child: child,
                          );
                        },
                      );
                    },
                    child: _isFlipped ? _buildBackFace(card) : _buildFrontFace(card),
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // Mascote bubble advice
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white10),
                ),
                child: Row(
                  children: [
                    const Text(
                      '🐶',
                      style: TextStyle(fontSize: 28),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _isFlipped
                            ? 'Отличный перевод! Запомни его и переходи к следующему слову!'
                            : 'Нажми на карточку, чтобы узнать перевод слова на русский язык!',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Bottom control elements buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Prev Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white.withOpacity(0.05),
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white24),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    ),
                    onPressed: _currentIndex > 0 ? _goToPreviousWord : null,
                    child: Row(
                      children: const [
                        Icon(Icons.arrow_back),
                        SizedBox(width: 4),
                        Text('Назад'),
                      ],
                    ),
                  ),
                  
                  // Flip Button Helper
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFF38BDF8).withOpacity(0.12),
                      foregroundColor: const Color(0xFF38BDF8),
                      padding: const EdgeInsets.all(16),
                    ),
                    icon: const Icon(Icons.flip_camera_android),
                    onPressed: _flipCard,
                  ),

                  // Next Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0EA5E9),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    ),
                    onPressed: _goToNextWord,
                    child: Row(
                      children: [
                         Text(_currentIndex == _cards.length - 1 ? 'Завершить Урок' : 'Далее'),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFrontFace(VocabCard card) {
    return Card(
      key: const ValueKey(true),
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      color: const Color(0xFF1E293B),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Illustration Placeholder
          Positioned(
            top: 24,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Icon(Icons.image, color: Colors.white24, size: 50),
              ),
            ),
          ),
          
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 120),
              Text(
                card.englishWord,
                style: const TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                card.phoneticTranscription,
                style: const TextStyle(
                  fontSize: 20,
                  fontFamily: 'monospace',
                  color: Color(0xFF38BDF8),
                ),
              ),
              const SizedBox(height: 20),
              
              // Vocalize Button
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF38BDF8).withOpacity(0.2),
                  foregroundColor: const Color(0xFF38BDF8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                onPressed: () => _speakEnglishWord(card.englishWord),
                icon: const Icon(Icons.volume_up),
                label: const Text(
                  'Послушать звук',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          
          const Positioned(
            bottom: 20,
            child: Row(
              children: [
                Icon(Icons.touch_app, color: Colors.white30, size: 16),
                SizedBox(width: 6),
                Text(
                  'Нажми, чтобы перевернуть',
                  style: TextStyle(color: Colors.white30, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackFace(VocabCard card) {
    return Card(
      key: const ValueKey(false),
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      color: const Color(0xFF1E293B),
      child: Transform(
        alignment: Alignment.center,
        transform: Matrix4.identity()..rotateY(3.1415),
        child: Stack(
          alignment: Alignment.center,
          children: [
            SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 16),
                  const Text(
                    'Перевод слова:',
                    style: TextStyle(fontSize: 14, color: Colors.white54),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    card.russianTranslation,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Colors.emeraldAccent,
                    ),
                  ),
                  if (card.exampleSentenceEn != null && card.exampleSentenceEn!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            Text(
                              card.exampleSentenceEn!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 16,
                                fontStyle: FontStyle.italic,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              card.exampleSentenceRu ?? '',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.white70,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.emeraldAccent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Отличная работа! 👍',
                      style: TextStyle(
                        color: Colors.emeraldAccent,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            const Positioned(
              bottom: 20,
              child: Row(
                children: [
                  Icon(Icons.touch_app, color: Colors.white30, size: 16),
                  SizedBox(width: 6),
                  Text(
                    'Нажми для возврата',
                    style: TextStyle(color: Colors.white30, fontSize: 13),
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
