// src/routes/bidRoute.js
const express = require('express');
const router = express.Router();
const Bid = require('../models/bid'); // Import Bid model
const User = require('../models/user'); // Import User model
const { emailSending } = require('../common/common');

// Get bids by user email
router.post('/getbids', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: {
        userEmail: req.body.userEmail
      }
    });
    if (bids.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List',
        data: bids
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Error fetching bids',
      data: []
    });
  }
});

// Get bids by project email
router.post('/getProjectBids', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: {
        projectEmail: req.body.projectEmail
      }
    });
    if (bids.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List By project',
        data: bids
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Error fetching project bids',
      data: []
    });
  }
});

// Accept or reject a bid
router.post('/acceptBid', async (req, res) => {
  try {
    const bidId = req.body.id;
    const [updated] = await Bid.update(
      { status: req.body.status },
      { where: { id: bidId } }
    );

    if (updated) {
      const bidExist = await Bid.findOne({ where: { id: bidId } });
      const user = await User.findOne({ where: { email: bidExist.userEmail } });

      const htmlBodyAcceptedBid = '<!DOCTYPE html> ...'; // Use your existing HTML templates
      const htmlBodyRejectedBid = '<!DOCTYPE html> ...';

      const htmlbody = bidExist.status === 'accepted' ? htmlBodyAcceptedBid : htmlBodyRejectedBid;
      emailSending(bidExist.userEmail, 'Bid ' + bidExist.status, htmlbody);

      return res.json({
        status: true,
        message: 'Bid was ' + req.body.status,
        data: bidExist
      });
    } else {
      return res.json({
        status: false,
        message: 'Bid not found',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Status update failed',
      data: []
    });
  }
});

// Post a new bid
router.post('/postBid', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.userEmail } });
    const projectUser = await User.findOne({ where: { email: req.body.projectEmail } });

    const newBid = await Bid.create({
      projectId: req.body.projectId,
      projectName: req.body.projectName,
      projectEmail: req.body.projectEmail,
      bidAmount: req.body.bidAmount,
      status: req.body.status,
      rupeesId: req.body.rupeesId,
      bidDescription: req.body.bidDescription,
      userEmail: req.body.userEmail,
    });

    const htmlBodyPostedBid = '<!DOCTYPE html> ...'; // Use your existing HTML templates
    const htmlBodyForProjectedBid = '<!DOCTYPE html> ...';

    emailSending(newBid.userEmail, 'Project Bid', htmlBodyPostedBid);
    emailSending(newBid.projectEmail, 'Project Bid', htmlBodyForProjectedBid);

    return res.json({
      status: true,
      message: 'Successfully posted project bidding',
      data: newBid
    });
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Project bidding failed',
      data: []
    });
  }
});

module.exports = router;
