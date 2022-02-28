import Report from "../models/report";
import { RequestHandler } from "express";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";

const getReport: RequestHandler = async (req, res, next) => {
  try {
    let report;
    if (!!req.params.reportId) {
      const reportId = req.params.reportId;
      report = await Report.findById(req.params.reportId);

      if (report.userId.toString() !== req.userId) {
        const err = new ProjectError("You are not allowed");
        err.statusCode = 405;
        throw err;
      }
    } else {
      report = await Report.find({ userId: req.userId });
    }

    if (!report) {
      const err = new ProjectError("Report not found");
      err.statusCode = 404;
      throw err;
    }

    let resp: ReturnResponse = {
      status: "success",
      message: "Report!",
      data: report,
    };
    res.send(resp);
  } catch (error) {
    next(error);
  }
};

export { getReport };
