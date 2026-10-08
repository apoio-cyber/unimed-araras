/* Perguntas da Declaração de Saúde (página e posição vertical no PDF original) */
var PERGUNTAS = [
{
"id": "1",
"page": 4,
"y": 146.2,
"text": "Especifique o seu peso (em KG)",
"type": "peso",
"group": "1"
},
{
"id": "2",
"page": 4,
"y": 206.8,
"text": "Especifique a sua altura (em M)",
"type": "altura",
"group": "2"
},
{
"id": "2.a",
"page": 4,
"y": 256.5,
"text": "IMC",
"type": "imc",
"group": "2.a"
},
{
"id": "3",
"page": 4,
"y": 319.3,
"text": "Sofre(u) de alguma doença infecciosa ou parasitária como?",
"type": "header",
"group": "3"
},
{
"id": "3a",
"page": 4,
"y": 334.3,
"text": "Tuberculose?",
"type": "yn",
"group": "3"
},
{
"id": "3b",
"page": 4,
"y": 349.5,
"text": "Hepatite?",
"type": "yn",
"group": "3"
},
{
"id": "3c",
"page": 4,
"y": 364.5,
"text": "AIDS?",
"type": "yn",
"group": "3"
},
{
"id": "3d",
"page": 4,
"y": 379.6,
"text": "Meningite?",
"type": "yn",
"group": "3"
},
{
"id": "3e",
"page": 4,
"y": 394.6,
"text": "Hanseníase?",
"type": "yn",
"group": "3"
},
{
"id": "3f",
"page": 4,
"y": 409.8,
"text": "Outros?",
"type": "yn",
"group": "3"
},
{
"id": "4",
"page": 4,
"y": 460.0,
"text": "Sofre(u) de neoplasias malignas (câncer)?",
"type": "header",
"group": "4"
},
{
"id": "4a",
"page": 4,
"y": 475.2,
"text": "Aparelho digestivo (estômago, outros)?",
"type": "yn",
"group": "4"
},
{
"id": "4b",
"page": 4,
"y": 490.3,
"text": "Aparelho respiratório (pulmão, outros)?",
"type": "yn",
"group": "4"
},
{
"id": "4c",
"page": 4,
"y": 505.3,
"text": "Pele?",
"type": "yn",
"group": "4"
},
{
"id": "4d",
"page": 4,
"y": 520.4,
"text": "Mama?",
"type": "yn",
"group": "4"
},
{
"id": "4e",
"page": 4,
"y": 535.4,
"text": "Órgãos genitais femininos (útero, ovário, outros)?",
"type": "yn",
"group": "4"
},
{
"id": "4f",
"page": 4,
"y": 550.5,
"text": "Órgãos genitais masculinos (próstata, outros)?",
"type": "yn",
"group": "4"
},
{
"id": "4g",
"page": 4,
"y": 565.6,
"text": "Trato urinário (rins, bexiga, outros)?",
"type": "yn",
"group": "4"
},
{
"id": "4h",
"page": 4,
"y": 580.8,
"text": "Tireóide? (Se sim, informar qual o tipo)",
"type": "yn",
"group": "4"
},
{
"id": "4i",
"page": 4,
"y": 595.9,
"text": "Linfoma?",
"type": "yn",
"group": "4"
},
{
"id": "4j",
"page": 4,
"y": 610.9,
"text": "Leucemia?",
"type": "yn",
"group": "4"
},
{
"id": "4k",
"page": 4,
"y": 626.0,
"text": "Outras localizações?",
"type": "yn",
"group": "4"
},
{
"id": "5",
"page": 4,
"y": 677.4,
"text": "Sofre(u) de neoplasias benignas?",
"type": "header",
"group": "5"
},
{
"id": "5a",
"page": 4,
"y": 692.4,
"text": "Útero (mioma)? (Mulher)",
"type": "yn",
"group": "5",
"sex": "F"
},
{
"id": "5b",
"page": 4,
"y": 707.5,
"text": "Pele (nevos)?",
"type": "yn",
"group": "5"
},
{
"id": "5c",
"page": 4,
"y": 722.6,
"text": "Outros?",
"type": "yn",
"group": "5"
},
{
"id": "6",
"page": 5,
"y": 137.1,
"text": "Sofre(u) de doenças do sangue?",
"type": "header",
"group": "6"
},
{
"id": "6a",
"page": 5,
"y": 152.2,
"text": "Anemia ?",
"type": "yn",
"group": "6"
},
{
"id": "6b",
"page": 5,
"y": 167.4,
"text": "Púrpura ?",
"type": "yn",
"group": "6"
},
{
"id": "6c",
"page": 5,
"y": 182.5,
"text": "Plaquetopenia (baixa plaquetas)?",
"type": "yn",
"group": "6"
},
{
"id": "6d",
"page": 5,
"y": 197.5,
"text": "Leucemia/Linfomas?",
"type": "yn",
"group": "6"
},
{
"id": "6e",
"page": 5,
"y": 212.6,
"text": "Outras?",
"type": "yn",
"group": "6"
},
{
"id": "7",
"page": 5,
"y": 274.0,
"text": "Sofre(u) de doenças endócrinas?",
"type": "header",
"group": "7"
},
{
"id": "7a",
"page": 5,
"y": 289.3,
"text": "Diabetes?",
"type": "yn",
"group": "7"
},
{
"id": "7b",
"page": 5,
"y": 304.3,
"text": "Tireóide?",
"type": "yn",
"group": "7"
},
{
"id": "7c",
"page": 5,
"y": 319.4,
"text": "Emagrecimento acentuado?",
"type": "yn",
"group": "7"
},
{
"id": "7d",
"page": 5,
"y": 334.4,
"text": "Alteração Hormonal?",
"type": "yn",
"group": "7"
},
{
"id": "7e",
"page": 5,
"y": 349.5,
"text": "Outras?",
"type": "yn",
"group": "7"
},
{
"id": "8",
"page": 5,
"y": 411.0,
"text": "Sofre(u) de transtornos psiquiátricos ou mentais?",
"type": "yn",
"group": "8"
},
{
"id": "9",
"page": 5,
"y": 472.5,
"text": "Apresenta algum tipo de dependência química?",
"type": "header",
"group": "9"
},
{
"id": "9a",
"page": 5,
"y": 487.5,
"text": "Álcool?",
"type": "yn",
"group": "9"
},
{
"id": "9b",
"page": 5,
"y": 502.6,
"text": "Fumo?",
"type": "yn",
"group": "9"
},
{
"id": "9c",
"page": 5,
"y": 517.6,
"text": "Drogas?",
"type": "yn",
"group": "9"
},
{
"id": "10",
"page": 5,
"y": 579.1,
"text": "Sofre(u) de doenças do sistema nervoso?",
"type": "header",
"group": "10"
},
{
"id": "10a",
"page": 5,
"y": 594.3,
"text": "Parkinson?",
"type": "yn",
"group": "10"
},
{
"id": "10b",
"page": 5,
"y": 609.3,
"text": "Alzheimer?",
"type": "yn",
"group": "10"
},
{
"id": "10c",
"page": 5,
"y": 624.5,
"text": "Epilepsia (Convulsão)?",
"type": "yn",
"group": "10"
},
{
"id": "10d",
"page": 5,
"y": 639.6,
"text": "Paralisia cerebral?",
"type": "yn",
"group": "10"
},
{
"id": "10e",
"page": 5,
"y": 654.6,
"text": "AVC (Derrame Cerebral)?",
"type": "yn",
"group": "10"
},
{
"id": "10f",
"page": 5,
"y": 669.7,
"text": "Enxaqueca?",
"type": "yn",
"group": "10"
},
{
"id": "10g",
"page": 5,
"y": 684.8,
"text": "Outros?",
"type": "yn",
"group": "10"
},
{
"id": "11",
"page": 6,
"y": 136.1,
"text": "Sofre(u) de doenças dos olhos e anexos?",
"type": "header",
"group": "11"
},
{
"id": "11a",
"page": 6,
"y": 151.1,
"text": "Catarata?",
"type": "yn",
"group": "11"
},
{
"id": "11b",
"page": 6,
"y": 166.2,
"text": "Glaucoma?",
"type": "yn",
"group": "11"
},
{
"id": "11c",
"page": 6,
"y": 181.2,
"text": "Estrabismo?",
"type": "yn",
"group": "11"
},
{
"id": "11d",
"page": 6,
"y": 196.3,
"text": "Miopia? (Informar o grau)",
"type": "yn",
"group": "11"
},
{
"id": "11e",
"page": 6,
"y": 211.4,
"text": "Astigmatismo? (Informar o grau)",
"type": "yn",
"group": "11"
},
{
"id": "11f",
"page": 6,
"y": 226.5,
"text": "Hipermetropia? (Informar o grau)",
"type": "yn",
"group": "11"
},
{
"id": "11g",
"page": 6,
"y": 241.5,
"text": "Outros?",
"type": "yn",
"group": "11"
},
{
"id": "12",
"page": 6,
"y": 292.3,
"text": "Sofre(u) de doenças do ouvido?",
"type": "header",
"group": "12"
},
{
"id": "12a",
"page": 6,
"y": 307.3,
"text": "Labirintite?",
"type": "yn",
"group": "12"
},
{
"id": "12b",
"page": 6,
"y": 322.4,
"text": "Perda de audição (surdez)?",
"type": "yn",
"group": "12"
},
{
"id": "12c",
"page": 6,
"y": 337.5,
"text": "Otites?",
"type": "yn",
"group": "12"
},
{
"id": "12d",
"page": 6,
"y": 352.6,
"text": "Outros?",
"type": "yn",
"group": "12"
},
{
"id": "13",
"page": 6,
"y": 403.3,
"text": "Sofre(u) de doenças do aparelho circulatório?",
"type": "header",
"group": "13"
},
{
"id": "13a",
"page": 6,
"y": 418.4,
"text": "Febre reumática (Reumatismo)?",
"type": "yn",
"group": "13"
},
{
"id": "13b",
"page": 6,
"y": 433.5,
"text": "Hipertensão arterial (Pressão alta)?",
"type": "yn",
"group": "13"
},
{
"id": "13c",
"page": 6,
"y": 448.5,
"text": "Angina pectoris?",
"type": "yn",
"group": "13"
},
{
"id": "13d",
"page": 6,
"y": 463.6,
"text": "Infarto do miocárdio?",
"type": "yn",
"group": "13"
},
{
"id": "13e",
"page": 6,
"y": 478.6,
"text": "Arritmia cardíaca?",
"type": "yn",
"group": "13"
},
{
"id": "13f",
"page": 6,
"y": 493.8,
"text": "Insuficiência cardíaca?",
"type": "yn",
"group": "13"
},
{
"id": "13g",
"page": 6,
"y": 508.9,
"text": "Acidente vascular cerebral (\"derrame\")?",
"type": "yn",
"group": "13"
},
{
"id": "13h",
"page": 6,
"y": 524.0,
"text": "Varizes de membros inferiores?",
"type": "yn",
"group": "13"
},
{
"id": "13i",
"page": 6,
"y": 539.1,
"text": "Hemorróidas?",
"type": "yn",
"group": "13"
},
{
"id": "13j",
"page": 6,
"y": 554.1,
"text": "Má circulação?",
"type": "yn",
"group": "13"
},
{
"id": "13k",
"page": 6,
"y": 569.2,
"text": "Outras?",
"type": "yn",
"group": "13"
},
{
"id": "14",
"page": 6,
"y": 619.9,
"text": "Sofre(u) de doenças do aparelho respiratório?",
"type": "header",
"group": "14"
},
{
"id": "14a",
"page": 6,
"y": 635.0,
"text": "Rinite?",
"type": "yn",
"group": "14"
},
{
"id": "14b",
"page": 6,
"y": 650.1,
"text": "Sinusite?",
"type": "yn",
"group": "14"
},
{
"id": "14c",
"page": 6,
"y": 665.2,
"text": "Bronquite?",
"type": "yn",
"group": "14"
},
{
"id": "14d",
"page": 6,
"y": 680.2,
"text": "Asma?",
"type": "yn",
"group": "14"
},
{
"id": "14e",
"page": 6,
"y": 695.4,
"text": "Pneumonia?",
"type": "yn",
"group": "14"
},
{
"id": "14f",
"page": 6,
"y": 710.4,
"text": "Enfisema?",
"type": "yn",
"group": "14"
},
{
"id": "14g",
"page": 7,
"y": 112.9,
"text": "Desvio de septo nasal?",
"type": "yn",
"group": "14"
},
{
"id": "14h",
"page": 7,
"y": 127.9,
"text": "Amidalite?",
"type": "yn",
"group": "14"
},
{
"id": "14i",
"page": 7,
"y": 143.0,
"text": "Aumento adenóide?",
"type": "yn",
"group": "14"
},
{
"id": "14j",
"page": 7,
"y": 158.0,
"text": "Outros?",
"type": "yn",
"group": "14"
},
{
"id": "15",
"page": 7,
"y": 212.6,
"text": "Sofre(u) de doenças do aparelho digestivo?",
"type": "header",
"group": "15"
},
{
"id": "15a",
"page": 7,
"y": 227.7,
"text": "Úlcera Péptica?",
"type": "yn",
"group": "15"
},
{
"id": "15b",
"page": 7,
"y": 242.7,
"text": "Gastrite?",
"type": "yn",
"group": "15"
},
{
"id": "15c",
"page": 7,
"y": 258.0,
"text": "Hérnia?",
"type": "yn",
"group": "15"
},
{
"id": "15d",
"page": 7,
"y": 273.0,
"text": "Doença diverticular do intestino?",
"type": "yn",
"group": "15"
},
{
"id": "15e",
"page": 7,
"y": 288.1,
"text": "Cirrose hepática?",
"type": "yn",
"group": "15"
},
{
"id": "15f",
"page": 7,
"y": 303.1,
"text": "Colite?",
"type": "yn",
"group": "15"
},
{
"id": "15g",
"page": 7,
"y": 318.2,
"text": "Colelitíase (cálculo da vesícula)?",
"type": "yn",
"group": "15"
},
{
"id": "15h",
"page": 7,
"y": 333.2,
"text": "Refluxo?",
"type": "yn",
"group": "15"
},
{
"id": "15i",
"page": 7,
"y": 348.5,
"text": "Intestino Preso (constipação)?",
"type": "yn",
"group": "15"
},
{
"id": "15j",
"page": 7,
"y": 363.6,
"text": "Diarréia?",
"type": "yn",
"group": "15"
},
{
"id": "15k",
"page": 7,
"y": 378.6,
"text": "Outros?",
"type": "yn",
"group": "15"
},
{
"id": "16",
"page": 7,
"y": 429.3,
"text": "Sofre(u) de doenças da pele?",
"type": "header",
"group": "16"
},
{
"id": "16a",
"page": 7,
"y": 444.3,
"text": "Verrugas?",
"type": "yn",
"group": "16"
},
{
"id": "16b",
"page": 7,
"y": 459.5,
"text": "Pintas?",
"type": "yn",
"group": "16"
},
{
"id": "16c",
"page": 7,
"y": 474.5,
"text": "Queloide?",
"type": "yn",
"group": "16"
},
{
"id": "16d",
"page": 7,
"y": 489.7,
"text": "Caroços?",
"type": "yn",
"group": "16"
},
{
"id": "16e",
"page": 7,
"y": 504.7,
"text": "Xantelasma?",
"type": "yn",
"group": "16"
},
{
"id": "16f",
"page": 7,
"y": 519.8,
"text": "Cistos?",
"type": "yn",
"group": "16"
},
{
"id": "16g",
"page": 7,
"y": 534.8,
"text": "Calos?",
"type": "yn",
"group": "16"
},
{
"id": "16h",
"page": 7,
"y": 549.9,
"text": "Outros?",
"type": "yn",
"group": "16"
},
{
"id": "17",
"page": 7,
"y": 600.6,
"text": "Sofre(u) de doenças osteomuscular?",
"type": "header",
"group": "17"
},
{
"id": "17a",
"page": 7,
"y": 615.7,
"text": "Artrite?",
"type": "yn",
"group": "17"
},
{
"id": "17b",
"page": 7,
"y": 630.9,
"text": "Artrose? (Se sim, colocar o local)",
"type": "yn",
"group": "17"
},
{
"id": "17c",
"page": 7,
"y": 645.9,
"text": "Osteoporose?",
"type": "yn",
"group": "17"
},
{
"id": "17d",
"page": 7,
"y": 661.0,
"text": "Reumatismo?",
"type": "yn",
"group": "17"
},
{
"id": "17e",
"page": 7,
"y": 676.0,
"text": "Escoliose?",
"type": "yn",
"group": "17"
},
{
"id": "17f",
"page": 7,
"y": 691.2,
"text": "Hérnia de Disco?",
"type": "yn",
"group": "17"
},
{
"id": "17g",
"page": 7,
"y": 706.2,
"text": "Osteomielite?",
"type": "yn",
"group": "17"
},
{
"id": "17h",
"page": 7,
"y": 721.4,
"text": "Problema de coluna vertebral?",
"type": "yn",
"group": "17"
},
{
"id": "17i",
"page": 8,
"y": 111.6,
"text": "Dor na coluna?",
"type": "yn",
"group": "17"
},
{
"id": "17j",
"page": 8,
"y": 126.8,
"text": "Outros?",
"type": "yn",
"group": "17"
},
{
"id": "18",
"page": 8,
"y": 180.3,
"text": "Sofre(u) de doenças do aparelho genito-urinário/reprodutor feminino (ginecológico)/masculino (urológico)",
"type": "header",
"group": "18"
},
{
"id": "18a",
"page": 8,
"y": 198.6,
"text": "Insuficiência renal?",
"type": "yn",
"group": "18"
},
{
"id": "18b",
"page": 8,
"y": 213.7,
"text": "Cálculo urinário (\"pedra\")?",
"type": "yn",
"group": "18"
},
{
"id": "18c",
"page": 8,
"y": 228.7,
"text": "Incontinência urinária (\"urina solta\")?",
"type": "yn",
"group": "18"
},
{
"id": "18d",
"page": 8,
"y": 243.8,
"text": "Hiperplasia da próstata? (Homem)",
"type": "yn",
"group": "18",
"sex": "M"
},
{
"id": "18e",
"page": 8,
"y": 258.8,
"text": "Fimose? (Homem)",
"type": "yn",
"group": "18",
"sex": "M"
},
{
"id": "18f",
"page": 8,
"y": 273.9,
"text": "Nódulo mamário?",
"type": "yn",
"group": "18"
},
{
"id": "18g",
"page": 8,
"y": 289.2,
"text": "Infertilidade?",
"type": "yn",
"group": "18"
},
{
"id": "18h",
"page": 8,
"y": 304.2,
"text": "Cisto de ovário? (Mulher)",
"type": "yn",
"group": "18",
"sex": "F"
},
{
"id": "18i",
"page": 8,
"y": 319.3,
"text": "Transtornos menstruais? (Mulher)",
"type": "yn",
"group": "18",
"sex": "F"
},
{
"id": "18j",
"page": 8,
"y": 334.3,
"text": "Endometriose?",
"type": "yn",
"group": "18"
},
{
"id": "18k",
"page": 8,
"y": 349.4,
"text": "Teve gravidezes anteriores?",
"type": "yn",
"group": "18",
"sex": "F"
},
{
"id": "18l",
"page": 8,
"y": 364.4,
"text": "Declara estar gestante?",
"type": "yn",
"group": "18",
"sex": "F"
},
{
"id": "18m",
"page": 8,
"y": 379.6,
"text": "Sendo gestante, informar semanas/tempo gestação",
"type": "text",
"group": "18",
"sex": "F"
},
{
"id": "19",
"page": 8,
"y": 430.3,
"text": "Data última menstruação?",
"type": "data",
"group": "19",
"sex": "F"
},
{
"id": "20",
"page": 8,
"y": 491.7,
"text": "Sofre(u) de traumatismos e/ou fraturas?",
"type": "yn",
"group": "20"
},
{
"id": "21",
"page": 8,
"y": 542.5,
"text": "Sofre(u) de má formações congênitas (doenças de nascença)?",
"type": "yn",
"group": "21"
},
{
"id": "22",
"page": 8,
"y": 596.1,
"text": "Sofre de seqüelas de acidentes, moléstia adquirida ou congênita?",
"type": "yn",
"group": "22"
},
{
"id": "23",
"page": 8,
"y": 649.9,
"text": "Já foi submetido a algum tipo de cirurgia?",
"type": "yn",
"group": "23"
},
{
"id": "24",
"page": 8,
"y": 708.7,
"text": "Sofre(u) de alguma doença não relacionada acima, que o tenha obrigado a internar-se ou submeter-se a algum tipo de tratamento ou exame?",
"type": "yn",
"group": "24"
},
{
"id": "25",
"page": 9,
"y": 194.1,
"text": "Já foi submetido à radioterapia, quimioterapia, hemodiálise ou diálise peritonial?",
"type": "yn",
"group": "25"
},
{
"id": "26",
"page": 9,
"y": 247.9,
"text": "Tem indicação de submeter-se a algum tipo de cirurgia?",
"type": "yn",
"group": "26"
},
{
"id": "27",
"page": 9,
"y": 309.3,
"text": "Faz Tratamento Ortodôntico/Buco Maxilo?",
"type": "yn",
"group": "27"
},
{
"id": "28",
"page": 9,
"y": 363.1,
"text": "Possui algum tipo de prótese ou órtese (placas, pinos, parafusos, marca-passo, outros)?",
"type": "yn",
"group": "28"
},
{
"id": "29",
"page": 9,
"y": 419.9,
"text": "Algum dos ascendentes diretos (pais e avós) sofre(u) de qualquer doença abaixo?",
"type": "header",
"group": "29"
},
{
"id": "29a",
"page": 9,
"y": 438.0,
"text": "Hipertensão arterial?",
"type": "yn",
"group": "29"
},
{
"id": "29b",
"page": 9,
"y": 453.0,
"text": "Diabetes?",
"type": "yn",
"group": "29"
},
{
"id": "29c",
"page": 9,
"y": 468.1,
"text": "Doença cardíaca?",
"type": "yn",
"group": "29"
},
{
"id": "29d",
"page": 9,
"y": 483.1,
"text": "Doença vascular/circulatória?",
"type": "yn",
"group": "29"
},
{
"id": "29e",
"page": 9,
"y": 498.2,
"text": "Doença pulmonar?",
"type": "yn",
"group": "29"
},
{
"id": "29f",
"page": 9,
"y": 513.3,
"text": "Doença digestiva?",
"type": "yn",
"group": "29"
},
{
"id": "29g",
"page": 9,
"y": 528.5,
"text": "Doença renal?",
"type": "yn",
"group": "29"
},
{
"id": "29h",
"page": 9,
"y": 543.5,
"text": "Doença neurológica?",
"type": "yn",
"group": "29"
},
{
"id": "29i",
"page": 9,
"y": 558.6,
"text": "Doença mental ou psiquiátrica?",
"type": "yn",
"group": "29"
},
{
"id": "29j",
"page": 9,
"y": 573.7,
"text": "Câncer?",
"type": "yn",
"group": "29"
},
{
"id": "30",
"page": 9,
"y": 636.4,
"text": "Consultou algum médico nos últimos 2 anos?",
"type": "yn30",
"group": "30"
},
{
"id": "31",
"page": 10,
"y": 135.4,
"text": "Realizou exame complementar nos últimos 2 anos?",
"type": "yn30",
"group": "31"
},
{
"id": "32",
"page": 10,
"y": 279.5,
"text": "Beneficiário encontra-se internado?",
"type": "yn",
"group": "32"
}
];
if (typeof module !== "undefined") module.exports = PERGUNTAS;
