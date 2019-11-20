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

  let words = await LanguageService.getAllWords(
    req.app.get('db'),
    req.language.id
  );

  const list = new LinkedList();
  list.insertFirst(head)
  //populate list
  words.forEach(word => {
    if (word.id !== list.head.value.id) {
      list.insertLast(word);
    }
  });

  // Check answer
  try {
    //use these for updating
    let [llHead] = list.head.value;
    let memVal;
    let isCorrect;
    let wordCountCorrect = llHead.correct_count;
    let wordCountIncorrect = llHead.incorrect_count;
    let score;

    //if incorrect
    if (guess !== llHead.translation) {
      memVal = 1; //memval sets to one if incorrect
      isCorrect = false; //obviously
      wordCountIncorrect = llHead.incorrect_count + 1;
    } else {
      memVal = llHead.memory_value * 2; // doubles to send back in the list
      isCorrect = true;
      wordCountCorrect = llHead.correct_count + 1;
    }

    //Manipulate the list and iterate over it.
console.log(JSON.stringify(list))

    console.log('THIS IS BEFORE THE HEAD IS MOVED')
    console.log(list.head)


    let moved = llHead;
    list.remove(list.head)
    list.insertAt(moved, memVal);


    console.log("THIS IS AFTER THE HEAD IS MOVED")
    console.log(list.head)

    //Trying update just the list head and the next/previous values didn't work in subsequent moves.

    let [currNode] = list.head.value;
    while (currNode.next != null) {
      await LanguageService.updateNext(
        req.app.get('db'),
        req.language.id,
        currNode.id,
        currNode.next
      );
      currNode = currNode.next
    }

    // updateWord
   
      await LanguageService.updateWord(
        req.app.get('db'),
        req.language.id,
        moved.id,
        memVal,
        wordCountCorrect,
        wordCountIncorrect
      )
     

    //update the head
    LanguageService.updateHead(
      req.app.get('db'),
      req.language.id,
      list.head.value.id
    );

    // make our response

    res.status(200).json({
      nextWord: list.head.next.value.original,
      wordCorrectCount: list.head.next.value.correct_count,
      wordIncorrectCount: list.head.next.value.incorrect_count,
      totalScore: 0,
      answer: llHead.translation,
      isCorrect: isCorrect
    });

   
  } catch (error) {
    next(error);
  }
});


module.exports = languageRouter;
