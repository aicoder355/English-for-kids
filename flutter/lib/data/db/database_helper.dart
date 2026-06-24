import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../../models/user_profile.dart';
import '../../models/vocab_card.dart';
import '../../models/lesson_progress.dart';
import '../../models/quiz_history.dart';
import '../../models/achievement.dart';

/// SQLite Database helper utilizing standard Sqflite for local data offline.
/// Includes table constructions, composite indices, seed pre-population, and XP calculations.
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('english_kids_local.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 4,
      onCreate: _createDB,
      onUpgrade: _onUpgrade,
      onConfigure: _onConfigure,
    );
  }

  Future<void> _onConfigure(Database db) async {
    // Enable Foreign Key operations
    await db.execute('PRAGMA foreign_keys = ON');
  }

  Future<void> _createDB(Database db, int version) async {
    const idType = 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL';
    const textType = 'TEXT NOT NULL';
    const intType = 'INTEGER NOT NULL';
    const realType = 'REAL NOT NULL';

    // 1. user_profile
    await db.execute('''
      CREATE TABLE user_profile (
        id $idType,
        child_name $textType,
        age_bracket $intType,
        hero_buddie_id $textType,
        current_level $intType DEFAULT 1,
        accumulated_xp $intType DEFAULT 0,
        star_balance $intType DEFAULT 0,
        daily_streak_count $intType DEFAULT 0,
        last_active_timestamp $intType,
        four_digit_pin $textType DEFAULT '1234',
        current_lesson $textType DEFAULT 'animals',
        is_onboarding_completed $intType DEFAULT 0
      )
    ''');

    // 2. vocab_card
    await db.execute('''
      CREATE TABLE vocab_card (
        id TEXT PRIMARY KEY NOT NULL,
        module_category $textType,
        difficulty_rank $intType,
        english_word $textType,
        russian_translation $textType,
        phonetic_transcription $textType,
        audio_path_identifier $textType,
        image_asset_identifier $textType,
        example_sentence_en TEXT,
        example_sentence_ru TEXT
      )
    ''');

    // 3. quiz_history
    await db.execute('''
      CREATE TABLE quiz_history (
        id $idType,
        card_id TEXT NOT NULL,
        last_answered_timestamp $intType,
        consecutive_correct_hits $intType DEFAULT 0,
        difficulty_weight_factor $realType DEFAULT 2.5,
        FOREIGN KEY (card_id) REFERENCES vocab_card (id) ON DELETE CASCADE
      )
    ''');

    // 4. lesson_progress
    await db.execute('''
      CREATE TABLE lesson_progress (
        module_category TEXT PRIMARY KEY NOT NULL,
        maximum_stars_earned $intType DEFAULT 0,
        is_completed_at_least_once $intType DEFAULT 0,
        times_practiced $intType DEFAULT 0,
        is_unlocked $intType DEFAULT 0
      )
    ''');

    // 5. system_achievement
    await db.execute('''
      CREATE TABLE system_achievement (
        achievement_id TEXT PRIMARY KEY NOT NULL,
        name_native $textType,
        requirement_description $textType,
        is_unlocked $intType DEFAULT 0,
        unlocked_at_timestamp INTEGER
      )
    ''');

    // 6. learning_analytics
    await db.execute('''
      CREATE TABLE learning_analytics (
        id $idType,
        date TEXT,
        learning_speed $realType,
        retention_rate $realType,
        accuracy $realType,
        activity_minutes $intType,
        weak_category TEXT,
        timestamp $intType,
        accuracy_percentage $realType,
        weak_categories TEXT,
        daily_activity TEXT,
        weekly_activity TEXT
      )
    ''');

    // Indices to speed up retrieval under 3ms
    await db.execute('CREATE INDEX idx_vocab_module ON vocab_card(module_category, difficulty_rank)');
    await db.execute('CREATE INDEX idx_quiz_card ON quiz_history(card_id)');
    await db.execute('CREATE INDEX idx_analytics_timestamp ON learning_analytics(timestamp)');

    // Seed/Prepopulate initial decks & constants
    await _seedDatabase(db);
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      const idType = 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL';
      const intType = 'INTEGER NOT NULL';
      const realType = 'REAL NOT NULL';

      await db.execute('''
        CREATE TABLE learning_analytics (
          id $idType,
          date TEXT,
          learning_speed $realType,
          retention_rate $realType,
          accuracy $realType,
          activity_minutes $intType,
          weak_category TEXT,
          timestamp $intType,
          accuracy_percentage $realType,
          weak_categories TEXT,
          daily_activity TEXT,
          weekly_activity TEXT
        )
      ''');

      await db.execute('CREATE INDEX idx_analytics_timestamp ON learning_analytics(timestamp)');
    }

    if (oldVersion < 3) {
      await db.execute('ALTER TABLE vocab_card ADD COLUMN example_sentence_en TEXT');
      await db.execute('ALTER TABLE vocab_card ADD COLUMN example_sentence_ru TEXT');
    }

    if (oldVersion < 4) {
      try {
        await db.execute("ALTER TABLE user_profile ADD COLUMN current_lesson TEXT DEFAULT 'animals'");
      } catch (e) {
        // ignore if column exists
      }
      try {
        await db.execute("ALTER TABLE user_profile ADD COLUMN is_onboarding_completed INTEGER DEFAULT 0");
      } catch (e) {
        // ignore if column exists
      }
    }
  }

  Future<void> _seedDatabase(Database db) async {
    // 1. Default user profiles placeholder for first initiation
    await db.rawInsert('''
      INSERT INTO user_profile (child_name, age_bracket, hero_buddie_id, last_active_timestamp, four_digit_pin)
      VALUES ('Исследователь', 2, 'milo', ${DateTime.now().millisecondsSinceEpoch}, '1234')
    ''');

    // 2. Static vocabulary seed matching standard SRS lessons
    final List<Map<String, dynamic>> initialCards = [];

    final animalsRaw = [
      ['dog', 'Dog', 'Собака', 'dɒɡ'],
      ['cat', 'Cat', 'Кошка', 'kæt'],
      ['rabbit', 'Rabbit', 'Кролик', 'ˈræb.ɪt'],
      ['mouse', 'Mouse', 'Мышь', 'maʊs'],
      ['horse', 'Horse', 'Лошадь', 'hɔːs'],
      ['cow', 'Cow', 'Корова', 'kaʊ'],
      ['sheep', 'Sheep', 'Овца', 'ʃiːp'],
      ['pig', 'Pig', 'Свинья', 'pɪɡ'],
      ['chicken', 'Chicken', 'Курица', 'ˈtʃɪk.ɪn'],
      ['duck', 'Duck', 'Утка', 'dʌk'],
      ['lion', 'Lion', 'Лев', 'ˈlaɪ.ən'],
      ['tiger', 'Tiger', 'Тигр', 'ˈtaɪ.ɡər'],
      ['bear', 'Bear', 'Медведь', 'beər'],
      ['monkey', 'Monkey', 'Обезьяна', 'ˈmʌŋ.ki'],
      ['elephant', 'Elephant', 'Слон', 'ˈel.ɪ.fənt'],
      ['giraffe', 'Giraffe', 'Жираф', 'dʒɪˈrɑːf'],
      ['zebra', 'Zebra', 'Зебра', 'ˈzeb.rə'],
      ['fox', 'Fox', 'Лиса', 'fɒks'],
      ['wolf', 'Wolf', 'Волк', 'wʊlf'],
      ['frog', 'Frog', 'Лягушка', 'frɒɡ'],
      ['fish', 'Fish', 'Рыба', 'fɪʃ'],
      ['bird', 'Bird', 'Птица', 'bɜːd'],
      ['penguin', 'Penguin', 'Пингвин', 'ˈpeŋ.ɡwɪn'],
      ['owl', 'Owl', 'Сова', 'aʊl'],
      ['deer', 'Deer', 'Олень', 'dɪər'],
      ['squirrel', 'Squirrel', 'Белка', 'ˈskwɪr.əl'],
      ['snake', 'Snake', 'Змея', 'sneɪk'],
      ['turtle', 'Turtle', 'Черепаха', 'ˈtɜː.təl'],
      ['whale', 'Whale', 'Кит', 'weɪl'],
      ['dolphin', 'Dolphin', 'Дельфин', 'ˈdɒl.fɪn'],
      ['shark', 'Shark', 'Акула', 'ʃɑːk'],
      ['bee', 'Bee', 'Пчела', 'biː'],
      ['spider', 'Spider', 'Паук', 'ˈspaɪ.dər'],
      ['ant', 'Ant', 'Муравей', 'ænt'],
      ['butterfly', 'Butterfly', 'Бабочка', 'ˈbʌt.ə.flaɪ'],
      ['goat', 'Goat', 'Коза', 'ɡəʊt'],
      ['donkey', 'Donkey', 'Осел', 'ˈdɒŋ.ki'],
      ['camel', 'Camel', 'Верблюд', 'ˈkæm.əl'],
      ['kangaroo', 'Kangaroo', 'Кенгуру', 'ˌkæŋ.ɡərˈuː'],
      ['panda', 'Panda', 'Панда', 'ˈpæn.də'],
      ['koala', 'Koala', 'Коала', 'kəʊˈɑː.lə'],
      ['hippo', 'Hippo', 'Бегемот', 'ˈhɪp.əʊ'],
      ['rhino', 'Rhino', 'Носорог', 'ˈraɪ.nəʊ'],
      ['crocodile', 'Crocodile', 'Крокодил', 'ˈkrɒk.ə.daɪl'],
      ['parrot', 'Parrot', 'Попугай', 'ˈpær.ət'],
      ['eagle', 'Eagle', 'Орел', 'ˈiː.ɡəl'],
      ['crab', 'Crab', 'Краб', 'kræb'],
      ['octopus', 'Octopus', 'Осьминог', 'ˈɒk.tə.pəs'],
      ['snail', 'Snail', 'Улитка', 'sneɪl'],
      ['hedgehog', 'Hedgehog', 'Еж', 'ˈhedʒ.hɒɡ']
    ];

    final foodRaw = [
      ['apple', 'Apple', 'Яблоко', 'ˈæp.əl'],
      ['banana', 'Banana', 'Банан', 'bəˈnɑː.nə'],
      ['bread', 'Bread', 'Хлеб', 'bred'],
      ['milk', 'Milk', 'Молоко', 'mɪlk'],
      ['cheese', 'Cheese', 'Сыр', 'tʃiːz'],
      ['egg', 'Egg', 'Яйцо', 'eɡ'],
      ['butter', 'Butter', 'Сливочное масло', 'ˈbʌt.ər'],
      ['water', 'Water', 'Вода', 'ˈwɔː.tər'],
      ['juice', 'Juice', 'Сок', 'dʒuːs'],
      ['tea', 'Tea', 'Чай', 'tiː'],
      ['coffee', 'Coffee', 'Кофе', 'ˈmɒf.i'],
      ['cake', 'Cake', 'Торт', 'keɪk'],
      ['cookie', 'Cookie', 'Печенье', 'ˈkʊk.i'],
      ['chocolate', 'Chocolate', 'Шоколад', 'ˈtʃɒk.lət'],
      ['ice_cream', 'Ice Cream', 'Мороженое', 'ˌaɪs ˈkriːm'],
      ['honey', 'Honey', 'Мед', 'ˈhʌn.i'],
      ['soup', 'Soup', 'Суп', 'suːp'],
      ['salad', 'Salad', 'Салат', 'ˈsæl.əd'],
      ['meat', 'Meat', 'Мясо', 'miːt'],
      ['chicken_food', 'Chicken', 'Курица (еда)', 'ˈtʃɪk.ɪn'],
      ['fish_food', 'Fish', 'Рыба (еда)', 'fɪʃ'],
      ['rice', 'Rice', 'Рис', 'raɪs'],
      ['pasta', 'Pasta', 'Паста', 'ˈpæs.tə'],
      ['potato', 'Potato', 'Картофель', 'pəˈteɪ.təʊ'],
      ['tomato', 'Tomato', 'Помидор', 'təˈmɑː.təʊ'],
      ['onion', 'Onion', 'Лук', 'ˈʌn.jən'],
      ['garlic', 'Garlic', 'Чеснок', 'ˈɡɑː.lɪk'],
      ['carrot', 'Carrot', 'Морковь', 'ˈkær.ət'],
      ['cucumber', 'Cucumber', 'Огурец', 'ˈkjuː.kʌm.bər'],
      ['orange', 'Orange', 'Апельсин', 'ˈɒr.ɪndʒ'],
      ['lemon', 'Lemon', 'Лимон', 'ˈlem.ən'],
      ['strawberry', 'Strawberry', 'Клубника', 'ˈstrɔː.bər.i'],
      ['grape', 'Grape', 'Виноград', 'ɡreɪp'],
      ['watermelon', 'Watermelon', 'Арбуз', 'ˈwɔː.tə.mel.ən'],
      ['peach', 'Peach', 'Персик', 'piːtʃ'],
      ['pear', 'Pear', 'Груша', 'peər'],
      ['plum', 'Plum', 'Слива', 'plʌm'],
      ['cherry', 'Cherry', 'Вишня', 'ˈtʃer.i'],
      ['nut', 'Nut', 'Орех', 'nʌt'],
      ['salt', 'Salt', 'Соль', 'sɔːlt'],
      ['pepper', 'Pepper', 'Перец', 'ˈpep.ər'],
      ['sugar', 'Sugar', 'Сахар', 'ˈʃʊɡ.ər'],
      ['oil', 'Oil', 'Масло', 'ɔɪl'],
      ['sandwich', 'Sandwich', 'Бутерброд', 'ˈsæn.wɪdʒ'],
      ['pizza', 'Pizza', 'Пицца', 'ˈpiːt.sə'],
      ['burger', 'Burger', 'Бургер', 'ˈbɜː.ɡər'],
      ['sausage', 'Sausage', 'Колбаса', 'ˈsɒs.ɪdʒ'],
      ['yogurt', 'Yogurt', 'Йогурт', 'ˈjɒɡ.ət'],
      ['cottage_cheese', 'Cottage Cheese', 'Творог', 'ˈkɒt.ɪdʒ tʃiːz'],
      ['pancake', 'Pancake', 'Блин', 'ˈpæn.keɪk']
    ];

    final colorsRaw = [
      ['red', 'Red', 'Красный', 'red'],
      ['green', 'Green', 'Зеленый', 'ɡriːn'],
      ['blue', 'Blue', 'Синий', 'bluː'],
      ['yellow', 'Yellow', 'Желтый', 'ˈjel.əʊ'],
      ['orange_color', 'Orange', 'Оранжевый', 'ˈɒr.ɪndʒ'],
      ['purple', 'Purple', 'Фиолетовый', 'ˈpɜː.pəl'],
      ['pink', 'Pink', 'Розовый', 'pɪŋk'],
      ['brown', 'Brown', 'Коричневый', 'braʊn'],
      ['black', 'Black', 'Черный', 'blæk'],
      ['white', 'White', 'Белый', 'waɪt'],
      ['gray', 'Gray', 'Серый', 'ɡreɪ'],
      ['gold', 'Gold', 'Золотой', 'ɡəʊld'],
      ['silver', 'Silver', 'Серебряный', 'ˈsɪl.vər'],
      ['beige', 'Beige', 'Бежевый', 'beɪʒ'],
      ['turquoise', 'Turquoise', 'Бирюзовый', 'ˈtɜː.kwɔɪz'],
      ['violet', 'Violet', 'Светло-фиолетовый', 'ˈvaɪə.lət'],
      ['indigo', 'Indigo', 'Индиго', 'ˈɪn.dɪ.ɡəʊ'],
      ['magenta', 'Magenta', 'Пурпурный', 'məˈdʒen.tə'],
      ['bronze', 'Bronze', 'Бронзовый', 'brɒnz'],
      ['peach_color', 'Peach', 'Персиковый', 'piːtʃ']
    ];

    final familyRaw = [
      ['mother', 'Mother', 'Мама', 'ˈmʌð.ər'],
      ['father', 'Father', 'Папа', 'ˈfɑː.ðər'],
      ['brother', 'Brother', 'Брат', 'ˈbrʌð.ər'],
      ['sister', 'Sister', 'Сестра', 'ˈsɪs.tər'],
      ['grandmother', 'Grandmother', 'Бабушка', 'ˈɡræn.mʌð.ər'],
      ['grandfather', 'Grandfather', 'Дедушка', 'ˈɡræn.fɑː.ðər'],
      ['son', 'Son', 'Сын', 'sʌn'],
      ['daughter', 'Daughter', 'Дочь', 'ˈdɔː.tər'],
      ['baby', 'Baby', 'Младенец', 'ˈbeɪ.bi'],
      ['uncle', 'Uncle', 'Дядя', 'ˈʌŋ.kəl'],
      ['aunt', 'Aunt', 'Тетя', 'ɑːnt'],
      ['cousin', 'Cousin', 'Двоюродный брат/сестра', 'ˈkʌz.ən'],
      ['parents', 'Parents', 'Родители', 'ˈpeə.rənts'],
      ['children', 'Children', 'Дети', 'ˈtʃɪl.drən'],
      ['husband', 'Husband', 'Муж', 'ˈhʌz.bənd'],
      ['wife', 'Wife', 'Жена', 'waɪf'],
      ['stepmother', 'Stepmother', 'Мачеха', 'ˈstep.mʌð.ər'],
      ['stepfather', 'Stepfather', 'Отчим', 'ˈstep.fɑː.ðər'],
      ['stepbrother', 'Stepbrother', 'Сводный брат', 'ˈstep.brʌð.ər'],
      ['stepsister', 'Stepsister', 'Сводная сестра', 'ˈstep.sɪs.tər'],
      ['grandson', 'Grandson', 'Внук', 'ˈɡræn.sʌn'],
      ['granddaughter', 'Granddaughter', 'Внучка', 'ˈɡræn.dɔː.tər'],
      ['nephew', 'Nephew', 'Племянник', 'ˈnef.juː'],
      ['niece', 'Niece', 'Племянница', 'niːs'],
      ['family_word', 'Family', 'Семья', 'ˈfæm.əl.i'],
      ['twins', 'Twins', 'Близнецы', 'twɪnz'],
      ['relative', 'Relative', 'Родственник', 'ˈrel.ə.tɪv'],
      ['newborn', 'Newborn', 'Новорожденный', 'ˈnjuː.bɔːn'],
      ['toddler', 'Toddler', 'Малыш (ясельный)', 'ˈtɒd.lər'],
      ['teenager', 'Teenager', 'Подросток', 'ˈtiːn.eɪ.dʒər'],
      ['adult', 'Adult', 'Взрослый', 'ˈæd.ʌlt'],
      ['child', 'Child', 'Ребенок', 'tʃaɪld'],
      ['guardian', 'Guardian', 'Опекун', 'ˈɡɑː.di.ən'],
      ['sibling', 'Sibling', 'Брат или сестра', 'ˈsɪb.lɪŋ'],
      ['generation', 'Generation', 'Поколение', 'ˌdʒen.əˈreɪ.ʃən'],
      ['ancestor', 'Ancestor', 'Предок', 'ˈæn.ses.tər'],
      ['descendant', 'Descendant', 'Потомок', 'dɪˈsen.dənt'],
      ['bride', 'Bride', 'Невеста', 'braɪd'],
      ['groom', 'Groom', 'Жених', 'ɡruːm'],
      ['marriage', 'Marriage', 'Брак', 'ˈmær.ɪdʒ'],
      ['wedding', 'Wedding', 'Свадьба', 'ˈwed.ɪŋ'],
      ['relative_in_law', 'In-law', 'Родственник по закону', 'ɪn_lɔː'],
      ['foster_parent', 'Foster Parent', 'Приемный родитель', 'ˈfɒs.tər ˈpeə.rənt'],
      ['godmother', 'Godmother', 'Крестная мать', 'ˈɡɒd.mʌð.ər'],
      ['godfather', 'Godfather', 'Крестный отец', 'ˈɡɒd.fɑː.ðər'],
      ['godson', 'Godson', 'Крестник', 'ˈɡɒd.sʌn'],
      ['goddaughter', 'Goddaughter', 'Крестница', 'ˈɡɒd.dɔː.tər'],
      ['infancy', 'Infancy', 'Младенчество', 'ˈɪn.fən.si'],
      ['youth', 'Youth', 'Юность', 'juːθ'],
      ['elder', 'Elder', 'Старший', 'ˈel.dər']
    ];

    final natureRaw = [
      ['sun', 'Sun', 'Солнце', 'sʌn'],
      ['cloud', 'Cloud', 'Облако', 'klaʊd'],
      ['rain', 'Rain', 'Дождь', 'reɪn'],
      ['wind', 'Wind', 'Ветер', 'wɪnd'],
      ['snow', 'Snow', 'Снег', 'snəʊ'],
      ['sky', 'Sky', 'Небо', 'skaɪ'],
      ['star_nature', 'Star', 'Звезда', 'stɑːr'],
      ['moon', 'Moon', 'Луна', 'muːn'],
      ['tree', 'Tree', 'Дерево', 'triː'],
      ['flower', 'Flower', 'Цветок', 'ˈflaʊ.ər'],
      ['grass', 'Grass', 'Трава', 'ɡrɑːs'],
      ['leaf', 'Leaf', 'Лист', 'liːf'],
      ['plant', 'Plant', 'Растение', 'plɑːnt'],
      ['mountain', 'Mountain', 'Гора', 'ˈmaʊn.tɪn'],
      ['river', 'River', 'Река', 'ˈrɪv.ər'],
      ['lake', 'Lake', 'Озеро', 'leɪk'],
      ['sea', 'Sea', 'Море', 'siː'],
      ['ocean', 'Ocean', 'Океан', 'ˈəʊ.ʃən'],
      ['forest', 'Forest', 'Лес', 'ˈfɒr.ɪst'],
      ['desert', 'Desert', 'Пустыня', 'ˈdez.ət'],
      ['hill', 'Hill', 'Холм', 'hɪl'],
      ['valley', 'Valley', 'Долина', 'ˈvæl.i'],
      ['stone', 'Stone', 'Камень', 'stəʊn'],
      ['sand', 'Sand', 'Песок', 'sænd'],
      ['soil', 'Soil', 'Почва', 'sɔɪl'],
      ['fire', 'Fire', 'Огонь', 'faɪər'],
      ['ice', 'Ice', 'Лед', 'aɪs'],
      ['rock', 'Rock', 'Скала', 'rɒk'],
      ['cave', 'Cave', 'Пещера', 'keɪv'],
      ['island', 'Island', 'Остров', 'ˈaɪ.lənd'],
      ['rainbow', 'Rainbow', 'Радуга', 'ˈreɪn.bəʊ'],
      ['storm', 'Storm', 'Шторм', 'stɔːm'],
      ['lightning', 'Lightning', 'Молния', 'ˈlaɪt.nɪŋ'],
      ['thunder', 'Thunder', 'Гром', 'ˈθʌn.dər'],
      ['wave', 'Wave', 'Волна', 'weɪv'],
      ['beach', 'Beach', 'Пляж', 'biːtʃ'],
      ['garden', 'Garden', 'Сад', 'ˈɡɑː.dən'],
      ['field', 'Field', 'Поле', 'fiːld'],
      ['meadow', 'Meadow', 'Луг', 'ˈmed.əʊ'],
      ['jungle', 'Jungle', 'Джунгли', 'ˈdʒʌŋ.ɡəl'],
      ['air', 'Air', 'Воздух', 'eər'],
      ['nature_word', 'Nature', 'Природа', 'ˈneɪ.tʃər'],
      ['volcano', 'Volcano', 'Вулкан', 'vɒlˈkeɪ.nəʊ'],
      ['waterfall', 'Waterfall', 'Водопад', 'ˈwɔː.tə.fɔːl'],
      ['breeze', 'Breeze', 'Легкий ветерок', 'briːz'],
      ['sunrise', 'Sunrise', 'Восход солнца', 'ˈsʌn.raɪz'],
      ['sunset', 'Sunset', 'Закат', 'ˈsʌn.set'],
      ['seasons', 'Seasons', 'Времена года', 'ˈsiː.zənz'],
      ['spring', 'Spring', 'Весна', 'sprɪŋ'],
      ['summer', 'Summer', 'Лето', 'ˈsʌm.ər']
    ];

    final schoolRaw = [
      ['school_word', 'School', 'Школа', 'skuːl'],
      ['teacher', 'Teacher', 'Учитель', 'ˈtiː.tʃər'],
      ['student', 'Student', 'Ученик', 'ˈstjuː.dənt'],
      ['book', 'Book', 'Книга', 'bʊk'],
      ['pen', 'Pen', 'Ручка', 'pen'],
      ['pencil', 'Pencil', 'Карандаш', 'ˈpen.səl'],
      ['paper', 'Paper', 'Бумага', 'ˈpeɪ.pər'],
      ['notebook', 'Notebook', 'Тетрадь', 'ˈnəʊt.bʊk'],
      ['desk', 'Desk', 'Парта', 'desk'],
      ['chair', 'Chair', 'Стул', 'tʃeər'],
      ['classroom', 'Classroom', 'Класс', 'ˈklɑːs.ruːm'],
      ['board', 'Board', 'Доска', 'bɔːd'],
      ['ruler', 'Ruler', 'Линейка', 'ˈruː.lər'],
      ['eraser', 'Eraser', 'Ластик', 'ɪˈreɪ.zər'],
      ['backpack', 'Backpack', 'Рюкзак', 'ˈbæk.pæk'],
      ['glue', 'Glue', 'Клей', 'ɡluː'],
      ['scissors', 'Scissors', 'Ножницы', 'ˈsɪz.əz'],
      ['computer', 'Computer', 'Компьютер', 'kəmˈpjuː.tər'],
      ['library', 'Library', 'Библиотека', 'ˈlaɪ.brər.i'],
      ['map_school', 'Map', 'Карта', 'mæp'],
      ['globe', 'Globe', 'Глобус', 'ɡəʊb'],
      ['clock_school', 'Clock', 'Часы', 'klɒk'],
      ['bell', 'Bell', 'Звонок', 'bel'],
      ['lesson', 'Lesson', 'Урок', 'ˈles.ən'],
      ['homework', 'Homework', 'Домашнее задание', 'ˈhəʊm.wɜːk'],
      ['exam', 'Exam', 'Экзамен', 'ɪɡˈzæm'],
      ['grade', 'Grade', 'Оценка', 'ɡreɪd'],
      ['test_school', 'Test', 'Тест', 'test'],
      ['recess', 'Recess', 'Перемена', 'rɪˈses'],
      ['calendar', 'Calendar', 'Календарь', 'ˈkæl.ən.dər'],
      ['marker', 'Marker', 'Маркер', 'ˈmɑː.kər'],
      ['sharpener', 'Sharpener', 'Точилка', 'ˈʃɑːp.nər'],
      ['chalk', 'Chalk', 'Мел', 'tʃɔːk'],
      ['dictionary', 'Dictionary', 'Словарь', 'ˈdɪk.ʃən.ər.i'],
      ['calculator', 'Calculator', 'Калькулятор', 'ˈkæl.kjə.leɪ.tər'],
      ['uniform', 'Uniform', 'Школьная форма', 'ˈjuː.nɪ.fɔːm'],
      ['principal', 'Principal', 'Директор', 'ˈprɪn.sə.pəl'],
      ['subject', 'Subject', 'Предмет', 'ˈsʌb.dʒekt'],
      ['history', 'History', 'История', 'ˈhɪs.tər.i'],
      ['science', 'Science', 'Наука', 'ˈsaɪ.əns'],
      ['art_school', 'Art', 'Рисование', 'ɑːt'],
      ['music_school', 'Music', 'Музыка', 'ˈmjuː.zɪk'],
      ['gym', 'Gym', 'Спортзал', 'dʒɪm'],
      ['playground', 'Playground', 'Игровая площадка', 'ˈpleɪ.ɡraʊnd'],
      ['paint', 'Paint', 'Краска', 'peɪnt'],
      ['brush', 'Brush', 'Кисть', 'brʌʃ'],
      ['folder', 'Folder', 'Папка', 'ˈfəʊl.dər'],
      ['desk_lamp', 'Desk Lamp', 'Настольная лампа', 'desk wrap'],
      ['compass', 'Compass', 'Циркуль', 'ˈkʌm.pəs'],
      ['project', 'Project', 'Проект', 'ˈprɒdʒ.ekt']
    ];

    final clothesRaw = [
      ['shirt', 'Shirt', 'Рубашка', 'ʃɜːt'],
      ['t-shirt', 'T-shirt', 'Футболка', 'ˈtiː.ʃɜːt'],
      ['pants', 'Pants', 'Брюки', 'pænts'],
      ['jeans', 'Jeans', 'Джинсы', 'dʒiːnz'],
      ['dress', 'Dress', 'Платье', 'dres'],
      ['skirt', 'Skirt', 'Юбка', 'skɜːt'],
      ['coat', 'Coat', 'Пальто', 'kəʊt'],
      ['jacket', 'Jacket', 'Куртка', 'ˈdʒæk.ɪt'],
      ['sweater', 'Sweater', 'Свитер', 'ˈswet.ər'],
      ['socks', 'Socks', 'Носки', 'sɒks'],
      ['shoes', 'Shoes', 'Обувь', 'ʃuːz'],
      ['boots', 'Boots', 'Сапоги', 'buːts'],
      ['hat', 'Hat', 'Шляпа', 'hæt'],
      ['cap', 'Cap', 'Кепка', 'kæp'],
      ['gloves', 'Gloves', 'Перчатки', 'ɡlʌvz'],
      ['scarf', 'Scarf', 'Шарф', 'skɑːf'],
      ['belt', 'Belt', 'Ремень', 'belt'],
      ['tie', 'Tie', 'Галстук', 'taɪ'],
      ['pajamas', 'Pajamas', 'Пижама', 'pəˈdʒɑː.məz'],
      ['shorts', 'Shorts', 'Шорты', 'ʃɔːts'],
      ['suit', 'Suit', 'Костюм', 'suːt'],
      ['swimsuit', 'Swimsuit', 'Купальник', 'ˈswɪm.suːt'],
      ['slippers', 'Slippers', 'Тапочки', 'ˈslɪp.əz'],
      ['sneakers', 'Sneakers', 'Кроссовки', 'ˈsniː.kəz'],
      ['umbrella_clothes', 'Umbrella', 'Зонт', 'ʌmˈbrel.ə'],
      ['glasses', 'Glasses', 'Очки', 'ˈɡlɑː.sɪz'],
      ['watch', 'Watch', 'Наручные часы', 'wɒtʃ'],
      ['ring', 'Ring', 'Кольцо', 'rɪŋ'],
      ['necklace', 'Necklace', 'Ожерелье', 'ˈnek.ləs'],
      ['earrings', 'Earrings', 'Серьги', 'ˈɪə.rɪŋz'],
      ['bag', 'Bag', 'Сумка', 'bæɡ'],
      ['wallet', 'Wallet', 'Кошелек', 'ˈwɒl.ɪt'],
      ['pocket', 'Pocket', 'Карман', 'ˈpɒk.ɪt'],
      ['button_clothes', 'Button', 'Пуговица', 'ˈbʌt.ən'],
      ['zipper', 'Zipper', 'Молния', 'ˈzɪp.ər'],
      ['collar', 'Collar', 'Воротник', 'ˈkɒl.ər'],
      ['sleeve', 'Sleeve', 'Рукав', 'sliːv'],
      ['hood', 'Hood', 'Капюшон', 'hʊd'],
      ['vest', 'Vest', 'Жилет', 'vest'],
      ['raincoat', 'Raincoat', 'Дождевик', 'ˈreɪn.kəʊ'],
      ['cardigan', 'Cardigan', 'Кардиган', 'ˈkɑː.dɪ.ɡən'],
      ['blouse', 'Blouse', 'Блузка', 'blaʊz'],
      ['scarf_head', 'Head Scarf', 'Платок', 'hed skɑːf'],
      ['boots_winter', 'Winter Boots', 'Зимние сапоги', 'ˈwɪn.tər buːts'],
      ['sandals', 'Sandals', 'Сандалии', 'ˈsæn.dəlz'],
      ['bow_tie', 'Bow Tie', 'Галстук-бабочка', 'ˌbəʊ ˈtaɪ'],
      ['uniform_clothes', 'Uniform', 'Форма', 'ˈjuː.nɪ.fɔːm'],
      ['hanger', 'Hanger', 'Вешалка', 'ˈhæŋ.ər'],
      ['mirror', 'Mirror', 'Зеркало', 'ˈmɪr.ər'],
      ['drawer', 'Drawer', 'Ящик', 'drɔː']
    ];

    final transportRaw = [
      ['car', 'Car', 'Машина', 'kɑːr'],
      ['bus', 'Bus', 'Автобус', 'bʌs'],
      ['train', 'Train', 'Поезд', 'treɪn'],
      ['plane', 'Plane', 'Самолет', 'pleɪn'],
      ['bicycle', 'Bicycle', 'Велосипед', 'ˈbaɪ.sɪ.kəl'],
      ['motorcycle', 'Motorcycle', 'Мотоцикл', 'ˈməʊ.tə.saɪ.kəl'],
      ['boat', 'Boat', 'Лодка', 'bəʊt'],
      ['ship', 'Ship', 'Корабль', 'ʃɪp'],
      ['helicopter', 'Helicopter', 'Вертолет', 'ˈhel.ɪ.ˌkɒp.tər'],
      ['truck', 'Truck', 'Грузовик', 'trʌk'],
      ['taxi', 'Taxi', 'Такси', 'ˈtæk.si'],
      ['subway', 'Subway', 'Метро', 'ˈsʌb.weɪ'],
      ['tram', 'Tram', 'Трамвай', 'træm'],
      ['scooter', 'Scooter', 'Самокат', 'ˈskuː.tər'],
      ['tractor', 'Tractor', 'Трактор', 'ˈtræk.tər'],
      ['ambulance', 'Ambulance', 'Скорая помощь', 'ˈæm.bjə.ləns'],
      ['fire_engine', 'Fire Engine', 'Пожарная машина', 'ˈfaɪər ˌen.dʒɪn'],
      ['police_car', 'Police Car', 'Полицейская машина', 'pəˈliːs kɑː'],
      ['rocket', 'Rocket', 'Ракета', 'ˈrɒk.ɪt'],
      ['balloon_hot', 'Hot Air Balloon', 'Воздушный шар', 'hɒt eər bəˈluːn'],
      ['yacht', 'Yacht', 'Яхта', 'jɒt'],
      ['submarine', 'Submarine', 'Подводная лодка', 'ˌsʌb.məˈriːn'],
      ['van', 'Van', 'Фургон', 'væn'],
      ['ferry', 'Ferry', 'Паром', 'ˈfer.i'],
      ['cable_car', 'Cable Car', 'Канатная дорога', 'ˈkeɪ.bəl kɑː'],
      ['skateboard', 'Skateboard', 'Скейтборд', 'ˈskeɪt.bɔːd'],
      ['carriage', 'Carriage', 'Карета', 'ˈkær.ɪdʒ'],
      ['sled', 'Sled', 'Сани', 'sled'],
      ['jet', 'Jet', 'Реактивный самолет', 'dʒet'],
      ['cruise_ship', 'Cruise Ship', 'Круизный лайнер', 'kruːz ʃɪp'],
      ['wheel', 'Wheel', 'Колесо', 'wiːl'],
      ['engine', 'Engine', 'Двигатель', 'ˈen.dʒɪn'],
      ['tire', 'Tire', 'Шина', 'taɪər'],
      ['helmet', 'Helmet', 'Шлем', 'ˈhel.mət'],
      ['road', 'Road', 'Дорога', 'rəʊd'],
      ['street', 'Street', 'Улица', 'striːt'],
      ['bridge', 'Bridge', 'Мост', 'brɪdʒ'],
      ['station', 'Station', 'Станция', 'ˈsteɪ.ʃən'],
      ['airport', 'Airport', 'Аэропорт', 'ˈeə.pɔːt'],
      ['harbor', 'Harbor', 'Порт', 'ˈhɑː.bər'],
      ['track_rails', 'Rails', 'Рельсы', 'reɪlz'],
      ['ticket', 'Ticket', 'Билет', 'ˈtɪk.ɪt'],
      ['passenger', 'Passenger', 'Пассажир', 'ˈpæs.ən.dʒər'],
      ['driver', 'Driver', 'Водитель', 'ˈdraɪ.vər'],
      ['pilot', 'Pilot', 'Пилот', 'ˈpaɪ.lət'],
      ['gasoline', 'Gasoline', 'Бензин', 'ˈɡæs.əl.iːn'],
      ['traffic_light', 'Traffic Light', 'Светофор', 'ˈtræf.ɪk laɪt'],
      ['sign_road', 'Road Sign', 'Дорожный знак', 'rəʊd saɪn'],
      ['garage', 'Garage', 'Гараж', 'ˈɡær.ɑːʒ'],
      ['journey', 'Journey', 'Путешествие', 'ˈdʒɜː.ni']
    ];

    final verbsRaw = [
      ['run', 'Run', 'Бежать', 'rʌn'],
      ['walk', 'Walk', 'Ходить', 'wɔːk'],
      ['jump', 'Jump', 'Прыгать', 'dʒʌmp'],
      ['fly', 'Fly', 'Летать', 'flaɪ'],
      ['swim', 'Swim', 'Плавать', 'swɪm'],
      ['read', 'Read', 'Читать', 'riːd'],
      ['write', 'Write', 'Писать', 'raɪt'],
      ['sleep', 'Sleep', 'Спать', 'sliːp'],
      ['eat', 'Eat', 'Есть', 'iːt'],
      ['drink', 'Drink', 'Пить', 'drɪŋk'],
      ['sing', 'Sing', 'Петь', 'sɪŋ'],
      ['dance', 'Dance', 'Танцевать', 'dɑːns'],
      ['play', 'Play', 'Играть', 'pleɪ'],
      ['speak', 'Speak', 'Говорить', 'spiːk'],
      ['listen', 'Listen', 'Слушать', 'ˈlɪs.ən'],
      ['look', 'Look', 'Смотреть', 'lʊk'],
      ['see', 'See', 'Видеть', 'siː'],
      ['hear', 'Hear', 'Слышать', 'hɪər'],
      ['think', 'Think', 'Думать', 'θɪŋk'],
      ['learn', 'Learn', 'Учиться', 'lɜːn'],
      ['teach', 'Teach', 'Обучать', 'tiːtʃ'],
      ['draw', 'Draw', 'Рисовать', 'drɔː'],
      ['paint_verb', 'Paint', 'Красить', 'peɪnt'],
      ['open', 'Open', 'Открывать', 'ˈəʊ.pən'],
      ['close', 'Close', 'Закрывать', 'kləʊz'],
      ['smile', 'Smile', 'Улыбаться', 'smaɪl'],
      ['laugh', 'Laugh', 'Смеяться', 'lɑːf'],
      ['cry', 'Cry', 'Плакать', 'kraɪ'],
      ['wash', 'Wash', 'Мыть', 'wɒʃ'],
      ['clean', 'Clean', 'Чистить', 'kliːn'],
      ['cook_verb', 'Cook', 'Готовить', 'kʊk'],
      ['bake', 'Bake', 'Выпекать', 'beɪk'],
      ['sit', 'Sit', 'Сидеть', 'sɪt'],
      ['stand', 'Stand', 'Стоять', 'stænd'],
      ['climb', 'Climb', 'Взбираться', 'klaɪm'],
      ['drive_verb', 'Drive', 'Водить', 'draɪv'],
      ['ride', 'Ride', 'Скакать', 'raɪd'],
      ['build', 'Build', 'Строить', 'bɪld'],
      ['make', 'Make', 'Делать', 'meɪk'],
      ['do', 'Do', 'Делать', 'duː'],
      ['give', 'Give', 'Давать', 'ɡɪv'],
      ['take', 'Take', 'Брать', 'teɪk'],
      ['bring', 'Bring', 'Приносить', 'brɪŋ'],
      ['buy', 'Buy', 'Покупать', 'baɪ'],
      ['sell', 'Sell', 'Продавать', 'sel'],
      ['help', 'Help', 'Помогать', 'help'],
      ['love', 'Love', 'Любить', 'lʌv'],
      ['like', 'Like', 'Нравиться', 'laɪk'],
      ['show', 'Show', 'Показывать', 'ʃəʊ'],
      ['hide', 'Hide', 'Прятать', 'haɪd'],
      ['find', 'Find', 'Находить', 'faɪnd'],
      ['lose', 'Lose', 'Терять', 'luːz'],
      ['begin', 'Begin', 'Начинать', 'bɪˈɡɪn'],
      ['end_verb', 'End', 'Заканчивать', 'end'],
      ['ask', 'Ask', 'Спрашивать', 'ɑːsk'],
      ['answer', 'Answer', 'Отвечать', 'ˈɑːn.sər'],
      ['call', 'Call', 'Звонить', 'kɔːl'],
      ['send', 'Send', 'Отправлять', 'send'],
      ['receive', 'Receive', 'Получать', 'rɪˈsiːv'],
      ['throw', 'Throw', 'Бросать', 'θrəʊ'],
      ['catch', 'Catch', 'Ловить', 'kætʃ'],
      ['push', 'Push', 'Толкать', 'pʊʃ'],
      ['pull', 'Pull', 'Тянуть', 'pʊl'],
      ['fall', 'Fall', 'Падать', 'fɔːl'],
      ['cut', 'Cut', 'Резать', 'kʌt'],
      ['count', 'Count', 'Считать', 'kaʊnt'],
      ['choose', 'Choose', 'Выбирать', 'tʃuːz'],
      ['wait', 'Wait', 'Ждать', 'weɪt'],
      ['stop', 'Stop', 'Останавливать', 'stɒp'],
      ['go', 'Go', 'Идти', 'ɡəʊ'],
      ['come', 'Come', 'Приходить', 'kʌm'],
      ['live', 'Live', 'Жить', 'lɪv'],
      ['die', 'Die', 'Умирать', 'daɪ'],
      ['try', 'Try', 'Пытаться', 'traɪ'],
      ['win', 'Win', 'Побеждать', 'wɪn'],
      ['feel', 'Feel', 'Чувствовать', 'fiːl'],
      ['touch', 'Touch', 'Трогать', 'tʌtʃ'],
      ['push_button', 'Push', 'Нажимать', 'pʊʃ'],
      ['drag', 'Drag', 'Тащить', 'dræg'],
      ['shake', 'Shake', 'Трясти', 'ʃeɪk']
    ];

    Map<String, String> generateExampleSentences(String category, String english, String russian) {
      final engLower = english.toLowerCase();
      final ruLower = russian.toLowerCase();

      switch (category) {
        case 'animals':
          return {
            'en': 'Look, this is a cute $engLower!',
            'ru': 'Смотри, это милый зверёк: $ruLower!',
          };
        case 'food':
          return {
            'en': 'I love to eat delicious $engLower.',
            'ru': 'Мне очень нравится кушать это: $ruLower.',
          };
        case 'colors':
          return {
            'en': 'Look, this beautiful color is $engLower!',
            'ru': 'Посмотри, этот красивый цвет — $ruLower!',
          };
        case 'family':
          return {
            'en': 'I love my precious $engLower!',
            'ru': 'Я очень сильно люблю мою семью и этого человека: $ruLower!',
          };
        case 'nature':
          return {
            'en': 'We can explore beautiful $engLower in nature.',
            'ru': 'В природе мы можем увидеть это замечательное явление: $ruLower.',
          };
        case 'school':
          return {
            'en': 'We use a $engLower in our classroom lessons.',
            'ru': 'Мы используем этот предмет на уроках в школе: $ruLower.',
          };
        case 'clothes':
          return {
            'en': 'I like to wear my clean $engLower.',
            'ru': 'Мне нравится носить это: $ruLower.',
          };
        case 'transport':
          return {
            'en': 'We can travel and move around using a $engLower.',
            'ru': 'Мы можем путешествовать и передвигаться, используя это: $ruLower.',
          };
        case 'verbs':
          return {
            'en': 'Let us $engLower together today!',
            'ru': 'Давай будем вместе делать это: $ruLower!',
          };
        case 'numbers':
          return {
            'en': 'Let us count up and find the number $engLower!',
            'ru': 'Давай посчитаем и найдём это число: $ruLower!',
          };
        default:
          return {
            'en': 'This is a $engLower.',
            'ru': 'Это $ruLower.',
          };
      }
    }

    void addRawCards(String category, List<List<String>> rawList) {
      for (int i = 0; i < rawList.length; i++) {
        final item = rawList[i];
        final id = item[0];
        final english = item[1];
        final russian = item[2];
        final phonetic = item[3];
        final rank = (i < rawList.length ~/ 3) ? 1 : (i < 2 * rawList.length ~/ 3) ? 2 : 3;
        final examples = generateExampleSentences(category, english, russian);
        initialCards.add({
          'id': 'v_${category}_$id',
          'module_category': category,
          'difficulty_rank': rank,
          'english_word': english,
          'russian_translation': russian,
          'phonetic_transcription': '[$phonetic]',
          'audio_path_identifier': 'audio/$id.ogg',
          'image_asset_identifier': 'images/$id.webp',
          'example_sentence_en': examples['en'],
          'example_sentence_ru': examples['ru'],
        });
      }
    }

    addRawCards('animals', animalsRaw);
    addRawCards('food', foodRaw);
    addRawCards('colors', colorsRaw);
    addRawCards('family', familyRaw);
    addRawCards('nature', natureRaw);
    addRawCards('school', schoolRaw);
    addRawCards('clothes', clothesRaw);
    addRawCards('transport', transportRaw);
    addRawCards('verbs', verbsRaw);

    final List<String> units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    final List<String> teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    final List<String> tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    final List<String> unitsRu = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
    final List<String> teensRu = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
    final List<String> tensRu = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];

    final List<String> unitsTrans = ['', 'wʌn', 'tuː', 'θriː', 'fɔːr', 'faɪv', 'sɪks', 'ˈsev.ən', 'eɪt', 'naɪn'];
    final List<String> teensTrans = ['ten', 'ɪˈlev.ən', 'twelv', 'ˌθɜːˈtiːn', 'ˌfɔːˈtiːn', 'ˌfɪfˈtiːn', 'ˌsɪkˈtiːn', 'ˌsev.ənˈtiːn', 'ˌeɪˈtiːn', 'ˌnaɪnˈtiːn'];
    final List<String> tensTrans = ['', '', 'ˈtwen.ti', 'ˈθɜː.ti', 'ˈfɔː.ti', 'ˈfɪf.ti', 'ˈsɪk.sti', 'ˈsev.ən.ti', 'ˈeɪ.ti', 'ˈnaɪn.ti'];

    for (int i = 1; i <= 100; i++) {
      String eng = '';
      String ru = '';
      String trans = '';
      if (i >= 1 && i <= 9) {
        eng = units[i];
        ru = unitsRu[i];
        trans = unitsTrans[i];
      } else if (i >= 10 && i <= 19) {
        eng = teens[i - 10];
        ru = teensRu[i - 10];
        trans = teensTrans[i - 10];
      } else if (i >= 20 && i <= 99) {
        int tensDigit = i ~/ 10;
        int unitsDigit = i % 10;
        if (unitsDigit == 0) {
          eng = tens[tensDigit];
          ru = tensRu[tensDigit];
          trans = tensTrans[tensDigit];
        } else {
          eng = '${tens[tensDigit]}-${units[unitsDigit]}';
          ru = '${tensRu[tensDigit]} ${unitsRu[unitsDigit]}';
          trans = '${tensTrans[tensDigit]}-${unitsTrans[unitsDigit]}';
        }
      } else if (i == 100) {
        eng = 'one hundred';
        ru = 'сто';
        trans = 'wʌn ˈhʌn.drəd';
      }
      
      eng = eng[0].toUpperCase() + eng.substring(1);
      ru = ru[0].toUpperCase() + ru.substring(1);

      final rank = (i <= 33) ? 1 : (i <= 66) ? 2 : 3;
      final examples = generateExampleSentences('numbers', eng, ru);
      initialCards.add({
        'id': 'v_numbers_num_$i',
        'module_category': 'numbers',
        'difficulty_rank': rank,
        'english_word': eng,
        'russian_translation': ru,
        'phonetic_transcription': '[$trans]',
        'audio_path_identifier': 'audio/num_$i.ogg',
        'image_asset_identifier': 'images/num_$i.webp',
        'example_sentence_en': examples['en'],
        'example_sentence_ru': examples['ru'],
      });
    }

    for (var card in initialCards) {
      await db.insert('vocab_card', card);
    }

    // 3. Populate Lesson Island Categories
    final islands = [
      'animals',
      'food',
      'colors',
      'family',
      'nature',
      'numbers',
      'school',
      'clothes',
      'transport',
      'verbs'
    ];
    for (int i = 0; i < islands.length; i++) {
      await db.insert('lesson_progress', {
        'module_category': islands[i],
        'maximum_stars_earned': 0,
        'is_completed_at_least_once': 0,
        'times_practiced': 0,
        'is_unlocked': (i == 0 || i == 1) ? 1 : 0, // Unlock animals/food by default
      });
    }

    // 4. Default achievements
    final achievements = [
      {'achievement_id': 'first_word', 'name_native': 'Первый Шаг', 'requirement_description': 'Выучите свою первую английскую карточку'},
      {'achievement_id': 'perfect_score', 'name_native': 'Отличник', 'requirement_description': 'Сдайте квест на 100% (3 Звезды)'},
      {'achievement_id': 'streak_7', 'name_native': 'Неделя Успеха', 'requirement_description': 'Поддерживайте 7-дневную серию дней активности'}
    ];
    for (var ach in achievements) {
      await db.insert('system_achievement', {
        'achievement_id': ach['achievement_id'],
        'name_native': ach['name_native'],
        'requirement_description': ach['requirement_description'],
        'is_unlocked': 0,
        'unlocked_at_timestamp': null,
      });
    }
  }

  // ============== DATABASE UTILITIES / PROFILE CRUD ===============

  Future<UserProfile?> getUserProfile() async {
    final db = await instance.database;
    final maps = await db.query('user_profile', limit: 1);
    if (maps.isNotEmpty) {
      return UserProfile.fromMap(maps.first);
    }
    return null;
  }

  Future<int> updateUserProfile(UserProfile profile) async {
    final db = await instance.database;
    return await db.update(
      'user_profile',
      profile.toMap(),
      where: 'id = ?',
      whereArgs: [profile.id],
    );
  }

  // ================= XP CALCULATION ENGINE =================

  /// Appends earned XP to user state, checking for progressive Level Ups
  /// Formula: TargetXP(L) = 100 * L^2 - 50 * L
  Future<Map<String, dynamic>> awardExperiencePoints(int gainedRawXp) async {
    final profile = await getUserProfile();
    if (profile == null) return {'leveled_up': false};

    int currentXp = profile.accumulatedXp + gainedRawXp;
    int currentLvl = profile.currentLevel;
    bool leveledUp = false;

    // Check level-up sequentially if xp surpasses calculation threshold
    while (true) {
      int neededForNext = 100 * currentLvl * currentLvl - 50 * currentLvl;
      if (currentXp >= neededForNext) {
        currentXp -= neededForNext;
        currentLvl++;
        leveledUp = true;
      } else {
        break;
      }
    }

    final updatedProfile = profile.copyWith(
      accumulatedXp: currentXp,
      currentLevel: currentLvl,
    );

    await updateUserProfile(updatedProfile);

    return {
      'leveled_up': leveledUp,
      'new_level': currentLvl,
      'current_xp': currentXp,
      'xp_needed_next': (100 * currentLvl * currentLvl - 50 * currentLvl)
    };
  }

  // ============= LOCAL RETREIVAL HELPER QUERY =============

  Future<List<VocabCard>> getCardsForModule(String moduleCategory) async {
    final db = await instance.database;
    final results = await db.query(
      'vocab_card',
      where: 'module_category = ?',
      whereArgs: [moduleCategory],
    );
    return results.map((elem) => VocabCard.fromMap(elem)).toList();
  }

  Future<void> updateLessonProgress(String moduleCategory, int starsAwarded) async {
    final db = await instance.database;
    final currentMaps = await db.query(
      'lesson_progress',
      where: 'module_category = ?',
      whereArgs: [moduleCategory],
    );

    if (currentMaps.isNotEmpty) {
      final currentObj = LessonProgress.fromMap(currentMaps.first);
      final int bestStars = currentObj.maximumStarsEarned > starsAwarded 
          ? currentObj.maximumStarsEarned 
          : starsAwarded;

      await db.update(
        'lesson_progress',
        {
          'maximum_stars_earned': bestStars,
          'is_completed_at_least_once': 1,
          'times_practiced': currentObj.timesPracticed + 1,
        },
        where: 'module_category = ?',
        whereArgs: [moduleCategory],
      );
    }
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}
