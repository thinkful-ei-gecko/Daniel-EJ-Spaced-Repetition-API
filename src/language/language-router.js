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
  //start with the head
  let [head] = await LanguageService.getHeadNode(
    req.app.get('db'),
    req.language.head
  );

  //The next values will but updated after the guess, so list must be ordered by next
  //in subsequent calls to the endpoint.
  
  const list = new LinkedList();
  list.insertFirst(head);
  let node = list.head;
  while (node.value.next !== null) {
    let [word] = await LanguageService.getWord(
      req.app.get('db'),
      node.value.next
    );
    list.insertLast(word);
    node = node.next;
  }


  // Check answer against the list head
  try {
    //These variables used for updating list and generating response
    let llHead = list.head.value;
    let memVal;
    let isCorrect;
    let wordCountCorrect = llHead.correct_count;
    let wordCountIncorrect = llHead.incorrect_count;
    let { total_score } = await LanguageService.getScore(
      req.app.get('db'),
      req.user.id,
      req.language.id
    );

    //If guess is correct
    if (guess !== llHead.translation.toLowerCase()) {
      memVal = 1; 
      isCorrect = false; 
      wordCountIncorrect = llHead.incorrect_count + 1;
    } else {
      memVal = llHead.memory_value * 2; // doubles to send back in the list
      isCorrect = true;
      wordCountCorrect = llHead.correct_count + 1;
      total_score++;
    }

    //Move the linked list head

    let moved = llHead;
    list.removeHead();
    list.insertAt(moved, memVal);

    //update the "next" value of each node in the DB

    let currNode = list.head;
    while (currNode.next != null) {
      await LanguageService.updateNext(
        req.app.get('db'),
        req.language.id,
        currNode.value.id,
        currNode.next.value.id
      );
      currNode = currNode.next;
    }

    //Update the values associated with the current word

    await LanguageService.updateWord(
      req.app.get('db'),
      req.language.id,
      moved.id,
      memVal,
      wordCountCorrect,
      wordCountIncorrect
    );

    //Update the 'language.head' value
    await LanguageService.updateHead(
      req.app.get('db'),
      req.language.id,
      list.head.value.id //This is the inner id
    );

    //update the 'language.total_score'
    await LanguageService.updateTotalScore(
      req.app.get('db'),
      req.language.id,
      req.user.id,
      total_score
    );

    res.status(200).json({
      nextWord: list.head.value.original,
      wordCorrectCount: list.head.value.correct_count,
      wordIncorrectCount: list.head.value.incorrect_count,
      totalScore: total_score,
      answer: moved.translation,
      isCorrect: isCorrect,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
