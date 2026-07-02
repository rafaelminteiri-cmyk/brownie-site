const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { nome, telefone, estabelecimento, endereco, cidade } = req.body;

  if (!nome || !telefone || !estabelecimento) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const htmlEmail = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

        <!-- Cabeçalho -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 32px;text-align:center">
            <div style="font-size:28px;margin-bottom:4px">🍫</div>
            <div style="font-size:20px;font-weight:700;color:#D4AF37;letter-spacing:1px">BROWNIE BRASILEIRO</div>
            <div style="font-size:12px;color:#888;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Novo cadastro de parceiro</div>
          </td>
        </tr>

        <!-- Destaque -->
        <tr>
          <td style="background:#D4AF37;padding:14px 32px;text-align:center">
            <div style="font-size:15px;font-weight:700;color:#1a1a1a">🎉 Um novo estabelecimento quer ser parceiro!</div>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="padding:32px">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:20px">
                  <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Responsável</div>
                  <div style="font-size:18px;font-weight:700;color:#1a1a1a">${nome}</div>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-right:10px">
                        <div style="background:#f8f8f8;border-radius:8px;padding:14px">
                          <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">📱 Telefone / WhatsApp</div>
                          <div style="font-size:16px;font-weight:600;color:#1a1a1a">${telefone}</div>
                        </div>
                      </td>
                      <td width="50%" style="padding-left:10px">
                        <div style="background:#f8f8f8;border-radius:8px;padding:14px">
                          <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">🏪 Estabelecimento</div>
                          <div style="font-size:16px;font-weight:600;color:#1a1a1a">${estabelecimento}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${endereco ? `
              <tr>
                <td style="padding-bottom:20px">
                  <div style="background:#f8f8f8;border-radius:8px;padding:14px">
                    <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">📍 Endereço</div>
                    <div style="font-size:15px;color:#1a1a1a">${endereco}${cidade ? ' — ' + cidade : ''}</div>
                  </div>
                </td>
              </tr>` : ''}

              <tr>
                <td>
                  <div style="background:#1a1a1a;border-radius:8px;padding:16px;text-align:center">
                    <div style="font-size:12px;color:#888;margin-bottom:6px">Entre em contato pelo WhatsApp</div>
                    <a href="https://wa.me/55${telefone.replace(/\D/g,'')}" style="display:inline-block;background:#25D366;color:#fff;font-size:14px;font-weight:700;padding:10px 24px;border-radius:6px;text-decoration:none">💬 Abrir WhatsApp</a>
                  </div>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Rodapé -->
        <tr>
          <td style="background:#f8f8f8;padding:16px 32px;text-align:center;border-top:1px solid #eee">
            <div style="font-size:12px;color:#aaa">Enviado em ${dataHora} via browniebrasileiro.com</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"Brownie Brasileiro Site" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINO || process.env.EMAIL_USER,
      subject: `🍫 Novo parceiro: ${estabelecimento} — ${nome}`,
      html: htmlEmail,
    });

    return res.status(200).json({ ok: true, message: 'Cadastro enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Erro ao enviar. Tente novamente.' });
  }
}
