'use strict'
const { execFile } = require('child_process')
const path = require('path')
const discordMessageJob = require('../jobs/discord-message')

const databaseConfig = require('../../config/database')[process.env.NODE_ENV || 'development']

module.exports = () => {
    const date = new Date()
    const backupName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date
        .getMinutes()}`
    const backupFile = `export_${backupName}.tar`
    const backupScript = `pg_dump -Ft --username=${databaseConfig.username} -h ${databaseConfig.host} ${databaseConfig
        .database}`

    execFile(
        path.resolve(__dirname, '../../bin/backup.sh'),
        [backupScript, backupFile, databaseConfig.password],
        error => {
            if (error) {
                throw error
            } else {
                discordMessageJob('backupNotification', {
                    title: `${databaseConfig.database}-backup successful`,
                    description: `${databaseConfig.database}-backup has been executed successfully!`,
                    color: 65313
                })
            }
        }
    )
}
