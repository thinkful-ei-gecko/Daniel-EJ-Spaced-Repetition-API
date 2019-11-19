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

  //Have a linked list that "represents" the current stateof the db.
  //We need to use this linked list as a tool to iterate and find the values needed to update the head (language table) and the words.next(words table)
  //
  //Probably solid idea to check against the head in the linked list. Be sure to update in the db!
  //
  //We need:
  //1. The pointer for the new head (will go in the language.head column)
  //2. Since word/head is "moving", we will need a new next for it.
  //3. Also, since the head is moving, we need the location of the node that will come before it, so that we can set it's next as well.

  //Check answer
  try {
    let head = list.head.value;
    if (guess !== head.translation) {
      let newCount = head.incorrect_count + 1; //gets value for updating count
      let newMem = 1; //resets the mem val to 1
      let newHead = list.head.next; //gets pointer for new head
      let prevNode = findBefore(list, newMem); //gets the previous node to point at the relocated head.
      let newNext = prevNode.next; //the new pointer for the relocated head
      let prevNodeNext = list.head; //set the prevNode to point at the relocated head... maybe.
      console.log('show us new next');
      console.log(newNext); //should not be morgen
      console.log(prevNodeNext.value.original); //want heute
      console.log(prevNode.value.original); //
      //Call services to make updates.

      //send response object
    }
    if (guess !== head.translation) {
      let newCount = head.incorrect_count + 1; //gets value for updating count
      let newMem = head.memory_value * 2;
      let newHead = list.head.next; //gets pointer for new head
      let prevNode = findBefore(list, newMem); //gets the previous node to point at the relocated head.
      let newNext = prevNode.next; //the new pointer for the relocated head
      let prevNodeNext = list.head; //set the prevNode to point at the relocated head... maybe.

      //Call services to make updates.
      res.status(200).json('boosh');
    } //send response object
  } catch (error) {
    next(error);
  }
});

function findBefore(list, num) {
  let before = list.head;
  for (let i = 0; i < num; i++) {
    before = before.next;
  }
  return before;
}

module.exports = languageRouter;
