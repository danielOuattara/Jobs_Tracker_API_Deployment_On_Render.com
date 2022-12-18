const express = require("express");
const router = express.Router();
const {
  getOneJob,
  getAllJobs,
  createJob,
  updateJob,
  deleteOneJob,
  deleteAllJobs,
} = require("../controllers/jobsControllers");

/* OK ! */
// router.post("/", createJob).get("/", getAllJobs).delete("/", deleteAllJobs);
// router
//   .get("/:jobId", getOneJob)
//   .patch("/:jobId", updateJob)
//   .delete(":jobId", deleteOneJob);

/* OK! */
router.route("/").post(createJob).get(getAllJobs).delete(deleteAllJobs);
router.route("/:jobId").get(getOneJob).patch(updateJob).delete(deleteOneJob);

module.exports = router;
