import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import portfolioLogo from '../img/logoportfolio.png';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ContactLead = Database['public']['Tables']['contact_leads']['Row'];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Não foi possível verificar a sessão administrativa.', error);
        setErrorMessage('Não foi possível validar sua sessão. Atualize a página e tente novamente.');
      }
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setLeads([]);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadLeads() {
    if (!supabase || !session) return;

    setLoadingLeads(true);
    setErrorMessage('');
    setNotice('');

    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .select('id, name, email, phone, state_code, state_name, city, message, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Não foi possível carregar os contatos.', error);
        setErrorMessage(
          'A conta está autenticada, mas não tem acesso aos contatos. Confira se ela foi adicionada como administradora no banco.',
        );
        setLeads([]);
        return;
      }

      setLeads(data);
    } catch (error) {
      console.error('Falha de conexão ao carregar os contatos.', error);
      setErrorMessage('Falha de conexão ao carregar os contatos. Verifique sua internet e tente novamente.');
    } finally {
      setLoadingLeads(false);
    }
  }

  useEffect(() => {
    if (session) void loadLeads();
  }, [session]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage('Supabase não configurado. Confira VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setNotice('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        console.error('Falha na autenticação do painel administrativo.', error);
        setErrorMessage('Não foi possível entrar. Verifique seu e-mail e senha.');
      }
    } catch (error) {
      console.error('Falha de conexão durante a autenticação administrativa.', error);
      setErrorMessage('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Não foi possível encerrar a sessão administrativa.', error);
      setErrorMessage('Não foi possível encerrar a sessão. Tente novamente.');
      return;
    }
    setNotice('Você saiu do painel.');
    setErrorMessage('');
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-container admin-header-inner">
          <a className="admin-brand" href="/" aria-label="Voltar ao portfólio de Juliano Araujo">
            <img src={portfolioLogo} alt="" />
            <span>Juliano Araujo<span>.</span></span>
          </a>
          <a className="admin-back-link" href="/">Voltar ao site</a>
        </div>
      </header>

      <div className="admin-container admin-main">
        {authLoading ? (
          <div className="admin-state-card" role="status">Verificando sessão...</div>
        ) : !session ? (
          <section className="admin-login-card">
            <div className="admin-login-mark"><img src={portfolioLogo} alt="" /></div>
            <p className="admin-eyebrow">ÁREA RESTRITA</p>
            <h1>Painel de contatos</h1>
            <p className="admin-description">
              Entre com a conta administrativa autorizada para consultar as mensagens recebidas pelo formulário.
            </p>
            <form className="admin-login-form" onSubmit={handleSignIn}>
              <label>
                E-mail
                <input
                  autoComplete="username"
                  autoFocus
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label>
                Senha
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
              {errorMessage && <p className="admin-message is-error" role="alert">{errorMessage}</p>}
              <button className="button button-accent admin-submit" disabled={submitting || !supabase} type="submit">
                {submitting ? 'Entrando...' : 'Entrar no painel'}
              </button>
              {!supabase && (
                <p className="admin-message is-error">
                  Supabase não configurado. Defina as variáveis de ambiente e reinicie o servidor.
                </p>
              )}
            </form>
            <p className="admin-secure-note">Acesso protegido por autenticação e autorização no banco de dados.</p>
          </section>
        ) : (
          <section className="admin-dashboard">
            <div className="admin-dashboard-heading">
              <div>
                <p className="admin-eyebrow">CAIXA DE ENTRADA</p>
                <h1>Contatos recebidos</h1>
                <p className="admin-description">Mensagens enviadas pelo formulário do portfólio.</p>
              </div>
              <div className="admin-actions">
                <button className="admin-secondary-button" disabled={loadingLeads} onClick={() => void loadLeads()} type="button">
                  {loadingLeads ? 'Atualizando...' : 'Atualizar'}
                </button>
                <button className="admin-secondary-button" onClick={() => void handleSignOut()} type="button">
                  Sair
                </button>
              </div>
            </div>

            <div className="admin-summary">
              <span className="admin-summary-count">{leads.length}</span>
              <span>{leads.length === 1 ? 'contato carregado' : 'contatos carregados'} · até 100 mais recentes</span>
            </div>

            {errorMessage && <p className="admin-message is-error" role="alert">{errorMessage}</p>}
            {notice && <p className="admin-message" role="status">{notice}</p>}
            {loadingLeads && leads.length === 0 ? (
              <div className="admin-state-card" role="status">Carregando contatos...</div>
            ) : errorMessage && leads.length === 0 ? (
              <div className="admin-state-card">Não foi possível mostrar os contatos.</div>
            ) : leads.length === 0 ? (
              <div className="admin-state-card">
                <h2>Nenhum contato por enquanto</h2>
                <p>Quando alguém enviar o formulário, a mensagem aparecerá aqui.</p>
              </div>
            ) : (
              <div className="admin-lead-list">
                {leads.map((lead) => {
                  const phoneDigits = lead.phone.replace(/\D/g, '');
                  return (
                    <article className="admin-lead-card" key={lead.id}>
                      <div className="admin-lead-heading">
                        <div>
                          <h2>{lead.name}</h2>
                          <time dateTime={lead.created_at}>{formatDate(lead.created_at)}</time>
                        </div>
                        <span className="admin-lead-location">{lead.city}, {lead.state_code}</span>
                      </div>
                      <div className="admin-lead-contact">
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        <a href={`tel:+55${phoneDigits}`}>{lead.phone}</a>
                        <a href={`https://wa.me/55${phoneDigits}`} rel="noreferrer" target="_blank">WhatsApp</a>
                      </div>
                      <p className="admin-lead-message">{lead.message}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
