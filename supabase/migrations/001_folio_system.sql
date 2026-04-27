-- Tabla para almacenar contadores de folio por tipo de documento
create table if not exists document_counters (
  doc_type text primary key,
  last_number int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Insertar tipos iniciales
insert into document_counters (doc_type, last_number) values
  ('COT', 0), ('BIT', 0), ('CA', 0), ('CHK-IZ', 0), ('OT', 0),
  ('CONT', 0), ('REQ', 0), ('EPP', 0), ('PI', 0), ('RA', 0),
  ('MIS', 0), ('MOP', 0), ('PC', 0), ('CE', 0), ('MR', 0),
  ('CST', 0), ('IPC', 0), ('ETF', 0), ('CFD', 0), ('CRH', 0), ('AF', 0)
on conflict (doc_type) do nothing;

-- Función SQL para generar folio único sin race conditions
create or replace function generate_folio(p_doc_type text)
returns text as $$
declare
  v_new_number int;
  v_folio text;
begin
  -- Update con FOR UPDATE para lock atomático
  update document_counters
  set last_number = last_number + 1,
      updated_at = now()
  where doc_type = p_doc_type
  returning last_number into v_new_number;

  -- Formatear folio: MICSA-COT-0001
  v_folio := 'MICSA-' || p_doc_type || '-' ||
             lpad(v_new_number::text, 4, '0');

  return v_folio;
end;
$$ language plpgsql;

-- RPC para que Next.js pueda llamarlo
create or replace function rpc_generate_folio(p_doc_type text)
returns text as $$
begin
  return generate_folio(p_doc_type);
end;
$$ language plpgsql;
