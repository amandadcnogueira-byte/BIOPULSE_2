/* ===== DADOS EDITÁVEIS ===== */
// Valores de exemplo: troque pelos dados oficiais (ex.: CETESB).
const DADOS_AR = { 2025: 36, 2024: 41 };
const EQUIPE = [
    { nome: 'Amanda Nogueira', funcao: 'Apresentadora' },
    { nome: 'Ana Heleine', funcao: 'Líder' },
    { nome: 'Amanda Miwa', funcao: 'Líder' },
    { nome: 'Henrique', funcao: 'Avaliador' },
    { nome: 'Manuela', funcao: 'Líder' },
    { nome: 'Rafaela', funcao: 'Líder' },
    { nome: 'Juliana Petzold', funcao: 'Líder' }
];
const CURIOSIDADES = [
    ['Pau-brasil', 'É a árvore nacional e deu nome ao nosso país. Sua madeira produzia um corante vermelho muito valorizado.'],
    ['Vitória-régia', 'Vive nos rios e lagos da Amazônia. Suas folhas redondas podem passar de 2 metros de diâmetro.'],
    ['Cerrado', 'É chamado de “floresta de cabeça para baixo” porque muitas plantas têm raízes bem mais profundas que o tamanho da copa.'],
    ['Caatinga', 'É o único bioma que existe só no Brasil. Muitas plantas perdem as folhas na seca para economizar água.'],
    ['Mata Atlântica', 'Restam cerca de 12% da cobertura original, mas ela ainda abriga milhares de espécies que só vivem aqui.'],
    ['Pantanal', 'É a maior planície alagável do planeta. As plantas se adaptam às cheias e secas ao longo do ano.'],
    ['Castanheira', 'Pode passar de 50 metros de altura e viver centenas de anos. A cutia ajuda a espalhar suas sementes.'],
    ['Ipê', 'Floresce quando está sem folhas, no fim do inverno seco. Existem ipês amarelos, rosas, roxos e brancos.']
];
const BANCO = [
    { q: 'Qual árvore deu nome ao Brasil?', o: ['Pau-brasil', 'Ipê', 'Jatobá'], c: 0 },
    { q: 'Qual bioma existe somente no Brasil?', o: ['Pantanal', 'Caatinga', 'Pampa'], c: 1 },
    { q: 'Por que o Cerrado é a “floresta de cabeça para baixo”?', o: ['As árvores crescem de ponta-cabeça', 'Chove de baixo para cima', 'Muitas plantas têm raízes bem profundas'], c: 2 },
    { q: 'Onde vive a vitória-régia?', o: ['Rios e lagos da Amazônia', 'Dunas do litoral', 'Campos secos do Sul'], c: 0 },
    { q: 'Quanto da Mata Atlântica original ainda existe?', o: ['Cerca de 12%', 'Cerca de 50%', 'Cerca de 80%'], c: 0 },
    { q: 'Qual é a maior planície alagável do planeta?', o: ['Caatinga', 'Pantanal', 'Cerrado'], c: 1 },
    { q: 'Quando o ipê costuma florescer?', o: ['Cheio de folhas, no verão', 'Sem folhas, no fim do inverno seco', 'Só à noite'], c: 1 },
    { q: 'Que animal ajuda a espalhar as sementes da castanheira?', o: ['A cutia', 'O tubarão', 'O pinguim'], c: 0 },
    { q: 'O que as algas do BioPulse absorvem na fotossíntese?', o: ['Gás carbônico (CO₂)', 'Óleo', 'Areia'], c: 0 },
    { q: 'Qual é o papel da IA no BioPulse?', o: ['Substituir as algas', 'Analisar dados e sugerir ajustes', 'Produzir luz'], c: 1 },
    { q: 'De onde vem boa parte do oxigênio do planeta?', o: ['De algas e fitoplâncton', 'De vulcões', 'De rochas'], c: 0 },
    { q: 'No índice de qualidade do ar (IQAr), quanto menor o número...', o: ['Pior é o ar', 'Melhor é o ar', 'Não muda nada'], c: 1 }
];
/* ===== FLORES, NÍVEIS E JARDIM ===== */
const $ = id => document.getElementById(id);
const NIVEIS = [[0, 'Semente'], [3, 'Broto'], [6, 'Muda'], [10, 'Flor'], [15, 'Jardim florido'], [22, 'Guardião(ã) da Flora']];
const CORES = ['#e8548c', '#f27aa8', '#f7a8c6', '#d6336c', '#ff8fb8', '#c2185b'];
let estado = { flores: 0, vistas: [] };
try { Object.assign(estado, JSON.parse(localStorage.getItem('flora') || '{}')); } catch (e) { }
const salvar = () => { try { localStorage.setItem('flora', JSON.stringify(estado)); } catch (e) { } };
function nivelAtual() { let i = 0; NIVEIS.forEach(([min], k) => { if (estado.flores >= min) i = k; }); return i; }
function aviso(t) {
    const a = $('aviso'); a.textContent = t; a.classList.add('mostra');
    clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove('mostra'), 3200);
}
function ganhar(n) {
    const antes = nivelAtual();
    estado.flores += n; salvar(); atualizarFlores();
    const depois = nivelAtual();
    if (depois > antes) aviso('Seu jardim cresceu! Novo nível: ' + NIVEIS[depois][1]);
}
function atualizarFlores() {
    const i = nivelAtual(), prox = NIVEIS[i + 1], nome = NIVEIS[i][1];
    $('placar').textContent = estado.flores; $('nivel').textContent = nome; $('nivel-nome').textContent = nome;
    if (prox) {
        const pct = (estado.flores - NIVEIS[i][0]) / (prox[0] - NIVEIS[i][0]) * 100;
        $('prog').style.width = pct + '%';
        $('jardim-txt').textContent = `Faltam ${prox[0] - estado.flores} flores para chegar a “${prox[1]}”. Ganhe flores descobrindo curiosidades (1 por flor) e acertando o quiz (2 por acerto).`;
    } else {
        $('prog').style.width = '100%';
        $('jardim-txt').textContent = 'Você chegou ao topo: cuidar da flora é cuidar do ar que respiramos!';
    }
    $('canteiro').innerHTML = Array.from({ length: Math.min(estado.flores, 60) }, (_, k) =>
        `<svg class="ico mini" style="color:${CORES[k % CORES.length]};animation-delay:${k * 30}ms"><use href="#flor"/></svg>`).join('');
}
/* ===== NAVEGAÇÃO ENTRE TELAS ===== */
function rota() {
    const id = location.hash.slice(1) || 'home';
    const alvo = document.getElementById(id) ? id : 'home';
    document.querySelectorAll('.tela').forEach(t => t.hidden = t.id !== alvo);
    if (alvo === 'co2') desenharCO2();
    scrollTo(0, 0);
}
addEventListener('hashchange', rota);
/* ===== TELA AR ===== */
function faixa(v) { return v <= 40 ? 'Boa' : v <= 80 ? 'Moderada' : v <= 120 ? 'Ruim' : v <= 200 ? 'Muito ruim' : 'Péssima'; }
(function () {
    const a = DADOS_AR[2025], b = DADOS_AR[2024], d = a - b;
    const cls = d > 0 ? 'sobe' : 'desce';
    const seta = d > 0 ? '▲ aumento' : d < 0 ? '▼ diminuição' : 'sem mudança';
    document.getElementById('indices').innerHTML =
        `<article class="cartao"><h3>Média 2025</h3><p class="num">${a}</p><p>Qualidade: ${faixa(a)}</p></article>` +
        `<article class="cartao"><h3>Média 2024</h3><p class="num">${b}</p><p>Qualidade: ${faixa(b)}</p></article>` +
        `<article class="cartao"><h3>Diferença</h3><p class="num ${cls}">${Math.abs(d)}</p><p class="${cls}">${seta}</p></article>`;
})();
/* ===== TELA IA ===== */
function decidir() {
    const ta = +$('ta').value, tr = +$('tr').value, co = +$('co').value;
    $('vTa').textContent = ta; $('vTr').textContent = tr; $('vCo').textContent = co;
    const fTemp = Math.max(0, 1 - Math.abs(tr - 26) / 14);     // reator rende mais perto de 26 °C
    const fCo2 = Math.min(1, (co - 400) / 400 + 0.4);          // mais CO₂ na região = mais trabalho para o reator
    const ef = Math.round(fTemp * fCo2 * 100);
    $('barra').style.width = ef + '%';
    let t = `Potência estimada do BioPulse: ${ef}%. `;
    if (tr > ta + 4) t += 'O reator está mais quente que o ar: a IA liga o resfriamento. ';
    else if (tr < 22) t += 'O reator está frio demais: a IA aquece a cultura. ';
    else t += 'A temperatura do reator está boa. ';
    t += co > 700 ? 'Há muito CO₂ na região, então a IA aumenta a captação.' : 'CO₂ em nível moderado, captação normal.';
    $('decisao').textContent = t;
}
['ta', 'tr', 'co'].forEach(i => $(i).addEventListener('input', decidir));
decidir();
/* ===== TELA CO₂ ===== */
const ARVORE = 60; // g de CO₂ por dia (≈ 22 kg/ano)
function desenharCO2() {
    const vol = +$('vol').value, prod = +$('prod').value;
    $('vVol').textContent = vol; $('vProd').textContent = prod;
    const reator = vol * prod * 1.83;
    $('res').textContent = Math.round(reator) + ' g/dia (' + (reator / ARVORE).toFixed(1).replace('.', ',') + ' árvores comuns)';
    const cv = $('canvas'), cx = cv.getContext('2d'), W = cv.width, H = cv.height;
    cx.clearRect(0, 0, W, H);
    const max = Math.max(reator, ARVORE) * 1.15, base = H - 50;
    [['Árvore comum', ARVORE, '#3fa466', 110], ['Bio-reator', reator, '#e8548c', 330]].forEach(([n, v, cor, x]) => {
        const h = (base - 30) * v / max;
        cx.fillStyle = cor; cx.beginPath(); cx.roundRect(x, base - h, 120, h, 10); cx.fill();
        cx.fillStyle = '#4a2a3a'; cx.font = '14px sans-serif'; cx.textAlign = 'center';
        cx.fillText(n, x + 60, H - 22); cx.fillText(Math.round(v) + ' g', x + 60, base - h - 8);
    });
    cx.fillText('CO₂ absorvido por dia', W / 2, 18);
}
['vol', 'prod'].forEach(i => $(i).addEventListener('input', desenharCO2));
/* ===== FLORA BRASILEIRA ===== */
$('curiosidades').innerHTML = CURIOSIDADES.map(([n, t]) =>
    `<button class="flor-card"><svg class="ico"><use href="#flor"/></svg><h3>${n}</h3><p>${t}</p></button>`).join('');
document.querySelectorAll('.flor-card').forEach((c, i) => {
    if (estado.vistas.includes(i)) c.classList.add('vista');
    c.addEventListener('click', () => {
        if (!estado.vistas.includes(i)) { estado.vistas.push(i); c.classList.add('vista'); ganhar(1); }
        c.classList.toggle('aberto');
    });
});
/* ===== QUIZ (perguntas sorteadas a cada rodada) ===== */
const POR_RODADA = 5;
const embaralhar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
const box = $('quiz-box'); let rodada = [], n = 0, acertos = 0;
function novaRodada() {
    rodada = embaralhar(BANCO).slice(0, POR_RODADA).map(p => ({ q: p.q, o: embaralhar(p.o.map((t, i) => ({ t, ok: i === p.c }))) }));
    n = 0; acertos = 0; pergunta();
}
function pergunta() {
    if (n >= rodada.length) {
        box.innerHTML = `<h3>Você acertou ${acertos} de ${rodada.length}!</h3><p class="msg">Flores ganhas nesta rodada: ${acertos * 2}</p><button class="btn" id="refazer">Nova rodada com outras perguntas</button>`;
        $('refazer').onclick = novaRodada;
        return;
    }
    const p = rodada[n];
    box.innerHTML = `<h3>${n + 1}/${rodada.length} — ${p.q}</h3>` + p.o.map((x, i) => `<button class="opc" data-i="${i}">${x.t}</button>`).join('') + '<p class="msg" id="msg"></p>';
    const bs = box.querySelectorAll('.opc');
    bs.forEach(b => b.addEventListener('click', () => {
        bs.forEach(x => x.disabled = true);
        const certa = p.o.findIndex(x => x.ok); bs[certa].classList.add('certa');
        if (+b.dataset.i === certa) { acertos++; ganhar(2); $('msg').textContent = 'Correto! +2 flores'; }
        else { b.classList.add('errada'); $('msg').textContent = 'Quase! A resposta certa está em verde.'; }
        setTimeout(() => { n++; pergunta(); }, 1600);
    }));
}
novaRodada();
/* ===== CRÉDITOS ===== */
$('equipe').innerHTML = EQUIPE.map(m => `<article class="cartao"><svg class="ico"><use href="#flor"/></svg><h3>${m.nome}</h3><p>${m.funcao}</p></article>`).join('');
atualizarFlores();
rota();

/* ===== CHATBOT (usa a rota /chat do app.py) ===== */
const chat = $('chat'), msgs = $('chat-msgs'), inp = $('chat-input');
function bolha(t, quem) {
    const d = document.createElement('div');
    d.className = 'bolha ' + quem; d.textContent = t;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
}
function alternarChat(abrir) {
    chat.hidden = !abrir; $('chat-abrir').setAttribute('aria-expanded', abrir);
    if (abrir) {
        if (!msgs.children.length) bolha('Olá! Pergunte sobre algas, flora brasileira ou o BioPulse. (I answer in English!)', 'bot');
        inp.focus();
    }
}
$('chat-abrir').onclick = () => alternarChat(chat.hidden);
$('chat-fechar').onclick = () => alternarChat(false);
async function enviar() {
    const t = inp.value.trim(); if (!t) return;
    inp.value = ''; bolha(t, 'eu');
    const esp = bolha('…', 'bot'); $('chat-enviar').disabled = true;
    try {
        const r = await fetch('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagem: t }) });
        const d = await r.json();
        esp.textContent = d.resposta || d.erro || 'Sem resposta.';
    } catch (e) { esp.textContent = 'Não consegui falar com o servidor. O app.py está rodando?'; }
    $('chat-enviar').disabled = false; inp.focus(); msgs.scrollTop = msgs.scrollHeight;
}
$('chat-enviar').onclick = enviar;
inp.addEventListener('keydown', e => { if (e.key === 'Enter') enviar(); });

/* ===== REINICIAR JARDIM (funciona mesmo que o botão seja recriado) ===== */
let confirmandoReset = false, timerReset;
document.addEventListener('click', ev => {
    const b = ev.target.closest('#reiniciar');
    if (!b) return;
    if (!confirmandoReset) {
        confirmandoReset = true;
        b.textContent = 'Clique de novo para confirmar';
        timerReset = setTimeout(() => { confirmandoReset = false; b.textContent = 'Reiniciar jardim'; }, 4000);
        return;
    }
    clearTimeout(timerReset);
    confirmandoReset = false;
    b.textContent = 'Reiniciar jardim';
    estado = { flores: 0, vistas: [] };
    salvar();
    atualizarFlores();
    document.querySelectorAll('.flor-card').forEach(c => c.classList.remove('vista', 'aberto'));
    novaRodada();
    aviso('Jardim reiniciado!');
});