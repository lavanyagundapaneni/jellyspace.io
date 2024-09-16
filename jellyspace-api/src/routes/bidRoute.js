const express = require("express");
const router = express.Router();
const Bid = require("../models/bid"); // Assuming this is the Sequelize model
const User = require("../models/user");
const { emailSending } = require('../common/common');

router.post("/getbids", async (req, res) => {
  try {
    const bids = await Bid.findAll(); // Sequelize method for fetching all records
    const bidsByEmail = bids.filter((item) => item.userEmail == req.body.userEmail);
    if (bidsByEmail.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List',
        data: bidsByEmail
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: ''
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching bids', error });
  }
});

router.post("/getProjectBids", async (req, res) => {
  try {
    const bids = await Bid.findAll(); // Sequelize method
    const bidsByEmail = bids.filter((item) => item.projectEmail == req.body.projectEmail);
    if (bidsByEmail.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List By project',
        data: bidsByEmail
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: ''
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching project bids', error });
  }
});

router.post("/acceptBid", async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.body.id); // Sequelize method to find by primary key
    if (bid) {
      bid.status = req.body.status;
      await bid.save(); // Save the updated status
      
      const user = await User.findOne({ where: { email: bid.userEmail } });
      
      const htmlBodyAcceptedBid = '<html>...</html>'; // Build your email body here
      const htmlBodyRejectedBid = '<html>...</html>';
      
      const htmlBody = bid.status == 'accepted' ? htmlBodyAcceptedBid : htmlBodyRejectedBid;
      emailSending(bid.userEmail, `Bid ${bid.status}`, htmlBody);

      return res.json({
        status: true,
        message: 'Bid status updated to ' + req.body.status,
        data: bid
      });
    } else {
      return res.status(404).json({ status: false, message: 'Bid not found' });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error updating bid status', error });
  }
});

router.post("/postBid", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.userEmail } });
    const projectUser = await User.findOne({ where: { email: req.body.projectEmail } });

    const projectBidding = await Bid.create({
      projectId: req.body.projectId,
      projectName: req.body.projectName,
      projectEmail: req.body.projectEmail,
      bidAmount: req.body.bidAmount,
      status: req.body.status,
      rupeesId: req.body.rupeesId,
      bidDescription: req.body.bidDescription,
      userEmail: req.body.userEmail
    });

    const htmlBodyPostedBid = '<html>...</html>'; // Your email template here
    const htmlBodyForProjectedBid = '<html>...</html>';

    emailSending(projectBidding.userEmail, 'Project Bid', htmlBodyPostedBid);
    emailSending(projectBidding.projectEmail, 'Project Bid', htmlBodyForProjectedBid);

    return res.json({
      status: true,
      message: 'Successfully Project Bidding',
      data: projectBidding
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Project Bidding failed', error });
  }
});

module.exports = router;
