import React, { useState } from "react";

export function StocksModule({ stocks }) {
  const [filtre, setFiltre] = useState("tout");
  const ruptures = stocks.filter((s) => s.statut === "rupture");
  const alertes = stocks.filter((s) => s.statut === "alerte");

  const filtres = stocks.filter(
    (s) => filtre === "tout" || s.statut === filtre || s.categorie.toLowerCase() === filtre
  );

  return (
    <div className="fade-in">
      {ruptures.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <div>
            <strong>Ruptures détectées !</strong> {ruptures.map((r) => r.nom).join(", ")} — Commande
            automatique recommandée par l'IA.
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }}>
              Commander maintenant
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}>
        <div className="stat-card teal">
          <div className="stat-label">Références en stock</div>
          <div className="stat-value">{stocks.length}</div>
          <div className="stat-sub">produits</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Valeur totale stock</div>
          <div className="stat-value">{Math.round(stocks.reduce((s, p) => s + p.stock * p.pu, 0) / 1000)}k</div>
          <div className="stat-sub">FCFA</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Alertes stock bas</div>
          <div className="stat-value">{alertes.length}</div>
          <div className="stat-sub">produits</div>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid var(--danger)" }}>
          <div className="stat-label">Ruptures</div>
          <div className="stat-value">{ruptures.length}</div>
          <div className="stat-sub">produits</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Inventaire des stocks</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: 12, padding: "4px 10px" }}
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
            >
              <option value="tout">Tout</option>
              <option value="rupture">Ruptures</option>
              <option value="alerte">Alertes</option>
              <option value="ok">OK</option>
            </select>
            <button className="btn btn-primary btn-sm">+ Entrée stock</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Stock actuel</th>
                <th>Seuil alerte</th>
                <th>P.U.</th>
                <th>Valeur</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtres.map((s) => (
                <tr key={s.id}>
                  <td className="name">{s.nom}</td>
                  <td>
                    <span className="tag tag-gray">{s.categorie}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontWeight: 500,
                          color:
                            s.statut === "rupture"
                              ? "var(--danger)"
                              : s.statut === "alerte"
                                ? "var(--amber)"
                                : "var(--ink)"
                        }}
                      >
                        {s.stock}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>{s.unite}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--ink-muted)", fontSize: 12 }}>
                    {s.seuil_alerte} {s.unite}
                  </td>
                  <td style={{ fontSize: 12 }}>{s.pu.toLocaleString()} FCFA</td>
                  <td style={{ fontWeight: 500, color: "var(--teal)", fontSize: 12 }}>
                    {(s.stock * s.pu).toLocaleString()} FCFA
                  </td>
                  <td>
                    <span
                      className={`tag ${s.statut === "ok" ? "tag-success" : s.statut === "alerte" ? "tag-amber" : "tag-danger"}`}
                    >
                      {s.statut === "ok" ? "✓ OK" : s.statut === "alerte" ? "⚠ Bas" : "✗ Rupture"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm">+ Entrée</button>
                      {s.statut !== "ok" && (
                        <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>
                          Commander
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">
            Recommandations IA{" "}
            <span className="ai-badge" style={{ marginLeft: 8 }}>
              ✨ IA
            </span>
          </span>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            ⚠{" "}
            <div>
              <strong>Gel écho obstétrique</strong> (3 flacons) — À ce rythme d'utilisation, rupture dans 4 jours.
              Commander minimum 10 flacons chez votre fournisseur habituel.
            </div>
          </div>
          <div className="alert alert-info">
            💡{" "}
            <div>
              <strong>Papier ECG</strong> — Rupture depuis 20 jours. L'IA a détecté 3 patients annulés faute de stock.
              Coût estimé de l'inaction : 45 000 FCFA de recettes perdues.
            </div>
          </div>
          <div className="alert alert-success">
            ✓{" "}
            <div>
              <strong>Optimisation possible</strong> — Vous commandez les gants tous les 15 jours. Passer à une
              commande mensuelle vous économiserait 8% sur les prix fournisseur.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PersonnelModule({ personnel }) {
  const [selected, setSelected] = useState(null);
  const massesSalariale = personnel.reduce((s, p) => s + p.salaire, 0);

  return (
    <div className="fade-in">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}>
        <div className="stat-card rose">
          <div className="stat-label">Effectif total</div>
          <div className="stat-value">{personnel.length}</div>
          <div className="stat-sub">collaborateurs</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Masse salariale</div>
          <div className="stat-value">{(massesSalariale / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA/mois</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Congés en cours</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">ce mois</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Taux de présence</div>
          <div className="stat-value">98%</div>
          <div className="stat-sub">ce mois</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Équipe</span>
            <button className="btn btn-primary btn-sm">+ Ajouter</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {personnel.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--line)",
                  cursor: "pointer",
                  background: selected?.id === p.id ? "var(--rose-pale)" : "transparent"
                }}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
              >
                <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                  {p.prenom[0]}
                  {p.nom[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {p.prenom} {p.nom}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{p.poste}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    className={`tag ${p.type === "Médecin" ? "tag-rose" : p.type === "Paramédical" ? "tag-teal" : p.type === "Administratif" ? "tag-amber" : "tag-gray"}`}
                    style={{ fontSize: 10 }}
                  >
                    {p.type}
                  </span>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 3 }}>
                    {p.salaire.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <div className="card fade-in">
              <div className="dossier-header" style={{ borderRadius: "var(--radius) var(--radius) 0 0" }}>
                <div className="dossier-avatar">
                  {selected.prenom[0]}
                  {selected.nom[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="dossier-name">
                    {selected.prenom} {selected.nom}
                  </div>
                  <div className="dossier-meta">
                    {selected.poste} · {selected.contrat}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="grid-2" style={{ marginBottom: 14 }}>
                  <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 500, color: "var(--teal)", fontFamily: "var(--font-display)" }}>
                      {selected.salaire.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Salaire FCFA/mois</div>
                  </div>
                  <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 500, color: "var(--rose)", fontFamily: "var(--font-display)" }}>
                      {selected.conges_restants}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Jours congés restants</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
                  Téléphone : <strong style={{ color: "var(--ink)" }}>{selected.tel}</strong>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
                  Arrivée : <strong style={{ color: "var(--ink)" }}>{selected.arrivee}</strong>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 14 }}>
                  Contrat : <strong style={{ color: "var(--ink)" }}>{selected.contrat}</strong>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost btn-sm">📋 Fiche de paie</button>
                  <button className="btn btn-ghost btn-sm">📅 Congé</button>
                  <button className="btn btn-primary btn-sm">Modifier</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <div className="empty-icon">👤</div>
                  <p>Sélectionnez un membre de l'équipe pour voir son profil</p>
                </div>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <div className="card" style={{ background: "var(--surface)", boxShadow: "none" }}>
                  <div className="card-header" style={{ borderBottom: "none", paddingBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Planning de la semaine</span>
                    <span className="ai-badge">✨ IA</span>
                  </div>
                  <div className="card-body" style={{ paddingTop: 0 }}>
                    {personnel.slice(0, 3).map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 12 }}>
                        <span style={{ fontWeight: 500 }}>
                          {p.prenom} {p.nom[0]}.
                        </span>
                        <div style={{ display: "flex", gap: 3 }}>
                          {["L", "M", "M", "J", "V", "S"].map((j, ji) => (
                            <span
                              key={ji}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 4,
                                background: ji < 5 ? "var(--teal-light)" : "var(--line)",
                                color: ji < 5 ? "var(--teal)" : "var(--ink-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 500
                              }}
                            >
                              {j}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FiscalModule() {
  const [trimestre, setTrimestre] = useState("T1_2025");

  return (
    <div className="fade-in">
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <span className="ai-badge">✨ IA</span>
        <div style={{ marginLeft: 8, fontSize: 12 }}>
          L'IA génère automatiquement vos déclarations fiscales à partir des données comptables. Toujours faire valider par votre expert-comptable avant dépôt.
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Déclarations fiscales</span>
            <select className="form-select" style={{ width: "auto", fontSize: 12, padding: "4px 10px" }} value={trimestre} onChange={(e) => setTrimestre(e.target.value)}>
              <option value="T1_2025">T1 2025 (Jan-Mar)</option>
              <option value="T4_2024">T4 2024 (Oct-Déc)</option>
              <option value="T3_2024">T3 2024 (Juil-Sep)</option>
            </select>
          </div>
          <div className="card-body">
            {[
              { label: "Chiffre d'affaires HT", val: 9750000, note: "Consultations + examens" },
              { label: "TVA collectée (0%)", val: 0, note: "Prestations médicales exonérées" },
              { label: "Charges déductibles", val: 4310000, note: "Personnel, loyer, consommables" },
              { label: "Résultat imposable", val: 5440000, note: "CA - charges" },
              { label: "Impôt sur le revenu estimé", val: 544000, note: "Taux effectif ~10%" }
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{r.note}</div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: i === 4 ? "var(--danger)" : i === 2 ? "var(--amber)" : "var(--teal)",
                    textAlign: "right",
                    flexShrink: 0,
                    marginLeft: 12
                  }}
                >
                  {r.val.toLocaleString()} FCFA
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="btn btn-primary">⬇ Télécharger déclaration PDF</button>
              <button className="btn btn-ghost">Envoyer au comptable</button>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">Obligations fiscales 2025</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {[
                { label: "Déclaration T1 2025", echeance: "30 Avril 2025", statut: "urgent", note: "Échéance dans 1 jour !" },
                { label: "Déclaration T2 2025", echeance: "31 Juillet 2025", statut: "ok", note: "Dans 3 mois" },
                { label: "Déclaration T3 2025", echeance: "31 Octobre 2025", statut: "ok", note: "Dans 6 mois" },
                { label: "Déclaration annuelle 2025", echeance: "31 Mars 2026", statut: "ok", note: "Dans 11 mois" }
              ].map((o, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</div>
                    <div style={{ fontSize: 11, color: o.statut === "urgent" ? "var(--danger)" : "var(--ink-muted)" }}>{o.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: o.statut === "urgent" ? "var(--danger)" : "var(--ink-muted)" }}>{o.echeance}</div>
                    <span className={`tag ${o.statut === "urgent" ? "tag-danger" : "tag-success"}`} style={{ fontSize: 10, marginTop: 3 }}>
                      {o.statut === "urgent" ? "⚠ Urgent" : "✓ OK"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Exports comptables</span>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Grand livre — Avril 2025", icon: "📒", fmt: "CSV" },
                  { label: "Balance générale — Q1 2025", icon: "⚖", fmt: "XLSX" },
                  { label: "Tableau de bord fiscal 2025", icon: "📊", fmt: "PDF" },
                  { label: "Déclaration CFCE Sénégal", icon: "🏛", fmt: "PDF" }
                ].map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 8 }}>
                    <span style={{ fontSize: 12 }}>
                      {e.icon} {e.label}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="tag tag-gray" style={{ fontSize: 10 }}>
                        {e.fmt}
                      </span>
                      <button className="btn btn-ghost btn-sm">⬇</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
