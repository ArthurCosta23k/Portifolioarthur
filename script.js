
const botaoTema = document.getElementById("botao-tema");

function atualizarIconeTema() {
  const escuro = document.documentElement.dataset.tema === "escuro";
  botaoTema.textContent = escuro ? "☀️" : "🌙";
}

botaoTema.addEventListener("click", () => {
  const novoTema = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
  document.documentElement.dataset.tema = novoTema;
  localStorage.setItem("tema", novoTema);
  atualizarIconeTema();
});

atualizarIconeTema();


const botaoMenu = document.getElementById("botao-menu");
const menu = document.getElementById("menu");

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto);
  botaoMenu.textContent = aberto ? "✕" : "☰";
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.textContent = "☰";
  });
});


const alvoDigitacao = document.getElementById("digitando");
const frases = [
  "estudante de TI",
  "futuro desenvolvedor",
  "curioso por tecnologia",
  "em busca do primeiro estágio"
];

const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let fraseAtual = 0;
let letraAtual = 0;
let apagando = false;

function digitar() {
  const frase = frases[fraseAtual];
  alvoDigitacao.textContent = frase.slice(0, letraAtual);

  if (!apagando && letraAtual < frase.length) {
    letraAtual++;
    setTimeout(digitar, 90);
  } else if (!apagando) {
    apagando = true;
    setTimeout(digitar, 1400);
  } else if (letraAtual > 0) {
    letraAtual--;
    setTimeout(digitar, 45);
  } else {
    apagando = false;
    fraseAtual = (fraseAtual + 1) % frases.length;
    setTimeout(digitar, 300);
  }
}

if (reduzirMovimento) {
  alvoDigitacao.textContent = frases[0];
} else {
  digitar();
}


const elementos = document.querySelectorAll(
  ".secao h2, .secao > .rotulo, .sobre-texto, .sobre-fatos, .sub, .tags, .cartao, .botao-github, .contato-intro, form"
);

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });

elementos.forEach((el) => {
  el.classList.add("aparecer");
  observador.observe(el);
});


const hero = document.querySelector(".hero");

if (!reduzirMovimento) {
  hero.addEventListener("mousemove", (e) => {
    const area = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - area.left + "px");
    hero.style.setProperty("--my", e.clientY - area.top + "px");
  });
}


const modal = document.getElementById("modal");

function mostrarModal(titulo, texto) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-texto").textContent = texto;
  modal.showModal();
}

document.getElementById("modal-fechar").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

document.querySelectorAll(".botao-link").forEach((botao) => {
  botao.addEventListener("click", () => {
    mostrarModal(botao.dataset.titulo, botao.dataset.texto);
  });
});

const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoTelefone = document.getElementById("telefone");
const campoMensagem = document.getElementById("mensagem");


campoNome.addEventListener("input", () => {
  campoNome.value = campoNome.value
    .replace(/[^A-Za-zÀ-ÿ\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|\s)(\S)/g, (_, espaco, letra) => espaco + letra.toUpperCase());
});


campoEmail.addEventListener("input", () => {
  campoEmail.value = campoEmail.value.toLowerCase().replace(/\s/g, "");
});


function mascaraTelefone(valor) {
  const n = valor.replace(/\D/g, "").slice(0, 11);

  if (n.length > 10) return n.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  if (n.length > 6)  return n.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  if (n.length > 2)  return n.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  if (n.length > 0)  return "(" + n;
  return "";
}

campoTelefone.addEventListener("input", () => {
  campoTelefone.value = mascaraTelefone(campoTelefone.value);
});


const contador = document.createElement("small");
contador.className = "contador";
contador.textContent = "0/300";
campoMensagem.insertAdjacentElement("afterend", contador);

campoMensagem.addEventListener("input", () => {
  contador.textContent = campoMensagem.value.length + "/300";
});


const formulario = document.getElementById("formulario");

function mostrarErro(campo, mensagem) {
  let aviso = campo.nextElementSibling;
  if (!aviso || !aviso.classList.contains("erro")) {
    aviso = document.createElement("small");
    aviso.className = "erro";
    campo.insertAdjacentElement("afterend", aviso);
  }
  aviso.textContent = mensagem;
  campo.classList.toggle("invalido", mensagem !== "");
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  let valido = true;

  if (campoNome.value.trim().length < 3) {
    mostrarErro(campoNome, "Digite seu nome (mínimo 3 letras).");
    valido = false;
  } else {
    mostrarErro(campoNome, "");
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(campoEmail.value)) {
    mostrarErro(campoEmail, "Digite um e-mail válido.");
    valido = false;
  } else {
    mostrarErro(campoEmail, "");
  }

  if (campoTelefone.value.replace(/\D/g, "").length < 10) {
    mostrarErro(campoTelefone, "Digite o telefone com DDD.");
    valido = false;
  } else {
    mostrarErro(campoTelefone, "");
  }

  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(campoMensagem, "A mensagem precisa ter pelo menos 10 caracteres.");
    valido = false;
  } else {
    mostrarErro(campoMensagem, "");
  }

  if (!valido) return;

  const primeiroNome = campoNome.value.trim().split(" ")[0];
  mostrarModal("Mensagem enviada!", "Valeu pelo contato, " + primeiroNome + "! Respondo assim que possível.");
  formulario.reset();
  contador.textContent = "0/300";
});
