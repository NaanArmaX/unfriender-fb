🧹 Facebook Friends Cleaner
Este é um script de automação usando Puppeteer que remove automaticamente amigos da sua conta do Facebook. Útil para quem deseja fazer uma limpeza em massa de contatos.

⚠️ Atenção: Automação em redes sociais pode violar os termos de uso da plataforma. Use por sua conta e risco.

📦 Requisitos
Node.js (v16 ou superior recomendado)

Conta no Facebook

Google Chrome ou Chromium (opcional, caso queira usar um navegador específico)

🚀 Instalação
bash
Copiar
Editar
git clone https://github.com/seu-usuario/facebook-friends-cleaner.git
cd facebook-friends-cleaner
npm install
🔧 Como usar
Configure seu login

Edite o arquivo config.js ou .env (dependendo da sua implementação) com seu e-mail e senha do Facebook.

Rode o script

bash
Copiar
Editar
node index.js
O script irá abrir o navegador, fazer login na sua conta e começar a remover amigos conforme a lógica que você definiu.

🧠 Como funciona
Login automático via Puppeteer

Acesso à lista de amigos

Iteração sobre os amigos com lógica personalizada (ex: inativos, sem interação, nome específico)

Remove cada amigo de forma controlada, com delays para evitar bloqueios

✅ Funcionalidades
Login automatizado

Remoção de amigos

Possibilidade de filtrar quem será removido

🛡️ Avisos e responsabilidade
Este projeto é apenas educacional. O uso de automações em redes sociais pode resultar em suspensão da conta. Use com cuidado e moderação.

📄 Licença
MIT
