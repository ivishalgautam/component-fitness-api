"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  try {
    await table.NoteModel.create(req, req.user_data.id);
    res.send({ status: true, message: "Note created." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.NoteModel.getById(req);

    if (!record) {
      return ErrorHandler({ code: NOT_FOUND, message: "Note not found!" });
    }

    res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const updateById = async (req, res) => {
  try {
    const record = await table.NoteModel.update(req, req.params.id);

    if (!record) {
      return ErrorHandler({ code: NOT_FOUND, message: "Note not found!" });
    }

    res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const queries = await table.NoteModel.get(req);
    res.send({ status: true, data: queries });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const record = await table.NoteModel.getById(req, req.params.id);

    if (!record)
      return ErrorHandler({ code: NOT_FOUND, message: "Note not found!" });

    await table.NoteModel.deleteById(req, req.params.id);
    res.send({ status: true, message: "Note deleted." });
  } catch (error) {
    ErrorHandler({ code: INTERNAL_SERVER_ERROR, message: error.message });
  }
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  updateById: updateById,
};
