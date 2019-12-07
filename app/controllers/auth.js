const { sendError } = require('../helpers/error')
const models = require('../models')

exports.authenticate = (req, res, next) => {
    models.Admin.findById(req.body.id)
        .then(admin => {
            if (admin !== undefined && req.body.key === admin.key) {
                next()
            } else {
                sendError(res, 401, 'Incorrect authentication key')
            }
        })
}