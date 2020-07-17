'use strict'
const express = require('express')
const router = express.Router()
const oAuth2Controller = require('../controllers/v1/oauth2')
const { handleValidationResult } = require('../middlewares/error')

router.post('/token', oAuth2Controller.validate('postToken'), handleValidationResult, oAuth2Controller
    .postToken)

router.post('/token/revoke', oAuth2Controller.validate('postTokenRevoke'), handleValidationResult,
    oAuth2Controller.postTokenRevoke)

module.exports = router
