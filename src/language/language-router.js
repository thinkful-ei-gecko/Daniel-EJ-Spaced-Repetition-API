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

  //THE NEXT IS ONLY UPDATED ON THE VALUE!! Get it by the next!
  const list = new LinkedList();
  list.insertFirst(head)
  let node = list.head
  console.log(node.value.next)
  while (node.value.next !== null) {
    console.log(node.value.next)
    let [word] = await LanguageService.getWord(
      req.app.get('db'),
      node.value.next
    )
    list.insertLast(word)
    node = node.next
  }

  let words = await LanguageService.getAllWords(
    req.app.get('db'),
    req.language.id
  );

  // const list = new LinkedList();
  // list.insertFirst(head);
  // //populate list
  // words.forEach(word => {
  //   if (word.id !== head.id) {
  //     list.insertLast(word);
  //   }
  // });


  // Check answer
  // try {
  //use these for updating
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

  //if incorrect
  if (guess !== llHead.translation) {
    memVal = 1; //memval sets to one if incorrect
    isCorrect = false; //obviously
    wordCountIncorrect = llHead.incorrect_count + 1;
  } else {
    memVal = llHead.memory_value * 2; // doubles to send back in the list
    isCorrect = true;
    wordCountCorrect = llHead.correct_count + 1;
    total_score = total_score + 1
  }

  //Manipulate the list and iterate over it.

   console.log("THIS IS THE LIST", JSON.stringify(list))
  let moved = llHead;
  list.removeHead();
  list.insertAt(moved, memVal);

  console.log("THIS IS THE LIST AFTER MOVING THE HEAD", JSON.stringify(list))

  //At this point, the head is reassigned. The VALUE of the previous head is listed behind the new head, but the inner next is not changed, so ignore it and use the outer.

  //     //Trying update just the list head and the next/previous values didn't work in subsequent moves.

  let currNode = list.head;
  while (currNode.next != null) {
    //this is the OUTER next
    await LanguageService.updateNext(
      req.app.get('db'),
      req.language.id,
      currNode.value.id, //this is the INNER id, the one we want.
      currNode.next.value.id
    );
    currNode = currNode.next;
  }

  // updateWord

  await LanguageService.updateWord(
    req.app.get('db'),
    req.language.id,
    moved.id,
    memVal,
    wordCountCorrect,
    wordCountIncorrect
  );

  //     //update the head
  await LanguageService.updateHead(
    req.app.get('db'),
    req.language.id,
    list.head.value.id //This is the inner id
  );


  //update the score 
  await LanguageService.updateTotalScore(
    req.app.get('db'),
    req.user.id,
    total_score
  )


  //     // make our response

  console.log(list.head)

  res.status(200).json({
    nextWord: list.head.value.original,
    wordCorrectCount: list.head.value.correct_count,
    wordIncorrectCount: list.head.value.incorrect_count,
    totalScore: total_score,
    answer: moved.translation,
    isCorrect: isCorrect,
  });

  // } catch (error) {
  //   next(error);
  // }
});

module.exports = languageRouter;
