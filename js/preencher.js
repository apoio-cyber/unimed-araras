/* Preenche a Declaração de Saúde + Ficha de Cadastro da Unimed Anhanguera.
 * Funciona no navegador (window.Preencher) e no Node (module.exports).
 * Coordenadas extraídas dos PDFs originais (pontos, origem no topo da página). */
(function (root) {
  'use strict';

  // Colunas da grade S/N (Titular, D1..D5) — páginas 4 a 10 da declaração
  var COL = [390.15, 421.35, 448.5, 475.6, 502.75, 530.0];
  // Colunas das questões 30 e 31
  var COL30 = [402.2, 432.0, 456.6, 481.35, 506.1, 531.05];
  // Linhas "Se sim, qual foi o motivo" (30, página 9) e "quais foram" (31, página 10)
  var MOTIVO_Y = { '30': [651.45, 666.5, 681.6, 696.7, 711.8, 726.95], '31': [150.45, 165.6, 180.7, 195.75, 210.8, 225.9] };
  var MOTIVO_PAG = { '30': 9, '31': 10 };
  // Tabela de especificações (página 10)
  var ESPEC_LINHAS = [410.5, 425.8, 440.9, 455.9, 471.0, 486.0, 501.1, 516.2, 531.4, 546.4, 561.5, 576.6, 591.6, 606.8];
  var ESPEC_COL_DATA = [368.3, 402.65, 433.9, 465.15, 496.5, 527.9];

  var INTERMEDIARIO = { nome: 'WLADEMIR CAVICCHIOLI FILHO', cpf: '088.045.738-25' };
  var EMPRESA = { nome: 'CUCINARE PRO ALIMENTAÇÃO LTDA', cnpj: '04.596.502/0050-66' };
  var CIDADE = 'Araras';

  function limpar(s) {
    // Mantém apenas caracteres suportados pela fonte padrão (WinAnsi)
    return String(s == null ? '' : s).replace(/[–—]/g, '-').replace(/[^\x20-\x7E -ÿ]/g, '');
  }

  async function gerar(opts) {
    var L = opts.PDFLib;
    var d = opts.dados;
    var out = await L.PDFDocument.create();
    var font = await out.embedFont(L.StandardFonts.Helvetica);
    var bold = await out.embedFont(L.StandardFonts.HelveticaBold);
    var preto = L.rgb(0, 0, 0.35);

    var decl = await L.PDFDocument.load(opts.declaracao);
    var cad = await L.PDFDocument.load(opts.cadastro);
    var dp = await out.copyPages(decl, decl.getPageIndices());
    dp.forEach(function (p) { out.addPage(p); });

    function T(page, txt, x, top, size, maxW, f, center) {
      txt = limpar(txt);
      if (!txt) return;
      f = f || font; size = size || 8;
      var w = f.widthOfTextAtSize(txt, size);
      while (maxW && w > maxW && size > 4.5) { size -= 0.25; w = f.widthOfTextAtSize(txt, size); }
      var px = center ? x - w / 2 : x;
      page.drawText(txt, { x: px, y: page.getHeight() - top, size: size, font: f, color: preto });
    }
    function C(page, txt, cx, cy, size, maxW, f) { // centralizado na célula (cy = centro vertical)
      size = size || 8;
      T(page, txt, cx, cy + size * 0.35, size, maxW, f, true);
    }

    var P = d.pessoas; // [titular, dep1, dep2, dep3]
    var hoje = d.dataPreenchimento; // dd/mm/aaaa
    var dd = hoje.split('/');
    var D = function (n) { return dp[n - 1]; };
    var docRG = function (p) { return p.rg ? (p.rg + (p.rgOrgao ? ' ' + p.rgOrgao : '')) : p.cpf; };

    // ---------- Página 1: rubrica ----------
    T(D(1), 'Rubrica: ____________________', 420, 808, 8);

    // ---------- Página 2: Carta de orientação ----------
    var p2 = D(2);
    T(p2, CIDADE, 70, 263.5, 9);
    C(p2, dd[0], 226, 260, 8); C(p2, dd[1], 252, 260, 8); C(p2, dd[2], 280, 260, 8);
    T(p2, P[0].nome, 82, 284, 7.5, 210);
    T(p2, CIDADE, 355, 263.5, 9);
    C(p2, dd[0], 469, 260, 8); C(p2, dd[1], 494.5, 260, 8); C(p2, dd[2], 522.5, 260, 8);
    T(p2, INTERMEDIARIO.nome, 370, 284, 7.5, 190);
    T(p2, INTERMEDIARIO.cpf, 364, 295.5, 8);
    if (opts.assinatura) {
      var sig = await out.embedPng(opts.assinatura);
      var sh = 44, sw = sh * sig.width / sig.height;
      p2.drawImage(sig, { x: 455, y: p2.getHeight() - 316, width: sw, height: sh });
    }

    // ---------- Página 3: proponentes ----------
    var p3 = D(3);
    var linhas3 = [156.1, 174.1, 192.1, 210.1, 228.1, 246.1];
    P.forEach(function (p, i) {
      C(p3, p.nome, 242.6, linhas3[i], 7.5, 240);
      C(p3, docRG(p), 406.8, linhas3[i], 7.5, 80);
      C(p3, p.cpf, 495, linhas3[i], 7.5, 90);
    });

    // ---------- Questionário ----------
    var Q = opts.perguntas;
    var R = d.respostas || {};
    Q.forEach(function (q) {
      if (q.type === 'header') return;
      var vals = R[q.id] || [];
      var page = D(q.page);
      P.forEach(function (p, i) {
        var v = vals[i];
        if (v == null || v === '') return;
        if (q.type === 'yn' || q.type === 'yn30') {
          var cx = (q.type === 'yn30' ? COL30 : COL)[i];
          C(page, v, cx, q.y, 9, 22, bold);
        } else {
          C(page, v, COL[i], q.y, 7.5, 25);
        }
      });
    });
    // Motivos das questões 30 / 31
    ['30', '31'].forEach(function (id) {
      var m = (d.motivos || {})[id] || [];
      P.forEach(function (p, i) { if (m[i]) T(D(MOTIVO_PAG[id]), m[i], 388, MOTIVO_Y[id][i] + 2.6, 7.5, 153); });
    });

    // ---------- Especificações (página 10) ----------
    var esp = [];
    Q.forEach(function (q) {
      var det = (d.detalhes || {})[q.id];
      if (!det) return;
      P.forEach(function (p, i) {
        var x = det[i];
        if (!x || (R[q.id] || [])[i] !== 'S') return;
        var txt = x.doenca + ' - ' + (x.tratamento === 'Sim' ? 'em tratamento' : 'sem tratamento atual');
        esp.push({ item: q.id, txt: txt, col: i, data: x.diagnostico });
      });
    });
    var p10 = D(10);
    var nLin = ESPEC_LINHAS.length - 1;
    esp.slice(0, nLin).forEach(function (e, k) {
      var cy = (ESPEC_LINHAS[k] + ESPEC_LINHAS[k + 1]) / 2;
      C(p10, e.item, 70.4, cy, 7.5, 36);
      T(p10, e.txt, 92, cy + 2.6, 7.5, 254);
      C(p10, e.data, ESPEC_COL_DATA[e.col], cy, 6.5, 30);
    });
    var extras = esp.slice(nLin);
    if (d.comentarios) {
      var linhas = quebrar(font, limpar(d.comentarios), 8, 480).slice(0, 3);
      linhas.forEach(function (l, k) { T(p10, l, 57, 662.5 + k * 15.5, 8); });
    }

    // ---------- Página 11: orientação + local e data ----------
    var p11 = D(11);
    var box = { operadora: 240.1, dispensar: 442.85, particular: 524.75 }[d.orientacao];
    if (box) C(p11, 'X', box, 346, 9, null, bold);
    T(p11, CIDADE, 60, 516, 9);
    C(p11, dd[0], 330, 514, 9); C(p11, dd[1], 383, 514, 9); C(p11, dd[2], 436, 514, 9);

    // ---------- Continuação das especificações (se necessário) ----------
    if (extras.length) {
      var porPag = 40, idx = 11;
      for (var s = 0; s < extras.length; s += porPag) {
        var pg = out.insertPage(idx++, [595.32, 841.92]);
        T(pg, 'DECLARAÇÃO DE SAÚDE - ESPECIFICAÇÕES (CONTINUAÇÃO)', 55, 70, 11, null, bold);
        T(pg, 'Titular: ' + P[0].nome, 55, 88, 8);
        var top = 110;
        T(pg, 'Item', 58, top, 8, null, bold); T(pg, 'Especificação', 95, top, 8, null, bold);
        T(pg, 'Proponente', 380, top, 8, null, bold); T(pg, 'Data do evento', 480, top, 8, null, bold);
        var nomes = ['Titular', 'D1', 'D2', 'D3', 'D4', 'D5'];
        extras.slice(s, s + porPag).forEach(function (e, k) {
          var y = top + 16 + k * 15;
          pg.drawLine({ start: { x: 52, y: pg.getHeight() - y + 10 }, end: { x: 543, y: pg.getHeight() - y + 10 }, thickness: 0.4, color: L.rgb(0.6, 0.6, 0.6) });
          T(pg, e.item, 58, y + 4, 7.5); T(pg, e.txt, 95, y + 4, 7.5, 280);
          T(pg, nomes[e.col], 380, y + 4, 7.5); T(pg, e.data, 480, y + 4, 7.5);
        });
        T(pg, 'Assinatura do titular: ___________________________________________', 55, 790, 9);
      }
    }

    // ---------- Ficha de cadastro ----------
    var cp = await out.copyPages(cad, cad.getPageIndices());
    cp.forEach(function (p) { out.addPage(p); });
    var c1 = cp[0], c2 = cp[1];
    var t = P[0];
    C(c1, 'X', 225, 168.5, 10, null, bold); // inclusão
    T(c1, EMPRESA.nome, 128, 197.5, 8.5, 245);
    T(c1, EMPRESA.cnpj, 412, 197.5, 8.5, 150);
    T(c1, t.nome, 171, 223, 8.5, 390);
    T(c1, t.admissao, 125, 248.6, 8.5, 115);
    T(c1, t.pis, 311, 248.6, 8.5, 250);
    T(c1, t.cpf, 59, 274.2, 8.5, 180);
    T(c1, docRG(t), 351, 274.2, 8.5, 210);
    T(c1, t.estadoCivil, 94, 299.8, 8.5, 145);
    C(c1, 'X', t.sexo === 'M' ? 284.3 : 355, 296.3, 9, null, bold);
    T(c1, t.nasc, 65, 325.5, 8.5, 175);
    T(c1, t.sus, 312, 325.5, 8.5, 250);
    T(c1, t.mae, 177, 351.2, 8.5, 385);
    T(c1, t.endereco, 84, 376.8, 8.5, 352);
    T(c1, t.numero, 459, 376.8, 8.5, 100);
    T(c1, t.bairro, 66, 402.4, 8.5, 175);
    T(c1, t.cidade, 326, 402.4, 8.5, 235);
    T(c1, t.cep, 59, 428, 8.5, 180);
    T(c1, 'ARARAS/SP', 359, 428, 8.5, 200);
    T(c1, hoje, 118, 453.6, 8.5, 120);
    C(c1, 'X', 253.4, 450.3, 9, null, bold); // Araras / Leme e Conchal
    C(c1, 'X', 120.8, 476.1, 9, null, bold); // Enfermaria

    var depBase = [[c1, 534.6, 287.2], [c1, 663.1, 290], [c2, 178.8, 290]];
    P.slice(1, 4).forEach(function (p, k) {
      var pg = depBase[k][0], B = depBase[k][1];
      T(pg, p.nome, 224, B - 2, 8.5, 340);
      T(pg, p.cpf, 59, B + 23.7, 8.5, 180);
      T(pg, docRG(p), 351, B + 23.7, 8.5, 210);
      T(pg, p.estadoCivil, 94, B + 49.2, 8, 84);
      C(pg, 'X', p.sexo === 'M' ? 219.3 : depBase[k][2], B + 45.7, 9, null, bold);
      T(pg, p.parentesco, 439, B + 49.2, 8.5, 125);
      T(pg, p.nasc, 65, B + 74.8, 8.5, 112);
      T(pg, p.sus, 247, B + 74.8, 8, 125);
      T(pg, p.declNasc, 433, B + 74.8, 8, 130);
      T(pg, p.mae, 177, B + 100.4, 8.5, 385);
    });

    // ---------- Documentos anexados ----------
    for (var a = 0; a < (opts.anexos || []).length; a++) {
      var ax = opts.anexos[a];
      try {
        if (ax.tipo === 'pdf') {
          var src = await L.PDFDocument.load(ax.bytes, { ignoreEncryption: true });
          var pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach(function (p) { out.addPage(p); });
        } else {
          var img = ax.tipo === 'png' ? await out.embedPng(ax.bytes) : await out.embedJpg(ax.bytes);
          var pg2 = out.addPage([595.28, 841.89]);
          T(pg2, ax.titulo, 40, 40, 10, 515, bold);
          var maxW = 515, maxH = 760;
          var sc = Math.min(maxW / img.width, maxH / img.height, 1.5);
          var iw = img.width * sc, ih = img.height * sc;
          pg2.drawImage(img, { x: (595.28 - iw) / 2, y: 841.89 - 55 - ih, width: iw, height: ih });
        }
      } catch (e) {
        if (opts.onAviso) opts.onAviso('Não foi possível anexar "' + ax.titulo + '": ' + e.message);
      }
    }

    out.setTitle('Inclusão Unimed - ' + limpar(t.nome));
    return await out.save();
  }

  function quebrar(font, txt, size, maxW) {
    var palavras = txt.split(/\s+/), linhas = [], atual = '';
    palavras.forEach(function (p) {
      var teste = atual ? atual + ' ' + p : p;
      if (font.widthOfTextAtSize(teste, size) > maxW && atual) { linhas.push(atual); atual = p; } else atual = teste;
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  var api = { gerar: gerar, EMPRESA: EMPRESA, INTERMEDIARIO: INTERMEDIARIO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Preencher = api;
})(typeof window !== 'undefined' ? window : globalThis);
