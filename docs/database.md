# Modelo de dados — LocalStorage

## Visão geral

Não há banco de dados relacional nem NoSQL. A persistência é feita exclusivamente em LocalStorage
do navegador, conforme o pedido original (PoC sem back-end).

## Chave e estrutura

| Chave LocalStorage | Tipo do valor | Descrição |
|---|---|---|
| `tasks` | `Task[]` (JSON) | Lista completa de tarefas |

## Esquema do objeto `Task`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` (UUID v4) | Sim | Identificador único, gerado pelo cliente |
| `description` | `string` | Sim | Descrição da tarefa (não vazio) |
| `dateTime` | `string` (ISO 8601) | Sim | Data e hora da tarefa (hora obrigatória, decisão HG-001) |
| `reminded` | `boolean` | Sim | `true` quando o lembrete visual já foi exibido |
| `createdAt` | `string` (ISO 8601) | Sim | Data/hora de criação do registro |

## Exemplo de valor armazenado

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "description": "Reunião com o time de produto",
    "dateTime": "2026-10-11T14:00:00",
    "reminded": false,
    "createdAt": "2026-10-10T10:30:00"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "description": "Entregar relatório mensal",
    "dateTime": "2026-10-12T00:00:00",
    "reminded": true,
    "createdAt": "2026-10-09T08:00:00"
  }
]
```

## Restrições

- **Tamanho**: LocalStorage tem limite de ~5 MB por origem. Para uma PoC com tarefas pessoais,
  isso é mais que suficiente (milhares de registros).
- **Concorrência**: sem sincronização entre abas (fora de escopo).
- **Migração**: não há migrations. Se o formato mudar, o código deve lidar com a leitura de dados
  antigos (parsing defensivo) ou limpar os dados.
- **Persistência**: dados locais ao navegador e dispositivo. Limpar dados do navegador apaga as tarefas.

## Índices

Não aplicável (LocalStorage é key-value; a busca é feita em memória após desserialização).

## Relacionamentos

Não há. Modelo plano com uma única coleção.
