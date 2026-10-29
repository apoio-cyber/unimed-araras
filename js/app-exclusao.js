/* Escolha do modo (inclusão/exclusão) e formulário de exclusão */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MAX_DEP = 5;
  var trctArquivo = null, outros = [], depSeq = 1;

  // ---------------- modo ----------------
  function mostrarModo(m) {
    $('#modoInclusao').hidden = m !== 'inclusao';
    $('#modoExclusao').hidden = m !== 'exclusao';
    $$('.modo').forEach(function (b) { b.classList.toggle('ativo', b.dataset.modo === m); });
    $('#modoAtual').textContent = m ? '· ' + (m === 'inclusao' ? 'Inclusão' : 'Exclusão') : '';
    if (m && location.hash !== '#' + m) history.replaceState(null, '', '#' + m);
  }
  $$('.modo').forEach(function (b) { b.onclick = function () { mostrarModo(b.dataset.modo); }; });
  var h = location.hash.replace('#', '');
  mostrarModo(h === 'inclusao' || h === 'exclusao' ? h : '');

  // ---------------- utilidades ----------------
  function so(v) { return (v || '').replace(/\D/g, ''); }
  function radio(n) { var r = $('input[name="' + n + '"]:checked'); return r ? r.value : ''; }
  function setRadio(n, v) { var r = $('input[name="' + n + '"][value="' + v + '"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } }
  function hoje() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function cpfValido(c) {
    c = so(c); if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (var t = 9; t < 11; t++) { var s = 0; for (var i = 0; i < t; i++) s += +c[i] * (t + 1 - i); if (((10 * s) % 11) % 10 !== +c[t]) return false; }
    return true;
  }
  function dataValida(d) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || ''); if (!m) return false;
    var dt = new Date(+m[3], +m[2] - 1, +m[1]); return dt.getDate() === +m[1] && dt.getMonth() === +m[2] - 1;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tipoArquivo(f) { return /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? 'pdf' : (/png/i.test(f.type) ? 'png' : 'jpg'); }

  var dataCom = hoje();
  $('#exDataCom').value = dataCom.slice(0, 6) + dataCom.slice(8); // dd/mm/aa

  // ---------------- regras da tela ----------------
  $$('input[name=exTipo]').forEach(function (r) {
    r.addEventListener('change', function () {
      var t = radio('exTipo');
      $('#exTermo').checked = t === 'desligamento';
      if (t === 'obito' && !radio('exMotivo')) { setRadio('exMotivo', 'outro'); if (!$('#exMotivoOutro').value) $('#exMotivoOutro').value = 'Óbito do titular'; }
    });
  });
  $$('input[name=exPerm]').forEach(function (r) {
    r.addEventListener('change', function () {
      var sim = radio('exPerm') === 'S';
      $('#exDepCard').hidden = !sim;
      $('#exPermNao').hidden = sim;
    });
  });
  $$('input[name=exMotivo]').forEach(function (r) {
    r.addEventListener('change', function () { $('#exMotivoOutroBox').hidden = radio('exMotivo') !== 'outro'; });
  });

  // ---------------- dependentes ----------------
  function addDep() {
    if ($$('.dep-ex').length >= MAX_DEP) return;
    var id = 'exd' + (depSeq++);
    var row = document.createElement('div');
    row.className = 'dep-ex'; row.id = id;
    row.innerHTML = '<label>Nome completo do dependente *<input class="exDepNome" style="text-transform:uppercase"></label>' +
      '<div><span class="obs">Permanece no plano? *</span><div class="radios linha">' +
      '<label><input type="radio" name="' + id + 'p" value="S"> Sim</label><label><input type="radio" name="' + id + 'p" value="N"> Não</label></div></div>' +
      '<button type="button" class="btn ghost mini">Remover</button>';
    row.querySelector('button').onclick = function () { row.remove(); $('#exAddDep').hidden = false; };
    $('#exDeps').appendChild(row);
    $('#exAddDep').hidden = $$('.dep-ex').length >= MAX_DEP;
  }
  $('#exAddDep').onclick = addDep;

  // ---------------- TRCT ----------------
  $('#exTrct').onchange = async function (e) {
    var f = e.target.files[0]; trctArquivo = f || null;
    var st = $('#exTrctStatus');
    if (!f) { st.textContent = ''; return; }
    if (tipoArquivo(f) !== 'pdf') { st.innerHTML = 'Arquivo de imagem anexado. <b>Não é possível ler os dados de uma foto</b> — preencha os campos abaixo manualmente.'; return; }
    st.textContent = 'Lendo o TRCT…';
    try {
      var r = await TRCT.extrair(new Uint8Array(await f.arrayBuffer()));
      if (r.semTexto) { st.innerHTML = 'O PDF parece escaneado (sem texto). <b>Preencha os campos manualmente.</b> O arquivo será anexado mesmo assim.'; return; }
      var achou = [];
      function pre(sel, v, nome) { if (v && !$(sel).value) { $(sel).value = v; $(sel).classList.add('auto'); achou.push(nome); } }
      pre('#exNome', (r.nome || '').toUpperCase(), 'nome');
      pre('#exCpf', r.cpf, 'CPF');
      pre('#exEndereco', (r.endereco || '').toUpperCase(), 'endereço');
      pre('#exData', r.afastamento, 'data de afastamento');
      if (r.meses != null && !$('#exMeses').value) { $('#exMeses').value = r.meses; achou.push('tempo de contribuição'); }
      if (!radio('exTipo')) setRadio('exTipo', 'desligamento');
      if (r.motivo && !radio('exMotivo')) {
        setRadio('exMotivo', r.motivo); achou.push('motivo');
        if (r.motivo === 'outro' && !$('#exMotivoOutro').value) $('#exMotivoOutro').value = r.causa.slice(0, 60);
      }
      st.innerHTML = achou.length
        ? 'Dados lidos do TRCT: <b>' + esc(achou.join(', ')) + '</b>. Confira os campos destacados.' + (r.causa ? '<br>Causa no TRCT: ' + esc(r.causa) : '')
        : 'Não consegui identificar os dados neste TRCT. Preencha manualmente — o arquivo será anexado.';
    } catch (err) {
      console.error(err);
      st.textContent = 'Não foi possível ler o TRCT (' + err.message + '). Preencha manualmente — o arquivo será anexado.';
    }
  };
  $('#exOutros').onchange = function (e) {
    outros = Array.prototype.slice.call(e.target.files);
    $('#exOutrosLista').textContent = outros.map(function (f) { return f.name; }).join(', ');
  };

  // ---------------- validação ----------------
  function validar() {
    var erros = [];
    $$('#modoExclusao .invalido').forEach(function (x) { x.classList.remove('invalido'); });
    function marca(sel) { var x = $(sel); if (x) x.classList.add('invalido'); }
    var tipo = radio('exTipo');
    var exige = tipo === 'desligamento' || tipo === 'obito';
    if (!tipo) { erros.push('Escolha o tipo de movimentação'); marca('#exTipo'); }
    if (tipo === 'desligamento' && !trctArquivo) { erros.push('Anexe o Termo de Rescisão (TRCT) — obrigatório para desligamento'); marca('#exTrct'); }
    if (!$('#exNome').value.trim()) { erros.push('Informe o nome do titular'); marca('#exNome'); }
    if (!cpfValido($('#exCpf').value)) { erros.push('CPF do titular inválido ou em branco'); marca('#exCpf'); }
    if (!$('#exEndereco').value.trim()) { erros.push('Informe o endereço do titular'); marca('#exEndereco'); }
    if ($('#exTermo').checked && so($('#exCelular').value).length < 10) { erros.push('Informe o celular do titular com DDD'); marca('#exCelular'); }
    if (!radio('exPerm')) { erros.push('Informe se o titular permanece no plano'); marca('#exPermanece'); }
    if (radio('exPerm') === 'S') {
      $$('.dep-ex').forEach(function (row, i) {
        var n = row.querySelector('.exDepNome');
        if (!n.value.trim()) { erros.push('Dependente ' + (i + 1) + ': nome completo obrigatório'); n.classList.add('invalido'); }
        if (!row.querySelector('input[type=radio]:checked')) { erros.push('Dependente ' + (i + 1) + ': informe se permanece no plano'); row.querySelector('.radios').classList.add('invalido'); }
      });
    }
    var dt = $('#exData').value;
    if ((exige || dt) && !dataValida(dt)) { erros.push('Data da rescisão/óbito inválida ou em branco'); marca('#exData'); }
    if (tipo === 'desligamento' && !radio('exMotivo')) { erros.push('Escolha o motivo da extinção do contrato'); marca('#exMotivo'); }
    if (radio('exMotivo') === 'outro' && !$('#exMotivoOutro').value.trim()) { erros.push('Especifique o motivo "Outro"'); marca('#exMotivoOutro'); }
    if (tipo === 'desligamento' && !radio('exApos')) erros.push('Informe se permaneceu na empresa após aposentadoria contribuindo para o plano');
    if (!radio('exContrib')) { erros.push('Escolha a forma de contribuição para o plano'); marca('#exContrib'); }
    if (tipo === 'desligamento' && !radio('exOpcao')) { erros.push('Informe a opção do titular (opto / não opto)'); marca('#exOpcao'); }
    return erros;
  }

  // ---------------- gerar ----------------
  $('#exGerar').onclick = async function () {
    var erros = validar(), box = $('#exErros');
    if (erros.length) {
      box.innerHTML = '<b>Corrija antes de gerar:</b><ul>' + erros.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>';
      box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    box.hidden = true;
    var btn = $('#exGerar'); btn.disabled = true; $('#exStatus').textContent = 'Gerando PDF…';
    try {
      var r = await Promise.all([fetch('modelos/exclusao-cad006.pdf'), fetch('modelos/termo-ciencia-cad001.pdf')]);
      if (!r[0].ok || !r[1].ok) throw new Error('modelos não encontrados');
      var mod = await Promise.all([r[0].arrayBuffer(), r[1].arrayBuffer()]);
      var agora = new Date();
      var deps = radio('exPerm') === 'S' ? $$('.dep-ex').map(function (row) {
        return { nome: row.querySelector('.exDepNome').value.trim().toUpperCase(), permanece: (row.querySelector('input[type=radio]:checked') || {}).value };
      }) : [];
      var nome = $('#exNome').value.trim().toUpperCase();
      var anexos = [];
      if (trctArquivo) anexos.push({ tipo: tipoArquivo(trctArquivo), titulo: 'Termo de Rescisão - ' + nome, bytes: new Uint8Array(await trctArquivo.arrayBuffer()) });
      for (var i = 0; i < outros.length; i++) anexos.push({ tipo: tipoArquivo(outros[i]), titulo: outros[i].name, bytes: new Uint8Array(await outros[i].arrayBuffer()) });
      var avisos = [];
      var bytes = await Exclusao.gerar({
        PDFLib: PDFLib, cad006: mod[0], cad001: mod[1],
        anexos: anexos, onAviso: function (m) { avisos.push(m); },
        dados: {
          tipo: radio('exTipo'),
          titular: { nome: nome, cpf: $('#exCpf').value, endereco: $('#exEndereco').value.trim().toUpperCase(), celular: $('#exCelular').value, permanece: radio('exPerm') },
          dependentes: deps,
          dataRescisao: $('#exData').value, motivo: radio('exMotivo'), motivoOutro: $('#exMotivoOutro').value.trim(),
          aposentadoContribui: radio('exApos'), contribuicao: radio('exContrib'), tempoMeses: so($('#exMeses').value),
          dataComunicacao: $('#exDataCom').value, opcao: radio('exOpcao'), incluirTermo: $('#exTermo').checked,
          dataPreenchimento: dataCom, hora: ('0' + agora.getHours()).slice(-2), minuto: ('0' + agora.getMinutes()).slice(-2)
        }
      });
      var blob = new Blob([bytes], { type: 'application/pdf' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Exclusao Unimed - ' + nome.replace(/[^\w\sÀ-ÿ]/g, '') + '.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { window.open(a.href, '_blank'); }, 300);
      $('#exStatus').textContent = 'PDF gerado.' + (avisos.length ? ' Atenção: ' + avisos.join(' ') : '');
      $('#exPos').hidden = false;
    } catch (e) {
      console.error(e);
      $('#exStatus').textContent = 'Erro ao gerar: ' + e.message;
    } finally { btn.disabled = false; }
  };
})();
