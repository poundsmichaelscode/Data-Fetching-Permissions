
const User = require('../models/User');

const isAgent = async (req, res, next) => {
  const user = await User.findById(req.body.userId || req.query.userId);
  if (!user || user.role !== 'agent') {
    return res.status(403).json({ message: 'Only agents can perform this action' });
  }
  req.user = user;
  next();
};

module.exports = { isAgent };
