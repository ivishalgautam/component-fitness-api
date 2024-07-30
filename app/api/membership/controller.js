"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import slugify from "slugify";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.name, { lower: true });
    await table.MembershipModel.create(req);
    res.send({ status: true, message: "Membership created." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.MembershipModel.getById(req);

    if (!record) {
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Membership not found!",
      });
    }

    res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const queries = await table.MembershipModel.get(req);
    res.send({ status: true, data: queries });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const record = await table.MembershipModel.getById(req, req.params.id);

    if (!record)
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Membership not found!",
      });

    await table.MembershipModel.deleteById(req, req.params.id);
    res.send({ status: true, message: "Membership deleted." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
};
