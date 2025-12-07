export const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  if (req.session.userRole === 'admin') {
    return next();
  }

  const error = {
    status: 403,
    message: 'Acesso negado. Você não tem permissão para acessar esta página.',
    stack: null,
  };

  next(error);
};

export const isPartner = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  if (req.session.userRole === 'partner' || req.session.userRole === 'admin') {
    return next();
  }

  const error = {
    status: 403,
    message: 'Acesso negado. Você não tem permissão para acessar esta página.',
    stack: null,
  };

  next(error);
};
