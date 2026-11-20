# Laboratório virtual de autômatos

Simulador no navegador para aprender **autômatos finitos (máquinas de Moore)** e **minimização**, usando uma catraca e um semáforo. Não precisa de Arduino, sensores, internet nem instalação.

## Como abrir

1. Extraia a pasta.
2. Dê duplo clique em `index.html` (Chrome, Edge ou Firefox).

Não separe os arquivos: o `index.html` carrega os outros por caminho relativo.

## O que dá para fazer

- Ver o **diagrama de estados** (estados em círculo, saída por cor *e* texto, estado atual com anel duplo, estado inicial com seta "início").
- **Simular**: clicar nos botões de entrada (Σ), digitar uma sequência (ex.: `MGM`) e acompanhar o histórico de transições e saídas.
- **Minimizar passo a passo**: ver P0, P1... e o resultado (ex.: 8 → 4 estados).
- Alternar entre o autômato **original** e o **mínimo**.
- **Validar equivalência**: 400 sequências aleatórias de 30 símbolos + verificação exata por busca em largura sobre pares de estados.
- Interagir com o **sistema físico** em SVG (moeda e giro da catraca, tick do relógio do semáforo).

## As três camadas

| Camada | Pasta | Papel |
|---|---|---|
| 1. Sistema físico | `js/fisico/` | Desenha catraca e semáforo em SVG. Sensor dispara um símbolo de Σ; a saída do estado aciona os atuadores. |
| 2. Motor | `js/motor/` | Máquina de Moore, estados alcançáveis, minimização por partições, equivalência. |
| 3. Interface | `js/ui/`, `css/`, `index.html` | Diagrama, painéis de simulação e minimização, mensagens. |

A camada 1 e o motor **não se conhecem**. A ligação é feita pela interface padronizada (`js/fisico/interface.js`): *evento de entrada entra, saída do estado sai*. Por isso dá para trocar o sistema físico sem mexer no algoritmo.

## Formato da máquina (JSON)

Segue a notação **M = (Q, Σ, δ, q0, Γ, λ)**:

```json
{
  "nome": "Catraca",
  "Q": ["T1", "T2", "L1", "L2"],
  "Sigma": ["M", "G"],
  "delta": { "T1": { "M": "L1", "G": "T2" }, "...": {} },
  "q0": "T1",
  "Gamma": ["BLOQUEADA", "LIBERADA"],
  "lambda": { "T1": "BLOQUEADA", "L1": "LIBERADA", "...": "" }
}
```

Regras: `delta` precisa ter um destino para **cada** estado e **cada** símbolo; `lambda` precisa estar definida para todo estado e dentro de `Gamma`.

## Como adicionar uma máquina

1. Crie `maquinas/minha.json` no formato acima.
2. Rode `node gerar-maquinas.js` (atualiza a cópia embutida `js/maquinas.js` e avisa se o JSON tiver erro).
3. Em `index.html`, acrescente uma `<option value="minha">` no seletor "Sistema".
4. (Opcional) Para ter um desenho físico, crie `js/fisico/minha.js` registrando um objeto com `id`, `montar(el, aoEvento)` e `mostrarSaida(g)` (veja `catraca.js`) e inclua o script no `index.html`. Sem isso, o painel físico mostra "ainda não disponível" e o resto funciona.

## Testes (opcionais; o app não depende deles)

```
node testes/rodar.js        # 20 testes do motor: 4→2, 8→4, partições, equivalência, erros, 300 máquinas aleatórias
node testes/exportar.js     # exporta original e mínimo em testes/exportados/
pip install dfa automata-lib
python3 testes/oraculo.py   # confere com bibliotecas independentes
```

As bibliotecas Python (`dfa`, `automata-lib`) servem **só de oráculo** nos testes; não são dependência do app.

## Acessibilidade

Interface em português do Brasil, contraste alto, navegação completa por teclado (Tab, Enter, Espaço), foco visível, botões de 44 px, rótulos para leitores de tela e mensagens anunciadas em região `role="status"`. Cores nunca são a única informação: toda saída aparece também em texto.

## Licenças e referências

Todo o código foi escrito do zero, sem copiar nada de Wokwi, Rocksi, Gears ou RoboBlockly; eles serviram só de inspiração de ideias. Se for reutilizar qualquer componente de terceiros (por exemplo, wokwi-elements), confira antes a licença. O app não usa bibliotecas externas.

## Fora do escopo da v1

Simulação de microcontrolador (avr8js), React e avaliação pedagógica com alunos. O **alarme** tem só a estrutura (`js/fisico/alarme.js`) para entrar na v2.
