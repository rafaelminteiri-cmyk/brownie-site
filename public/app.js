// ===== MENU MOBILE =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(15,15,15,0.98)';
  } else {
    nav.style.background = 'rgba(15,15,15,0.92)';
  }
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.sobre-card, .vantagem-card, .numero-card, .como-step, .fade-in').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== CONTADOR ANIMADO =====
function animarContador(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const bruto = el.textContent.trim();
  const match = bruto.match(/^([^\d]*)([\d.,]+)([^\d]*)$/);
  if (!match) return;
  const [, prefixo, numero, sufixo] = match;
  const alvo = parseInt(numero.replace(/\D/g, ''), 10);
  if (isNaN(alvo)) return;

  const duracao = 2200;
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const suavizado = 1 - Math.pow(1 - progresso, 3);
    const valorAtual = Math.round(alvo * suavizado);
    el.textContent = prefixo + valorAtual.toLocaleString('pt-BR') + sufixo;
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

document.querySelectorAll('.proof-num').forEach(animarContador);

const contadorObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animarContador(entry.target);
      contadorObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.numero-val').forEach(el => contadorObserver.observe(el));

// ===== FORMULÁRIO =====
async function enviarFormulario(event) {
  event.preventDefault();

  const btn = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-text');

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    estabelecimento: document.getElementById('estabelecimento').value.trim(),
    endereco: document.getElementById('endereco').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
  };

  // Validação simples
  if (!dados.nome || !dados.telefone || !dados.estabelecimento) {
    alert('Por favor, preencha os campos obrigatórios (nome, telefone e estabelecimento).');
    return;
  }

  btn.disabled = true;
  btnText.textContent = 'Enviando...';

  try {
    const response = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      // Mostrar mensagem de sucesso
      document.getElementById('form-parceiro').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    } else {
      throw new Error(result.error || 'Erro ao enviar');
    }
  } catch (err) {
    console.error(err);
    // Mesmo se der erro, mostrar confirmação (evita frustração do usuário)
    // Em produção, você pode ajustar isso
    alert('Houve um problema ao enviar. Por favor, entre em contato diretamente pelo e-mail browniebrasileiro@gmail.com ou Instagram @browniebrasileiro.');
    btn.disabled = false;
    btnText.textContent = 'Quero ser parceiro';
  }
}

// ===== MÁSCARA DE TELEFONE =====
document.getElementById('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  this.value = v;
});
