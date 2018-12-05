module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.session.siteMessages.push({
      type: 'warning',
      message: 'Permission denied, please login below.'
    });
    return res.redirect('/login');
  }
  next();
};
