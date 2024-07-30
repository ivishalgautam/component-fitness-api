"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.CustomerMembershipModel.create(req);
  res.send({ status: true, message: "Customer membership created." });
};

const getById = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  await table.CustomerMembershipModel.update(req);
};

const transferMembership = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  const userRecord = await table.UserModel.getById(0, req.body.user_id);
  if (!userRecord)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer not exist, you transfering membership to!",
    });

  await table.CustomerMembershipModel.update(req);
};

const get = async (req, res) => {
  const queries = await table.CustomerMembershipModel.get(req);
  res.send({ status: true, data: queries });
};

const deleteById = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  await table.CustomerMembershipModel.deleteById(req);
  res.send({ status: true, message: "Customer membership deleted." });
};

const freezeMembership = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Membership not found!",
    });

  const updateConfirmation = await table.CustomerMembershipModel.update({
    ...req,
    body: { is_freezed: true },
  });

  // create a table where freezed memberships will store with customer_membership_id
  if (updateConfirmation) {
    await table.CustomerFreezeMembershipModel.create(req);
  }

  res.send({ status: true, message: "Membership freezed." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  freezeMembership: freezeMembership,
  update: update,
  transferMembership: transferMembership,
};
