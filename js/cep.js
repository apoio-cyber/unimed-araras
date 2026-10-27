/* Endereço pelo CEP (ViaCEP).
   Uso: <input ... data-cep-endereco> no campo "Endereço completo".
   Acrescenta antes dele os campos CEP, Número e Complemento; ao digitar o CEP,
   busca rua, bairro e cidade e monta o endereço completo no campo original,
   que continua editável. */
(function () {
  var so = function (v) { return String(v || '').replace(/\D/g, ''); };
  var up = function (v) { return String(v || '').trim().toUpperCase(); };

  function montar(alvo) {
    var c = document.createElement('div');
    c.className = 'cep-box';
    c.style.cssText = 'grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px 12px';
    c.innerHTML =
      '<label>CEP<input class="cep-cep" inputmode="numeric" placeholder="00000-000" autocomplete="postal-code"></label>' +
      '<label>Número<input class="cep-num" style="text-transform:uppercase" placeholder="123 ou S/N"></label>' +
      '<label>Complemento (opcional)<input class="cep-comp" style="text-transform:uppercase" placeholder="APTO 12"></label>' +
      '<p class="cep-msg ajuda" style="grid-column:1/-1;margin:0">Digite o CEP para preencher o endereço automaticamente.</p>';
    var label = alvo.closest('label') || alvo;
    label.parentNode.insertBefore(c, label);

    var cep = c.querySelector('.cep-cep'), num = c.querySelector('.cep-num'),
        comp = c.querySelector('.cep-comp'), msg = c.querySelector('.cep-msg');
    var dados = null, ultimo = '';

    function compor() {
      if (!dados) return;
      var rua = [dados.logradouro, up(num.value), up(comp.value)].filter(Boolean).join(', ');
      var cid = dados.localidade ? dados.localidade + '/' + dados.uf : '';
      var d = so(cep.value);
      alvo.value = [rua, dados.bairro, cid, d.length === 8 ? 'CEP ' + d.replace(/(\d{5})(\d{3})/, '$1-$2') : '']
        .filter(Boolean).join(' - ').toUpperCase();
      alvo.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function buscar(d) {
      if (d === ultimo) return; ultimo = d;
      msg.textContent = 'Buscando endereço…';
      fetch('https://viacep.com.br/ws/' + d + '/json/').then(function (r) { return r.json(); }).then(function (j) {
        if (j.erro) { dados = null; msg.textContent = 'CEP não encontrado. Confira o número ou preencha o endereço à mão.'; return; }
        dados = { logradouro: up(j.logradouro), bairro: up(j.bairro), localidade: up(j.localidade), uf: up(j.uf) };
        compor();
        msg.textContent = j.logradouro
          ? 'Endereço preenchido. Informe o número e confira o endereço completo.'
          : 'Este CEP é geral da cidade: complete a rua e o bairro no endereço completo.';
        if (!num.value) num.focus();
      }).catch(function () { ultimo = ''; msg.textContent = 'Não consegui buscar o CEP agora. Preencha o endereço à mão.'; });
    }

    cep.addEventListener('input', function () {
      var d = so(cep.value).slice(0, 8);
      cep.value = d.replace(/(\d{5})(\d)/, '$1-$2');
      if (d.length === 8) buscar(d); else { ultimo = ''; }
    });
    num.addEventListener('input', compor);
    comp.addEventListener('input', compor);
  }

  function iniciar() { document.querySelectorAll('[data-cep-endereco]').forEach(montar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
