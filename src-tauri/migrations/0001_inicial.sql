-- Valores em dinheiro são guardados em CENTAVOS (INTEGER): R$ 12,50 = 1250.
-- Datas em texto no formato AAAA-MM-DD.

CREATE TABLE contas (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nome          TEXT    NOT NULL UNIQUE,
  tipo          TEXT    NOT NULL DEFAULT 'corrente',
  saldo_inicial INTEGER NOT NULL DEFAULT 0,
  criado_em     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE categorias (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  cor  TEXT NOT NULL DEFAULT '#64748B',
  UNIQUE (nome, tipo)
);

CREATE TABLE transacoes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo         TEXT    NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  valor        INTEGER NOT NULL CHECK (valor > 0),
  data         TEXT    NOT NULL,
  descricao    TEXT    NOT NULL,
  observacao   TEXT,
  conta_id     INTEGER NOT NULL REFERENCES contas(id) ON DELETE RESTRICT,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  criado_em    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_transacoes_data ON transacoes (data);

INSERT INTO categorias (nome, tipo, cor) VALUES
  ('Alimentação', 'despesa', '#134E4A'),
  ('Moradia',     'despesa', '#0F766E'),
  ('Transporte',  'despesa', '#14B8A6'),
  ('Lazer',       'despesa', '#5EEAD4'),
  ('Saúde',       'despesa', '#64748B'),
  ('Educação',    'despesa', '#94A3B8'),
  ('Outros',      'despesa', '#CCFBF1'),
  ('Salário',     'receita', '#1E3A8A'),
  ('Freela',      'receita', '#3B82F6'),
  ('Outros',      'receita', '#BFDBFE');
