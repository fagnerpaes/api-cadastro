/**
 * Iniciador do servidor Express
 */

const app = require('./app');

const findAvailablePort = (startPort) => {
  const net = require('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findAvailablePort(startPort + 1)));
  });
};

const startServer = async () => {
  const basePort = process.env.PORT || 5000;
  const PORT = await findAvailablePort(basePort);

  const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   API de Cadastro de Produtos - Express Server        ║
║   Status: ✓ Iniciada com sucesso                      ║
║   Porta: ${PORT}                                        ║
║   Documentação: http://localhost:${PORT}/api/docs     ║
║   Health Check: http://localhost:${PORT}/health       ║
╚═══════════════════════════════════════════════════════╝
  `);
  });

  // Tratamento de erro durante a inicialização
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Erro: Porta ${PORT} já está em uso`);
    } else {
      console.error('Erro ao iniciar servidor:', error);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Encerrando servidor...');
    server.close(() => {
      console.log('Servidor encerrado');
      process.exit(0);
    });
  });
};

startServer();
