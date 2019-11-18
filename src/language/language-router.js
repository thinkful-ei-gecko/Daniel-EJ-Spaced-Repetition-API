const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    //The following syntax applies to all endpoints within the language router.
    //The user.id is taken from the authToken, and before anything else is done, 
    //the db is checked for a language related to that user. 
    //If not found, response is "no language"
    //If found, req.langauge is set as the language usw...
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      console.log(req.language)
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // implement me
  try {
    const word = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.id,
      req.user.id
    )
    res.json(word)
    next()
  } catch (error) {
    next(error)
  }
})

languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })

module.exports = languageRouter
