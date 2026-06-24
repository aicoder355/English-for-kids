/// Model representing a single vocabulary review flashcard.
/// Bundled assets inside resources are synchronized with this local config.
class VocabCard {
  final String id;
  final String moduleCategory; // 'animals', 'food', 'colors', 'family'
  final int difficultyRank; // 1 = Simple, 2 = Medium, 3 = Complex
  final String englishWord;
  final String russianTranslation;
  final String phoneticTranscription;
  final String audioPathIdentifier;
  final String imageAssetIdentifier;
  final String? exampleSentenceEn;
  final String? exampleSentenceRu;

  VocabCard({
    required this.id,
    required this.moduleCategory,
    required this.difficultyRank,
    required this.englishWord,
    required this.russianTranslation,
    required this.phoneticTranscription,
    required this.audioPathIdentifier,
    required this.imageAssetIdentifier,
    this.exampleSentenceEn,
    this.exampleSentenceRu,
  });

  factory VocabCard.fromMap(Map<String, dynamic> json) {
    return VocabCard(
      id: json['id'] as String,
      moduleCategory: json['module_category'] as String,
      difficultyRank: json['difficulty_rank'] as int,
      englishWord: json['english_word'] as String,
      russianTranslation: json['russian_translation'] as String,
      phoneticTranscription: json['phonetic_transcription'] as String,
      audioPathIdentifier: json['audio_path_identifier'] as String,
      imageAssetIdentifier: json['image_asset_identifier'] as String,
      exampleSentenceEn: json['example_sentence_en'] as String?,
      exampleSentenceRu: json['example_sentence_ru'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'module_category': moduleCategory,
      'difficulty_rank': difficultyRank,
      'english_word': englishWord,
      'russian_translation': russianTranslation,
      'phonetic_transcription': phoneticTranscription,
      'audio_path_identifier': audioPathIdentifier,
      'image_asset_identifier': imageAssetIdentifier,
      'example_sentence_en': exampleSentenceEn,
      'example_sentence_ru': exampleSentenceRu,
    };
  }
}
