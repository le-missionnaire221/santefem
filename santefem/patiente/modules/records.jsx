import React, { useState } from "react";

export function PageRDV({ rdvList, patiente }) {
  const [view, setView] = useState("list");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    medecin: "Dr. Aminata Diallo",
    service: "Suivi grossesse",
    date: "",
    creneau: "Matin (8h-12h)",
    assurance: "IPRES",
    motif: ""
  });
  const [confirmed, setConfirmed] = useState(false);

  const confirmer = () => {
    setConfirmed(true);
  };

  return (
    <>
      <div className="app-header">
        {view !== "list" && (
          <button
            className="header-back"
            onClick={() => {
              setView("list");
              setStep(1);
              setConfirmed(false);
            }}
          >
            ‹
          </button>
        )}
        <div className="header-title">{view === "list" ? "Mes rendez-vous" : "Nouveau rendez-vous"}</div>
        {view === "list" && (
          <button className="header-action" onClick={() => setView("new")}>
            + Nouveau
          </button>
        )}
      </div>
      <div className="page fade-in">
        {view === "list" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div className="stat-mini">
                <div className="stat-mini-val">{rdvList.length}</div>
                <div className="stat-mini-lbl">RDV programmés</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-val" style={{ color: "var(--teal)" }}>
                  ✓
                </div>
                <div className="stat-mini-lbl">Prochain confirmé</div>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <span className="section-title">Prochains rendez-vous</span>
              </div>
              <div className="card">
                {rdvList.map((r, i) => (
                  <div key={i} className="rdv-slot">
                    <div style={{ minWidth: 52 }}>
                      <div className="rdv-time">{r.heure}</div>
                      <div style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 1 }}>{r.date}</div>
                    </div>
                    <div className="rdv-info">
                      <div className="rdv-doc">{r.medecin}</div>
                      <div className="rdv-motif">{r.motif}</div>
                    </div>
                    <span className={`tag ${r.statut === "confirmé" ? "tag-teal" : "tag-amber"}`} style={{ fontSize: 10 }}>
                      {r.statut === "confirmé" ? "✓ Confirmé" : "Programmé"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-full" onClick={() => setView("new")}>
              + Prendre un nouveau rendez-vous
            </button>
          </>
        )}

        {view === "new" && !confirmed && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: step >= s ? "var(--rose)" : "var(--line)",
                    transition: "background 0.3s"
                  }}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="fade-in">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Choisir le service
                </div>
                <div className="form-group">
                  <label className="form-label">Médecin</label>
                  <select className="form-select" value={form.medecin} onChange={(e) => setForm({ ...form, medecin: e.target.value })}>
                    <option>Dr. Aminata Diallo</option>
                    <option>Dr. Fatou Sène</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Service</label>
                  {[
                    "Consultation gynécologique",
                    "Suivi grossesse",
                    "Échographie obstétricale",
                    "Planning familial",
                    "Frottis cervical",
                    "Bilan hormonal",
                    "Téléconsultation"
                  ].map((s, i) => (
                    <div
                      key={i}
                      onClick={() => setForm({ ...form, service: s })}
                      style={{
                        padding: "12px 16px",
                        border: `1.5px solid ${form.service === s ? "var(--rose)" : "var(--line)"}`,
                        borderRadius: 10,
                        marginBottom: 8,
                        cursor: "pointer",
                        background: form.service === s ? "var(--rose-pale)" : "var(--white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: form.service === s ? 500 : 400 }}>{s}</span>
                      {form.service === s && <span style={{ color: "var(--rose)" }}>✓</span>}
                    </div>
                  ))}
                </div>
                <button className="btn-full" onClick={() => setStep(2)}>
                  Suivant →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Date & horaire
                </div>
                <div className="form-group">
                  <label className="form-label">Date souhaitée</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Créneau préféré</label>
                  {["Matin (8h-12h)", "Après-midi (14h-18h)", "Pas de préférence"].map((c, i) => (
                    <div
                      key={i}
                      onClick={() => setForm({ ...form, creneau: c })}
                      style={{
                        padding: "12px 16px",
                        border: `1.5px solid ${form.creneau === c ? "var(--rose)" : "var(--line)"}`,
                        borderRadius: 10,
                        marginBottom: 8,
                        cursor: "pointer",
                        background: form.creneau === c ? "var(--rose-pale)" : "var(--white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{c}</span>
                      {form.creneau === c && <span style={{ color: "var(--rose)" }}>✓</span>}
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Prise en charge</label>
                  <select className="form-select" value={form.assurance} onChange={(e) => setForm({ ...form, assurance: e.target.value })}>
                    <option>Privé (sans assurance)</option>
                    <option>IPRES</option>
                    <option>CSS</option>
                    <option>AXA Sénégal</option>
                    <option>Allianz</option>
                    <option>Sanlam</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-full ghost" onClick={() => setStep(1)}>
                    ← Retour
                  </button>
                  <button className="btn-full" onClick={() => setStep(3)}>
                    Suivant →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="fade-in">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Confirmation
                </div>
                <div className="card" style={{ marginBottom: 16 }}>
                  {[
                    { l: "Médecin", v: form.medecin },
                    { l: "Service", v: form.service },
                    { l: "Date", v: form.date || "À confirmer" },
                    { l: "Créneau", v: form.creneau },
                    { l: "Assurance", v: form.assurance }
                  ].map((r, i) => (
                    <div key={i} className="info-row" style={{ cursor: "default" }}>
                      <span className="info-label">{r.l}</span>
                      <span className="info-value">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Motif (optionnel)</label>
                  <textarea className="form-textarea" placeholder="Décrivez brièvement votre motif..." value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} style={{ minHeight: 70 }} />
                </div>
                <div className="alert alert-info">📱 Un SMS de confirmation sera envoyé au {patiente.tel}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-full ghost" onClick={() => setStep(2)}>
                    ← Retour
                  </button>
                  <button className="btn-full" onClick={confirmer}>
                    Confirmer le RDV ✓
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {view === "new" && confirmed && (
          <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              Rendez-vous demandé !
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Votre demande a été envoyée. Vous recevrez une confirmation par SMS dans les prochaines minutes.
            </div>
            <div className="alert alert-success" style={{ textAlign: "left" }}>
              ✓ SMS de confirmation envoyé au {patiente.tel}
            </div>
            <button
              className="btn-full"
              style={{ marginTop: 16 }}
              onClick={() => {
                setView("list");
                setStep(1);
                setConfirmed(false);
              }}
            >
              Voir mes rendez-vous
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function PageDossier({ patiente, exams, ordonnances, factures, historique }) {
  const [tab, setTab] = useState("sante");
  const tabs = [
    { id: "sante", lbl: "Santé" },
    { id: "examens", lbl: "Examens" },
    { id: "ordonnances", lbl: "Ordonnances" },
    { id: "factures", lbl: "Factures" },
    { id: "historique", lbl: "Historique" }
  ];

  return (
    <>
      <div className="app-header">
        <div className="header-title">Mon dossier</div>
      </div>

      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--line)",
          padding: "14px 18px",
          display: "flex",
          gap: 14,
          alignItems: "center"
        }}
      >
        <div className="avatar">
          {patiente.prenom[0]}
          {patiente.nom[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {patiente.prenom} {patiente.nom}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            {patiente.age} ans · {patiente.assurance}
          </div>
        </div>
        {patiente.statut === "grossesse" && <span className="tag tag-rose">🤱 {patiente.semaines} SA</span>}
      </div>

      <div style={{ display: "flex", background: "var(--white)", borderBottom: "1px solid var(--line)", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: "0 0 auto",
              padding: "12px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.id ? 500 : 400,
              color: tab === t.id ? "var(--rose)" : "var(--ink-muted)",
              borderBottom: `2px solid ${tab === t.id ? "var(--rose)" : "transparent"}`,
              fontFamily: "var(--font-body)",
              whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}
          >
            {t.lbl}
          </button>
        ))}
      </div>

      <div className="page fade-in" style={{ paddingTop: 14 }}>
        {tab === "sante" && (
          <>
            {patiente.statut === "grossesse" && (
              <div className="section">
                <div className="section-head">
                  <span className="section-title">Ma grossesse</span>
                </div>
                <div
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius)",
                    padding: 20,
                    textAlign: "center",
                    marginBottom: 12
                  }}
                >
                  <div className="preg-circle">
                    <div className="preg-sa">{patiente.semaines}</div>
                    <div className="preg-sa-lbl">Semaines</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--teal)", fontFamily: "var(--font-display)" }}>
                        {40 - patiente.semaines}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Semaines restantes</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--rose)", fontFamily: "var(--font-display)" }}>
                        {Math.round((patiente.semaines / 40) * 100)}%
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Avancement</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: "10px", background: "var(--rose-pale)", borderRadius: 10, fontSize: 12, color: "var(--rose)" }}>
                    Terme prévu : <strong>{patiente.terme}</strong>
                  </div>
                </div>
                <div className="alert alert-warning">⚠ Anémie légère (Hb 10.2). Continuez votre sulfate de fer quotidiennement.</div>
                <div className="alert alert-info">📋 Écho morphologique T2 à programmer avant 28 SA.</div>
              </div>
            )}

            <div className="section">
              <div className="section-head">
                <span className="section-title">Informations médicales</span>
              </div>
              <div className="card">
                {[
                  { l: "Groupe sanguin", v: patiente.groupe_sanguin },
                  { l: "Allergies", v: patiente.allergies, danger: patiente.allergies !== "Aucune" },
                  { l: "Médecin traitant", v: patiente.medecin },
                  { l: "Dernière consultation", v: historique[0]?.date || "-" },
                  { l: "Assurance", v: patiente.assurance }
                ].map((r, i) => (
                  <div key={i} className="info-row" style={{ cursor: "default" }}>
                    <span className="info-label">{r.l}</span>
                    <span className="info-value" style={{ color: r.danger ? "var(--danger)" : undefined }}>
                      {r.danger ? "⚠ " : ""}
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "examens" && <div className="section">{exams.map((e) => <div key={e.id} className="card" style={{ padding: 12, marginBottom: 8 }}>{e.type} — {e.date}</div>)}</div>}
        {tab === "ordonnances" && <div className="section">{ordonnances.map((o) => <div key={o.id} className="card" style={{ padding: 12, marginBottom: 8 }}>Ordonnance du {o.date} — {o.medecin}</div>)}</div>}
        {tab === "factures" && <div className="section">{factures.map((f) => <div key={f.id} className="card" style={{ padding: 12, marginBottom: 8 }}>{f.id} — {f.montant.toLocaleString()} FCFA</div>)}</div>}
        {tab === "historique" && <div className="section">{historique.map((h, i) => <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>{h.type} — {h.date}</div>)}</div>}
      </div>
    </>
  );
}

