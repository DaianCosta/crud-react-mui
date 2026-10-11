# Contrato de API

## Não há API

Esta aplicação é uma PoC exclusivamente front-end, sem back-end. Não existem endpoints HTTP.

Toda a lógica de dados é resolvida localmente:

- **Persistência**: LocalStorage do navegador (chave `tasks`).
- **Operações**: CRUD síncrono via `services/taskStorage.ts`.
- **Estado**: gerenciado pelo hook `useTasks` em memória React, sincronizado com LocalStorage.

O Frontend Engineer **não** deve criar chamadas HTTP, nem usar TanStack Query para dados de tarefas
(não há servidor para consultar). O estado é local e síncrono.
