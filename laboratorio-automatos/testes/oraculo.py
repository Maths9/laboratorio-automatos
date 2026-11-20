"""
ETAPA 2 - ORACULO EM PYTHON (verificacao independente)

Uso:
    pip install dfa automata-lib
    node testes/exportar.js
    python3 testes/oraculo.py

Nao faz parte do app: so confere se o nosso motor (JavaScript) concorda com
bibliotecas feitas por outras pessoas.
  - biblioteca "dfa"          -> minimiza e conta os estados minimos
  - biblioteca "automata-lib" -> verifica equivalencia original x minimo
Truque: uma maquina de Moore vira um DFA por saida g. Para cada g, os estados
com lambda(q) = g sao os estados finais. Duas maquinas de Moore sao
equivalentes se, para todo g, os DFAs correspondentes aceitam a mesma linguagem.
"""
import json
import sys
from pathlib import Path

from dfa import DFA
from automata.fa.dfa import DFA as DFAAutomata

PASTA = Path(__file__).parent / "exportados"


def carregar(arquivo):
    return json.loads(Path(arquivo).read_text(encoding="utf-8"))


def contar_minimo_dfa(m):
    """Usa a biblioteca dfa: label = saida do estado (Moore), depois minimize()."""
    d = DFA(
        start=m["q0"],
        inputs=set(m["Sigma"]),
        label=lambda q: m["lambda"][q],
        transition=lambda q, s: m["delta"][q][s],
        outputs=set(m["Gamma"]),
    )
    return len(d.minimize().states())


def dfa_por_saida(m, g):
    """DFA do automata-lib em que os estados finais sao os de saida g."""
    return DFAAutomata(
        states=set(m["Q"]),
        input_symbols=set(m["Sigma"]),
        transitions={q: dict(m["delta"][q]) for q in m["Q"]},
        initial_state=m["q0"],
        final_states={q for q in m["Q"] if m["lambda"][q] == g},
        allow_partial=False,
    )


def equivalentes(a, b):
    if set(a["Sigma"]) != set(b["Sigma"]):
        return False
    saidas = set(a["Gamma"]) | set(b["Gamma"])
    return all(dfa_por_saida(a, g) == dfa_por_saida(b, g) for g in saidas)


def main():
    esperado = carregar(PASTA / "esperado.json")
    falhas = 0
    for nome, cont in esperado.items():
        orig = carregar(PASTA / f"{nome}.json")
        mini = carregar(PASTA / f"{nome}.minimo.json")
        n_oraculo = contar_minimo_dfa(orig)
        eq = equivalentes(orig, mini)
        ok = (n_oraculo == cont["minimo"]) and eq and len(mini["Q"]) == cont["minimo"]
        falhas += 0 if ok else 1
        print(
            f"{'OK ' if ok else 'ERRO'} {nome}: nosso motor {cont['original']}->{cont['minimo']} | "
            f"oráculo (dfa) mínimo={n_oraculo} | equivalência (automata-lib)={eq}"
        )
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()
