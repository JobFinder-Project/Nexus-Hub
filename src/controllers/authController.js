import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

const renderLogin = (req, res) => {
  let message = null;
  let status = null;
  if (req.session.message) {
    message = req.session.message;
    status = req.session.status;
    req.session.message = null;
    req.session.status = null;
  }
  res.render('auth/login', {
    title: 'Login | Nexus Hub',
    layout: 'auth',
  });
};

const renderRegister = (req, res) => {
  let message = null;
  let status = null;
  if (req.session.message) {
    message = req.session.message;
    status = req.session.status;
    req.session.message = null;
    req.session.status = null;
  }
  res.render('auth/register', {
    title: 'Criar Conta | Nexus Hub',
    layout: 'auth',
  });
};

const processRegister = async (req, res, next) => {
  try {
    const { nome, email, senha, nascimento } = req.body;

    // Valida os campos obrigatórios
    if (!nome || !email || !senha || !nascimento) {
      req.session.message = 'Por favor, preencha todos os campos.';
      req.session.status = 'error';
      return res.redirect('/register');
    }

    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.session.message = 'Este email já está registrado.';
      req.session.status = 'error';
      return res.redirect('/register');
    }

    // Valida a data de nascimento (aceita DD/MM/YYYY ou YYYY-MM-DD)
    let data_nascimento;
    if (typeof nascimento === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) {
      // parse DD/MM/YYYY
      const [dia, mes, ano] = nascimento.split('/').map(Number);
      data_nascimento = new Date(ano, mes - 1, dia);
    } else {
      data_nascimento = new Date(nascimento);
    }

    // verifica formato válido
    if (isNaN(data_nascimento.getTime())) {
      req.session.message = 'Data de nascimento inválida.';
      req.session.status = 'error';
      return res.redirect('/register');
    }

    // comparar apenas a parte da data (ignora horário/timezone)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const nascimentoDateOnly = new Date(data_nascimento);
    nascimentoDateOnly.setHours(0, 0, 0, 0);

    if (nascimentoDateOnly >= hoje) {
      req.session.message = 'Data de nascimento deve ser anterior à data atual.';
      req.session.status = 'error';
      return res.redirect('/register');
    }

    // use formato YYYY-MM-DD ao criar o registro (DATEONLY)
    const data_nascimento_str = nascimentoDateOnly.toISOString().slice(0, 10);

    // Valida o role
    /* const perfisValidos = ['cliente', 'parceiro', 'admin'];
    if (!perfisValidos.includes(role)) {
      req.session.message = 'Perfil inválido selecionado.';
      req.session.status = 'error';
      return res.redirect('/register');
    } */

    // Cria o hash da senha
    const senha_hash = bcrypt.hashSync(senha, 10);

    // Cria o novo usuário
    const user = await User.create({
      nome,
      email,
      senha_hash,
      data_nascimento: data_nascimento_str,
      perfil: 'cliente', // registra sempre como 'cliente'
    });

    // Verifica se o usuário foi criado com sucesso
    if (!user) {
      req.session.message = 'Erro ao registrar usuário. Tente novamente.';
      req.session.status = 'error';
      return res.redirect('/register');
    }

    req.session.message = 'Registro bem-sucedido! Agora você pode fazer login.';
    req.session.status = 'success';
    return res.redirect('/login');
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return next(err);
  }
};

const processLogin = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Valida os campos obrigatórios
    if (!email || !senha) {
      req.session.message = 'Por favor, preencha todos os campos.';
      req.session.status = 'error';
      return res.redirect('/login');
    }

    // Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.message = 'Email ou senha incorretos.';
      req.session.status = 'error';
      return res.redirect('/login');
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      req.session.message = 'Email ou senha incorretos.';
      req.session.status = 'error';
      return res.redirect('/login');
    }

    // Configura a sessão do usuário
    req.session.userId = user.id;
    req.session.userName = user.nome;
    req.session.userRole = user.perfil;

    // Redireciona com base no perfil do usuário
    if (user.perfil === 'admin') {
      return res.redirect('/admin/dashboard');
    } else if (user.perfil === 'parceiro') {
      return res.redirect('/partner/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Erro ao realizar o login:', err);
    return next(err);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      next(err);
    } else {
      res.redirect('/login');
    }
  });
};

export { renderLogin, renderRegister, processRegister, processLogin, logout };
