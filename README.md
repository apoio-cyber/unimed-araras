# Movimentação Unimed Araras (inclusão e exclusão)

Formulário web que gera, em um único PDF, a **Carta de Orientação + Declaração de Saúde** e a **Ficha de Cadastro** da Unimed Anhanguera já preenchidas para inclusão de colaboradores da Cucinare Pro Alimentação Ltda.

- Todo o processamento acontece no navegador: nenhum dado do colaborador é enviado para servidores.
- Nenhuma assinatura ou carimbo é inserido: a empresa (Cucinare) e o intermediário assinam no papel e a documentação é digitalizada.
- A assinatura do intermediário (Wlademir) não é incluída: o campo sai em branco para ele assinar ao receber o formulário (nome e CPF já vêm preenchidos).

## Regras aplicadas
- Cidade sempre **Araras** e data = data de preenchimento.
- Intermediário: Wlademir Cavicchioli Filho, CPF 088.045.738-25 (assinatura feita por ele depois).
- RG em branco → usa o CPF.
- Respostas "S" exigem doença, se está em tratamento e mês/ano do diagnóstico (vão para a tabela de Especificações; o excedente vai para uma página de continuação).
- Agravo/CPT não são preenchidos.
- Ficha: Inclusão, Araras/Leme e Conchal, Enfermaria, local de atendimento ARARAS/SP, data de inclusão = hoje.
- Até 3 dependentes.

## O colaborador assina
Rubrica na pág. 1, assinatura de beneficiário na pág. 2 e assinatura do contratante na pág. 11. A Ficha de Cadastro é assinada só pela empresa e pela operadora.

## Exclusão (preenchida pelo RH)
- Gera a Planilha de Movimentação - Exclusão (CAD006) + Termo de Ciência (CAD001) + TRCT anexado.
- Ao anexar o TRCT em PDF (com texto), lê automaticamente nome, CPF, endereço, data de afastamento, causa e tempo de contribuição. PDFs escaneados precisam de preenchimento manual.
- Titular "Não permanece" → dependentes saem automaticamente; "Sim" → informar os dependentes (nome completo) e se cada um permanece.
- Data da comunicação = data de preenchimento (dd/mm/aa). Termo: Araras, data e hora do preenchimento.
