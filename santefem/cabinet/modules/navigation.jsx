import React from "react";

const PAGE_NAV = [
  { section: "Principal" },
  { id: "dashboard", label: "Tableau de bord", icon: "dashboard" },
  { id: "queue", label: "File d'attente", icon: "queue", badge: 6 },
  { id: "calendar", label: "Rendez-vous", icon: "calendar" },
  { section: "Clinique" },
  { id: "patients", label: "Dossiers patientes", icon: "patients" },
  { id: "ai", label: "Assistant IA", icon: "ai" },
  { section: "Finance & Admin" },
  { id: "invoice", label: "Factures & devis", icon: "invoice" },
  { id: "cash", label: "Caisse", icon: "cash" },
  { id: "tiers_payant", label: "Tiers payant / IPM", icon: "insurance" },
  { id: "comptabilite", label: "Comptabilité", icon: "stats" },
  { id: "stocks", label: "Stocks & consommables", icon: "dossier" },
  { id: "personnel", label: "Personnel", icon: "patients" },
  { section: "Communication" },
  { id: "teleconsult", label: "Téléconsultation", icon: "phone" },
  { id: "whatsapp", label: "WhatsApp & SMS", icon: "whatsapp" },
  { id: "portail", label: "Portail patiente", icon: "patients" },
  { id: "ecran_attente", label: "Écran salle d'attente", icon: "queue" },
  { section: "Pilotage" },
  { id: "stats", label: "Statistiques & IA", icon: "stats" },
  { id: "fiscal", label: "Rapports fiscaux", icon: "invoice" },
  { section: "SaaS & Plateforme" },
  { id: "onboarding", label: "Onboarding cabinet", icon: "add" },
  { id: "multi_cabinet", label: "Multi-cabinets", icon: "dashboard" },
  { id: "securite", label: "Sécurité & CDP", icon: "settings" },
  { id: "saas_admin", label: "Administration SaaS", icon: "stats" }
];

export function Sidebar({ active, setActive, Icon }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">SantéFem Pro</div>
        <div className="logo-sub">Clinique Santé Féminine</div>
      </div>
      <nav className="sidebar-nav">
        {PAGE_NAV.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">
              {item.section}
            </div>
          ) : (
            <button
              key={item.id}
              className={`nav-item${active === item.id ? " active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          )
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Dr. Aminata Diallo</div>
            <div className="user-role">Gynécologue</div>
          </div>
          <span className="online-dot" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ setActive, queueData, rdvToday }) {
  const stats = [
    { label: "Patientes aujourd'hui", value: 8, sub: "2 urgences", color: "rose" },
    { label: "En attente", value: 6, sub: "~45min moy.", color: "amber" },
    { label: "Recettes du jour", value: "223k", sub: "FCFA", color: "teal" },
    { label: "RDV cette semaine", value: 42, sub: "3 no-show", color: "success" }
  ];
  return (
    <div className="fade-in">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">File d'attente — maintenant</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setActive("queue")}>
              Voir tout
            </button>
          </div>
          <div className="card-body" style={{ padding: "12px" }}>
            {queueData.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className={`queue-item${p.statut === "en_cours" ? " active-consult" : p.statut === "urgent" ? " urgent" : ""}`}
                style={{ marginBottom: 6 }}
              >
                <div
                  className={`queue-num${p.statut === "en_cours" ? " active" : p.statut === "urgent" ? " urgent" : ""}`}
                >
                  {p.num}
                </div>
                <div className="queue-info">
                  <div className="queue-name">{p.nom}</div>
                  <div className="queue-meta">
                    {p.motif} · {p.medecin}
                  </div>
                </div>
                <div className={`queue-wait${p.statut === "en_cours" ? " done" : ""}`}>
                  {p.statut === "en_cours" ? "En cours" : p.attente + "min"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Programme du jour</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setActive("calendar")}>
              Agenda
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Patiente</th>
                  <th>Médecin</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {rdvToday.slice(0, 6).map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: "var(--rose)" }}>{r.heure}</td>
                    <td className="name">{r.patiente}</td>
                    <td style={{ color: "var(--ink-muted)", fontSize: 12 }}>
                      {r.medecin.replace("Dr. ", "")}
                    </td>
                    <td>
                      <span
                        className={`tag ${r.statut === "en_cours" ? "tag-teal" : r.statut === "urgent" ? "tag-danger" : r.statut === "programme" ? "tag-gray" : "tag-amber"}`}
                      >
                        {r.statut === "en_cours"
                          ? "En cours"
                          : r.statut === "urgent"
                            ? "Urgent"
                            : r.statut === "programme"
                              ? "Programmé"
                              : "Attente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              Alertes IA{" "}
              <span className="ai-badge" style={{ marginLeft: 8 }}>
                ✨ IA
              </span>
            </span>
          </div>
          <div className="card-body">
            <div className="alert alert-warning">
              ⚠{" "}
              <div>
                <strong>Awa Mbaye (S32)</strong> — Tension à surveiller. Dernière mesure : 140/90.
                Recommande contrôle en priorité.
              </div>
            </div>
            <div className="alert alert-info">
              ℹ{" "}
              <div>
                <strong>3 patientes</strong> ont un RDV de suivi en retard cette semaine. Relance
                automatique envoyée par SMS.
              </div>
            </div>
            <div className="alert alert-success">
              ✓{" "}
              <div>
                <strong>Facture F-2025-037</strong> (Awa Mbaye, 20 000 FCFA) — Relance impayé
                envoyée automatiquement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
