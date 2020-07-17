'use strict'
const { header, body } = require('express-validator')
const oAuth2Service = require('../../services/oauth2')

const COOKIE_NAME = '.NSSECURITY'

exports.validate = method => {
    switch (method) {
        case 'postToken':
            return [
                header('authorization').exists().isString(),
                body('scope').exists().isString()
            ]
        case 'postTokenRevoke':
            return [
                // cookie('.NSSECURITY').exists()
            ]
    }
}

exports.postToken = async (req, res) => {
    const result = (await oAuth2Service.getAccessToken(req.header('authorization').replace('Bearer ', ''), req.body
        .scope)).data
    res.cookie(COOKIE_NAME, result.access_token, {
        maxAge: result.expires_in * 1000,
        httpOnly: true,
        // secure: true
    })
    res.sendStatus(200)
}

exports.postTokenRevoke = async (req, res) => {
    const result = await oAuth2Service.revokeAccessToken(req.headers.cookie.replace(COOKIE_NAME, ''))
    // console.log(result)
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: 'localhost',
        path: '/'
    })
    // res.cookie(COOKIE_NAME, '', {
    //     // maxAge: 0,
    //     httpOnly: true,
    //     // secure: true,
    //     domain: 'localhost',
    //     path: '/'
    // })
    res.sendStatus(200)
}
