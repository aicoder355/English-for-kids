/// Model representing the local child profile.
/// Uses SQFlite conversion helpers with SQLite typing compatibility.
class UserProfile {
  final int? id;
  final String childName;
  final int ageBracket; // 1 = Ages 5-6, 2 = Ages 7-9, 3 = Ages 10-12
  final String heroBuddyId; // 'milo', 'bella', 'drake'
  final int currentLevel;
  final int accumulatedXp;
  final int starBalance;
  final int dailyStreakCount;
  final int lastActiveTimestamp; // millisecondEpoch for offline calendar calc
  final String parentalPin;

  UserProfile({
    this.id,
    required this.childName,
    required this.ageBracket,
    required this.heroBuddyId,
    this.currentLevel = 1,
    this.accumulatedXp = 0,
    this.starBalance = 0,
    this.dailyStreakCount = 1,
    required this.lastActiveTimestamp,
    this.parentalPin = '1234',
  });

  /// Factory constructors for SQLite conversion.
  factory UserProfile.fromMap(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as int?,
      childName: json['child_name'] as String,
      ageBracket: json['age_bracket'] as int,
      heroBuddyId: json['hero_buddie_id'] as String,
      currentLevel: json['current_level'] as int,
      accumulatedXp: json['accumulated_xp'] as int,
      starBalance: json['star_balance'] as int,
      dailyStreakCount: json['daily_streak_count'] as int,
      lastActiveTimestamp: json['last_active_timestamp'] as int,
      parentalPin: json['four_digit_pin'] as String? ?? '1234',
    );
  }

  /// Exports map object for Database operations.
  Map<String, dynamic> toMap() {
    return {
      if (id != null) 'id': id,
      'child_name': childName,
      'age_bracket': ageBracket,
      'hero_buddie_id': heroBuddyId,
      'current_level': currentLevel,
      'accumulated_xp': accumulatedXp,
      'star_balance': starBalance,
      'daily_streak_count': dailyStreakCount,
      'last_active_timestamp': lastActiveTimestamp,
      'four_digit_pin': parentalPin,
    };
  }

  /// Creates a modified copy with new values easily using copyWith.
  UserProfile copyWith({
    int? id,
    String? childName,
    int? ageBracket,
    String? heroBuddyId,
    int? currentLevel,
    int? accumulatedXp,
    int? starBalance,
    int? dailyStreakCount,
    int? lastActiveTimestamp,
    String? parentalPin,
  }) {
    return UserProfile(
      id: id ?? this.id,
      childName: childName ?? this.childName,
      ageBracket: ageBracket ?? this.ageBracket,
      heroBuddyId: heroBuddyId ?? this.heroBuddyId,
      currentLevel: currentLevel ?? this.currentLevel,
      accumulatedXp: accumulatedXp ?? this.accumulatedXp,
      starBalance: starBalance ?? this.starBalance,
      dailyStreakCount: dailyStreakCount ?? this.dailyStreakCount,
      lastActiveTimestamp: lastActiveTimestamp ?? this.lastActiveTimestamp,
      parentalPin: parentalPin ?? this.parentalPin,
    );
  }
}
