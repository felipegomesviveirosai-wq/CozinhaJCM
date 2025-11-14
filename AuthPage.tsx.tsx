import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.trim() === '' || password.trim() === '') {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Por favor, insira um e-mail válido.');
        return;
    }
    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : {};

    if (isLoginMode) {
      // Logic for Login
      const userExists = users[email];
      const passwordMatches = userExists && users[email] === password;

      if (passwordMatches) {
        onLoginSuccess(email);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      // Logic for Registration
      if (users[email]) {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        const newUsers = { ...users, [email]: password };
        localStorage.setItem('users', JSON.stringify(newUsers));
        onLoginSuccess(email); // Automatically log in after registration
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
            <svg className="w-12 h-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            <h1 className="text-3xl font-bold text-slate-800 mt-2">CozinhaJCM</h1>
            <p className="text-slate-600">
              {isLoginMode ? 'Faça login para encontrar receitas deliciosas.' : 'Crie sua conta para começar.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-slate-700 font-semibold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="********"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            {isLoginMode ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          {isLoginMode ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <button onClick={handleToggleMode} className="font-semibold text-orange-600 hover:underline focus:outline-none">
            {isLoginMode ? 'Registre-se' : 'Faça login'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default AuthPage;
