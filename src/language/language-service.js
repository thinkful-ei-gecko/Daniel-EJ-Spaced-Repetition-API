const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getNextWord(db, language_id, user_id) {
    return db
      .from('word')
      .select(
        'word.original as nextWord',
        'language.total_score as totalScore',
        'word.correct_count as wordCorrectCount',
        'word.incorrect_count as wordIncorrectCount'
      )
      .join('language', 'language.id', '=', 'word.language_id')
      .join('users', 'users.id', '=', 'language.user_id')
      .where('users.id', user_id)
      .andWhere('word.language_id', language_id)
      .whereRaw('word.id = language.head')
      .first()
      .groupBy(
        'nextWord',
        'wordCorrectCount',
        'wordIncorrectCount',
        'totalScore'
      );
  },

  //this is a test service
  getAllWords(db, language_id, user_id) {
    return db.from('word').select('*');
  },

  //check answer
  checkAnswer(db) {
    return db
      .select('word.translation')
      .from('word')
      .join('language', 'language.id', '=', 'word.language_id')
      .whereRaw('word.id = language.head')
      .first();
  },

  //Set m value

  //update the counts
  updateCorrectCount(db, id, newCount) {
    return db('words')
      .where({ id })
      .update({
        correct_count: newCount,
      });
  },

  updateIncorrectCount(db, id, newCount) {
    return db('words')
      .join('language', 'language.id', '=', 'word.language_id')
      .where({ id })
      .update({
        incorrect_count: newCount,
      });
  },

  updateTotalScore(db, user_id, newTotal) {
    return db('language')
      .where('language.user_id', user_id)
      .update({
        total_score: newTotal,
      });
  },

  //update the total score
};

module.exports = LanguageService;
