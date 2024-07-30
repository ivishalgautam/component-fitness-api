"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  const record = await table.MembershipPerksModel.getByContent(req);
  if (!record) {
    await table.MembershipPerksModel.create(req);
  }

  res.send({ message: "Membership perks created." });
};

const getById = async (req, res) => {
  const record = await table.MembershipPerksModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Membership perk not found!",
    });
  }

  res.send(record);
};

const update = async (req, res) => {
  const record = await table.MembershipPerksModel.getById(req);
  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Membership perk not found!",
    });
  }

  const existWithContent = await table.MembershipPerksModel.getByContent(req);

  if (existWithContent && existWithContent.id !== record.id)
    return ErrorHandler({
      code: BAD_REQUEST,
      message: "Exist with content!",
    });

  await table.MembershipPerksModel.updateById(req);

  res.send({ message: "Updated" });
};

const get = async (req, res) => {
  const data = await table.MembershipPerksModel.get(req);
  res.send(data);
};

const deleteById = async (req, res) => {
  const record = await table.MembershipPerksModel.getById(req, req.params.id);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Membership perk not found!",
    });

  await table.MembershipPerksModel.deleteById(req, req.params.id);
  res.send({ message: "Membership perk deleted." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  update: update,
};
