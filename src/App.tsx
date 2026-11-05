import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioLogo from './img/logoportfolio.png';

const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
] as const;

interface IbgeCity {
  id: number;
  nome: string;
}

function isIbgeCityList(data: unknown): data is IbgeCity[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'number' &&
        'nome' in item &&
        typeof item.nome === 'string',
    )
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const services = [
  {
    number: '01',
    icon: 'web',
    title: 'Sites institucionais',
    description:
      'Uma presença digital profissional, clara e pronta para apresentar o valor do seu negócio.',
  },
  {
    number: '02',
    icon: 'store',
    title: 'Landing pages',
    description:
      'Páginas focadas em uma oferta, com conteúdo e chamadas para ação que facilitam o próximo passo.',
  },
  {
    number: '03',
    icon: 'code',
    title: 'Experiências web',
    description:
      'Interfaces sob medida para organizar processos, divulgar serviços ou levar uma ideia ao próximo nível.',
  },
] as const;

const solutions = [
  {
    kind: 'PARA MARCAS E SERVIÇOS',
    title: 'Um site que apresenta seu negócio com clareza.',
    description: 'Institucional',
    icon: 'globe',
  },
  {
    kind: 'PARA CAMPANHAS E LANÇAMENTOS',
    title: 'Uma página direta para sua próxima oferta.',
    description: 'Landing page',
    icon: 'cursor',
  },
  {
    kind: 'PARA IDEIAS EM CRESCIMENTO',
    title: 'Uma interface que acompanha sua operação.',
    description: 'Aplicação web',
    icon: 'layers',
  },
] as const;

const faqs = [
  {
    question: 'Como funciona o desenvolvimento de um site?',
    answer:
      'Começamos entendendo seu negócio, público e objetivo. Depois alinhamos estrutura e conteúdo, desenvolvemos a interface e refinamos tudo com seus comentários antes da publicação.',
  },
  {
    question: 'O site funciona bem no celular?',
    answer:
      'Sim. A experiência é projetada primeiro para telas pequenas e adaptada para tablet e desktop, com atenção à leitura, navegação e velocidade.',
  },
  {
    question: 'Posso atualizar o conteúdo depois?',
    answer:
      'Sim. A solução é definida conforme sua necessidade: posso preparar uma estrutura simples de manter ou integrar um CMS quando atualizações frequentes fizerem sentido.',
  },
  {
    question: 'Quanto tempo leva e quanto custa?',
    answer:
      'O prazo e o investimento dependem do escopo, conteúdo e integrações. Na conversa inicial, entendemos suas prioridades e combinamos uma proposta adequada.',
  },
] as const;

type IconName =
  | 'web'
  | 'store'
  | 'code'
  | 'globe'
  | 'cursor'
  | 'layers'
  | 'arrow'
  | 'check'
  | 'spark'
  | 'menu';

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  const paths: Record<IconName, ReactNode> = {
    web: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v5m-2 5h4m-4 3h7m3-5h2" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
        <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6" />
      </>
    ),
    code: (
      <>
        <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-7-2 6" />
        <rect x="2.5" y="3" width="19" height="18" rx="3" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    cursor: (
      <>
        <path d="m5 3 14 10-7 1-3 7L5 3Z" />
        <path d="m13 14 5 6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    spark: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        <path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
  };

  return <svg {...shared}>{paths[name]}</svg>;
}

function App() {
  const [headerSolid, setHeaderSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [phone, setPhone] = useState('');
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');
  const [citiesRetryCount, setCitiesRetryCount] = useState(0);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity('');
      setCitiesError('');
      return;
    }

    const controller = new AbortController();
    setCities([]);
    setSelectedCity('');
    setCitiesLoading(true);
    setCitiesError('');

    async function loadCities() {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`IBGE respondeu com status ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!isIbgeCityList(data)) {
          throw new Error('Formato inesperado na resposta de municípios do IBGE');
        }

        setCities(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Não foi possível carregar os municípios do IBGE.', error);
        setCitiesError('Não foi possível carregar as cidades. Verifique sua conexão e tente novamente.');
      } finally {
        if (!controller.signal.aborted) {
          setCitiesLoading(false);
        }
      }
    }

    void loadCities();
    return () => controller.abort();
  }, [selectedState, citiesRetryCount]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const updateHeader = () => setHeaderSolid(window.scrollY > 80);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
      const heroItems = gsap.utils.toArray<HTMLElement>('.hero-animate');

      gsap.fromTo(
        heroItems,
        { opacity: 0, y: isSmallScreen ? 12 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: isSmallScreen ? 0.45 : 0.7,
          stagger: isSmallScreen ? 0.08 : 0.15,
          ease: 'power3.out',
          delay: 0.12,
        },
      );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: isSmallScreen ? 10 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: isSmallScreen ? 0.45 : 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-grid').forEach((grid) => {
        gsap.fromTo(
          grid.children,
          { opacity: 0, y: isSmallScreen ? 8 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: isSmallScreen ? 0.4 : 0.6,
            stagger: isSmallScreen ? 0.04 : 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 86%',
              once: true,
            },
          },
        );
      });
    });

    return () => {
      window.removeEventListener('scroll', updateHeader);
      media.revert();
    };
  }, []);

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setFormStatus('error');
      setFormMessage('O formulário ainda não está configurado. Confira as variáveis do Supabase no arquivo .env.local.');
      return;
    }

    const state = BRAZILIAN_STATES.find((item) => item.code === selectedState);
    if (!state || !selectedCity) {
      setFormStatus('error');
      setFormMessage('Selecione o estado e a cidade antes de enviar.');
      return;
    }

    const data = new FormData(form);
    setFormStatus('sending');
    setFormMessage('');

    try {
      const { supabase } = await import('./lib/supabase');
      if (!supabase) {
        setFormStatus('error');
        setFormMessage('O formulário ainda não está configurado. Confira as variáveis do Supabase no arquivo .env.local.');
        return;
      }

      const { error } = await supabase.from('contact_leads').insert({
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        phone,
        state_code: state.code,
        state_name: state.name,
        city: selectedCity,
        message: String(data.get('message')).trim(),
      });

      if (error) {
        console.error('O Supabase recusou o envio do contato.', error);
        setFormStatus('error');
        setFormMessage('Não foi possível enviar agora. Tente novamente em instantes.');
        return;
      }

      form.reset();
      setSelectedState('');
      setSelectedCity('');
      setPhone('');
      setFormStatus('success');
      setFormMessage('Mensagem enviada! Obrigado pelo contato. Vou responder assim que possível.');
    } catch (error) {
      console.error('Falha de conexão ao enviar o contato para o Supabase.', error);
      setFormStatus('error');
      setFormMessage('Falha de conexão ao enviar. Verifique sua internet e tente novamente.');
    }
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className={`site-header${headerSolid ? ' is-solid' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="Juliano Araujo, início">
            <img className="brand-logo" src={portfolioLogo} alt="" />
            <span className="brand-name">Juliano Araujo<span>.</span></span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name="menu" />
          </button>
          <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navegação principal">
            <a href="#servicos" onClick={() => setMenuOpen(false)}>O que faço</a>
            <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
            <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
            <a className="button button-small button-outline" href="#contato" onClick={() => setMenuOpen(false)}>
              Vamos conversar <Icon name="arrow" size={16} />
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-grid-pattern" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow hero-animate"><span className="eyebrow-dot" /> DESENVOLVIMENTO WEB PARA NEGÓCIOS</p>
              <h1 className="hero-animate">
                Seu próximo site pode fazer <span>mais pelo seu negócio.</span>
              </h1>
              <p className="hero-description hero-animate">
                Crio experiências web rápidas, responsivas e bem pensadas para apresentar seu trabalho e transformar interesse em conversa.
              </p>
              <div className="hero-actions hero-animate">
                <a className="button button-accent" href="#contato">
                  Vamos tirar sua ideia do papel <Icon name="arrow" />
                </a>
                <a className="text-link" href="#solucoes">
                  Conheça as soluções <span className="arrow-nudge"><Icon name="arrow" size={17} /></span>
                </a>
              </div>
              <div className="hero-note hero-animate">
                <span className="note-icon"><Icon name="check" size={16} /></span>
                Feito para pessoas. Pensado para resultados.
              </div>
            </div>

            <div className="hero-visual hero-animate" aria-label="Prévia ilustrativa de uma interface web" role="img">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-glow" />
              <div className="floating-label label-top"><span className="status-dot" /> Experiência sob medida</div>
              <div className="browser-card">
                <div className="browser-top">
                  <div className="browser-dots"><i /><i /><i /></div>
                  <div className="browser-address"><span /> seu-negocio.com.br</div>
                  <span className="browser-menu">···</span>
                </div>
                <div className="mock-site">
                  <div className="mock-nav">
                    <span className="mock-logo" />
                    <div className="mock-nav-lines"><i /><i /><i /></div>
                    <span className="mock-nav-button" />
                  </div>
                  <div className="mock-content">
                    <span className="mock-kicker" />
                    <span className="mock-heading mock-heading-wide" />
                    <span className="mock-heading mock-heading-short" />
                    <span className="mock-body mock-body-wide" />
                    <span className="mock-body mock-body-short" />
                    <span className="mock-cta" />
                  </div>
                  <div className="mock-picture">
                    <div className="picture-sun" />
                    <div className="picture-shape shape-back" />
                    <div className="picture-shape shape-front" />
                    <div className="picture-base" />
                  </div>
                  <div className="mock-bottom">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
              <div className="floating-label label-bottom">
                <span className="label-icon"><Icon name="spark" size={17} /></span>
                Design + tecnologia
              </div>
              <div className="floating-brand-logo">
                <img src={portfolioLogo} alt="Logo de Juliano Araujo, Desenvolvedor Web" />
              </div>
              <div className="visual-cross cross-one" />
              <div className="visual-cross cross-two" />
            </div>
          </div>
          <div className="hero-bottom container">
            <span>DO PRIMEIRO CLIQUE AO PRÓXIMO PASSO</span>
            <a href="#servicos" aria-label="Rolar para conhecer os serviços"><span className="scroll-line" /></a>
            <span>SCROLL PARA EXPLORAR</span>
          </div>
        </section>

        <section className="intro-strip" aria-label="Princípios do trabalho">
          <div className="container intro-strip-inner">
            <span>ESTRATÉGIA</span><i />
            <span>DESIGN</span><i />
            <span>DESENVOLVIMENTO</span><i />
            <span>PERFORMANCE</span>
          </div>
        </section>

        <section className="section services-section" id="servicos">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">COMO POSSO AJUDAR</p>
                <h2>Uma presença digital que trabalha junto com você.</h2>
              </div>
              <p className="section-intro">
                Seu site é muitas vezes o primeiro contato com um cliente. Vamos fazer com que esse primeiro passo seja claro, útil e memorável.
              </p>
            </div>
            <div className="service-grid reveal-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <div className="card-topline"><span className="icon-box"><Icon name={service.icon} /></span><span className="card-number">{service.number}</span></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a className="card-link" href="#contato" aria-label={`Conversar sobre ${service.title}`}>
                    Vamos conversar <span className="arrow-nudge"><Icon name="arrow" size={17} /></span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="solutions-section section" id="solucoes">
          <div className="container">
            <div className="section-heading section-heading-light reveal">
              <div>
                <p className="eyebrow eyebrow-light">SOLUÇÕES PARA CADA MOMENTO</p>
                <h2>Do que você precisa para dar o próximo passo?</h2>
              </div>
              <p className="section-intro">
                Cada projeto parte de um objetivo real. A solução certa é a que faz sentido para sua fase, seu público e sua rotina.
              </p>
            </div>
            <div className="solution-grid reveal-grid">
              {solutions.map((solution) => (
                <article className="solution-card" key={solution.description}>
                  <div className="solution-icon"><Icon name={solution.icon} size={25} /></div>
                  <p className="solution-kind">{solution.kind}</p>
                  <h3>{solution.title}</h3>
                  <div className="solution-bottom">
                    <span>{solution.description}</span>
                    <a href="#contato" aria-label={`Conversar sobre ${solution.description}`}><Icon name="arrow" size={18} /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="processo">
          <div className="container process-layout">
            <div className="process-copy reveal">
              <p className="eyebrow">SIMPLES, CLARO E COLABORATIVO</p>
              <h2>Um bom projeto começa com uma boa conversa.</h2>
              <p className="section-intro">
                Você acompanha cada etapa e sabe o que está acontecendo. Sem complicar o processo — e sem surpresas no caminho.
              </p>
              <a className="text-link dark-link" href="#contato">
                Conte o que você está planejando <span className="arrow-nudge"><Icon name="arrow" size={17} /></span>
              </a>
            </div>
            <div className="process-list reveal">
              <article className="process-step">
                <span className="step-number">01</span>
                <div><h3>Entender</h3><p>Alinhamos objetivos, público e o que realmente precisa ser resolvido.</p></div>
                <span className="step-check"><Icon name="check" size={17} /></span>
              </article>
              <article className="process-step">
                <span className="step-number">02</span>
                <div><h3>Desenhar</h3><p>Organizamos conteúdo e experiência antes de transformar a ideia em código.</p></div>
                <span className="step-check"><Icon name="check" size={17} /></span>
              </article>
              <article className="process-step">
                <span className="step-number">03</span>
                <div><h3>Construir</h3><p>Desenvolvemos, testamos em diferentes telas e ajustamos com seu retorno.</p></div>
                <span className="step-check"><Icon name="check" size={17} /></span>
              </article>
              <article className="process-step">
                <span className="step-number">04</span>
                <div><h3>Publicar</h3><p>Colocamos seu projeto no ar e deixamos os próximos passos bem definidos.</p></div>
                <span className="step-check"><Icon name="check" size={17} /></span>
              </article>
            </div>
          </div>
        </section>

        <section className="benefit-band">
          <div className="container benefit-layout reveal">
            <div className="benefit-heading">
              <p className="eyebrow eyebrow-light">MAIS DO QUE UM SITE BONITO</p>
              <h2>Uma experiência feita para funcionar de verdade.</h2>
            </div>
            <div className="benefit-items">
              <div><span className="benefit-check"><Icon name="check" size={15} /></span><p>Rápida e confortável de usar</p></div>
              <div><span className="benefit-check"><Icon name="check" size={15} /></span><p>Responsiva em todas as telas</p></div>
              <div><span className="benefit-check"><Icon name="check" size={15} /></span><p>Estrutura pronta para crescer</p></div>
              <div><span className="benefit-check"><Icon name="check" size={15} /></span><p>Conteúdo fácil de entender</p></div>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="container faq-layout">
            <div className="faq-heading reveal">
              <p className="eyebrow">PERGUNTAS FREQUENTES</p>
              <h2>O que você quer saber antes de começar?</h2>
              <p>Não encontrou sua dúvida? Me conte o que está pensando e conversamos.</p>
              <a className="text-link dark-link" href="#contato">
                Fale comigo <span className="arrow-nudge"><Icon name="arrow" size={17} /></span>
              </a>
            </div>
            <div className="faq-list reveal">
              {faqs.map((faq) => (
                <details className="faq-item" key={faq.question}>
                  <summary>{faq.question}<span className="faq-plus" aria-hidden="true" /></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="container contact-layout">
            <div className="contact-copy reveal">
              <p className="eyebrow eyebrow-light">SEU PRÓXIMO PASSO COMEÇA AQUI</p>
              <h2>Tem uma ideia? <span>Vamos conversar.</span></h2>
              <p>
                Me conte um pouco sobre seu negócio e o que você quer construir. A conversa inicial é sem compromisso.
              </p>
              <div className="contact-promise">
                <span><Icon name="check" size={16} /></span>
                Uma resposta humana, sem compromisso.
              </div>
              <div className="contact-details" aria-label="Dados para contato">
                <a href="mailto:julianoaraujo8749@gmail.com">
                  julianoaraujo8749@gmail.com
                </a>
                <a href="tel:+5551993667248">
                  (51) 99366-7248
                </a>
                <a href="https://wa.me/5551993667248" rel="noreferrer" target="_blank">
                  Conversar pelo WhatsApp
                </a>
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <label>
                  Seu nome
                  <input autoComplete="name" maxLength={120} minLength={2} name="name" placeholder="Como posso te chamar?" required />
                </label>
                <label>
                  Seu e-mail
                  <input autoComplete="email" maxLength={254} name="email" placeholder="voce@empresa.com" required type="email" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Telefone / WhatsApp
                  <input
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={15}
                    minLength={15}
                    name="phone"
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    pattern="\([0-9]{2}\) [0-9]{5}-[0-9]{4}"
                    placeholder="(00) 00000-0000"
                    required
                    type="tel"
                    value={phone}
                  />
                </label>
                <label>
                  Estado
                  <select
                    autoComplete="address-level1"
                    name="state_code"
                    onChange={(event) => setSelectedState(event.target.value)}
                    required
                    value={selectedState}
                  >
                    <option value="">Selecione o estado</option>
                    {BRAZILIAN_STATES.map((state) => (
                      <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Cidade
                <select
                  autoComplete="address-level2"
                  disabled={!selectedState || citiesLoading || Boolean(citiesError)}
                  name="city"
                  onChange={(event) => setSelectedCity(event.target.value)}
                  required
                  value={selectedCity}
                >
                  <option value="">
                    {!selectedState ? 'Selecione primeiro o estado' : citiesLoading ? 'Carregando cidades...' : 'Selecione a cidade'}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.nome}>{city.nome}</option>
                  ))}
                </select>
                {citiesError && (
                  <span className="form-field-error" role="alert">
                    {citiesError}{' '}
                    <button className="retry-cities" type="button" onClick={() => setCitiesRetryCount((count) => count + 1)}>
                      Tentar novamente
                    </button>
                  </span>
                )}
              </label>
              <label>
                O que você está planejando?
                <textarea maxLength={5000} minLength={10} name="message" placeholder="Conte brevemente sobre sua ideia..." required rows={4} />
              </label>
              <div className="form-submit-row">
                <button className="button button-accent" disabled={formStatus === 'sending'} type="submit">
                  {formStatus === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
                  {formStatus !== 'sending' && <Icon name="arrow" size={18} />}
                </button>
                <span>Sem spam. Só uma boa conversa.</span>
              </div>
              <p className={`form-message${formStatus === 'error' ? ' is-error' : ''}`} aria-live="polite" role="status">
                {formMessage}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#inicio">
            <img className="brand-logo" src={portfolioLogo} alt="" />
            <span className="brand-name">Juliano Araujo<span>.</span></span>
          </a>
          <p>Desenvolvimento web com intenção, cuidado e resultado.</p>
          <a className="footer-top" href="#inicio">Voltar ao topo ↑</a>
          <span className="footer-copyright">© {new Date().getFullYear()} Juliano Araujo. Feito com cuidado.</span>
          <a className="footer-admin-link" href="/admin">Área administrativa</a>
        </div>
      </footer>
    </>
  );
}

export default App;
