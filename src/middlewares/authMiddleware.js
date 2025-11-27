export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/login'); 
};

export const isGuest = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next(); 
  }
  return res.redirect('/'); 
};