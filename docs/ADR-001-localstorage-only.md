# ADR-001 — Persistência exclusivamente em LocalStorage

## Contexto

O pedido original define que esta é uma PoC sem back-end. A squad tem skill de back-end (node-express),
mas o requisito explicitamente descarta qualquer back-end, API ou banco de dados.

## Decisão

Toda a persistência será feita em LocalStorage do navegador. Não será criada a pasta `back-end/` nem
qualquer serviço de API. O TanStack Query (que faz parte da skill react-mui) **não será usado para
dados de tarefas**, pois não há servidor para consultar; o estado será gerenciado com hooks React
simples (`useState`).

## Alternativas consideradas

1. **Usar IndexedDB**: mais capacidade e operações assíncronas, mas adiciona complexidade desnecessária
   para uma PoC com poucos registros.
2. **Criar um back-end mínimo**: contraria o pedido explícito do usuário.

## Consequências

- Dados limitados ao navegador e dispositivo (sem sincronização).
- Limite de ~5 MB do LocalStorage (suficiente para a PoC).
- Operações síncronas simplificam o código (sem `async/await` no CRUD).
- Sem controle de concorrência entre abas.
