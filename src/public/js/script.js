import app from './src/app.js'; 
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8050;


app.listen(PORT, () => {
  console.log(`Servidor Nexus-Hub rodando na porta ${PORT}`);
  console.log(`Acesse em: http://localhost:${PORT}`);
});