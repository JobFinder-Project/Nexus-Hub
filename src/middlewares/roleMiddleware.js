export const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  if (req.session.userRole === 'admin') {
    return next();
  }

  return res.status(403).render('error', { 
    message: 'Acesso negado: Apenas administradores podem acessar esta área.' 
  });
};

export const isPartner = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }

  if (req.session.userRole === 'parceiro' || req.session.userRole === 'admin') {
    return next();
  }

  return res.status(403).render('error', { 
    message: 'Acesso negado: Área restrita para parceiros.' 
  });
};