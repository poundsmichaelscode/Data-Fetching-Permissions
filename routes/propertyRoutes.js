const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');
const { isAgent } = require('../middleware/auth');

// ✅ GET: Saved Listings for a User
router.get('/saved-listings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedListings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST: Create New Listing (agents only)
router.post('/create', isAgent, async (req, res) => {
  try {
    const property = new Property({ ...req.body, listedBy: req.user._id });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: 'Error creating property', error: err.message });
  }
});

// ✅ GET: Properties with Optional Filters
router.get('/listings', async (req, res) => {
  const filters = {};

  if (req.query.location) filters.location = req.query.location;
  if (req.query.minPrice) filters.price = { ...filters.price, $gte: req.query.minPrice };
  if (req.query.maxPrice) filters.price = { ...filters.price, $lte: req.query.maxPrice };
  if (req.query.bedrooms) filters.bedrooms = parseInt(req.query.bedrooms);
  if (req.query.bathrooms) filters.bathrooms = parseInt(req.query.bathrooms);

  try {
    const properties = await Property.find(filters);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

module.exports = router;
