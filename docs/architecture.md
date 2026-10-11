# Arquitetura — CRUD de Tarefas com Lembretes (PoC)

## Visão geral

Aplicação SPA (Single Page Application) de gerenciamento de tarefas pessoais com lembretes visuais.
Sem back-end: toda a persistência é feita em LocalStorage. A interface usa Material UI para um visual
de painel administrativo.

## Componentes

### 1. Camada de dados — `services/taskStorage.ts`

Serviço que encapsula o acesso ao LocalStorage. Oferece operações CRUD síncronas sobre a coleção de
tarefas armazenada na chave `tasks`.

- `getTasks(): Task[]` — lê e desserializa a lista.
- `saveTask(task: Task): void` — cria ou atualiza (upsert por `id`).
- `deleteTask(id: string): void` — remove pelo `id`.
- `saveTasks(tasks: Task[]): void` — persiste a lista inteira (usado internamente).

### 2. Camada de modelo — `types/task.ts`

```ts
interface Task {
  id: string;          // UUID v4
  description: string; // texto obrigatório
  dateTime: string;    // ISO 8601, data e hora obrigatórios
  reminded: boolean;   // true quando o lembrete já foi exibido
  createdAt: string;   // ISO 8601
}
```

### 3. Hook de estado — `hooks/useTasks.ts`

Hook React que expõe o estado reativo das tarefas e as operações de mutação. Usa `useState` para manter
a lista em memória e sincroniza com o `taskStorage` a cada mutação.

- `tasks: Task[]`
- `addTask(data: Omit<Task, 'id' | 'reminded' | 'createdAt'>): void`
- `updateTask(id: string, data: Partial<Pick<Task, 'description' | 'dateTime'>>): void`
- `removeTask(id: string): void`
- `markReminded(id: string): void`

### 4. Hook de lembretes — `hooks/useReminders.ts`

Roda um `setInterval` (a cada 15 s) que percorre as tarefas e, para cada uma cujo `dateTime` está a
≤ 60 segundos no futuro (ou já passou) e `reminded === false`, dispara um callback de notificação e
marca `reminded = true` no storage.

Ao montar o hook (abertura da aplicação), roda a checagem imediatamente para cobrir o caso de tarefas
que já estão no limiar (AC-7 + decisão "Lembrete ao abrir a aplicação").

### 5. Layout administrativo — `components/AdminLayout.tsx`

Componente de layout com:
- `AppBar` do MUI com título da aplicação.
- `Drawer` lateral (permanente em telas grandes, retrátil em telas pequenas) com navegação.
- Área de conteúdo (`<Outlet />`).

### 6. Páginas

| Página | Rota | Descrição |
|---|---|---|
| `TaskListPage` | `/` | Lista de tarefas em tabela ou cards MUI, com botões de editar e excluir e FAB de adicionar. |
| `TaskFormDialog` | — | Diálogo MUI (não é rota) para criar ou editar uma tarefa. |

### 7. Tema — `theme/theme.ts`

Tema customizado do MUI com modo claro/escuro, usando `createTheme` com paleta personalizada.

### 8. Notificação — snackbar global

Um `Snackbar` do MUI controlado por contexto (`SnackbarProvider`) para exibir os lembretes e outras
mensagens de feedback (criação, edição, exclusão).

## Fluxos principais

### Criar tarefa
1. Usuário clica no FAB (+) → abre `TaskFormDialog` em modo criação.
2. Preenche descrição, data e hora (todos obrigatórios, validação no submit).
3. Ao confirmar, `useTasks.addTask` gera UUID, salva no LocalStorage e atualiza o estado.
4. Snackbar confirma a criação.

### Editar tarefa
1. Usuário clica em "Editar" na linha → abre `TaskFormDialog` com dados preenchidos.
2. Altera campos e confirma.
3. `useTasks.updateTask` persiste e atualiza estado; reseta `reminded = false` se a data/hora mudou.

### Excluir tarefa
1. Usuário clica em "Excluir" → diálogo de confirmação.
2. Ao confirmar, `useTasks.removeTask` remove do LocalStorage e do estado.

### Lembrete
1. `useReminders` verifica a cada 15 s.
2. Para tarefas com `dateTime` a ≤ 60 s no futuro (ou já passado) e `reminded === false`:
   - Exibe Snackbar com a descrição da tarefa.
   - Marca `reminded = true`.

## Mapeamento AC → Componentes

| AC | Componente(s) |
|---|---|
| AC-1 | `TaskListPage`, `AdminLayout` |
| AC-2 | `TaskFormDialog` (validação) |
| AC-3 | `TaskFormDialog`, `useTasks.addTask`, `taskStorage` |
| AC-4 | `TaskFormDialog`, `useTasks.updateTask`, `taskStorage` |
| AC-5 | `TaskListPage` (botão excluir), `useTasks.removeTask`, `taskStorage` |
| AC-6 | `taskStorage` (leitura no mount), `useTasks` |
| AC-7 | `useReminders`, `SnackbarProvider` |
| AC-8 | `AdminLayout` (AppBar, Drawer), tema MUI |
| AC-9 | `tsconfig.json` (strict), build Vite |
| AC-10 | Tema, layout, espaçamento (verificação manual) |

## Front-end

**Required.** Todo o trabalho desta task é front-end.

### Estrutura de pastas (`front-end/`)

```
front-end/
├── public/
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── TaskFormDialog.tsx
│   │   ├── DeleteConfirmDialog.tsx
│   │   └── SnackbarProvider.tsx
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   └── useReminders.ts
│   ├── pages/
│   │   └── TaskListPage.tsx
│   ├── services/
│   │   └── taskStorage.ts
│   ├── theme/
│   │   └── theme.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .gitignore
```

### Back-end

Não há back-end. A persistência é feita exclusivamente em LocalStorage (decisão do pedido original).
A pasta `back-end/` não será criada.

## Plano de implementação

### Back-end

Nenhum trabalho. Não há back-end nesta task.

### Front-end (responsabilidade do Frontend Engineer)

Ordem sugerida de implementação:

1. **Scaffolding do projeto**: `npm create vite@latest`, instalar dependências (MUI, React Router,
   date-fns ou dayjs para manipulação de datas, uuid).
2. **Modelo e storage**: `types/task.ts` e `services/taskStorage.ts`.
3. **Hook `useTasks`**: estado reativo + CRUD via `taskStorage`.
4. **Tema e layout**: `theme.ts`, `AdminLayout.tsx` com AppBar e Drawer.
5. **Página de listagem**: `TaskListPage.tsx` com tabela/cards MUI.
6. **Diálogo de formulário**: `TaskFormDialog.tsx` com validação.
7. **Diálogo de exclusão**: `DeleteConfirmDialog.tsx`.
8. **Snackbar global**: `SnackbarProvider.tsx` com contexto.
9. **Hook `useReminders`**: lógica de verificação periódica + disparo de snackbar.
10. **Testes Vitest**: testes unitários para `taskStorage`, `useTasks`, `useReminders` e testes de
    componente para `TaskFormDialog` e `TaskListPage`.
11. **Dockerfile**: nginx servindo o build estático, com healthcheck.
12. **Ajustes visuais**: espaçamento, cores, responsividade.

## Como rodar

### Instalar dependências
```bash
cd front-end && npm install
```

### Desenvolvimento
```bash
cd front-end && npm run dev
```

### Build
```bash
cd front-end && npm run build
```

### Testes
```bash
cd front-end && npm test -- --run
```

### Type check
```bash
cd front-end && npx tsc --noEmit
```

## Variáveis de ambiente

Nenhuma. A aplicação é puramente client-side com LocalStorage.

## Como o sistema inicia

Em desenvolvimento: `npm run dev` sobe o Vite dev server (porta padrão 5173).
Em produção (container): o Dockerfile faz o build e serve com nginx na porta 80.
