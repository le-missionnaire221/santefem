import React, { useState } from "react";

export function InvoiceModule({ factures }) {
  const total = factures.reduce((s, f) => s + f.montant, 0);
  const payes = factures.filter((f) => f.statut === "payé").reduce((s, f) => s + f.montant, 0);
  const impayes = factures.filter((f) => f.statut !== "payé").reduce((s, f) => s + f.montant, 0);

  return (
    <div className="fade-in">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 16 }}>
        <div className="stat-card teal">
          <div className="stat-label">Total facturé</div>
          <div className="stat-value">{(total / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA ce mois</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Encaissé</div>
          <div className="stat-value">{(payes / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">En attente</div>
          <div className="stat-value">{(impayes / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Factures & devis</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">⬇ Exporter</button>
            <button className="btn btn-primary btn-sm">+ Nouvelle facture</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Date</th>
                <th>Patiente</th>
                <th>Actes</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {factures.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ink-muted)" }}>
                    {f.id}
                  </td>
                  <td style={{ fontSize: 12 }}>{f.date}</td>
                  <td className="name">{f.patiente}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-muted)" }}>{f.actes}</td>
                  <td style={{ fontWeight: 500, color: "var(--teal)" }}>
                    {f.montant.toLocaleString()} FCFA
                  </td>
                  <td>
                    <span className="tag tag-gray">{f.mode}</span>
                  </td>
                  <td>
                    <span
                      className={`tag ${f.statut === "payé" ? "tag-success" : f.statut === "impayé" ? "tag-danger" : "tag-amber"}`}
                    >
                      {f.statut}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm">🖨</button>
                      {f.statut !== "payé" && <button className="btn btn-primary btn-sm">Encaisser</button>}
                    </div>
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

export function CaisseModule({ patientes, factures }) {
  const [mode, setMode] = useState("wave");
  const [montant, setMontant] = useState("");
  const [patiente, setPatiente] = useState("");
  const [done, setDone] = useState(false);

  const modes = [
    { id: "wave", icon: "〰", name: "Wave", color: "#1a56db" },
    { id: "orange", icon: "●", name: "Orange Money", color: "#f97316" },
    { id: "especes", icon: "💵", name: "Espèces", color: "#059669" },
    { id: "cb", icon: "💳", name: "Carte bancaire", color: "#7c3aed" },
    { id: "ipres", icon: "🏦", name: "IPRES/IPM", color: "#b5446e" },
    { id: "axa", icon: "🛡", name: "AXA/Allianz", color: "#1a7f6e" }
  ];

  const encaisser = () => {
    if (!montant || !patiente) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setMontant("");
      setPatiente("");
    }, 3000);
  };

  return (
    <div className="fade-in">
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Encaissement</span>
          </div>
          <div className="card-body">
            {done ? (
              <div className="alert alert-success" style={{ textAlign: "center", padding: 20 }}>
                ✓ Paiement enregistré avec succès !<br />
                <span style={{ fontSize: 11, marginTop: 4, display: "block" }}>Reçu envoyé par WhatsApp</span>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Patiente</label>
                  <select className="form-select" value={patiente} onChange={(e) => setPatiente(e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {patientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.prenom} {p.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Acte / Prestation</label>
                  <select className="form-select">
                    <option>Consultation gynécologique — 15 000 FCFA</option>
                    <option>Suivi grossesse — 20 000 FCFA</option>
                    <option>Échographie — 25 000 FCFA</option>
                    <option>Frottis cervical — 18 000 FCFA</option>
                    <option>Bilan hormonal — 35 000 FCFA</option>
                    <option>Pose DIU — 30 000 FCFA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Montant (FCFA)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="15000"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    style={{ fontSize: 18, fontWeight: 500, color: "var(--teal)" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mode de paiement</label>
                  <div className="payment-grid">
                    {modes.map((m) => (
                      <div
                        key={m.id}
                        className={`payment-btn${mode === m.id ? " selected" : ""}`}
                        onClick={() => setMode(m.id)}
                      >
                        <div className="p-icon" style={{ color: m.color }}>
                          {m.icon}
                        </div>
                        <div className="p-name">{m.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                  onClick={encaisser}
                >
                  Encaisser {montant ? (parseInt(montant, 10) || 0).toLocaleString() + " FCFA" : ""} →
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">Résumé du jour</span>
            </div>
            <div className="card-body">
              {[
                { label: "Wave", val: 78000, pct: 35 },
                { label: "Orange Money", val: 45000, pct: 20 },
                { label: "Espèces", val: 55000, pct: 25 },
                { label: "Assurances", val: 45000, pct: 20 }
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--ink-soft)" }}>{r.label}</span>
                    <span style={{ fontWeight: 500 }}>{r.val.toLocaleString()} FCFA</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: r.pct + "%" }} />
                  </div>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
                <span>Total journée</span>
                <span style={{ color: "var(--teal)", fontSize: 16, fontFamily: "var(--font-display)" }}>
                  223 000 FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Dernières transactions</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {factures.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--line)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{f.patiente}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                      {f.mode} · {f.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--teal)" }}>
                      {f.montant.toLocaleString()}
                    </div>
                    <span
                      className={`tag ${f.statut === "payé" ? "tag-success" : f.statut === "impayé" ? "tag-danger" : "tag-amber"}`}
                      style={{ fontSize: 10 }}
                    >
                      {f.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComptabiliteModule({ ecrituresCompta, moisData }) {
  const [filtre, setFiltre] = useState("tout");

  const totalRecettes = ecrituresCompta.filter((e) => e.categorie === "recette").reduce((s, e) => s + e.credit, 0);
  const totalDepenses = ecrituresCompta.filter((e) => e.categorie === "depense").reduce((s, e) => s + e.debit, 0);
  const resultat = totalRecettes - totalDepenses;

  const ecrituresFiltrees = ecrituresCompta.filter((e) => filtre === "tout" || e.categorie === filtre);
  const maxBar = Math.max(...moisData.map((m) => m.recettes));

  return (
    <div className="fade-in">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 20 }}>
        <div className="stat-card teal">
          <div className="stat-label">Recettes — Avril</div>
          <div className="stat-value">{(totalRecettes / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Dépenses — Avril</div>
          <div className="stat-value">{(totalDepenses / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA</div>
        </div>
        <div className="stat-card" style={{ borderTop: `3px solid ${resultat >= 0 ? "var(--success)" : "var(--danger)"}` }}>
          <div className="stat-label">Résultat net</div>
          <div className="stat-value" style={{ color: resultat >= 0 ? "var(--success)" : "var(--danger)" }}>
            {resultat >= 0 ? "+" : ""}
            {(resultat / 1000).toFixed(0)}k
          </div>
          <div className="stat-sub">FCFA</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Évolution sur 6 mois</span>
            <span className="ai-badge">✨ IA</span>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginBottom: 8 }}>
              {moisData.map((m, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 90 }}>
                    <div style={{ flex: 1, background: "var(--teal)", borderRadius: "3px 3px 0 0", height: Math.round((m.recettes / maxBar) * 90) + "px", opacity: 0.8 }} />
                    <div style={{ flex: 1, background: "var(--rose-light)", borderRadius: "3px 3px 0 0", height: Math.round((m.depenses / maxBar) * 90) + "px", opacity: 0.9 }} />
                  </div>
                  <span style={{ fontSize: 10, color: "var(--ink-muted)" }}>{m.mois}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 11, color: "var(--ink-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, background: "var(--teal)", borderRadius: 2, display: "inline-block" }} /> Recettes
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, background: "var(--rose-light)", borderRadius: 2, display: "inline-block" }} /> Dépenses
              </span>
            </div>
            <div className="alert alert-success" style={{ marginTop: 12, fontSize: 11 }}>
              ✨ IA : Tendance haussière +8% vs même période 2024. Pic d'activité en mars/avril.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Répartition des dépenses</span>
          </div>
          <div className="card-body">
            {[
              { label: "Charges de personnel", val: 820000, pct: 51, color: "var(--rose)" },
              { label: "Loyer & charges", val: 380000, pct: 23, color: "var(--amber)" },
              { label: "Consommables médicaux", val: 250000, pct: 15, color: "var(--teal)" },
              { label: "Équipement & maintenance", val: 120000, pct: 7, color: "#7c3aed" },
              { label: "Autres", val: 50000, pct: 4, color: "var(--ink-muted)" }
            ].map((d, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "var(--ink-soft)" }}>{d.label}</span>
                  <span style={{ fontWeight: 500 }}>{d.val.toLocaleString()} FCFA</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: d.pct + "%", background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Journal des écritures</span>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="form-select" style={{ width: "auto", fontSize: 12, padding: "4px 10px" }} value={filtre} onChange={(e) => setFiltre(e.target.value)}>
              <option value="tout">Toutes les écritures</option>
              <option value="recette">Recettes uniquement</option>
              <option value="depense">Dépenses uniquement</option>
            </select>
            <button className="btn btn-ghost btn-sm">⬇ Exporter CSV</button>
            <button className="btn btn-primary btn-sm">+ Nouvelle écriture</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Libellé</th>
                <th>Compte</th>
                <th>Débit</th>
                <th>Crédit</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {ecrituresFiltrees.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontSize: 12, color: "var(--ink-muted)", whiteSpace: "nowrap" }}>{e.date}</td>
                  <td className="name">{e.libelle}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-muted)" }}>{e.compte}</td>
                  <td style={{ color: "var(--danger)", fontWeight: e.debit > 0 ? 500 : 400 }}>{e.debit > 0 ? e.debit.toLocaleString() + " FCFA" : "—"}</td>
                  <td style={{ color: "var(--teal)", fontWeight: e.credit > 0 ? 500 : 400 }}>{e.credit > 0 ? e.credit.toLocaleString() + " FCFA" : "—"}</td>
                  <td>
                    <span className="tag tag-gray">{e.mode}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", background: "var(--surface)", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>
              Solde période :{" "}
              <strong style={{ color: resultat >= 0 ? "var(--success)" : "var(--danger)" }}>
                {resultat >= 0 ? "+" : ""}
                {resultat.toLocaleString()} FCFA
              </strong>
            </span>
            <button className="btn btn-ghost btn-sm">Exporter vers comptable →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
