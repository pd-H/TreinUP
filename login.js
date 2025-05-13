function toggleForm(form) {
    document.getElementById('loginForm').style.display = form === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = form === 'register' ? 'block' : 'none';
  }

  function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;
    const stored = JSON.parse(localStorage.getItem(username));

    if (stored && stored.password === password) {
      alert(`Bem-vindo, ${stored.name}!`);

      // Salva o nome de usuário no localStorage
      localStorage.setItem("usuarioLogado", username);

      // Redireciona para a página principal
      window.location.href = "index.html";
  
    } else {
      alert('Usuário ou senha inválidos.');
    }

    if (password.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  // Verifica formato de email básico
  if (!email.includes('@') || !email.includes('.')) {
    alert('Email inválido');
    return;
  }
  }

  function register() {
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (localStorage.getItem(username)) {
      alert('Usuário já existe.');
      return;
    }

    localStorage.setItem(username, JSON.stringify({ name, email, password }));
    alert('Cadastro realizado com sucesso!');
    toggleForm('login');
  }