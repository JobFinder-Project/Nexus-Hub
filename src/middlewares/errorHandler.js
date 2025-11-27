// middleware que captura rotas sem resposta
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  console.error('Erro 404: ', error);
  res.status(404);
  res.render('error/404', {
    title: '404 - Página Não Encontrada',
  });
};

// middleware que captura as exceções
const globalError = (err, req, res, next) => {
  console.error('Erro 500: ', err);
  res.status(500);
  res.render('error/500', {
    title: '500 - Erro Interno do Servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, globalError };
