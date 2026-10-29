/* Preenche a Planilha de Movimentação - Exclusão (CAD006) e o Termo de Ciência (CAD001).
 * Coordenadas em pontos, origem no topo da página. */
(function (root) {
  'use strict';
  var EMPRESA = { nome: 'CUCINARE PRO ALIMENTAÇÃO LTDA', cnpj: '04.596.502/0050-66' };
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function limpar(s) {
    return String(s == null ? '' : s).replace(/[–—]/g, '-').replace(/[^\x20-\x7E -ÿ]/g, '');
  }

  var pdfName;
  // Tira os campos editáveis da página (eles cobririam o texto) e devolve a posição
  // de cada um, para redesenhar só a moldura dos quadros.
  function semCampos(doc) {
    var rects = [];
    try {
      doc.getForm().getFields().forEach(function (f) {
        f.acroField.getWidgets().forEach(function (w) { rects.push(w.getRectangle()); });
      });
    } catch (e) { }
    doc.getPages().forEach(function (pg) { pg.node.delete(pdfName('Annots')); });
    return rects;
  }

  async function gerar(opts) {
    var L = opts.PDFLib, d = opts.dados;
    pdfName = function (n) { return L.PDFName.of(n); };
    var out = await L.PDFDocument.create();
    var font = await out.embedFont(L.StandardFonts.Helvetica);
    var bold = await out.embedFont(L.StandardFonts.HelveticaBold);
    var cor = L.rgb(0, 0, 0.35);

    function T(page, txt, x, top, size, maxW, f, center) {
      txt = limpar(txt); if (!txt) return;
      f = f || font; size = size || 9;
      var w = f.widthOfTextAtSize(txt, size);
      while (maxW && w > maxW && size > 5) { size -= 0.25; w = f.widthOfTextAtSize(txt, size); }
      page.drawText(txt, { x: center ? x - w / 2 : x, y: page.getHeight() - top, size: size, font: f, color: cor });
    }
    function X(page, cx, cy) { T(page, 'X', cx, cy + 3.5, 10, null, bold, true); }

    // ---------- CAD006 ----------
    var cad = await L.PDFDocument.load(opts.cad006);
    var molduras = semCampos(cad);
    var p = (await out.copyPages(cad, [0]))[0];
    out.addPage(p);
    molduras.forEach(function (r) {
      p.drawRectangle({ x: r.x + 0.5, y: r.y + 0.5, width: r.width - 1, height: r.height - 1, borderColor: L.rgb(0, 0, 0), borderWidth: 0.75 });
    });

    T(p, EMPRESA.nome, 68, 82.5, 8, 168);
    T(p, EMPRESA.cnpj, 481, 82.5, 8.5, 94);
    var tipo = { iniciativa: [80.5, 119.5], desligamento: [80.5, 135.5], obito: [300.5, 128.5] }[d.tipo];
    if (tipo) X(p, tipo[0], tipo[1]);

    T(p, d.titular.nome, 47, 180.5, 9, 396);
    T(p, d.titular.cpf, 475, 180.5, 9, 100);
    T(p, d.titular.endereco, 61, 202.5, 8.5, 383);
    X(p, d.titular.permanece === 'S' ? 472.5 : 529, 204);

    var depY = [[241, 246.5], [265, 269.5], [289, 293.5], [312.5, 317], [336, 340.5]];
    (d.dependentes || []).slice(0, 5).forEach(function (dep, i) {
      T(p, dep.nome, 80, depY[i][0] + 3.5, 9, 365);
      if (dep.permanece) X(p, dep.permanece === 'S' ? 472.5 : 529, depY[i][1]);
    });

    if (d.dataRescisao) T(p, d.dataRescisao, 64.5, 403, 9.5, 88, bold, true);
    var mot = { demissao: 394, aposentadoria: 407.5, outro: 421 }[d.motivo];
    if (mot) X(p, 126, mot);
    if (d.motivo === 'outro' && d.motivoOutro) T(p, d.motivoOutro, 211, 426, 7.5, 232);
    if (d.aposentadoContribui) X(p, d.aposentadoContribui === 'S' ? 473 : 528.7, 421);
    var contrib = { integral: 465.5, parcial: 476.3 }[d.contribuicao];
    if (contrib) X(p, 106.6, contrib);
    if (d.tempoMeses) T(p, String(d.tempoMeses), 477.8, 465, 8.5, 50, bold, true);
    T(p, d.dataComunicacao, 542.5, 473, 9, 66, null, true);
    var opcao = { opto: 515.4, naoOpto: 529.1 }[d.opcao];
    if (opcao) X(p, 106.6, opcao);


    // ---------- CAD001 - Termo de ciência ----------
    if (d.incluirTermo) {
      var tc = await L.PDFDocument.load(opts.cad001);
      semCampos(tc);
      var t = (await out.copyPages(tc, [0]))[0];
      out.addPage(t);
      T(t, d.titular.nome, 66, 110.5, 9.5, 290);
      T(t, d.titular.cpf, 472, 110.5, 9.5, 88);
      T(t, d.titular.endereco, 181, 125.5, 9, 378);
      var cel = String(d.titular.celular || '').replace(/\D/g, '');
      var ddd = cel.length >= 10 ? cel.slice(0, 2) : '';
      var num = ddd ? cel.slice(2) : cel;
      num = num.length === 9 ? num.slice(0, 5) + '-' + num.slice(5) : (num.length === 8 ? num.slice(0, 4) + '-' + num.slice(4) : num);
      T(t, ddd, 71.3, 140.5, 9.5, 12, null, true);
      T(t, num, 88, 140.5, 9.5, 68);
      T(t, d.hora, 483.5, 140.5, 9.5, 30, null, true);
      T(t, d.minuto, 516, 140.5, 9.5, 24, null, true);
      var dt = d.dataPreenchimento.split('/');
      T(t, 'Araras', 204, 739.5, 10.5, 74, null, true);
      T(t, dt[0], 259, 739.5, 10.5, 24, null, true);
      T(t, MESES[+dt[1] - 1], 335, 739.5, 10.5, 86, null, true);
      T(t, dt[2], 417, 739.5, 10.5, 44, null, true);
    }

    // ---------- Anexos (TRCT etc.) ----------
    for (var a = 0; a < (opts.anexos || []).length; a++) {
      var ax = opts.anexos[a];
      try {
        if (ax.tipo === 'pdf') {
          var src = await L.PDFDocument.load(ax.bytes, { ignoreEncryption: true });
          (await out.copyPages(src, src.getPageIndices())).forEach(function (pg) { out.addPage(pg); });
        } else {
          var img = ax.tipo === 'png' ? await out.embedPng(ax.bytes) : await out.embedJpg(ax.bytes);
          var pg2 = out.addPage([595.28, 841.89]);
          T(pg2, ax.titulo, 40, 40, 10, 515, bold);
          var sc = Math.min(515 / img.width, 760 / img.height, 1.5);
          pg2.drawImage(img, { x: (595.28 - img.width * sc) / 2, y: 841.89 - 55 - img.height * sc, width: img.width * sc, height: img.height * sc });
        }
      } catch (e) { if (opts.onAviso) opts.onAviso('Não foi possível anexar "' + ax.titulo + '": ' + e.message); }
    }

    out.setTitle('Exclusão Unimed - ' + limpar(d.titular.nome));
    return await out.save();
  }

  var api = { gerar: gerar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Exclusao = api;
})(typeof window !== 'undefined' ? window : globalThis);
