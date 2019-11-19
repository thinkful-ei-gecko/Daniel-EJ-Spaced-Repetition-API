const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('../LinkedList/LinkedList');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  // implement me
  try {
    const word = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.id,
      req.user.id
    );
    res.json(word);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  let { guess } = req.body;

  //validate body
  if (!guess) {
    res.status(400).json({ error: `Missing 'guess' in request body` });
  }

  //Make a linked list to use in this endpoint
  let words = await LanguageService.getAllWords(req.app.get('db'));

  const list = new LinkedList();
  //populate list
  words.forEach(word => list.insertLast(word));
  console.log(list);

  //Have a linked list that "represents" the current state of the db.
  //We need to use this linked list as a tool to iterate and find the values needed to update the head (language table) and the words.next(words table)
  //
  //Probably solid idea to check against the head in the linked list. Be sure to update in the db!

  //Check answer
  try {
    console.log('inthe try');
    const answer = await LanguageService.checkAnswer(req.app.get('db'));

    //Check answer fail
    if (guess !== answer.translation) {
      res.status(200).json('you were wrong');
    }

    //else
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
