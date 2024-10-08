"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import slugify from "slugify";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  const salesPerson = await table.SalesPersonModel.getByUserId(
    0,
    req.user_data.id
  );
  if (!salesPerson)
    return ErrorHandler({ code: 401, message: "unauthorized!" });
  req.body.sales_person_id = salesPerson.id;

  await table.FollowupModel.create(req);
  res.send({ status: true, message: "Follow up created." });
};

const getById = async (req, res) => {
  const record = await table.FollowupModel.getById(req);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Follow up not found!" });
  }

  res.send({ status: true, data: record });
};

const getByLeadId = async (req, res) => {
  const record = await table.LeadModel.getById(req);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Lead not found!" });
  }

  res.send({ status: true, data: await table.FollowupModel.getByLeadId(req) });
};

const getByUserId = async (req, res) => {
  const record = await table.FollowupModel.getByUserId(req, req.params.id);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Follow up not found!" });
  }

  res.send({ status: true, data: record });
};

const updateById = async (req, res) => {
  const record = await table.FollowupModel.update(req, req.params.id);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Follow up not found!" });
  }

  res.send({ status: true, data: record });
};

const get = async (req, res) => {
  const queries = await table.FollowupModel.get(req);
  res.send({ status: true, data: queries });
};

const deleteById = async (req, res) => {
  const record = await table.FollowupModel.getById(req, req.params.id);
  if (!record)
    return ErrorHandler({ code: NOT_FOUND, message: "Follow up not found!" });

  await table.FollowupModel.deleteById(req, req.params.id);
  res.send({ status: true, message: "Follow up deleted." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  updateById: updateById,
  getByUserId: getByUserId,
  getByLeadId: getByLeadId,
};
