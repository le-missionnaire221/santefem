import React, { useEffect, useState } from "react";

export function PageAccueil({ setPage, setNotifOpen, patiente, queueData, notifications }) {
  const unread = notifications.filter((n) => !n.lu).length;
  return (
    <>
      <div className="app-header">
        <div className="header-title">SantéFem</div>
        <button className="header-action" onClick={() => setNotifOpen(true)} style={{ position: "relative" }}>
          🔔{" "}
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "var(--danger)",
                color: "white",
                borderRadius: "50%",
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700
              }}
            >
              {unread}
            </span>
          )}
        </button>
      </div>
      <div className="page fade-in">
        <div className="hero">
          <div className="hero-greeting">Bonjour 👋</div>
          <div className="hero-name">
            {patiente.prenom} {patiente.nom}
          </div>
          <div className="hero-sub">{patiente.cabinet}</div>
          <div className="hero-chips">
            <span className="hero-chip">🤱 {patiente.semaines} SA</span>
            <span className="hero-chip">Terme : {patiente.terme}</span>
            <span className="hero-chip">G.S. {patiente.groupe_sanguin}</span>
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <span className="section-title">Prochain rendez-vous</span>
            <button className="section-link" onClick={() => setPage("rdv")}>
              Tous mes RDV →
            </button>
          </div>
          <div className="card">
            <div className="rdv-slot">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--rose)", fontFamily: "var(--font-display)" }}>
                  {patiente.rdv_prochain.heure}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{patiente.rdv_prochain.date}</div>
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <div className="rdv-doc">{patiente.rdv_prochain.medecin}</div>
                <div className="rdv-motif">{patiente.rdv_prochain.motif}</div>
              </div>
              <span className="tag tag-teal">✓ Confirmé</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <span className="section-title">Ma position</span>
            <button className="section-link" onClick={() => setPage("queue")}>
              Détails →
            </button>
          </div>
          <div className="wait-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--rose)", lineHeight: 1 }}>
                {queueData.mon_numero}
              </div>
              <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>Mon numéro</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="wait-time">
                {queueData.temps_estime}
                <span className="wait-unit"> min</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{queueData.avant_moi} personne(s) avant vous</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                <span className="online-dot" />
                <span style={{ fontSize: 11, color: "var(--success)" }}>Temps réel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <span className="section-title">Alertes santé IA</span>
          </div>
          <div className="alert alert-warning">⚠ Anémie légère détectée. Pensez à prendre votre sulfate de fer ce soir.</div>
          <div className="alert alert-info">💡 À 24 SA, l'écho morphologique T2 est à programmer. Dr. Diallo vous a préparé un bon.</div>
          <div className="alert alert-success">✓ Tension artérielle normale à votre dernière visite. Continuez le suivi.</div>
        </div>

        <div className="section">
          <div className="section-head">
            <span className="section-title">Accès rapide</span>
          </div>
          <div className="action-grid">
            <div className="action-card rose" onClick={() => setPage("chat")}>
              <span className="action-icon">✨</span>
              <div className="action-title">Assistant IA</div>
              <div className="action-desc">Questions 24h/24</div>
            </div>
            <div className="action-card teal" onClick={() => setPage("dossier")}>
              <span className="action-icon">📋</span>
              <div className="action-title">Mon dossier</div>
              <div className="action-desc">Résultats & ordonnances</div>
            </div>
            <div className="action-card wide" onClick={() => setPage("rdv")}>
              <span className="action-icon">📅</span>
              <div className="action-title">Prendre un rendez-vous</div>
              <div className="action-desc">Disponible en quelques secondes</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function PageQueue({ queueData, patiente }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);
  const attente = Math.max(0, queueData.temps_estime - tick * 2);

  return (
    <>
      <div className="app-header">
        <div className="header-title">Ma file d'attente</div>
      </div>
      <div className="page fade-in">
        <div className="queue-big">
          <div className="queue-label">Votre numéro</div>
          <div className="queue-number">{queueData.mon_numero}</div>
          <div className="queue-sub">{queueData.avant_moi} personne(s) avant vous</div>
        </div>
        <div className="wait-card" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>⏱</div>
          <div style={{ flex: 1 }}>
            <div className="wait-time">
              {attente}
              <span className="wait-unit"> min</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Temps d'attente estimé</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className="online-dot" />
            <span style={{ fontSize: 11, color: "var(--success)" }}>Temps réel</span>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 4 }}>Consultation en cours (N°1)</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Patiente anonymisée</div>
            <div style={{ fontSize: 12, color: "var(--teal)", marginTop: 2 }}>Avec {queueData.medecin}</div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Votre rendez-vous
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--rose-light)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--rose)" }}>
                {queueData.mon_numero}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{patiente.rdv_prochain.motif}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                  {patiente.rdv_prochain.medecin} · {patiente.rdv_prochain.heure}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 16px", background: "var(--teal-light)" }}>
            <div style={{ fontSize: 12, color: "var(--teal)" }}>✓ Vous recevrez un SMS quand c'est votre tour. Restez à proximité de la salle d'attente.</div>
          </div>
        </div>
      </div>
    </>
  );
}

