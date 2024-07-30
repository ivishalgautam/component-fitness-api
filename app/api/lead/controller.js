"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import slugify from "slugify";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.LeadModel.create(req);
  res.send({ status: true, message: "Query sent." });
};

const getById = async (req, res) => {
  const record = await table.LeadModel.getById(req, req.params.id);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Query not found!" });
  }

  res.send({ status: true, data: record });
};

const get = async (req, res) => {
  const queries = await table.LeadModel.get(req);
  res.send({ status: true, data: queries });
};

const deleteById = async (req, res) => {
  const record = await table.LeadModel.getById(req, req.params.id);
  if (!record)
    return ErrorHandler({ code: NOT_FOUND, message: "Query not found!" });

  await table.LeadModel.deleteById(req, req.params.id);
  res.send({ status: true, message: "Query deleted." });
};

const convertToCustomer = async (req, res) => {
  const leadRecord = await table.LeadModel.getById(req);
  if (!leadRecord)
    return ErrorHandler({ code: NOT_FOUND, message: "Lead not found!" });

  const membershipRecord = await table.MembershipModel.getById(
    0,
    req.body.membership_id
  );
  if (!membershipRecord)
    return ErrorHandler({ code: NOT_FOUND, message: "Membership not found!" });

  const trainerRecord = await table.TrainerModel.getById(
    0,
    req.body.trainer_id
  );
  if (!trainerRecord)
    return ErrorHandler({ code: NOT_FOUND, message: "Trainer not found!" });

  if (leadRecord) {
    req.body.fullname = leadRecord.fullname;
    req.body.email = leadRecord.email;
    req.body.mobile_number = leadRecord.mobile_number;
    req.body.role = "customer";
  }

  const user = await table.UserModel.create(newReq);
  if (user) {
    req.body.user_id = user.id;
  } else {
    return ErrorHandler({ code: 500, message: "Error converting to customer" });
  }

  const converted = await table.CustomerMembershipModel.create(req);
  if (converted) {
    req.body.is_converted_to_member = true;
    await table.LeadModel.update(req);
  }

  res.send({ status: true, message: "Converted to member." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  convertToCustomer: convertToCustomer,
};
