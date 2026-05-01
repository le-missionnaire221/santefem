import React, { useEffect, useState } from "react";

export function QueueModule({ initialQueue }) {
  const [queue, setQueue] = useState(initialQueue);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const appelerSuivant = () => {
    setQueue((q) =>
      q.map((p, i) => {
        if (p.statut === "en_cours") return { ...p, statut: "termine" };
        if (
          i === q.findIndex((x) => x.statut === "attente") ||
          i === q.findIndex((x) => x.statut === "urgent")
        )
          return { ...p, statut: "en_cours", attente: 0 };
        return { ...p, attente: Math.max(0, p.attente - 20) };
      })
    );
  };

  const enCours = queue.find((p) => p.statut === "en_cours");
  const enAttente = queue.filter((p) => p.statut === "attente" || p.statut === "urgent");
  const termines = queue.filter((p) => p.statut === "termine");

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card" style={{ borderTop: "3px solid var(--teal)" }}>
          <div className="card-body">
            <div className="stat-label">En consultation</div>
            {enCours ? (
              <>
                <div className="stat-value" style={{ fontSize: 20, marginTop: 4 }}>
                  {enCours.nom}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>
                  {enCours.motif} · {enCours.medecin}
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-teal btn-sm" onClick={appelerSuivant}>
                    Appeler suivant →
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "var(--ink-muted)", fontSize: 13, marginTop: 8 }}>
                Aucune consultation en cours
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="grid-3" style={{ gap: 10 }}>
              <div style={{ textAlign: "center" }}>
                <div className="stat-value">{enAttente.length}</div>
                <div className="stat-label">En attente</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="stat-value">
                  {enAttente.length > 0 ? enAttente[0].attente : 0}
                  <span style={{ fontSize: 14 }}>min</span>
                </div>
                <div className="stat-label">Prochain</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="stat-value">{termines.length}</div>
                <div className="stat-label">Terminés</div>
              </div>
            </div>
            <div className="progress-bar" style={{ marginTop: 12 }}>
              <div
                className="progress-fill"
                style={{
                  width: Math.round((termines.length / queue.length) * 100) + "%",
                  background: "var(--teal)"
                }}
              />
            </div>
            <div
              style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 4, textAlign: "center" }}
            >
              {Math.round((termines.length / queue.length) * 100)}% des consultations terminées
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">File d'attente en temps réel</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="online-dot" />{" "}
            <span style={{ fontSize: 11, color: "var(--success)" }}>Temps réel</span>
            <button className="btn btn-primary btn-sm" onClick={appelerSuivant}>
              + Appeler suivant
            </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: "12px 16px" }}>
          {queue
            .filter((p) => p.statut !== "termine")
            .map((p) => (
              <div
                key={p.id}
                className={`queue-item${p.statut === "en_cours" ? " active-consult" : p.statut === "urgent" ? " urgent" : ""}`}
                style={{ marginBottom: 8 }}
              >
                <div
                  className={`queue-num${p.statut === "en_cours" ? " active" : p.statut === "urgent" ? " urgent" : ""}`}
                >
                  {p.num}
                </div>
                <div className="queue-info">
                  <div className="queue-name">{p.nom}</div>
                  <div className="queue-meta">
                    {p.motif} · {p.medecin} · Arrivée {p.heure}
                  </div>
                </div>
                {p.statut === "urgent" && <span className="tag tag-danger">URGENT</span>}
                <div className={`queue-wait${p.statut === "en_cours" ? " done" : ""}`}>
                  {p.statut === "en_cours"
                    ? "En cours"
                    : p.statut === "urgent"
                      ? "Urgent"
                      : p.attente + "min"}
                </div>
              </div>
            ))}
          {termines.length > 0 && (
            <>
              <div className="divider" />
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  marginBottom: 6,
                  fontWeight: 500
                }}
              >
                Terminés
              </div>
              {termines.map((p) => (
                <div key={p.id} className="queue-item" style={{ marginBottom: 6, opacity: 0.5 }}>
                  <div
                    className="queue-num"
                    style={{ background: "var(--success-light)", color: "var(--success)" }}
                  >
                    ✓
                  </div>
                  <div className="queue-info">
                    <div className="queue-name">{p.nom}</div>
                    <div className="queue-meta">{p.motif}</div>
                  </div>
                  <span className="tag tag-success">Terminé</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CalendarModule({ rdvToday }) {
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["Lun 28", "Mar 29", "Mer 30", "Jeu 01", "Ven 02", "Sam 03"];

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Agenda — Semaine du 28 Avril 2025</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">← Préc.</button>
            <button className="btn btn-ghost btn-sm">Suiv. →</button>
            <button className="btn btn-primary btn-sm">+ Nouveau RDV</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                <th
                  style={{
                    width: 60,
                    padding: "10px 12px",
                    fontSize: 11,
                    color: "var(--ink-muted)",
                    fontWeight: 500,
                    borderBottom: "1px solid var(--line)",
                    textAlign: "left"
                  }}
                >
                  Heure
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    style={{
                      padding: "10px 12px",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--ink-soft)",
                      borderBottom: "1px solid var(--line)",
                      textAlign: "center",
                      borderLeft: "1px solid var(--line)"
                    }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((h) => (
                <tr key={h}>
                  <td
                    style={{
                      padding: "8px 12px",
                      fontSize: 11,
                      color: "var(--ink-muted)",
                      borderBottom: "1px solid var(--line)",
                      verticalAlign: "top",
                      fontWeight: 500
                    }}
                  >
                    {h}
                  </td>
                  {days.map((d, di) => {
                    const rdv = rdvToday.find((r) => r.heure === h && di === 2);
                    return (
                      <td
                        key={d}
                        style={{
                          padding: "4px 6px",
                          borderBottom: "1px solid var(--line)",
                          borderLeft: "1px solid var(--line)",
                          verticalAlign: "top",
                          minHeight: 40,
                          height: 50
                        }}
                      >
                        {rdv && (
                          <div
                            style={{
                              background:
                                rdv.statut === "urgent"
                                  ? "var(--danger-light)"
                                  : rdv.statut === "en_cours"
                                    ? "var(--teal-light)"
                                    : "var(--rose-pale)",
                              border: `1px solid ${rdv.statut === "urgent" ? "var(--danger)" : rdv.statut === "en_cours" ? "var(--teal)" : "var(--rose-light)"}`,
                              borderRadius: 6,
                              padding: "4px 7px",
                              cursor: "pointer"
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color:
                                  rdv.statut === "urgent"
                                    ? "var(--danger)"
                                    : rdv.statut === "en_cours"
                                      ? "var(--teal)"
                                      : "var(--rose)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {rdv.patiente}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>{rdv.motif}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">RDV du jour — Mercredi 30 Avril</span>
          <span className="tag tag-rose">{rdvToday.length} rendez-vous</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Patiente</th>
                <th>Motif</th>
                <th>Médecin</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rdvToday.map((r) => (
                <tr key={r.id}>
                  <td
                    style={{
                      fontWeight: 500,
                      color: "var(--rose)",
                      fontFamily: "var(--font-display)"
                    }}
                  >
                    {r.heure}
                  </td>
                  <td className="name">{r.patiente}</td>
                  <td style={{ color: "var(--ink-muted)" }}>{r.motif}</td>
                  <td style={{ fontSize: 12 }}>{r.medecin}</td>
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
                  <td>
                    <button className="btn btn-ghost btn-sm">Dossier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
