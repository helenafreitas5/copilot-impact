"use client";

import { useMemo, useState } from "react";

const businessSignals = [
  { label: "Sessões realizadas", value: "+20", note: "nos últimos 15 dias", state: "Em andamento" },
  { label: "Sponsors SRT", value: "SRT", note: "engajamento de sócios", state: "Prioridade" },
  { label: "SRT Playbook Lab", value: "Lab", note: "frente de capacitação", state: "Em andamento" },
  { label: "DotHub Booking", value: "Ativo", note: "canal de experiência", state: "Em andamento" },
];
const reportedResults = [
  ["5.600", "profissionais treinados", "todas as áreas"],
  ["179h", "de treinamento", "carga total reportada"],
  ["+40%", "adoção do Copilot", "variação reportada"],
];
const calendarSessions: Record<number, { month: string; days: number[]; label: string }[]> = {
  2025: [
    { month: "Mar", days: [6, 13, 20], label: "Sessões SRT" },
    { month: "Jun", days: [4, 11, 18], label: "Labs de playbook" },
    { month: "Set", days: [9, 16, 23], label: "Sessões por área" },
  ],
  2026: [
    { month: "Fev", days: [5, 12, 19], label: "Sessões SRT" },
    { month: "Abr", days: [7, 14, 28], label: "DotHub / booking" },
    { month: "Ago", days: [6, 13, 20], label: "Playbook Lab" },
  ],
};
const dataLanes = [
  ["Telemetria de uso", "Prompts por e-mail · janela de 180 dias", "Disponível", "now"],
  ["Perfil organizacional", "Cargo · área · service line", "Disponível", "now"],
  ["Voz do colaborador", "~3 mil e-mails sobre ajuda e personalização", "Disponível", "now"],
  ["People", "População elegível, movimentações e atributos", "Aguardando", "wait"],
  ["TI / Global", "Export oficial de adoção e impacto Microsoft", "Aguardando", "wait"],
];
const officialMetrics = [
  ["Adoção", "Usuários habilitados, usuários ativos, prompts totais e média de prompts por usuário."],
  ["Uso por superfície", "Atividade e adoção por aplicativo Microsoft 365 / Copilot Chat."],
  ["Impacto assistido", "Ações Copilot, horas assistidas e valor assistido configurável."],
  ["Experiência", "Taxa de satisfação por reações e sentimento por pesquisa."],
];
const journey = [["01", "Sinais", "Prompts e participação mostram onde a adoção acontece."], ["02", "Contexto", "Cargo, área e service line permitem entender padrões."], ["03", "Evidência", "E-mails revelam casos de uso, ajuda e personalização."], ["04", "Impacto", "Dados Microsoft + People completam a leitura de valor."]];
const cohortOptions = ["Safra Mar/2026", "Safra Abr/2026", "Safra Mai/2026", "Safra Jun/2026"];
const analysisViews = {
  area: { title: "Quais áreas usam mais?", metric: "Prompts médios por pessoa / mês", rows: [["Consulting", 84], ["Tax & Legal", 71], ["Audit & Assurance", 59], ["Enabling Areas", 42]] },
  role: { title: "Quais cargos usam mais?", metric: "Prompts médios por pessoa / mês", rows: [["Manager", 86], ["Senior Consultant", 73], ["Partner / Director", 61], ["Analyst", 48]] },
} as const;

export default function Home() {
  const [section, setSection] = useState<"overview" | "analysis" | "cohort" | "data" | "impact">("overview");
  const [scope, setScope] = useState("Todos os SRT");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState<2025 | 2026>(2026);
  const [cohort, setCohort] = useState(cohortOptions[1]);
  const [uplift, setUplift] = useState(40);
  const [baselinePrompts, setBaselinePrompts] = useState(18);
  const [inactivityDays, setInactivityDays] = useState(45);
  const [analysisView, setAnalysisView] = useState<"area" | "role">("area");
  const ready = useMemo(() => dataLanes.filter((lane) => lane[2] === "Disponível").length, []);
  const modeledPrompts = Math.round(baselinePrompts * (1 + uplift / 100));
  const incrementalPrompts = modeledPrompts - baselinePrompts;
  const curveValues = [
    Math.round(baselinePrompts * 0.82),
    baselinePrompts,
    modeledPrompts,
    Math.max(2, Math.round(modeledPrompts * (1 - 0.42 * (30 / inactivityDays)))),
    Math.max(2, Math.round(modeledPrompts * (1 - 0.68 * (60 / inactivityDays)))),
  ];
  const curveMax = Math.max(...curveValues);
  const curveHeights = curveValues.map((value) => `${Math.round(14 + (value / curveMax) * 76)}%`);
  return <main className="shell">
    <header className="topbar"><a className="wordmark" href="#top" aria-label="Deloitte SGO Brazil"><span className="d-mark">D.</span><span>SGO <i>Brazil</i></span></a><div className="top-meta"><span className="live-dot" />Template de status · atualização manual</div><button className="export" onClick={() => window.print()}>Exportar resumo <span>↗</span></button></header>
    <section className="masthead" id="top"><div><p className="eyebrow">Copilot Results Template · SGO Brazil</p><h1>Da adoção ao <em>impacto</em><br />com evidência.</h1><p className="intro">Uma leitura executiva do rollout: o que já está em movimento, o que os sinais disponíveis permitem analisar e o que falta para mensurar impacto completo.</p></div><aside className="status-card"><span className="status-kicker">STATUS DA MENSURAÇÃO</span><strong>Em construção</strong><p>Há dados de uso e feedback. A leitura oficial de impacto depende de TI, People e Global.</p><div><span>{ready}/5</span> fontes mapeadas disponíveis</div><button className="calendar-cta" onClick={() => setCalendarOpen(true)}>Ver calendário de sessões <span>↗</span></button></aside></section>
    <nav className="tabs" aria-label="Seções do dashboard">{[["overview", "Visão executiva"], ["analysis", "Análises"], ["cohort", "Cohort & Value Lab"], ["data", "Dados e cobertura"], ["impact", "Impacto Microsoft"]].map(([id, label]) => <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id as typeof section)}>{label}</button>)}<label>Recorte<select value={scope} onChange={(event) => setScope(event.target.value)}><option>Todos os SRT</option><option>Audit & Assurance</option><option>Consulting</option><option>Tax & Legal</option></select></label></nav>
    {section === "overview" && <><section className="section-head"><div><p className="eyebrow">01 · Status do rollout</p><h2>Ativação que já está acontecendo.</h2></div><p>Recorte selecionado: <strong>{scope}</strong>. Os cards abaixo representam frentes informadas; não são indicadores de desempenho comparáveis.</p></section><section className="signal-grid">{businessSignals.map((signal) => <article className="signal" key={signal.label}><span className="badge">{signal.state}</span><strong>{signal.value}</strong><h3>{signal.label}</h3><p>{signal.note}</p></article>)}</section><section className="results-ribbon" aria-label="Resultados reportados">{reportedResults.map(([value, label, note]) => <article key={label}><strong>{value}</strong><div><span>{label}</span><p>{note} · aguardando validação</p></div></article>)}<button onClick={() => setCalendarOpen(true)}>Calendário das sessões <span>↗</span></button></section><section className="split-section"><article className="callout crimson"><p className="eyebrow">Leitura atual</p><h2>Uso é sinal.<br /><em>Impacto exige contexto.</em></h2><p>Contagem de prompts por e-mail mostra intensidade de uso. Ela não mede, sozinha, produtividade, qualidade ou valor para o negócio.</p></article><article className="evidence"><p className="eyebrow">O que já pode ser analisado</p><h3>Segmentação de adoção</h3><ul><li>Intensidade de prompts por colaborador na janela de 180 dias</li><li>Diferenças por cargo, área e service line</li><li>Temas recorrentes nos ~3 mil relatos por e-mail</li><li>Casos de ajuda percebida e personalização</li></ul></article></section></>}
    {section === "analysis" && <><section className="section-head"><div><p className="eyebrow">02 · Análises de adoção</p><h2>Onde o uso ganha tração?</h2></div><p>Estrutura pronta para leitura por área, cargo e efeito pós-treinamento. Os valores abaixo são placeholders e serão substituídos pelo extrato.</p></section><section className="analysis-shell"><div className="analysis-top"><div className="analysis-toggle"><button className={analysisView === "area" ? "selected" : ""} onClick={() => setAnalysisView("area")}>Por área</button><button className={analysisView === "role" ? "selected" : ""} onClick={() => setAnalysisView("role")}>Por cargo</button></div><span>Indicador atual: uso, não eficiência</span></div><div className="ranking-card"><div><p className="eyebrow">Ranking de intensidade</p><h3>{analysisViews[analysisView].title}</h3><p>{analysisViews[analysisView].metric} · cenário ilustrativo</p></div><div className="ranking-bars">{analysisViews[analysisView].rows.map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{width: `${value}%`}} /></i><strong>{value}</strong></div>)}</div></div></section><section className="impact-framework"><article><span>01 · Cobertura</span><h3>Quem foi treinado?</h3><p>Base elegível, participantes, área, cargo, service line e data da turma.</p></article><article><span>02 · Mudança de uso</span><h3>O uso aumentou?</h3><p>Comparar prompts por pessoa antes e depois, por safra, com janela idêntica.</p></article><article><span>03 · Persistência</span><h3>O uso continua?</h3><p>Curva de retenção e dias desde o último uso: 30, 60 e 90 dias.</p></article><article><span>04 · Impacto</span><h3>O trabalho melhorou?</h3><p>Tempo, qualidade, retrabalho e satisfação — não inferir por prompts.</p></article></section><section className="analysis-question"><div><p className="eyebrow">Pergunta executiva</p><h2>Treinamento moveu <em>adoção</em> — e sustentou o comportamento?</h2></div><p>O próximo extrato deve permitir comparar cada safra com o seu pré-treinamento e, quando possível, com uma população semelhante não treinada.</p></section></>}
    {section === "data" && <><section className="section-head"><div><p className="eyebrow">02 · Dados e cobertura</p><h2>O desenho da evidência.</h2></div><p>O template protege a distinção entre dados observados, interpretação e dados pendentes.</p></section><section className="data-board"><div className="data-list">{dataLanes.map(([title, detail, status, kind]) => <article key={title}><span className={`lane-dot ${kind}`} /><div><h3>{title}</h3><p>{detail}</p></div><b className={kind}>{status}</b></article>)}</div><aside className="method"><p className="eyebrow">Janela disponível</p><strong>180 dias</strong><p>Unidade atual: e-mail / colaborador.</p><hr /><p className="small">Próximo passo: consolidar o extrato Global e validar o cruzamento com atributos People sob as regras de privacidade aplicáveis.</p></aside></section></>}
    {section === "cohort" && <><section className="section-head"><div><p className="eyebrow">02 · Cohort & Value Lab</p><h2>O que mudou após cada turma?</h2></div><p>Uma camada de hipótese para comparar uso antes/depois do treinamento, continuidade e evidência de impacto.</p></section><section className="cohort-lab"><aside className="lab-controls"><p className="eyebrow">Construa o cenário</p><label>Safra de treinamento<select value={cohort} onChange={(event) => setCohort(event.target.value)}>{cohortOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>Prompts médios antes<strong>{baselinePrompts} / mês</strong><input type="range" min="5" max="45" value={baselinePrompts} onChange={(event) => setBaselinePrompts(Number(event.target.value))} /></label><label>Variação pós-treinamento<strong>+{uplift}%</strong><input type="range" min="0" max="100" step="5" value={uplift} onChange={(event) => setUplift(Number(event.target.value))} /></label><label>Sinal de inatividade<select value={inactivityDays} onChange={(event) => setInactivityDays(Number(event.target.value))}><option value={30}>30 dias sem uso</option><option value={45}>45 dias sem uso</option><option value={60}>60 dias sem uso</option><option value={90}>90 dias sem uso</option></select></label></aside><div className="lab-output"><div className="scenario-tag">CENÁRIO HIPOTÉTICO · NÃO É RESULTADO OBSERVADO</div><h3>{cohort}</h3><p className="lab-lead">A leitura executiva combina intensidade de uso, retenção e sinal de valor — sem transformar prompt em eficiência automaticamente.</p><div className="cohort-kpis"><article><span>Antes do treinamento</span><strong>{baselinePrompts}</strong><small>prompts / pessoa / mês</small></article><article><span>Após treinamento</span><strong>{modeledPrompts}</strong><small>prompts / pessoa / mês</small></article><article><span>Incremento estimado</span><strong>+{incrementalPrompts}</strong><small>prompts / pessoa / mês</small></article><article><span>Risco de perda de uso</span><strong>{inactivityDays}d</strong><small>sem atividade registrada</small></article></div><section className="adoption-curve"><div className="curve-head"><span>Trajetória de adoção por safra</span><b>Janela de comparação: 90 dias</b></div><div className="curve-bars">{curveHeights.map((height, index) => <i key={index} style={{height}} title={`${curveValues[index]} prompts / pessoa / mês`} />)}</div><div className="curve-axis"><span>Pré</span><span>Treinamento</span><span>30d</span><span>60d</span><span>90d</span></div></section><div className="decision-readout"><span>LEITURA PARA DECISÃO</span><p>Se o padrão real replicar este cenário, a safra deve ser acompanhada com reforço entre 30 e {inactivityDays} dias, antes que o uso se torne inativo. Validar também tempo, qualidade, retrabalho ou entrega para discutir impacto.</p></div></div></section><section className="cohort-questions"><article><b>01</b><h3>A pessoa usou mais?</h3><p>Comparar prompts por pessoa no pré versus pós, mesma janela e mesma população.</p></article><article><b>02</b><h3>Quando parou?</h3><p>Medir dias desde o último uso e a curva de retenção por safra.</p></article><article><b>03</b><h3>Onde aprofundar?</h3><p>Identificar área, cargo e service line com alta adoção e baixo sinal de valor.</p></article></section></>}
    {section === "impact" && <><section className="section-head"><div><p className="eyebrow">03 · Impacto oficial Microsoft</p><h2>O que pedir para completar a mensuração.</h2></div><p>Este bloco é a especificação do extrato — ainda não contém resultados da Deloitte.</p></section><section className="metric-grid">{officialMetrics.map(([title, detail]) => <article key={title}><span>Microsoft 365 Copilot</span><h3>{title}</h3><p>{detail}</p><b>Aguardando Global</b></article>)}</section><article className="disclaimer"><strong>Importante.</strong> Métricas agregadas como “número de prompts” podem divergir dos relatórios oficiais de uso do Microsoft 365. Para acompanhamento executivo, a fonte Microsoft deve ser a referência para métricas oficiais.</article></>}
    <section className="journey"><p className="eyebrow">Modelo de leitura</p><div>{journey.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section><footer><span>Deloitte SGO Brazil · Copilot Results Template</span><span>Uso interno · dados sujeitos a validação</span></footer>
    {calendarOpen && <div className="modal-backdrop" role="presentation" onClick={() => setCalendarOpen(false)}><section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-title" onClick={(event) => event.stopPropagation()}><header><div><p className="eyebrow">Agenda inteligente · placeholders</p><h2 id="calendar-title">Sessões realizadas</h2></div><button aria-label="Fechar calendário" onClick={() => setCalendarOpen(false)}>×</button></header><div className="calendar-intro"><p>Visão consolidada por ano. Os blocos abaixo são placeholders de agenda até o recebimento da planilha de sessões.</p><div className="year-switch"><button className={calendarYear === 2025 ? "selected" : ""} onClick={() => setCalendarYear(2025)}>2025</button><button className={calendarYear === 2026 ? "selected" : ""} onClick={() => setCalendarYear(2026)}>2026</button></div></div><div className="calendar-grid">{calendarSessions[calendarYear].map((session) => <article key={session.month}><span>{session.month} · {calendarYear}</span><div className="days">{session.days.map((day) => <b key={day}>{day}</b>)}</div><p>{session.label}</p><small>placeholder de sessão</small></article>)}</div><footer><span className="calendar-dot" /> Calendário ilustrativo — substituir pelos dados consolidados.</footer></section></div>}
  </main>;
}
