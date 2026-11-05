# Configuração do painel administrativo

1. Execute `schema.sql` no SQL Editor do projeto Supabase. Ele cria a tabela de autorização e permite leitura dos leads somente às contas autorizadas.
2. No Supabase, crie um usuário em **Authentication → Users → Add user**. Não habilite cadastro público para este painel.
3. Execute `authorize-admin.sql` no SQL Editor para autorizar `juliano@gmail.com`. Para autorizar outra conta, copie o UUID do usuário e use:

```sql
insert into public.contact_admins (user_id)
values ('UUID_DO_USUARIO_ADMIN');
```

4. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no ambiente de execução do site.
5. Acesse `/admin` e entre com o e-mail e a senha da conta criada.

A chave anon/publishable pode ser usada no navegador: a segurança dos contatos é aplicada por RLS e pela lista `contact_admins`. Nunca coloque a chave `service_role` no frontend.
