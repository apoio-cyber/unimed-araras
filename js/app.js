/* Formulário de inclusão — lógica da página */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var MAX_DEP = 3;
  var LS_SIG = 'unimed_assinatura_intermediario', LS_STAMP = 'unimed_carimbo_empresa';

  var EST_CIVIL = ['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Separado(a)', 'Viúvo(a)'];
  var PARENTESCO = ['Cônjuge', 'Companheiro(a)', 'Filho(a)', 'Enteado(a)', 'Outro'];

  var CAMPOS_TIT = [
    { k: 'nome', l: 'Nome completo (sem abreviação)', cls: 'span2', up: 1 },
    { k: 'cpf', l: 'CPF', mask: 'cpf' },
    { k: 'rg', l: 'RG', opt: 1, obs: 'Se não tiver, será usado o CPF' },
    { k: 'rgOrgao', l: 'Órgão emissor do RG', opt: 1, ph: 'SSP/SP', up: 1 },
    { k: 'nasc', l: 'Data de nascimento', mask: 'data' },
    { k: 'sexo', l: 'Sexo', sel: [['', 'Selecione'], ['M', 'Masculino'], ['F', 'Feminino']] },
    { k: 'estadoCivil', l: 'Estado civil', sel: [['', 'Selecione']].concat(EST_CIVIL.map(function (e) { return [e, e]; })) },
    { k: 'sus', l: 'Cartão Nacional de Saúde (SUS)', mask: 'sus' },
    { k: 'admissao', l: 'Data de admissão', mask: 'data' },
    { k: 'pis', l: 'PIS/PASEP', opt: 1, obs: 'Não obrigatório' },
    { k: 'cep', l: 'CEP', mask: 'cep', obs: 'Preenche o endereço automaticamente' },
    { k: 'mae', l: 'Nome da mãe (sem abreviação)', cls: 'span3', up: 1 },
    { k: 'endereco', l: 'Endereço (rua/avenida)', cls: 'span2', up: 1 },
    { k: 'numero', l: 'Número / complemento', up: 1 },
    { k: 'bairro', l: 'Bairro', up: 1 },
    { k: 'cidade', l: 'Cidade/Estado', ph: 'ARARAS/SP', up: 1 }
  ];
  var CAMPOS_DEP = [
    { k: 'nome', l: 'Nome completo (sem abreviação)', cls: 'span2', up: 1 },
    { k: 'parentesco', l: 'Parentesco', sel: [['', 'Selecione']].concat(PARENTESCO.map(function (e) { return [e, e]; })) },
    { k: 'cpf', l: 'CPF', mask: 'cpf', opt: 1, obs: 'Filhos sem CPF: anexar certidão de nascimento' },
    { k: 'rg', l: 'RG', opt: 1, obs: 'Se não tiver, será usado o CPF' },
    { k: 'rgOrgao', l: 'Órgão emissor do RG', opt: 1, ph: 'SSP/SP', up: 1 },
    { k: 'nasc', l: 'Data de nascimento', mask: 'data' },
    { k: 'sexo', l: 'Sexo', sel: [['', 'Selecione'], ['M', 'Masculino'], ['F', 'Feminino']] },
    { k: 'estadoCivil', l: 'Estado civil', sel: [['', 'Selecione']].concat(EST_CIVIL.map(function (e) { return [e, e]; })) },
    { k: 'sus', l: 'Cartão Nacional de Saúde (SUS)', mask: 'sus' },
    { k: 'declNasc', l: 'Decl. Nasc. (Declaração de Nascido Vivo)', opt: 1, obs: 'Não obrigatório' },
    { k: 'mae', l: 'Nome da mãe (sem abreviação)', cls: 'span2', up: 1 }
  ];

  var deps = [];            // [{uid}]
  var uidSeq = 1;
  var resp = {};            // resp[qid][uid] = valor
  var det = {};             // det[qid][uid] = {doenca, tratamento, diagnostico}
  var motivos = { '30': {}, '31': {} };
  var arquivos = {};        // arquivos[uid][chave] = File
  var alterado = false;

  // ---------------- utilidades ----------------
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function so(v) { return (v || '').replace(/\D/g, ''); }
  var MASK = {
    cpf: function (v) { v = so(v).slice(0, 11); return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); },
    cep: function (v) { v = so(v).slice(0, 8); return v.replace(/(\d{5})(\d)/, '$1-$2'); },
    data: function (v) { v = so(v).slice(0, 8); return v.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2'); },
    mesano: function (v) { v = so(v).slice(0, 6); return v.replace(/(\d{2})(\d)/, '$1/$2'); },
    sus: function (v) { v = so(v).slice(0, 15); return v.replace(/(\d{3})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2'); },
    num1: function (v) { return v.replace(/[^\d,\.]/g, '').replace('.', ',').slice(0, 6); }
  };
  document.addEventListener('input', function (e) {
    var m = e.target.getAttribute && e.target.getAttribute('data-mask');
    if (m && MASK[m]) e.target.value = MASK[m](e.target.value);
    if (e.target.classList) e.target.classList.remove('invalido');
    alterado = true;
  }, true); // captura: aplica a máscara antes dos demais handlers
  window.addEventListener('beforeunload', function (e) { if (alterado) { e.preventDefault(); e.returnValue = ''; } });

  function cpfValido(c) {
    c = so(c); if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (var t = 9; t < 11; t++) {
      var s = 0; for (var i = 0; i < t; i++) s += +c[i] * (t + 1 - i);
      if (((10 * s) % 11) % 10 !== +c[t]) return false;
    }
    return true;
  }
  function dataValida(d) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || ''); if (!m) return false;
    var dt = new Date(+m[3], +m[2] - 1, +m[1]);
    return dt.getDate() === +m[1] && dt.getMonth() === +m[2] - 1 && +m[3] > 1900;
  }
  function hojeStr() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }

  // ---------------- campos ----------------
  function montarCampos(container, campos, prefixo) {
    campos.forEach(function (c) {
      var lab = el('label', { class: c.cls || null });
      lab.appendChild(document.createTextNode(c.l + (c.opt ? '' : ' *')));
      var inp;
      if (c.sel) {
        inp = el('select');
        c.sel.forEach(function (o) { inp.appendChild(el('option', { value: o[0] }, esc(o[1]))); });
      } else {
        inp = el('input', { type: 'text', 'data-mask': c.mask || null, placeholder: c.ph || null, autocomplete: 'off' });
        if (c.up) inp.style.textTransform = 'uppercase';
      }
      inp.id = prefixo + c.k;
      inp.dataset.campo = c.k;
      lab.appendChild(inp);
      if (c.obs) lab.appendChild(el('span', { class: 'obs' }, esc(c.obs)));
      container.appendChild(lab);
    });
  }

  function lerPessoa(prefixo, campos) {
    var p = {};
    campos.forEach(function (c) {
      var v = ($('#' + prefixo + c.k) || {}).value || '';
      v = v.trim(); if (c.up) v = v.toUpperCase();
      p[c.k] = v;
    });
    return p;
  }

  function pessoas() {
    var lista = [Object.assign({ uid: 't', rotulo: 'Titular', curto: 'Titular' }, lerPessoa('t_', CAMPOS_TIT))];
    deps.forEach(function (d, i) {
      lista.push(Object.assign({ uid: d.uid, rotulo: 'Dependente ' + (i + 1), curto: 'D' + (i + 1) }, lerPessoa(d.uid + '_', CAMPOS_DEP)));
    });
    return lista;
  }

  // ---------------- dependentes ----------------
  function addDep() {
    if (deps.length >= MAX_DEP) return;
    var uid = 'd' + (uidSeq++);
    deps.push({ uid: uid });
    var box = el('div', { class: 'dep', id: 'box_' + uid });
    var top = el('div', { class: 'dep-top' });
    top.appendChild(el('b', { class: 'dep-titulo' }));
    var rm = el('button', { type: 'button', class: 'btn ghost mini' }, 'Remover');
    rm.onclick = function () {
      if (!confirm('Remover este dependente e as respostas dele?')) return;
      deps = deps.filter(function (d) { return d.uid !== uid; });
      box.remove(); delete arquivos[uid];
      atualizarTudo();
    };
    top.appendChild(rm);
    box.appendChild(top);
    var g = el('div', { class: 'grid3' });
    montarCampos(g, CAMPOS_DEP, uid + '_');
    box.appendChild(g);
    $('#dependentes').appendChild(box);
    atualizarTudo();
  }

  function atualizarTudo() {
    deps.forEach(function (d, i) { $('#box_' + d.uid + ' .dep-titulo').textContent = 'Dependente ' + (i + 1) + ' (D' + (i + 1) + ')'; });
    $('#btnAddDep').hidden = deps.length >= MAX_DEP;
    renderQuestionario();
    renderDocumentos();
  }

  // ---------------- questionário ----------------
  function sexoBloqueia(q, p) { return q.sex && p.sexo && p.sexo !== q.sex; }

  function renderQuestionario() {
    var P = pessoas();
    var wrap = $('#questionario');
    var scrollY = window.scrollY;
    // atalhos
    var at = $('#atalhos'); at.innerHTML = '';
    P.forEach(function (p) {
      var b = el('button', { type: 'button', class: 'btn ghost mini' }, 'Marcar "N" em tudo — ' + esc(p.curto));
      b.onclick = function () {
        PERGUNTAS.forEach(function (q) {
          if (q.type !== 'yn' && q.type !== 'yn30') return;
          resp[q.id] = resp[q.id] || {};
          if (!resp[q.id][p.uid]) resp[q.id][p.uid] = 'N';
        });
        renderQuestionario();
      };
      at.appendChild(b);
    });

    var t = el('table', { class: 'qtab' });
    var h = '<thead><tr><th>Item</th><th>Pergunta</th>';
    P.forEach(function (p) { h += '<th class="resp" title="' + esc(p.nome) + '">' + esc(p.curto) + (p.nome ? '<br><span class="obs">' + esc(p.nome.split(' ')[0]) + '</span>' : '') + '</th>'; });
    t.innerHTML = h + '</tr></thead>';
    var tb = el('tbody');
    PERGUNTAS.forEach(function (q) {
      var tr = el('tr');
      if (q.type === 'header') {
        tr.className = 'grupo';
        tr.innerHTML = '<td class="it">' + q.id + '</td><td colspan="' + (P.length + 1) + '">' + esc(q.text) + '</td>';
        tb.appendChild(tr); return;
      }
      var itemLbl = /^\d+[a-z]$/.test(q.id) ? q.id.slice(-1) : q.id;
      tr.innerHTML = '<td class="it">' + esc(itemLbl) + '</td><td>' + esc(q.text) + '</td>';
      resp[q.id] = resp[q.id] || {};
      P.forEach(function (p) {
        var td = el('td', { class: 'resp' });
        var bloq = sexoBloqueia(q, p);
        if (q.type === 'yn' || q.type === 'yn30') {
          if (bloq) resp[q.id][p.uid] = 'N';
          var v = resp[q.id][p.uid] || '';
          var g = el('div', { class: 'sn', 'data-q': q.id, 'data-p': p.uid });
          ['S', 'N'].forEach(function (op) {
            var b = el('button', { type: 'button', class: v === op ? 'on-' + op : '' }, op);
            if (bloq) b.disabled = true;
            b.onclick = function () { resp[q.id][p.uid] = op; alterado = true; renderQuestionario(); };
            g.appendChild(b);
          });
          td.appendChild(g);
        } else if (q.type === 'imc') {
          var imc = calcIMC(p.uid);
          resp[q.id][p.uid] = imc;
          td.innerHTML = '<b>' + (imc || '—') + '</b>';
        } else {
          var mask = { peso: 'num1', altura: 'num1', data: 'data', text: null }[q.type];
          var ph = { peso: '78,5', altura: '1,72', data: 'dd/mm/aaaa', text: 'semanas' }[q.type];
          var desab = bloq || (q.id === '18m' && (resp['18l'] || {})[p.uid] !== 'S');
          if (desab) resp[q.id][p.uid] = '';
          var inp = el('input', { class: 'cel', 'data-mask': mask, placeholder: ph, 'data-q': q.id, 'data-p': p.uid });
          inp.value = resp[q.id][p.uid] || '';
          if (desab) inp.disabled = true;
          inp.addEventListener('input', function () {
            resp[q.id][p.uid] = inp.value;
            if (q.type === 'peso' || q.type === 'altura') {
              var out = tb.querySelector('tr[data-imc] td.resp:nth-of-type(' + (P.indexOf(p) + 3) + ') b');
              var val = calcIMC(p.uid); resp['2.a'][p.uid] = val;
              if (out) out.textContent = val || '—';
            }
          });
          td.appendChild(inp);
        }
        tr.appendChild(td);
      });
      if (q.type === 'imc') tr.setAttribute('data-imc', '1');
      tb.appendChild(tr);

      // detalhes quando "S"
      var sims = P.filter(function (p) { return resp[q.id][p.uid] === 'S'; });
      if (sims.length && (q.type === 'yn' || q.type === 'yn30')) {
        var trd = el('tr', { class: 'det' });
        var tdd = el('td', { colspan: P.length + 2 });
        sims.forEach(function (p) {
          var linha = el('div', { class: 'det-linha' });
          linha.appendChild(el('div', { class: 'quem' }, esc(p.curto) + ' — ' + esc(q.id)));
          if (q.type === 'yn30') {
            motivos[q.id][p.uid] = motivos[q.id][p.uid] || '';
            var lab = el('label', { class: 'span3', style: 'grid-column:2/-1' }, q.id === '30' ? 'Qual foi o motivo? *' : 'Quais exames? *');
            var i1 = el('input', { maxlength: 60, 'data-mot': q.id, 'data-p': p.uid }); i1.value = motivos[q.id][p.uid];
            i1.oninput = function () { motivos[q.id][p.uid] = i1.value; };
            lab.appendChild(i1); linha.appendChild(lab);
          } else {
            det[q.id] = det[q.id] || {};
            var dd = det[q.id][p.uid] = det[q.id][p.uid] || { doenca: '', tratamento: '', diagnostico: '' };
            var l1 = el('label', null, 'Nome da doença / especificação *');
            var a = el('input', { maxlength: 70, 'data-det': 'doenca', 'data-q': q.id, 'data-p': p.uid }); a.value = dd.doenca;
            a.oninput = function () { dd.doenca = a.value; }; l1.appendChild(a);
            var l2 = el('label', null, 'Está em tratamento? *');
            var s = el('select', { 'data-det': 'tratamento', 'data-q': q.id, 'data-p': p.uid });
            [['', 'Selecione'], ['Sim', 'Sim'], ['Não', 'Não']].forEach(function (o) { s.appendChild(el('option', { value: o[0] }, o[1])); });
            s.value = dd.tratamento; s.onchange = function () { dd.tratamento = s.value; }; l2.appendChild(s);
            var l3 = el('label', null, 'Diagnóstico (mês/ano) *');
            var c = el('input', { 'data-mask': 'mesano', placeholder: '10/2026', 'data-det': 'diagnostico', 'data-q': q.id, 'data-p': p.uid }); c.value = dd.diagnostico;
            c.oninput = function () { dd.diagnostico = c.value; }; l3.appendChild(c);
            linha.appendChild(l1); linha.appendChild(l2); linha.appendChild(l3);
          }
          tdd.appendChild(linha);
        });
        trd.appendChild(tdd); tb.appendChild(trd);
      }
    });
    t.appendChild(tb);
    wrap.innerHTML = ''; var qw = el('div', { class: 'qwrap' }); qw.appendChild(t); wrap.appendChild(qw);
    window.scrollTo(0, scrollY);
  }

  // Atualiza só os rótulos com nomes (sem recriar a tabela, para não perder cliques)
  function atualizarNomes() {
    var P = pessoas();
    document.querySelectorAll('.qtab thead th.resp').forEach(function (th, i) {
      var p = P[i]; if (!p) return;
      th.title = p.nome;
      th.innerHTML = esc(p.curto) + (p.nome ? '<br><span class="obs">' + esc(p.nome.split(' ')[0]) + '</span>' : '');
    });
    document.querySelectorAll('#documentos .docs-p h3').forEach(function (h, i) {
      var p = P[i]; if (p) h.textContent = p.rotulo + (p.nome ? ' — ' + p.nome : '');
    });
  }

  function calcIMC(uid) {
    var pe = parseFloat(((resp['1'] || {})[uid] || '').replace(',', '.'));
    var al = parseFloat(((resp['2'] || {})[uid] || '').replace(',', '.'));
    if (!pe || !al) return '';
    if (al > 3) al = al / 100; // digitou em cm
    return (pe / (al * al)).toFixed(1).replace('.', ',');
  }

  // Re-render ao mudar sexo/nome (afeta colunas e perguntas por sexo)
  document.addEventListener('change', function (e) {
    var c = e.target.dataset && e.target.dataset.campo;
    if (c === 'sexo' || c === 'parentesco') { renderQuestionario(); renderDocumentos(); }
  });
  document.addEventListener('focusout', function (e) {
    var c = e.target.dataset && e.target.dataset.campo;
    if (c === 'nome') atualizarNomes();
    if (c === 'cep' && e.target.id === 't_cep') buscarCEP(e.target.value);
  });

  function buscarCEP(cep) {
    cep = so(cep); if (cep.length !== 8) return;
    fetch('https://viacep.com.br/ws/' + cep + '/json/').then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.erro) return;
      if (!$('#t_endereco').value) $('#t_endereco').value = (j.logradouro || '').toUpperCase();
      if (!$('#t_bairro').value) $('#t_bairro').value = (j.bairro || '').toUpperCase();
      if (!$('#t_cidade').value) $('#t_cidade').value = ((j.localidade || '') + '/' + (j.uf || '')).toUpperCase();
    }).catch(function () { });
  }

  // ---------------- documentos ----------------
  function docsDe(p) {
    if (p.uid === 't') return [['rg', 'RG'], ['cpf', 'CPF'], ['sus', 'Cartão Nacional de Saúde'], ['endereco', 'Comprovante de endereço'], ['ctps', 'CTPS digital (dados pessoais + registro na empresa) — PDF']];
    var l = [['rg', 'RG'], ['cpf', 'CPF'], ['sus', 'Cartão Nacional de Saúde']];
    if (p.parentesco === 'Cônjuge') l.push(['casamento', 'Certidão de casamento']);
    if (p.parentesco === 'Companheiro(a)') l.push(['uniao', 'Declaração / escritura de união estável']);
    if (p.parentesco === 'Filho(a)' || p.parentesco === 'Enteado(a)') l.push(['certidao', 'Certidão de nascimento (se não tiver RG/CPF)']);
    return l;
  }
  function renderDocumentos() {
    var w = $('#documentos'); w.innerHTML = '';
    pessoas().forEach(function (p) {
      arquivos[p.uid] = arquivos[p.uid] || {};
      var box = el('div', { class: 'docs-p' });
      box.appendChild(el('h3', null, esc(p.rotulo) + (p.nome ? ' — ' + esc(p.nome) : '')));
      docsDe(p).forEach(function (d) {
        var linha = el('div', { class: 'doc' });
        var atual = arquivos[p.uid][d[0]];
        linha.appendChild(el('span', null, esc(d[1]) + (atual ? ' ✓' : '')));
        var inp = el('input', { type: 'file', accept: 'image/jpeg,image/png,application/pdf' });
        inp.onchange = function () { arquivos[p.uid][d[0]] = inp.files[0]; alterado = true; renderDocumentos(); };
        var cel = el('div'); cel.appendChild(inp);
        if (atual) cel.appendChild(el('span', { class: 'obs' }, ' ' + esc(atual.name)));
        linha.appendChild(cel);
        box.appendChild(linha);
      });
      w.appendChild(box);
    });
  }

  // ---------------- orientação ----------------
  document.querySelectorAll('input[name=orient]').forEach(function (r) {
    r.addEventListener('change', function () { $('#avisoMedico').hidden = r.value === 'dispensar'; });
  });

  // ---------------- assinaturas (salvas no navegador) ----------------
  function processarImagem(file) {
    return new Promise(function (ok, erro) {
      var img = new Image();
      img.onload = function () {
        var maxW = 700, sc = Math.min(1, maxW / img.width);
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cv.width, cv.height);
        var d = cx.getImageData(0, 0, cv.width, cv.height), px = d.data;
        // estima a cor do papel (percentil 80 da luminosidade) para remover o fundo
        var hist = new Array(256).fill(0), n = px.length / 4;
        for (var j = 0; j < px.length; j += 4) hist[Math.round((px[j] + px[j + 1] + px[j + 2]) / 3)]++;
        var acc = 0, papel = 235;
        for (var v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * 0.8) { papel = v; break; } }
        var branco = Math.max(140, papel - 12), tinta = Math.max(40, branco - 110);
        for (var i = 0; i < px.length; i += 4) {
          var lum = (px[i] + px[i + 1] + px[i + 2]) / 3;
          px[i + 3] = Math.max(0, Math.min(255, (branco - lum) / (branco - tinta) * 255));
        }
        cx.putImageData(d, 0, 0);
        ok(cv.toDataURL('image/png'));
      };
      img.onerror = function () { erro(new Error('Imagem inválida')); };
      img.src = URL.createObjectURL(file);
    });
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { alert('Não foi possível salvar a imagem neste navegador.'); return false; } }
  function statusCfg() {
    var a = !!lsGet(LS_SIG), b = !!lsGet(LS_STAMP);
    $('#cfgStatus').textContent = a && b ? 'configuradas ✓' : 'pendentes';
    $('#prevSig').src = lsGet(LS_SIG) || ''; $('#prevStamp').src = lsGet(LS_STAMP) || '';
    return a && b;
  }
  $('#btnConfig').onclick = function () { $('#secConfig').hidden = !$('#secConfig').hidden; };
  $('#cfgFechar').onclick = function () { $('#secConfig').hidden = true; };
  $('#cfgLimpar').onclick = function () {
    if (!confirm('Remover as assinaturas salvas neste computador?')) return;
    try { localStorage.removeItem(LS_SIG); localStorage.removeItem(LS_STAMP); } catch (e) { }
    statusCfg();
  };
  [['#cfgSig', LS_SIG], ['#cfgStamp', LS_STAMP]].forEach(function (x) {
    $(x[0]).onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      processarImagem(f).then(function (url) { lsSet(x[1], url); statusCfg(); }).catch(function (er) { alert(er.message); });
    };
  });
  function dataUrlBytes(u) {
    var b = atob(u.split(',')[1]), a = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
    return a;
  }

  // ---------------- validação ----------------
  function validar(P) {
    var erros = [];
    document.querySelectorAll('.invalido').forEach(function (e) { e.classList.remove('invalido'); });
    document.querySelectorAll('.sn.falta').forEach(function (e) { e.classList.remove('falta'); });
    function marca(id) { var e = document.getElementById(id); if (e) e.classList.add('invalido'); }

    P.forEach(function (p, i) {
      var campos = i === 0 ? CAMPOS_TIT : CAMPOS_DEP, pre = i === 0 ? 't_' : p.uid + '_';
      var falt = [];
      campos.forEach(function (c) { if (!c.opt && !p[c.k]) { falt.push(c.l.replace(/ \(.*\)/, '')); marca(pre + c.k); } });
      if (falt.length) erros.push(p.rotulo + ': preencher ' + falt.join(', '));
      if (p.cpf && !cpfValido(p.cpf)) { erros.push(p.rotulo + ': CPF inválido'); marca(pre + 'cpf'); }
      if (i > 0 && !p.cpf && !p.rg && !/Filho|Enteado/.test(p.parentesco)) { erros.push(p.rotulo + ': informe CPF ou RG'); marca(pre + 'cpf'); }
      if (p.nasc && !dataValida(p.nasc)) { erros.push(p.rotulo + ': data de nascimento inválida'); marca(pre + 'nasc'); }
      if (i === 0 && p.admissao && !dataValida(p.admissao)) { erros.push('Titular: data de admissão inválida'); marca('t_admissao'); }
    });
    if (!dataValida($('#dataPreench').value)) { erros.push('Data de preenchimento inválida'); marca('dataPreench'); }

    var semResp = 0, semDet = 0;
    PERGUNTAS.forEach(function (q) {
      P.forEach(function (p) {
        var v = (resp[q.id] || {})[p.uid];
        if (q.type === 'yn' || q.type === 'yn30') {
          if (!v) { semResp++; var g = document.querySelector('.sn[data-q="' + q.id + '"][data-p="' + p.uid + '"]'); if (g) g.classList.add('falta'); }
          if (v === 'S') {
            if (q.type === 'yn30') {
              if (!(motivos[q.id][p.uid] || '').trim()) { semDet++; var m = document.querySelector('[data-mot="' + q.id + '"][data-p="' + p.uid + '"]'); if (m) m.classList.add('invalido'); }
            } else {
              var dd = (det[q.id] || {})[p.uid] || {};
              ['doenca', 'tratamento', 'diagnostico'].forEach(function (k) {
                var ok = (dd[k] || '').trim() && (k !== 'diagnostico' || /^(0[1-9]|1[0-2])\/\d{4}$/.test(dd[k]));
                if (!ok) { semDet++; var x = document.querySelector('[data-det="' + k + '"][data-q="' + q.id + '"][data-p="' + p.uid + '"]'); if (x) x.classList.add('invalido'); }
              });
            }
          }
        } else if ((q.type === 'peso' || q.type === 'altura') && !v) {
          semResp++; var inp = document.querySelector('input[data-q="' + q.id + '"][data-p="' + p.uid + '"]'); if (inp) inp.classList.add('invalido');
        } else if (q.id === '18m' && (resp['18l'] || {})[p.uid] === 'S' && !v) {
          semResp++; var g2 = document.querySelector('input[data-q="18m"][data-p="' + p.uid + '"]'); if (g2) g2.classList.add('invalido');
        }
      });
    });
    if (semResp) erros.push('Declaração de saúde: ' + semResp + ' resposta(s) em branco (destacadas em vermelho)');
    if (semDet) erros.push('Declaração de saúde: há respostas "S" sem doença, tratamento ou diagnóstico (mês/ano) completos');
    if (!document.querySelector('input[name=orient]:checked')) erros.push('Orientação médica: escolha uma opção');
    if (!statusCfg()) erros.push('Assinaturas não configuradas neste computador (botão "Assinaturas" no topo)');
    return erros;
  }

  // ---------------- gerar ----------------
  function estadoCivilTxt(e, sexo) {
    if (!/\(a\)/.test(e)) return e;
    return e.replace('o(a)', sexo === 'F' ? 'a' : 'o');
  }

  $('#btnGerar').onclick = async function () {
    var P = pessoas();
    var erros = validar(P);
    var box = $('#erros');
    if (erros.length) {
      box.innerHTML = '<b>Corrija antes de gerar:</b><ul>' + erros.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>';
      box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (/Assinaturas/.test(erros.join())) $('#secConfig').hidden = false;
      return;
    }
    box.hidden = true;
    var btn = $('#btnGerar'); btn.disabled = true; $('#statusGerar').textContent = 'Gerando PDF…';
    try {
      var r = await Promise.all([fetch('modelos/declaracao-saude.pdf'), fetch('modelos/ficha-cadastro.pdf')]);
      if (!r[0].ok || !r[1].ok) throw new Error('modelos não encontrados');
      var modelos = await Promise.all([r[0].arrayBuffer(), r[1].arrayBuffer()]);

      var respostas = {}, detalhes = {}, mot = {};
      PERGUNTAS.forEach(function (q) {
        respostas[q.id] = P.map(function (p) { return ((resp[q.id] || {})[p.uid] || '').trim(); });
        if (det[q.id]) detalhes[q.id] = P.map(function (p) {
          var d = det[q.id][p.uid]; return d ? { doenca: d.doenca.trim(), tratamento: d.tratamento, diagnostico: d.diagnostico } : null;
        });
      });
      ['30', '31'].forEach(function (id) { mot[id] = P.map(function (p) { return respostas[id][P.indexOf(p)] === 'S' ? (motivos[id][p.uid] || '').trim() : ''; }); });

      var anexos = [];
      for (var i = 0; i < P.length; i++) {
        var p = P[i], lst = docsDe(p);
        for (var k = 0; k < lst.length; k++) {
          var f = (arquivos[p.uid] || {})[lst[k][0]];
          if (!f) continue;
          var tipo = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? 'pdf' : (/png/i.test(f.type) ? 'png' : 'jpg');
          anexos.push({ tipo: tipo, titulo: lst[k][1].split(' — ')[0] + ' — ' + p.rotulo + ': ' + p.nome, bytes: new Uint8Array(await f.arrayBuffer()) });
        }
      }

      var pdfPessoas = P.map(function (p) {
        var c = Object.assign({}, p);
        c.estadoCivil = estadoCivilTxt(p.estadoCivil, p.sexo).toUpperCase();
        c.parentesco = (p.parentesco || '').toUpperCase();
        return c;
      });
      var avisos = [];
      var bytes = await Preencher.gerar({
        PDFLib: PDFLib, declaracao: modelos[0], cadastro: modelos[1], perguntas: PERGUNTAS,
        assinatura: dataUrlBytes(lsGet(LS_SIG)), carimbo: dataUrlBytes(lsGet(LS_STAMP)),
        anexos: anexos, onAviso: function (m) { avisos.push(m); },
        dados: {
          dataPreenchimento: $('#dataPreench').value, pessoas: pdfPessoas, respostas: respostas,
          detalhes: detalhes, motivos: mot, orientacao: document.querySelector('input[name=orient]:checked').value,
          comentarios: $('#comentarios').value.trim()
        }
      });
      var blob = new Blob([bytes], { type: 'application/pdf' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Inclusao Unimed - ' + P[0].nome.replace(/[^\w\sÀ-ÿ]/g, '') + '.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { window.open(a.href, '_blank'); }, 300);
      alterado = false;
      $('#statusGerar').textContent = 'PDF gerado.' + (avisos.length ? ' Atenção: ' + avisos.join(' ') : '');
      $('#posGerar').hidden = false;
      var orient = document.querySelector('input[name=orient]:checked').value;
      if (orient !== 'dispensar') alert('Salve o PDF como está. A última página da Declaração de Saúde deverá ser preenchida, assinada e carimbada pelo médico orientador.');
    } catch (e) {
      console.error(e);
      $('#statusGerar').textContent = 'Erro ao gerar: ' + e.message + (location.protocol === 'file:' ? ' — abra a página pelo link do GitHub Pages (não pelo arquivo local).' : '');
    } finally { btn.disabled = false; }
  };

  // ---------------- início ----------------
  montarCampos($('#titular'), CAMPOS_TIT, 't_');
  $('#dataPreench').value = hojeStr();
  $('#btnAddDep').onclick = addDep;
  statusCfg();
  if (!statusCfg()) $('#secConfig').hidden = false;
  atualizarTudo();
})();
