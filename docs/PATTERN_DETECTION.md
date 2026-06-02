# Pattern Detection

## Objetivo

A deteccao de padroes transforma dados da semana em ajustes praticos. O objetivo e perceber tendencias de execucao, sobrecarga, negligencia e retomada sem produzir julgamento moral.

## Fontes permitidas

Usar apenas dados do proprio usuario e, sempre que possivel, em forma agregada:

- Alvos avancados ou parados.
- Projetos movimentados ou sem acao.
- Tarefas concluidas, adiadas ou retomadas.
- Microtarefas concluidas.
- Blocos de calendario por tipo e carga.
- Sessoes de foco concluidas.
- Habitos mantidos, pausados ou retomados.
- Placar em resumo, nao bruto.
- Metacognicao apenas como padrao agregado/redigido, nunca sessao bruta.
- Desbloqueador apenas como rota/resultado agregado.
- Mapa da Vida e Chamado apenas como referencia minima de alinhamento.

## Dados proibidos

Nao usar em padroes ou logs:

- Pensamento automatico bruto.
- Fato/interpretacao/sentimento/impulso de Metacognicao.
- Conteudo completo de distracoes.
- Calendario com notas, detalhes privados, horarios sensiveis ou titulos intimos.
- Placar bruto como ranking de valor pessoal.
- Prompt ou resposta bruta de IA.
- Dados de Atalaia fora de escopo autorizado.

## Regras iniciais

- Sobrecarga: muitos adiamentos, excesso de blocos ou baixa energia pos-foco sugerem reduzir escopo.
- Negligencia: area sem evento recente vira convite de cuidado, nao punicao.
- Retomada: volta apos pausa, falha, adiamento ou baixa execucao conta como progresso real.
- Travamento: projeto/tarefa sem movimento exige proxima acao menor.
- Consistencia: habito minimo, foco curto ou tarefa parcial contam como direcao.
- Descanso protegido: descanso cumprido e progresso de mordomia, nao ausencia de produtividade.

## Saida

Padrao em `weekly_review_output_v1`:

```json
{
  "pattern": "string",
  "evidence": ["string"],
  "impact": "low",
  "suggested_adjustment": "string"
}
```

## Tom

Usar linguagem de aprendizado:

- "O padrao sugere..."
- "Pode ajudar reduzir..."
- "A semana mostrou..."
- "Retomada registrada..."

Evitar:

- "voce falhou"
- "falta disciplina"
- "voce sempre..."
- "voce nunca..."

## Aceite

- Padroes sao curtos e acionaveis.
- Cada padrao tem evidencia minima.
- Ajuste sugerido cabe na proxima semana.
- Sobrecarga gera reducao de friccao.
- Areas negligenciadas viram cuidado, nao castigo.
- Dados sensiveis permanecem minimizados.
