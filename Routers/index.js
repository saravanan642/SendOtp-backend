const express = require("express");

const router = express.Router();

const AuthRouter = require("./AuthRouter");

router.use(AuthRouter);

module.exports = router;