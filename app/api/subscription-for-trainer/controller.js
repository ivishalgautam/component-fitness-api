"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import slugify from "slugify";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.name, { lower: true });
    await table.SubscriptionForTrainerModel.create(req);
    res.send({ status: true, message: "Subscription created." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.SubscriptionForTrainerModel.getById(req);

    if (!record) {
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Subscription not found!",
      });
    }

    res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const record = await table.SubscriptionForTrainerModel.getById(req);

    if (!record) {
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Subscription not found!",
      });
    }
    await table.SubscriptionForTrainerModel.updateById(req);
    res.send({ status: true, data: "Subscription updated." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const queries = await table.SubscriptionForTrainerModel.get(req);
    res.send({ status: true, data: queries });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const record = await table.SubscriptionForTrainerModel.getById(
      req,
      req.params.id
    );

    if (!record)
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Subscription not found!",
      });

    await table.SubscriptionForTrainerModel.deleteById(req, req.params.id);
    res.send({ status: true, message: "Subscription deleted." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

export default {
  create: create,
  get: get,
  getById: getById,
  deleteById: deleteById,
  update: update,
};
