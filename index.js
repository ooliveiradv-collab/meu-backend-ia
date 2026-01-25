// Webhook do Mercado Pago
app.post("/webhook-mercadopago", async (req, res) => {
  try {
    const payment = req.body;

    console.log("Webhook recebido:", payment);

    // Verifica se é um pagamento aprovado
    if (payment.type === "payment" && payment.data?.id) {
      console.log("Pagamento confirmado:", payment.data.id);

      // Aqui no próximo passo vamos buscar os detalhes
      // e liberar o plano no Firebase
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});
// Webhook do Mercado Pago
app.post("/webhook-mercadopago", (req, res) => {
  try {
    console.log("Webhook recebido do Mercado Pago");
    console.log(req.body);

    // Mercado Pago envia vários tipos de evento
    // Aqui vamos apenas confirmar que chegou
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});
// Importa o Express
const express = require("express");

// Cria a aplicação
const app = express();

// Permite receber JSON no body das requisições
app.use(express.json());

// Define a porta (Render, Railway, etc usam process.env.PORT)
const PORT = process.env.PORT || 3000;

/**
 * Rota de teste de saúde
 * Serve para verificar se o backend está online
 */
app.get("/health", (req, res) => {
  res.send("ok");
});

/**
 * Inicia o servidor
 */
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// Importa o SDK do Mercado Pago
const mercadopago = require("mercadopago");

// Configura o access token a partir da variável de ambiente
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

/**
 * Rota para criar o pagamento usando Checkout Pro
 */
app.post("/criar-pagamento", async (req, res) => {
  try {
    // Cria a preferência de pagamento
    const preference = {
      items: [
        {
          title: "Plano Mensal",
          unit_price: 29.9,
          quantity: 1,
        },
      ],
    };

    // Cria a preferência no Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Retorna o link do Checkout Pro
    res.json({
      init_point: response.body.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});
/**
 * Armazenamento simples em memória
 * (isso some quando o servidor reinicia — é só para MVP)
 */
const acessosAtivos = {};

/**
 * Webhook do Mercado Pago
 * Essa rota é chamada automaticamente pelo Mercado Pago
 */
app.post("/webhook-mercadopago", async (req, res) => {
  try {
    // O Mercado Pago envia vários tipos de notificação
    const { type, data } = req.body;

    // Verifica se é notificação de pagamento
    if (type === "payment") {
      const paymentId = data.id;

      // Aqui, para simplificar, vamos considerar o pagamento aprovado direto
      // (Em produção, o ideal é consultar a API do Mercado Pago pelo ID)
      console.log("Pagamento recebido. ID:", paymentId);

      // SIMULA usuário identificado (exemplo)
      const userId = "usuario_teste";

      // Data atual
      const agora = new Date();

      // Soma 30 dias
      const expiracao = new Date(agora);
      expiracao.setDate(agora.getDate() + 30);

      // Salva acesso ativo
      acessosAtivos[userId] = expiracao;

      console.log(
        `Pagamento aprovado. Acesso liberado até ${expiracao.toISOString()}`
      );
    }

    // Sempre responder 200 para o Mercado Pago
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});
// Importa o fetch para chamar a API do Gemini
// (Node 18+ já tem fetch nativo; se não tiver, depois ajustamos)
const fetch = global.fetch;

/**
 * Rota para perguntar à IA (Google Gemini)
 */
app.post("/perguntar-ia", async (req, res) => {
  try {
    const { pergunta } = req.body;

    // Simulação de usuário
    const userId = "usuario_teste";

    // Verifica se o usuário tem acesso ativo
    const expiracao = acessosAtivos[userId];
    const agora = new Date();

    if (!expiracao || agora > expiracao) {
      return res.status(403).json({
        mensagem: "Seu plano expirou. Faça o pagamento para continuar.",
      });
    }

    // Chamada à API do Google Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: pergunta }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extrai a resposta da IA
    const respostaIA =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível gerar resposta.";

    res.json({
      resposta: respostaIA,
    });
  } catch (error) {
    console.error("Erro ao chamar a IA:", error);
    res.status(500).json({
      erro: "Erro ao processar a pergunta",
    });
  }
});
    
