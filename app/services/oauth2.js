'use strict'
require('dotenv').config()

const axios = require('axios')

const applicationConfig = require('../../config/application')

exports.getAccessToken = (code, scope) => {
    return axios({
        method: 'post',
        url: 'https://discord.com/api/v6/oauth2/token',
        data: new URLSearchParams({
            client_id: applicationConfig.oAuth2ClientId,
            client_secret: process.env.OAUTH2_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: applicationConfig.oAuth2RedirectUri,
            scope
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

exports.revokeAccessToken = token => {
    return axios({
        method: 'post',
        url: 'https://discord.com/api/oauth2/token/revoke',
        data: new URLSearchParams({
            token,
            client_id: applicationConfig.oAuth2ClientId,
            client_secret: process.env.OAUTH2_CLIENT_SECRET,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
