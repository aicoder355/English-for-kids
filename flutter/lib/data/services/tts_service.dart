import 'package:flutter_tts/flutter_tts.dart';

/// Service for text-to-speech pronunciation leveraging flutter_tts.
/// Provides offline capabilities, English pronunciation adjustments, and child-friendly settings.
class TtsService {
  static final TtsService instance = TtsService._init();
  late final FlutterTts _flutterTts;
  
  bool _isInitialized = false;
  double _speechRate = 0.35; // Slow, child-friendly speech rate
  String _language = 'en-US';
  final double _pitch = 1.15; // Slightly high pitch for kids gamification

  TtsService._init() {
    _flutterTts = FlutterTts();
    _configureTts();
  }

  Future<void> _configureTts() async {
    try {
      await _flutterTts.setLanguage(_language);
      await _flutterTts.setSpeechRate(_speechRate);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(_pitch);
      
      // Handle completion/error events
      _flutterTts.setErrorHandler((msg) {
        print("TTS speech error: $msg");
      });
      
      _isInitialized = true;
    } catch (e) {
      print("Error configuring child TTS: $e");
    }
  }

  /// Speaks the specified word in English
  Future<void> speakEnglish(String text) async {
    if (!_isInitialized) {
      await _configureTts();
    }
    await _flutterTts.stop();
    await _flutterTts.speak(text);
  }

  /// Sets custom speech rate (e.g., from 0.1 to 1.0)
  Future<void> setCustomSpeechRate(double rate) async {
    _speechRate = rate;
    await _flutterTts.setSpeechRate(_speechRate);
  }

  /// Stop current active speech
  Future<void> stop() async {
    await _flutterTts.stop();
  }

  /// Get list of supported voices for speech adjustments
  Future<List<String>> getAvailableEnglishVoices() async {
    try {
      final voices = await _flutterTts.getVoices;
      if (voices != null) {
        final List<String> list = [];
        for (var voice in voices) {
          final voiceStr = voice.toString();
          if (voiceStr.toLowerCase().contains("en")) {
            list.add(voiceStr);
          }
        }
        return list;
      }
    } catch (_) {}
    return ['System Default Male', 'System Default Female'];
  }

  /// Set customized voice setting
  Future<void> setVoice(String voiceName) async {
    try {
      await _flutterTts.setVoice({"name": voiceName, "locale": _language});
    } catch (e) {
      print("Could not load selected voice: $e");
    }
  }
}
