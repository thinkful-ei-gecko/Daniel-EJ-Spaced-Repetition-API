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

  //Gets a word by id.
  //Id = node.next id
  getWord(db, id) {
    return db
      .from('word')
      .select('*')
      .where('word.id', id);
  },

  getHeadNode(db, head) {
    return db
      .select('*')
      .from('word')
      .where('word.id', head);
  },

  getScore(db, user_id, language_id) {
    return db
      .select('language.total_score')
      .from('language')
      .where('language.user_id', user_id)
      .andWhere('language.id', language_id)
      .first();
  },

  //nextNode = id number for currentNode.next (number)
  updateNext(db, language_id, word_id, nextNode) {
    return db('word')
      .join('language', 'language.id', '=', 'word.language_id')
      .where('word.language_id', language_id)
      .andWhere('word.id', word_id)
      .update({
        next: nextNode !== null ? nextNode : null,
      });
  },

  //This function uses the inner id for current head in the linked list
  //It uses this value to point the 'head' in the language table to the correct head.
  updateHead(db, language_id, newHead) {
    return db('language')
      .where('language.id', language_id)
      .update({
        head: newHead,
      });
  },

  //memVal (number)
  //wordCorrect (number)
  //wordIncorrect (number)
  updateWord(db, language_id, word_id, memVal, wordCorrect, wordIncorrect) {
    return db('word')
      .where('word.language_id', language_id)
      .where('word.id', word_id)
      .update({
        memory_value: memVal,
        incorrect_count: wordIncorrect,
        correct_count: wordCorrect,
      });
  },

  updateTotalScore(db, language_id, user_id, newTotal) {
    return db('language')
      .where('language.user_id', user_id)
      .andWhere('language.id', language_id)
      .update({
        total_score: newTotal,
      })
      .then(res => console.log(res))
  },
};

module.exports = LanguageService;
