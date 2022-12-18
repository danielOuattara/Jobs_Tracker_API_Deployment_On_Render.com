const Job = require("../models/Job.js");
const { StatusCodes } = require("http-status-codes");
const { generateNotFoundError, generateBadRequestError } = require("../errors");

//----------------------------------------------------------------
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

//----------------------------------------------------------------
const getOneJob = async (req, res, next) => {
  const job = await Job.findOne({
    _id: req.params.jobId,
    createdBy: req.user._id,
  });
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).json({ job });
};

//----------------------------------------------------------------
const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//----------------------------------------------------------------
const updateJob = async (req, res, next) => {
  if (!req.body.company || !req.body.position) {
    return next(
      generateBadRequestError("Pease, provide Company and Position fields !"),
    );
  }
  const job = await Job.findOneAndUpdate(
    { _id: req.params.jobId, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).send({ job });
};

//----------------------------------------------------------------
const deleteAllJobs = async (req, res) => {
  await Job.deleteMany({ createdBy: req.user._id });
  res.status(StatusCodes.OK).send(" All Jobs Deleted");
};

//----------------------------------------------------------------
const deleteOneJob = async (req, res, next) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.jobId,
    createdBy: req.user._id,
  });
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).json();
};

//-----------------------------------------------------------------
module.exports = {
  getAllJobs,
  getOneJob,
  createJob,
  updateJob,
  deleteOneJob,
  deleteAllJobs,
};
