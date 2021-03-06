'use strict'
const { param, body, header, query } = require('express-validator')

const { requestHelper } = require('../../helpers')
const { decodeScopeQueryParam, decodeSortQueryParam } = requestHelper

class GroupController {
  constructor (groupService, suspensionService, trainingService) {
    this._groupService = groupService
    this._suspensionService = suspensionService
    this._trainingService = trainingService
  }

  // GroupService
  async getShout (req, res) {
    res.json(await this._groupService.getShout(req.params.groupId))
  }

  async getExiles (req, res) {
    res.json((await this._groupService.getExiles())
      .map(exile => exile.get({ raw: true })))
  }

  async getRoles (req, res) {
    res.json(await this._groupService.getRoles(req.params.groupId))
  }

  async getGroup (req, res) {
    res.json(await this._groupService.getGroup(req.params.groupId))
  }

  async postShout (req, res) {
    res.json(await this._groupService.shout(req.params.groupId, req.body.message, req.body.authorId))
  }

  async putUser (req, res) {
    res.json(await this._groupService.changeRank(req.params.groupId, req.params.userId, req.body))
  }

  // SuspensionService
  async getSuspensions (req, res) {
    res.json((await this._suspensionService.getSuspensions(req.query.scope, req.query.sort))
      .map(suspension => suspension.get({ plain: true })))
  }

  async getSuspension (req, res) {
    res.json((await this._suspensionService.getSuspension(req.params.userId, req.query.scope))
      .get({ plain: true }))
  }

  async cancelSuspension (req, res) {
    res.json((await this._suspensionService.cancelSuspension(req.params.groupId, req.params.userId, req.body))
      .get({ raw: true }))
  }

  async extendSuspension (req, res) {
    res.json((await this._suspensionService.extendSuspension(req.params.groupId, req.params.userId, req.body))
      .get({ raw: true }))
  }

  async putSuspension (req, res) {
    res.json((await this._suspensionService.changeSuspension(req.params.groupId, req.params.userId, req.body))
      .get({ plain: true }))
  }

  // TrainingService
  async getTraining (req, res) {
    res.json((await this._trainingService.getTraining(req.params.trainingId, req.query.scope))
      .get({ plain: true }))
  }

  async getTrainings (req, res) {
    res.json((await this._trainingService.getTrainings(req.query.scope, req.query.sort))
      .map(training => training.get({ plain: true })))
  }

  async getTrainingTypes (req, res) {
    res.json((await this._trainingService.getTrainingTypes(req.params.groupId))
      .map(trainingType => trainingType.get({ plain: true })))
  }

  async postSuspension (req, res) {
    res.json((await this._suspensionService.suspend(req.params.groupId, req.body.userId, req.body))
      .get({ raw: true }))
  }

  async postTraining (req, res) {
    res.json((await this._trainingService.addTraining(req.body))
      .get({ raw: true }))
  }

  async cancelTraining (req, res) {
    res.json((await this._trainingService.cancelTraining(req.params.groupId, req.params.trainingId, req.body))
      .get({ raw: true }))
  }

  async postTrainingType (req, res) {
    res.json((await this._trainingService.createTrainingType(req.params.groupId, req.body))
      .get({ raw: true }))
  }

  async putTraining (req, res) {
    res.json((await this._trainingService.changeTraining(req.params.groupId, req.params.trainingId, req.body))
      .get({ plain: true }))
  }

  async putTrainingType (req, res) {
    res.json((await this._trainingService.changeTrainingType(req.params.groupId, req.params.typeId, req.body))
      .get({ plain: true }))
  }

  async deleteTrainingType (req, res) {
    res.json(await this._trainingService.deleteTrainingType(req.params.groupId, req.params.typeId))
  }

  validate (method) {
    switch (method) {
      // GroupService
      case 'getShout':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt()
        ]
      case 'getExiles':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt()
        ]
      case 'getRoles':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt()
        ]
      case 'getGroup':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt()
        ]

      case 'postShout':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('message').exists().isString()
        ]

      case 'putUser':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('userId').isInt().toInt(),
          body('rank').exists().isInt().toInt(),
          body('authorId').optional().isInt().toInt()
        ]

        // SuspensionService
      case 'getSuspensions':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          query('scope').customSanitizer(decodeScopeQueryParam),
          query('sort').customSanitizer(decodeSortQueryParam)
        ]
      case 'getSuspension':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('userId').isInt().toInt(),
          query('scope').customSanitizer(decodeScopeQueryParam)
        ]

      case 'postSuspension':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          body('userId').exists().isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('reason').exists().isString(),
          body('duration').exists().isInt().toInt(),
          body('rankBack').exists().isBoolean().toBoolean()
        ]
      case 'cancelSuspension':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('userId').isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('reason').exists().isString()
        ]
      case 'extendSuspension':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('userId').isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('duration').exists().isInt().toInt(),
          body('reason').exists().isString()
        ]

      case 'putSuspension':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('userId').isInt().toInt(),
          body('editorId').exists().isInt().toInt(),
          body('changes.authorId').optional().isInt().toInt(),
          body('changes.reason').optional().isString(),
          body('changes.rankBack').optional().isBoolean().toBoolean()
        ]

        // TrainingService
      case 'getTrainings':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          query('scope').customSanitizer(decodeScopeQueryParam),
          query('sort').customSanitizer(decodeSortQueryParam)
        ]
      case 'getTraining':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('trainingId').isInt().toInt(),
          query('scope').customSanitizer(decodeScopeQueryParam)
        ]
      case 'getTrainingTypes':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt()
        ]

      case 'postTraining':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('typeId').exists().isInt().toInt(),
          body('date').exists(),
          body('notes').optional().isString()
        ]
      case 'cancelTraining':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('trainingId').isInt().toInt(),
          body('authorId').exists().isInt().toInt(),
          body('reason').exists().isString()
        ]
      case 'postTrainingType':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          body('name').exists().isString(),
          body('abbreviation').exists().isString()
        ]

      case 'putTraining':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('trainingId').isInt().toInt(),
          body('editorId').exists().isInt().toInt(),
          body('changes.typeId').optional().isInt().toInt(),
          body('changes.date').optional().isInt().toInt(),
          body('changes.notes').optional().isString(),
          body('changes.authorId').optional().isInt().toInt()
        ]
      case 'putTrainingType':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('typeId').isInt().toInt(),
          body('changes.name').optional().isString(),
          body('changes.abbreviation').optional().isString()
        ]

      case 'deleteTrainingType':
        return [
          header('authorization').exists().isString(),
          param('groupId').isInt().toInt(),
          param('typeId').isInt().toInt()
        ]
    }
  }
}

module.exports = GroupController
