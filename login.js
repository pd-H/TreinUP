function toggleForm(form) {
  document.getElementById('loginForm').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = form === 'register' ? 'block' : 'none';
}

function login() {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPassword').value;
  
  console.log("Tentando login com usuário:", username);
  
  // Verificar se os campos estão preenchidos
  if (!username || !password) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  // Verificar se o localStorage está funcionando
  try {
    const test = 'test_login';
    localStorage.setItem(test, test);
    if (localStorage.getItem(test) !== test) {
      alert('Erro: localStorage não está funcionando corretamente.');
      return;
    }
    localStorage.removeItem(test);
  } catch (e) {
    console.error("Erro ao acessar localStorage:", e);
    alert('Seu navegador não suporta ou bloqueou o armazenamento local.');
    return;
  }
  
  // Listar todos os itens no localStorage para depuração
  console.log("Conteúdo do localStorage:");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`${key}: ${localStorage.getItem(key)}`);
  }
  
  // Buscar dados do usuário no localStorage
  try {
    const storedData = localStorage.getItem(username);
    console.log("Dados encontrados para o usuário:", storedData);
    
    if (!storedData) {
      alert('Usuário não encontrado.');
      return;
    }
    
    const stored = JSON.parse(storedData);
    
    if (stored && stored.password === password) {
      console.log("Login bem-sucedido para:", username);
      alert(`Bem-vindo, ${stored.name}!`);

      // Salva o nome de usuário no localStorage
      localStorage.setItem("usuarioLogado", username);

      // Redireciona para a página principal
      window.location.href = "index.html";
    } else {
      console.log("Senha incorreta para:", username);
      alert('Usuário ou senha inválidos.');
    }
  } catch (e) {
    console.error("Erro ao processar login:", e);
    alert('Ocorreu um erro ao processar o login. Por favor, tente novamente.');
  }
}

function register() {
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  console.log("Tentando registrar usuário:", username);
  
  // Verificar se todos os campos estão preenchidos
  if (!name || !email || !username || !password || !confirmPassword) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  // Validação de senha
  if (password.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  // Verificação de senhas iguais
  if (password !== confirmPassword) {
    alert('As senhas não coincidem.');
    return;
  }
  
  // Verifica formato de email básico
  if (!email.includes('@') || !email.includes('.')) {
    alert('Email inválido. Por favor, insira um email válido.');
    return;
  }

  // Verificar se o localStorage está funcionando
  try {
    const test = 'test_register';
    localStorage.setItem(test, test);
    if (localStorage.getItem(test) !== test) {
      alert('Erro: localStorage não está funcionando corretamente.');
      return;
    }
    localStorage.removeItem(test);
  } catch (e) {
    console.error("Erro ao acessar localStorage:", e);
    alert('Seu navegador não suporta ou bloqueou o armazenamento local.');
    return;
  }

  // Verifica se o usuário já existe
  if (localStorage.getItem(username)) {
    alert('Usuário já existe. Por favor, escolha outro nome de usuário.');
    return;
  }

  // Salva os dados do usuário no localStorage
  try {
    const userData = { 
      name, 
      email, 
      password,
      registeredAt: new Date().toISOString()
    };
    
    const userDataString = JSON.stringify(userData);
    console.log("Salvando dados:", userDataString);
    
    localStorage.setItem(username, userDataString);
    
    // Verificar se os dados foram salvos corretamente
    const savedData = localStorage.getItem(username);
    if (!savedData) {
      throw new Error("Dados não foram salvos");
    }
    
    console.log("Dados salvos com sucesso:", savedData);
    
    // Atualiza a lista de usuários (para facilitar a gestão)
    try {
      let usersList = JSON.parse(localStorage.getItem('usersList') || '[]');
      if (!usersList.includes(username)) {
        usersList.push(username);
        localStorage.setItem('usersList', JSON.stringify(usersList));
      }
    } catch (e) {
      console.error("Erro ao atualizar lista de usuários:", e);
      // Não interrompe o fluxo se apenas a lista falhar
    }
    
    alert('Cadastro realizado com sucesso!');
    
    // Salvar em cookie como backup (opcional)
    document.cookie = `user_${username}=${encodeURIComponent(userDataString)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    
    toggleForm('login'); // Muda para o formulário de login
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    alert('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
  }
}

// Função para verificar se o localStorage está disponível e funcionando
function checkLocalStorage() {
  try {
    const test = 'test_check';
    localStorage.setItem(test, test);
    const result = localStorage.getItem(test) === test;
    localStorage.removeItem(test);
    
    if (!result) {
      console.error("localStorage não está funcionando corretamente");
      alert('Seu navegador não está armazenando dados corretamente. Seus dados podem não ser salvos entre sessões.');
      return false;
    }
    
    console.log("localStorage está funcionando corretamente");
    return true;
  } catch (e) {
    console.error("Erro ao acessar localStorage:", e);
    alert('Seu navegador não suporta armazenamento local ou está em modo privado. Seus dados podem não ser salvos entre sessões.');
    return false;
  }
}

// Função para carregar dados do localStorage para um objeto
function loadAllUsers() {
  const users = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== 'usersList' && key !== 'usuarioLogado') {
        try {
          const userData = JSON.parse(localStorage.getItem(key));
          if (userData && userData.name && userData.password) {
            users[key] = userData;
          }
        } catch (e) {
          console.error(`Erro ao processar usuário ${key}:`, e);
        }
      }
    }
    console.log("Usuários carregados:", Object.keys(users).length);
    return users;
  } catch (e) {
    console.error("Erro ao carregar usuários:", e);
    return {};
  }
}

// Verificar localStorage quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  console.log("Página carregada, verificando localStorage...");
  
  const isLocalStorageWorking = checkLocalStorage();
  if (isLocalStorageWorking) {
    console.log("localStorage está funcionando");
    
    // Carregar e exibir todos os usuários (apenas para depuração)
    const allUsers = loadAllUsers();
    console.log("Usuários encontrados:", Object.keys(allUsers));
    
    // Verificar se há um usuário logado
    const loggedInUser = localStorage.getItem('usuarioLogado');
    console.log("Usuário logado:", loggedInUser);
    
    if (loggedInUser && window.location.pathname.includes('login.html')) {
      // Se estiver na página de login e já estiver logado, redirecionar
      console.log("Redirecionando usuário logado para a página principal");
      window.location.href = 'index.html';
    }
  } else {
    console.error("localStorage não está funcionando corretamente");
  }
});

// Função de logout
function logout() {
  localStorage.removeItem('usuarioLogado');
  console.log("Usuário deslogado com sucesso");
  alert('Você saiu com sucesso.');
  window.location.href = 'login.html';
}