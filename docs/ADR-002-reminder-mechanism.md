# ADR-002 — Mecanismo de lembretes com polling via setInterval

## Contexto

O sistema precisa avisar o usuário 1 minuto antes do horário de uma tarefa (AC-7). A Notification API
do navegador está fora de escopo (decisão do PM). O lembrete deve funcionar também ao abrir a
aplicação quando já há tarefas no limiar.

## Decisão

Usar `setInterval` com intervalo de 15 segundos para verificar periodicamente se alguma tarefa está
a ≤ 60 segundos do seu `dateTime` e ainda não foi notificada (`reminded === false`). Ao detectar,
exibir um Snackbar do MUI e marcar `reminded = true` no LocalStorage.

Ao montar o hook, executar a verificação imediatamente (não esperar o primeiro intervalo).

## Alternativas consideradas

1. **setTimeout por tarefa**: mais preciso, mas requer gerenciar muitos timers e recriá-los ao
   recarregar. Complexidade desproporcional para uma PoC.
2. **Web Workers**: permitiria notificação mesmo com a aba em segundo plano, mas adiciona
   complexidade e está além do escopo.
3. **Notification API**: explicitamente fora de escopo.

## Consequências

- Polling a cada 15 s é simples e suficiente para a precisão de "1 minuto antes".
- O lembrete só funciona com a aba aberta e ativa.
- O campo `reminded` evita notificações duplicadas.
- Editar a data/hora de uma tarefa reseta `reminded` para permitir novo lembrete.
