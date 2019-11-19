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
    return db
      .from('word')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.next'
        // 'language.total_score'
      )
      .join('language', 'language.id', '=', 'word.language_id')
      .where('word.language_id', language_id)
      .andWhere('language.user_id', user_id)
      .groupBy(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.next'
        // 'language.total_score'
      );
  },

  getScore(db, user_id, language_id) {
    return db
      .select('language.total_score')
      .from('language')
      .where('language.user_id', user_id)
      .andWhere('language.id', language_id)
      .first();
  },
  //update the counts
  updateCorrect(db, word_id, language_id, user_id, newCount, memVal, newNext) {
    return db('word')
      .join('language', 'language.id', '=', 'word.language_id')
      .where('word.language_id', language_id)
      .andWhere('language.user_id', user_id)
      .andWhere('word.id', word_id)
      .update({
        correct_count: newCount,
        memory_value: memVal,
        next: newNext,
      });
  },

  updateIncorrect(
    db,
    word_id,
    language_id,
    user_id,
    newCount,
    memVal,
    newNext
  ) {
    return db('word')
      .join('language', 'language.id', '=', 'word.language_id')
      .where('word.language_id', language_id)
      .andWhere('language.user_id', user_id)
      .andWhere('word.id', word_id)
      .update({
        incorrect_count: newCount,
        memory_value: memVal,
        next: `${newNext}`,
      });
  },

  updateHead(db, language_id, newHead) {
    return db('language')
      .where('language.id', language_id)
      .update({
        head: newHead,
      })
      .then(res => console.log(res))
      .catch(error => console.log(error))
  },

  updatePrev(db, user_id, language_id, prevNode, head_id) {
    return db('word')
      .join('language', 'language.id', '=', 'word.language_id')
      .where('word.language_id', language_id)
      .andWhere('word.id', prevNode)
      .update({
        next: head_id,
      });
  },

  updateTotalScore(db, user_id, newTotal) {
    return db('language')
      .where('language.user_id', user_id)
      .update({
        total_score: newTotal,
      });
  },
};

module.exports = LanguageService;
