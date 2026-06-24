import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../data/services/app_state_integration.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: 'Алексей');
  final _pinController = TextEditingController(text: '1234');
  
  int _selectedAgeBracket = 2; // 1 = 5-6 лет, 2 = 7-9 лет, 3 = 10-12 лет
  String _selectedHeroId = 'milo'; // milo, bella, drake

  final List<Map<String, dynamic>> _heroes = [
    {
      'id': 'milo',
      'name': 'Майло 🐶',
      'description': 'Дружелюбный щенок-исследователь, который обожает новые слова.',
      'color': Colors.amber,
    },
    {
      'id': 'bella',
      'name': 'Белла 🐱',
      'description': 'Умная кошечка, которая знает все английские песенки наизусть.',
      'color': Colors.pinkAccent,
    },
    {
      'id': 'drake',
      'name': 'Дрейк 🐉',
      'description': 'Веселый карманный дракончик, обожающий сложные квесты.',
      'color': Colors.emerald,
    },
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  void _submitOnboarding() async {
    if (!_formKey.currentState!.validate()) return;

    final appState = Provider.of<LearningAppState>(context, listen: false);
    await appState.completeOnboarding(
      childName: _nameController.text.trim(),
      ageBracket: _selectedAgeBracket,
      heroBuddy: _selectedHeroId,
      parentalPin: _pinController.text.trim(),
    );

    if (mounted) {
      context.go('/islands');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              theme.colorScheme.background,
              theme.colorScheme.background.withBlue(45),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  const Text(
                    'English Start Kids',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                      color: Color(0xFF38BDF8),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Создай свой профиль исследователя английского языка!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  // Card of Basic Information
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    color: Colors.white.withOpacity(0.05),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Как тебя зовут?',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _nameController,
                            style: const TextStyle(color: Colors.white, fontSize: 16),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.05),
                              hintText: 'Введите имя',
                              hintStyle: const TextStyle(color: Colors.white30),
                              prefixIcon: const Icon(Icons.face, color: Color(0xFF38BDF8)),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            validator: (val) {
                              if (val == null || val.trim().isEmpty) {
                                return 'Пожалуйста, введите имя';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Age selection card
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    color: Colors.white.withOpacity(0.05),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Сколько тебе лет?',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              _buildAgeButton(1, '5-6', 'лет'),
                              const SizedBox(width: 12),
                              _buildAgeButton(2, '7-9', 'лет'),
                              const SizedBox(width: 12),
                              _buildAgeButton(3, '10-12', 'лет'),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Character selection
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    color: Colors.white.withOpacity(0.05),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Выбери своего напарника:',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ..._heroes.map((hero) {
                            final isSelected = _selectedHeroId == hero['id'];
                            return GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedHeroId = hero['id'];
                                });
                              },
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: isSelected
                                        ? hero['color'] as Color
                                        : Colors.white30,
                                    width: isSelected ? 2 : 1,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  color: isSelected
                                      ? (hero['color'] as Color).withOpacity(0.12)
                                      : Colors.transparent,
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: (hero['color'] as Color).withOpacity(0.2),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Text(
                                        hero['name'].toString().split(' ').last,
                                        style: const TextStyle(fontSize: 24),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            hero['name'].toString().split(' ').first,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            hero['description'].toString(),
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: Colors.white70,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Parental Pin Code card
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    color: Colors.white.withOpacity(0.05),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Пароль родительского контроля (PIN)',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Используется для доступа к родительской панели статистики',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.white50,
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _pinController,
                            style: const TextStyle(color: Colors.white, fontSize: 16, letterSpacing: 4),
                            keyboardType: TextInputType.number,
                            maxLength: 4,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.05),
                              hintText: '1234',
                              hintStyle: const TextStyle(color: Colors.white30),
                              prefixIcon: const Icon(Icons.lock, color: Color(0xFF38BDF8)),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(vertical: 16),
                              counterText: '',
                            ),
                            validator: (val) {
                              if (val == null || val.trim().length != 4) {
                                return 'Введите корректный 4-значный цифровой код';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Start button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0EA5E9),
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(60),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 4,
                    ),
                    onPressed: _submitOnboarding,
                    child: const Text(
                      'Начать приключение! 🚀',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  TextButton(
                    onPressed: () => context.go('/parent-gate'),
                    child: const Text(
                      'Войти как родитель',
                      style: TextStyle(
                        color: Colors.white50,
                        decoration: TextDecoration.underline,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAgeButton(int bracket, String ageStr, String labelStr) {
    final isSelected = _selectedAgeBracket == bracket;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedAgeBracket = bracket;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF38BDF8) : Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? const Color(0xFF0EA5E9) : Colors.white24,
              width: 2,
            ),
          ),
          child: Column(
            children: [
              Text(
                ageStr,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.black87 : Colors.white,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                labelStr,
                style: TextStyle(
                  fontSize: 12,
                  color: isSelected ? Colors.black54 : Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
