"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  try {
    const record = await table.MembershipPerksModel.getByContent(req);
    if (!record) {
      await table.MembershipPerksModel.create(req);
    }

    res.send({ message: "Membership perks created." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.MembershipPerksModel.getById(req);

    if (!record) {
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Membership perk not found!",
      });
    }

    res.send(record);
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const update = async (req, res) => {
  try {
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
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const data = await table.MembershipPerksModel.get(req);
    res.send(data);
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const record = await table.MembershipPerksModel.getById(req, req.params.id);

    if (!record)
      return ErrorHandler({
        code: NOT_FOUND,
        message: "Membership perk not found!",
      });

    await table.MembershipPerksModel.deleteById(req, req.params.id);
    res.send({ message: "Membership perk deleted." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  update: update,
};
