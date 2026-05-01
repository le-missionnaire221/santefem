import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { Sidebar, Dashboard } from "./modules/navigation";
import { QueueModule, CalendarModule } from "./modules/operations";
import { AIModule, WhatsAppModule } from "./modules/communication";
import { InvoiceModule, CaisseModule, ComptabiliteModule } from "./modules/finance";
import { StocksModule, PersonnelModule, FiscalModule } from "./modules/admin";
const AI_PROXY_URL = window.__AI_PROXY_URL__ || "http://localhost:8787/api/ai/message";

// ── MOCK DATA ──
const PATIENTES = [
  {
    id: 1,
    nom: "Diallo",
    prenom: "Aminata",
    age: 28,
    tel: "+221 77 432 11 23",
    assurance: "IPRES",
    derniere_visite: "2025-04-10",
    motif: "Suivi grossesse",
    statut: "grossesse",
    semaines: 24,
    groupe_sanguin: "A+",
    allergies: "Pénicilline"
  },
  {
    id: 2,
    nom: "Sène",
    prenom: "Fatou",
    age: 35,
    tel: "+221 76 891 44 12",
    assurance: "Privé",
    derniere_visite: "2025-04-22",
    motif: "Contraception",
    statut: "normal",
    semaines: null,
    groupe_sanguin: "O+",
    allergies: "Aucune"
  },
  {
    id: 3,
    nom: "Ndiaye",
    prenom: "Rokhaya",
    age: 42,
    tel: "+221 78 234 56 78",
    assurance: "AXA",
    derniere_visite: "2025-03-15",
    motif: "Bilan hormonal",
    statut: "suivi",
    semaines: null,
    groupe_sanguin: "B-",
    allergies: "Aspirine"
  },
  {
    id: 4,
    nom: "Fall",
    prenom: "Mariama",
    age: 24,
    tel: "+221 70 567 89 01",
    assurance: "Privé",
    derniere_visite: "2025-04-28",
    motif: "Consultation gynéco",
    statut: "normal",
    semaines: null,
    groupe_sanguin: "AB+",
    allergies: "Aucune"
  },
  {
    id: 5,
    nom: "Mbaye",
    prenom: "Awa",
    age: 31,
    tel: "+221 77 123 45 67",
    assurance: "CSS",
    derniere_visite: "2025-04-05",
    motif: "Suivi grossesse",
    statut: "grossesse",
    semaines: 32,
    groupe_sanguin: "A-",
    allergies: "Latex"
  },
  {
    id: 6,
    nom: "Diop",
    prenom: "Ndéye",
    age: 19,
    tel: "+221 76 234 56 78",
    assurance: "Privé",
    derniere_visite: "2025-04-29",
    motif: "Première consultation",
    statut: "normal",
    semaines: null,
    groupe_sanguin: "O-",
    allergies: "Aucune"
  }
];

const QUEUE_INIT = [
  {
    id: 1,
    num: 1,
    nom: "Aminata Diallo",
    motif: "Suivi grossesse S24",
    medecin: "Dr. Diallo",
    statut: "en_cours",
    heure: "08:30",
    attente: 0
  },
  {
    id: 2,
    num: 2,
    nom: "Fatou Sène",
    motif: "Contraception",
    medecin: "Dr. Sène",
    statut: "attente",
    heure: "08:45",
    attente: 18
  },
  {
    id: 3,
    num: 3,
    nom: "Rokhaya Ndiaye",
    motif: "Bilan hormonal",
    medecin: "Dr. Diallo",
    statut: "attente",
    heure: "09:00",
    attente: 34
  },
  {
    id: 4,
    num: 4,
    nom: "Mariama Fall",
    motif: "Consultation gynéco",
    medecin: "Dr. Sène",
    statut: "attente",
    heure: "09:15",
    attente: 50
  },
  {
    id: 5,
    num: 5,
    nom: "Awa Mbaye",
    motif: "Suivi grossesse S32",
    medecin: "Dr. Diallo",
    statut: "urgent",
    heure: "09:20",
    attente: 55
  },
  {
    id: 6,
    num: 6,
    nom: "Ndéye Diop",
    motif: "Première consultation",
    medecin: "Dr. Sène",
    statut: "attente",
    heure: "09:30",
    attente: 65
  }
];

const RDV_TODAY = [
  {
    id: 1,
    heure: "08:30",
    patiente: "Aminata Diallo",
    motif: "Suivi grossesse",
    medecin: "Dr. Diallo",
    statut: "en_cours"
  },
  {
    id: 2,
    heure: "09:00",
    patiente: "Fatou Sène",
    motif: "Contraception",
    medecin: "Dr. Sène",
    statut: "attente"
  },
  {
    id: 3,
    heure: "09:30",
    patiente: "Rokhaya Ndiaye",
    motif: "Bilan hormonal",
    medecin: "Dr. Diallo",
    statut: "attente"
  },
  {
    id: 4,
    heure: "10:00",
    patiente: "Mariama Fall",
    motif: "Gynéco",
    medecin: "Dr. Sène",
    statut: "attente"
  },
  {
    id: 5,
    heure: "10:30",
    patiente: "Awa Mbaye",
    motif: "Suivi grossesse",
    medecin: "Dr. Diallo",
    statut: "urgent"
  },
  {
    id: 6,
    heure: "11:00",
    patiente: "Ndéye Diop",
    motif: "1ère consultation",
    medecin: "Dr. Sène",
    statut: "attente"
  },
  {
    id: 7,
    heure: "11:30",
    patiente: "Khady Gueye",
    motif: "Frottis",
    medecin: "Dr. Diallo",
    statut: "programme"
  },
  {
    id: 8,
    heure: "14:00",
    patiente: "Coumba Diallo",
    motif: "Échographie",
    medecin: "Dr. Sène",
    statut: "programme"
  }
];

const FACTURES = [
  {
    id: "F-2025-041",
    date: "2025-04-29",
    patiente: "Fatou Sène",
    actes: "Consultation + Frottis",
    montant: 33000,
    statut: "payé",
    mode: "Wave"
  },
  {
    id: "F-2025-040",
    date: "2025-04-29",
    patiente: "Aminata Diallo",
    actes: "Suivi grossesse + Écho",
    montant: 45000,
    statut: "payé",
    mode: "Espèces"
  },
  {
    id: "F-2025-039",
    date: "2025-04-28",
    patiente: "Rokhaya Ndiaye",
    actes: "Bilan hormonal",
    montant: 35000,
    statut: "en_attente",
    mode: "IPRES"
  },
  {
    id: "F-2025-038",
    date: "2025-04-28",
    patiente: "Mariama Fall",
    actes: "Consultation",
    montant: 15000,
    statut: "payé",
    mode: "Orange Money"
  },
  {
    id: "F-2025-037",
    date: "2025-04-27",
    patiente: "Awa Mbaye",
    actes: "Suivi grossesse",
    montant: 20000,
    statut: "impayé",
    mode: "CSS"
  }
];

const AI_RESPONSES = {
  default:
    "Je suis l'IA de SantéFem Pro. Je peux vous aider à analyser des symptômes, résumer un dossier, générer une ordonnance ou répondre aux questions médicales générales.",
  symptome:
    "D'après les symptômes décrits, les diagnostics différentiels à considérer sont : 1) Infection urinaire (probabilité élevée), 2) Colique néphrétique, 3) Annexite. Je recommande un ECBU et une échographie pelvienne.",
  ordonnance:
    "Ordonnance suggérée :\n• Amoxicilline 500mg — 3×/jour — 7 jours\n• Ibuprofène 400mg — si douleur\n• Repos 48h\n\nÀ valider et signer par le médecin.",
  grossesse:
    "Suivi grossesse S24 — Points clés :\n✓ Prise de poids dans la norme (+6kg)\n⚠ Légère anémie à surveiller (Hb 10.2)\n✓ Tension artérielle normale\n→ Prescrire sulfate de fer + acide folique",
  résumé:
    "Résumé IA du dossier Aminata Diallo :\n• Dernière visite : 10/04 — RAS, écho normale\n• Grossesse : 24 SA, sans complication\n• Allergie : Pénicilline ⚠\n• À faire aujourd'hui : écho morphologique T2"
};

// ── ICONS ──
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "⊞",
    patients: "👩",
    queue: "⏱",
    calendar: "📅",
    invoice: "📄",
    cash: "💳",
    stats: "📊",
    ai: "✨",
    settings: "⚙",
    logout: "→",
    add: "+",
    search: "⌕",
    bell: "🔔",
    close: "×",
    edit: "✎",
    delete: "🗑",
    phone: "📞",
    send: "➤",
    check: "✓",
    warning: "⚠",
    wave: "〰",
    orange: "●",
    cash2: "💵",
    insurance: "🏦",
    gross: "🤱",
    normal: "👤",
    urgent: "🚨",
    refresh: "↻",
    dossier: "📋",
    ordonnance: "💊",
    exam: "🔬",
    birth: "🎂",
    mic: "🎤",
    print: "🖨",
    download: "⬇",
    whatsapp: "💬"
  };
  return <span style={{ fontSize: size + "px", lineHeight: 1 }}>{icons[name] || "·"}</span>;
};

// ── DOSSIER MODAL ──
function DossierModal({ patiente, onClose }) {
  const [tab, setTab] = useState("info");
  const tabs = ["info", "grossesse", "examens", "ordonnances", "historique"];
  const tabLabels = {
    info: "Informations",
    grossesse: "Grossesse",
    examens: "Examens",
    ordonnances: "Ordonnances",
    historique: "Historique"
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="dossier-header">
          <div className="dossier-avatar">
            {patiente.prenom[0]}
            {patiente.nom[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div className="dossier-name">
              {patiente.prenom} {patiente.nom}
            </div>
            <div className="dossier-meta">
              {patiente.age} ans · {patiente.tel} · {patiente.assurance}
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                className="tag"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 10 }}
              >
                G.S. {patiente.groupe_sanguin}
              </span>
              {patiente.allergies !== "Aucune" && (
                <span
                  className="tag"
                  style={{ background: "rgba(220,38,38,0.3)", color: "white", fontSize: 10 }}
                >
                  ⚠ {patiente.allergies}
                </span>
              )}
              {patiente.statut === "grossesse" && (
                <span
                  className="tag"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 10 }}
                >
                  🤱 {patiente.semaines} SA
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
          >
            ✕
          </button>
        </div>

        <div className="dossier-tabs">
          {tabs.map((t) => (
            <div
              key={t}
              className={`dossier-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {tabLabels[t]}
            </div>
          ))}
        </div>

        <div className="dossier-body">
          {tab === "info" && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: 14 }}>
                <span className="ai-badge">✨ IA</span>
                <div style={{ marginLeft: 8, fontSize: 12 }}>
                  {patiente.statut === "grossesse"
                    ? `Grossesse ${patiente.semaines} SA — Dernière écho normale. Allergie pénicilline ⚠. Prévoir écho morphologique T2 aujourd'hui.`
                    : `Dernière visite ${patiente.derniere_visite}. Motif habituel : ${patiente.motif}. Aucune alerte particulière.`}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input className="form-input" defaultValue={patiente.prenom} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input className="form-input" defaultValue={patiente.nom} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" defaultValue={patiente.tel} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assurance</label>
                  <input className="form-input" defaultValue={patiente.assurance} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Groupe sanguin</label>
                  <input className="form-input" defaultValue={patiente.groupe_sanguin} />
                </div>
                <div className="form-group">
                  <label className="form-label">Allergies</label>
                  <input className="form-input" defaultValue={patiente.allergies} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes consultation</label>
                <textarea
                  className="form-textarea"
                  placeholder="Saisir les notes de consultation... (ou activer la transcription vocale ✨)"
                />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn btn-primary btn-sm">🎤 Transcription vocale IA</button>
                <button className="btn btn-ghost btn-sm">💊 Générer ordonnance IA</button>
              </div>
            </div>
          )}
          {tab === "grossesse" && patiente.statut === "grossesse" && (
            <div>
              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div className="stat-card rose">
                  <div className="stat-label">Semaines</div>
                  <div className="stat-value">{patiente.semaines}</div>
                  <div className="stat-sub">SA</div>
                </div>
                <div className="stat-card teal">
                  <div className="stat-label">Terme prévu</div>
                  <div className="stat-value">Août</div>
                  <div className="stat-sub">2025</div>
                </div>
                <div className="stat-card amber">
                  <div className="stat-label">Prochaine écho</div>
                  <div className="stat-value">T2</div>
                  <div className="stat-sub">Morphologique</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Poids actuel</label>
                  <input className="form-input" defaultValue="68 kg" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tension</label>
                  <input className="form-input" defaultValue="120/80 mmHg" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hauteur utérine</label>
                  <input className="form-input" defaultValue="24 cm" />
                </div>
                <div className="form-group">
                  <label className="form-label">Bruits du cœur</label>
                  <input className="form-input" defaultValue="148 bpm" />
                </div>
              </div>
              <div className="alert alert-warning" style={{ marginTop: 8 }}>
                ⚠ Anémie légère détectée (Hb 10.2 g/dL) — IA recommande supplément en fer
              </div>
            </div>
          )}
          {tab === "grossesse" && patiente.statut !== "grossesse" && (
            <div className="empty-state">
              <div className="empty-icon">🤰</div>
              <p>Pas de grossesse en cours</p>
            </div>
          )}
          {tab === "examens" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button className="btn btn-primary btn-sm">+ Ajouter résultat</button>
              </div>
              {[
                {
                  date: "2025-04-10",
                  exam: "Échographie pelvienne",
                  resultat: "Normale — utérus et annexes sans anomalie",
                  statut: "normal"
                },
                {
                  date: "2025-03-20",
                  exam: "NFS + Bilan hormonal",
                  resultat: "Hb 10.2 g/dL ⚠ — FSH, LH normaux",
                  statut: "anormal"
                },
                {
                  date: "2025-02-14",
                  exam: "Frottis cervical",
                  resultat: "Pas de lésion — HPV négatif",
                  statut: "normal"
                }
              ].map((e, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.exam}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>
                        {e.resultat}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <span
                        className={`tag ${e.statut === "normal" ? "tag-success" : "tag-danger"}`}
                      >
                        {e.statut === "normal" ? "Normal" : "Anormal"}
                      </span>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 3 }}>
                        {e.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "ordonnances" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  alignItems: "center"
                }}
              >
                <span className="ai-badge">✨ IA peut générer une ordonnance</span>
                <button className="btn btn-primary btn-sm">+ Nouvelle ordonnance</button>
              </div>
              {[
                {
                  date: "2025-04-10",
                  medecin: "Dr. Diallo",
                  medicaments: [
                    "Sulfate de fer 80mg 1×/j 3 mois",
                    "Acide folique 5mg 1×/j",
                    "Vitamine C 500mg 1×/j"
                  ]
                },
                {
                  date: "2025-02-14",
                  medecin: "Dr. Sène",
                  medicaments: ["Métronidazole 500mg 2×/j 7j", "Probiotiques"]
                }
              ].map((o, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 10
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 500 }}>
                      {o.date} · {o.medecin}
                    </span>
                    <button className="btn btn-ghost btn-sm">🖨 Imprimer</button>
                  </div>
                  {o.medicaments.map((m, j) => (
                    <div
                      key={j}
                      style={{ fontSize: 12, color: "var(--ink-soft)", padding: "3px 0" }}
                    >
                      • {m}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {tab === "historique" && (
            <div>
              {[
                {
                  date: "2025-04-10",
                  type: "Consultation",
                  notes: "Suivi grossesse S20 — Écho normale, poids OK, tension stable",
                  medecin: "Dr. Diallo"
                },
                {
                  date: "2025-03-20",
                  type: "Examen",
                  notes: "NFS et bilan hormonal — Anémie légère détectée, traitement prescrit",
                  medecin: "Dr. Diallo"
                },
                {
                  date: "2025-02-14",
                  type: "Consultation",
                  notes: "Consultation suivi grossesse S8 — Confirmée, DPA calculée",
                  medecin: "Dr. Sène"
                }
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line)"
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      background: "var(--rose-light)",
                      borderRadius: 2,
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{h.type}</span>
                      <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                        {h.date} · {h.medecin}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}>
                      {h.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Fermer
          </button>
          <button className="btn btn-primary">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ── PATIENTS ──
function PatientsModule() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = PATIENTES.filter(
    (p) =>
      (p.prenom + " " + p.nom).toLowerCase().includes(search.toLowerCase()) ||
      p.tel.includes(search) ||
      p.motif.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      {selected && <DossierModal patiente={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <input
          className="form-input"
          style={{ flex: 1, maxWidth: 340 }}
          placeholder="⌕  Rechercher patiente, téléphone, motif..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          + Nouvelle patiente
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Dossiers patientes</span>
          <span className="tag tag-rose">{filtered.length} patientes</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patiente</th>
                <th>Âge</th>
                <th>Téléphone</th>
                <th>Assurance</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Dernière visite</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="name">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                        {p.prenom[0]}
                        {p.nom[0]}
                      </div>
                      {p.prenom} {p.nom}
                    </div>
                  </td>
                  <td>{p.age} ans</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.tel}</td>
                  <td>
                    <span className="tag tag-gray">{p.assurance}</span>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {p.motif}
                  </td>
                  <td>
                    <span
                      className={`tag ${p.statut === "grossesse" ? "tag-rose" : p.statut === "suivi" ? "tag-amber" : "tag-teal"}`}
                    >
                      {p.statut === "grossesse"
                        ? `🤱 ${p.semaines} SA`
                        : p.statut === "suivi"
                          ? "Suivi"
                          : "Normal"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-muted)" }}>{p.derniere_visite}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}>
                      Dossier →
                    </button>
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

// ── STATS ──
function StatsModule() {
  return (
    <div className="fade-in">
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card rose">
          <div className="stat-label">Patientes ce mois</div>
          <div className="stat-value">124</div>
          <div className="stat-sub">+12% vs mois dernier</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Revenus du mois</div>
          <div className="stat-value">3.2M</div>
          <div className="stat-sub">FCFA</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Taux occupation</div>
          <div className="stat-value">87%</div>
          <div className="stat-sub">Créneaux utilisés</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Satisfaction</div>
          <div className="stat-value">4.8</div>
          <div className="stat-sub">/ 5 ⭐</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Répartition des actes</span>
            <span className="ai-badge">✨ IA</span>
          </div>
          <div className="card-body">
            {[
              { label: "Consultation gynéco", val: 45, color: "var(--rose)" },
              { label: "Suivi grossesse", val: 28, color: "var(--teal)" },
              { label: "Échographie", val: 15, color: "var(--amber)" },
              { label: "Planning familial", val: 8, color: "#7c3aed" },
              { label: "Autres", val: 4, color: "var(--ink-muted)" }
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 4
                  }}
                >
                  <span>{s.label}</span>
                  <span style={{ fontWeight: 500 }}>{s.val}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: s.val + "%", background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Insights IA du mois</span>
            <span className="ai-badge">✨ IA</span>
          </div>
          <div className="card-body">
            <div className="alert alert-success" style={{ marginBottom: 10 }}>
              📈 Les consultations grossesse ont augmenté de 23% — envisager un créneau dédié Dr.
              Diallo le vendredi.
            </div>
            <div className="alert alert-warning" style={{ marginBottom: 10 }}>
              ⚠ 8 patientes n'ont pas été vues depuis plus de 6 mois. Relance automatique
              recommandée.
            </div>
            <div className="alert alert-info" style={{ marginBottom: 10 }}>
              💡 Le mercredi matin est le créneau le plus chargé. Ajouter un médecin en renfort ?
            </div>
            <div className="alert alert-success">
              💳 Wave représente 35% des paiements — intégration directe recommandée pour accélérer
              l'encaissement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PHASE 3 — FINANCE & ADMINISTRATION
// ════════════════════════════════════════════

// ── DATA PHASE 3 ──
const ASSURANCES = [
  {
    id: 1,
    nom: "IPRES",
    type: "IPM",
    taux: 80,
    delai_remb: 30,
    contact: "ipres@sn.sn",
    actif: true
  },
  { id: 2, nom: "CSS", type: "IPM", taux: 70, delai_remb: 45, contact: "css@sn.sn", actif: true },
  {
    id: 3,
    nom: "AXA Sénégal",
    type: "Assurance privée",
    taux: 90,
    delai_remb: 21,
    contact: "axa@sn.sn",
    actif: true
  },
  {
    id: 4,
    nom: "Allianz Sénégal",
    type: "Assurance privée",
    taux: 85,
    delai_remb: 25,
    contact: "allianz@sn.sn",
    actif: true
  },
  {
    id: 5,
    nom: "Sanlam",
    type: "Assurance privée",
    taux: 80,
    delai_remb: 30,
    contact: "sanlam@sn.sn",
    actif: false
  }
];

const PRISES_EN_CHARGE = [
  {
    id: "PC-041",
    patiente: "Rokhaya Ndiaye",
    assurance: "AXA",
    montant_total: 35000,
    part_assurance: 31500,
    part_patient: 3500,
    statut: "soumis",
    date_soumission: "2025-04-28",
    date_remb: null
  },
  {
    id: "PC-040",
    patiente: "Aminata Diallo",
    assurance: "IPRES",
    montant_total: 45000,
    part_assurance: 36000,
    part_patient: 9000,
    statut: "remboursé",
    date_soumission: "2025-04-10",
    date_remb: "2025-04-25"
  },
  {
    id: "PC-039",
    patiente: "Awa Mbaye",
    assurance: "CSS",
    montant_total: 20000,
    part_assurance: 14000,
    part_patient: 6000,
    statut: "en_attente",
    date_soumission: "2025-04-05",
    date_remb: null
  },
  {
    id: "PC-038",
    patiente: "Khady Gueye",
    assurance: "Allianz",
    montant_total: 33000,
    part_assurance: 28050,
    part_patient: 4950,
    statut: "refusé",
    date_soumission: "2025-03-20",
    date_remb: null
  }
];

const ECRITURES_COMPTA = [
  {
    id: 1,
    date: "2025-04-29",
    libelle: "Consultation Fatou Sène",
    compte: "Recettes consultations",
    debit: 0,
    credit: 33000,
    mode: "Wave",
    categorie: "recette"
  },
  {
    id: 2,
    date: "2025-04-29",
    libelle: "Achat gants chirurgicaux (×200)",
    compte: "Consommables médicaux",
    debit: 15000,
    credit: 0,
    mode: "Espèces",
    categorie: "depense"
  },
  {
    id: 3,
    date: "2025-04-28",
    libelle: "Salaire Dr. Sène - Avril",
    compte: "Charges de personnel",
    debit: 450000,
    credit: 0,
    mode: "Virement",
    categorie: "depense"
  },
  {
    id: 4,
    date: "2025-04-28",
    libelle: "Consultation Mariama Fall",
    compte: "Recettes consultations",
    debit: 0,
    credit: 15000,
    mode: "Orange Money",
    categorie: "recette"
  },
  {
    id: 5,
    date: "2025-04-27",
    libelle: "Remboursement IPRES - Mars",
    compte: "Remboursements assurances",
    debit: 0,
    credit: 180000,
    mode: "Virement",
    categorie: "recette"
  },
  {
    id: 6,
    date: "2025-04-26",
    libelle: "Loyer cabinet - Mai",
    compte: "Charges locatives",
    debit: 350000,
    credit: 0,
    mode: "Virement",
    categorie: "depense"
  },
  {
    id: 7,
    date: "2025-04-25",
    libelle: "Écho Coumba Diallo",
    compte: "Recettes examens",
    debit: 0,
    credit: 25000,
    mode: "Espèces",
    categorie: "recette"
  },
  {
    id: 8,
    date: "2025-04-24",
    libelle: "Achat réactifs labo",
    compte: "Consommables médicaux",
    debit: 85000,
    credit: 0,
    mode: "Wave",
    categorie: "depense"
  }
];

const STOCKS = [
  {
    id: 1,
    nom: "Gants chirurgicaux L",
    categorie: "Consommable",
    stock: 45,
    seuil_alerte: 20,
    unite: "Boîtes",
    pu: 7500,
    derniere_commande: "2025-04-15",
    statut: "ok"
  },
  {
    id: 2,
    nom: "Seringues 5ml",
    categorie: "Consommable",
    stock: 8,
    seuil_alerte: 15,
    unite: "Boîtes",
    pu: 3500,
    derniere_commande: "2025-04-01",
    statut: "alerte"
  },
  {
    id: 3,
    nom: "Spéculums jetables",
    categorie: "Consommable",
    stock: 120,
    seuil_alerte: 50,
    unite: "Unités",
    pu: 850,
    derniere_commande: "2025-04-20",
    statut: "ok"
  },
  {
    id: 4,
    nom: "Gel écho obstétrique",
    categorie: "Consommable",
    stock: 3,
    seuil_alerte: 5,
    unite: "Flacons",
    pu: 12000,
    derniere_commande: "2025-03-28",
    statut: "rupture"
  },
  {
    id: 5,
    nom: "Sulfate de fer 80mg",
    categorie: "Médicament",
    stock: 280,
    seuil_alerte: 100,
    unite: "Comprimés",
    pu: 150,
    derniere_commande: "2025-04-10",
    statut: "ok"
  },
  {
    id: 6,
    nom: "Acide folique 5mg",
    categorie: "Médicament",
    stock: 95,
    seuil_alerte: 100,
    unite: "Comprimés",
    pu: 120,
    derniere_commande: "2025-04-10",
    statut: "alerte"
  },
  {
    id: 7,
    nom: "Préservatifs masculins",
    categorie: "Contraception",
    stock: 200,
    seuil_alerte: 80,
    unite: "Boîtes",
    pu: 2500,
    derniere_commande: "2025-04-18",
    statut: "ok"
  },
  {
    id: 8,
    nom: "Papier ECG",
    categorie: "Consommable",
    stock: 0,
    seuil_alerte: 3,
    unite: "Rouleaux",
    pu: 8000,
    derniere_commande: "2025-03-10",
    statut: "rupture"
  }
];

const PERSONNEL = [
  {
    id: 1,
    nom: "Diallo",
    prenom: "Aminata",
    poste: "Gynécologue",
    type: "Médecin",
    salaire: 850000,
    contrat: "CDI",
    statut: "actif",
    conges_restants: 12,
    tel: "+221 77 000 11 11",
    arrivee: "2022-01-15"
  },
  {
    id: 2,
    nom: "Sène",
    prenom: "Fatou",
    poste: "Gynécologue",
    type: "Médecin",
    salaire: 800000,
    contrat: "CDI",
    statut: "actif",
    conges_restants: 18,
    tel: "+221 76 000 22 22",
    arrivee: "2023-03-01"
  },
  {
    id: 3,
    nom: "Badji",
    prenom: "Mariama",
    poste: "Sage-femme",
    type: "Paramédical",
    salaire: 320000,
    contrat: "CDI",
    statut: "actif",
    conges_restants: 7,
    tel: "+221 77 000 33 33",
    arrivee: "2022-06-01"
  },
  {
    id: 4,
    nom: "Faye",
    prenom: "Aissatou",
    poste: "Secrétaire médicale",
    type: "Administratif",
    salaire: 220000,
    contrat: "CDI",
    statut: "actif",
    conges_restants: 15,
    tel: "+221 78 000 44 44",
    arrivee: "2023-09-01"
  },
  {
    id: 5,
    nom: "Diop",
    prenom: "Omar",
    poste: "Agent d'entretien",
    type: "Support",
    salaire: 120000,
    contrat: "CDD",
    statut: "actif",
    conges_restants: 5,
    tel: "+221 70 000 55 55",
    arrivee: "2024-01-01"
  }
];

const MOIS_DATA = [
  { mois: "Nov", recettes: 2850000, depenses: 1420000 },
  { mois: "Déc", recettes: 3100000, depenses: 1550000 },
  { mois: "Jan", recettes: 2700000, depenses: 1380000 },
  { mois: "Fév", recettes: 2950000, depenses: 1460000 },
  { mois: "Mar", recettes: 3200000, depenses: 1510000 },
  { mois: "Avr", recettes: 3450000, depenses: 1620000 }
];

// ── MODULE TIERS PAYANT ──
function TiersPayantModule() {
  const [onglet, setOnglet] = useState("dossiers");
  const [selectedPC, setSelectedPC] = useState(null);

  const totalSoumis = PRISES_EN_CHARGE.filter(
    (p) => p.statut === "soumis" || p.statut === "en_attente"
  ).reduce((s, p) => s + p.part_assurance, 0);
  const totalRemb = PRISES_EN_CHARGE.filter((p) => p.statut === "remboursé").reduce(
    (s, p) => s + p.part_assurance,
    0
  );
  const totalRefuse = PRISES_EN_CHARGE.filter((p) => p.statut === "refusé").reduce(
    (s, p) => s + p.part_assurance,
    0
  );

  return (
    <div className="fade-in">
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card amber">
          <div className="stat-label">En attente remb.</div>
          <div className="stat-value">{(totalSoumis / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA soumis</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Remboursé ce mois</div>
          <div className="stat-value">{(totalRemb / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA reçus</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-label">Dossiers actifs</div>
          <div className="stat-value">{ASSURANCES.filter((a) => a.actif).length}</div>
          <div className="stat-sub">assurances</div>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid var(--danger)" }}>
          <div className="stat-label">Refusés</div>
          <div className="stat-value">{(totalRefuse / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA perdus</div>
        </div>
      </div>

      <div
        className="dossier-tabs"
        style={{
          borderRadius: "var(--radius) var(--radius) 0 0",
          border: "1px solid var(--line)",
          borderBottom: "none",
          background: "var(--white)"
        }}
      >
        {[
          ["dossiers", "Prises en charge"],
          ["assurances", "Assurances partenaires"],
          ["soumettre", "Soumettre un dossier"]
        ].map(([id, label]) => (
          <div
            key={id}
            className={`dossier-tab${onglet === id ? " active" : ""}`}
            onClick={() => setOnglet(id)}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="card" style={{ borderRadius: "0 0 var(--radius) var(--radius)" }}>
        {onglet === "dossiers" && (
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Patiente</th>
                  <th>Assurance</th>
                  <th>Montant total</th>
                  <th>Part assurance</th>
                  <th>Part patient</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {PRISES_EN_CHARGE.map((pc) => (
                  <tr key={pc.id}>
                    <td
                      style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ink-muted)" }}
                    >
                      {pc.id}
                    </td>
                    <td className="name">{pc.patiente}</td>
                    <td>
                      <span className="tag tag-gray">{pc.assurance}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{pc.montant_total.toLocaleString()} FCFA</td>
                    <td style={{ color: "var(--teal)", fontWeight: 500 }}>
                      {pc.part_assurance.toLocaleString()} FCFA
                    </td>
                    <td style={{ color: "var(--rose)" }}>
                      {pc.part_patient.toLocaleString()} FCFA
                    </td>
                    <td>
                      <span
                        className={`tag ${pc.statut === "remboursé" ? "tag-success" : pc.statut === "refusé" ? "tag-danger" : pc.statut === "soumis" ? "tag-amber" : "tag-gray"}`}
                      >
                        {pc.statut === "remboursé"
                          ? "✓ Remboursé"
                          : pc.statut === "refusé"
                            ? "✗ Refusé"
                            : pc.statut === "soumis"
                              ? "Soumis"
                              : "En attente"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {pc.statut === "refusé" && (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: "var(--danger)", fontSize: 11 }}
                          >
                            Contester
                          </button>
                        )}
                        {pc.statut === "en_attente" && (
                          <button className="btn btn-primary btn-sm">Soumettre</button>
                        )}
                        {pc.statut === "soumis" && (
                          <button className="btn btn-ghost btn-sm">Relancer</button>
                        )}
                        {pc.statut === "remboursé" && (
                          <button className="btn btn-ghost btn-sm">🖨 Reçu</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                padding: "10px 16px",
                background: "var(--surface)",
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 8,
                alignItems: "center"
              }}
            >
              <span className="ai-badge">✨ IA</span>
              <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                Relance automatique envoyée à AXA pour PC-041 (soumis il y a 2 jours). Délai
                contractuel : 21 jours.
              </span>
            </div>
          </div>
        )}

        {onglet === "assurances" && (
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assurance</th>
                  <th>Type</th>
                  <th>Taux prise en charge</th>
                  <th>Délai remb.</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ASSURANCES.map((a) => (
                  <tr key={a.id}>
                    <td className="name">{a.nom}</td>
                    <td>
                      <span className="tag tag-gray">{a.type}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          className="progress-bar"
                          style={{ width: 80, display: "inline-block" }}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: a.taux + "%", background: "var(--teal)" }}
                          />
                        </div>
                        <span style={{ fontWeight: 500, color: "var(--teal)" }}>{a.taux}%</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--ink-muted)" }}>{a.delai_remb} jours</td>
                    <td style={{ fontSize: 11, color: "var(--ink-muted)" }}>{a.contact}</td>
                    <td>
                      <span className={`tag ${a.actif ? "tag-success" : "tag-gray"}`}>
                        {a.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
              <button className="btn btn-primary btn-sm">+ Ajouter une assurance partenaire</button>
            </div>
          </div>
        )}

        {onglet === "soumettre" && (
          <div className="card-body">
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <span className="ai-badge">✨ IA</span>
              <span style={{ marginLeft: 8, fontSize: 12 }}>
                L'IA vérifie automatiquement les droits de la patiente et pré-remplit le dossier de
                prise en charge.
              </span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Patiente</label>
                <select className="form-select">
                  <option>Sélectionner une patiente...</option>
                  {PATIENTES.map((p) => (
                    <option key={p.id}>
                      {p.prenom} {p.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assurance</label>
                <select className="form-select">
                  {ASSURANCES.filter((a) => a.actif).map((a) => (
                    <option key={a.id}>{a.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">N° adhérent / Police</label>
                <input className="form-input" placeholder="Ex: IPRES-2024-00123" />
              </div>
              <div className="form-group">
                <label className="form-label">Date des soins</label>
                <input className="form-input" type="date" defaultValue="2025-04-30" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Actes réalisés</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                  marginTop: 4
                }}
              >
                {[
                  "Consultation gynéco (15 000)",
                  "Suivi grossesse (20 000)",
                  "Échographie (25 000)",
                  "Frottis (18 000)",
                  "Bilan hormonal (35 000)",
                  "Pose DIU (30 000)"
                ].map((a, i) => (
                  <label
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      cursor: "pointer",
                      padding: "6px 8px",
                      border: "1px solid var(--line)",
                      borderRadius: 6
                    }}
                  >
                    <input type="checkbox" /> {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Montant total FCFA</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0"
                  style={{ fontWeight: 500, fontSize: 16, color: "var(--teal)" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Part patient estimée</label>
                <input
                  className="form-input"
                  readOnly
                  placeholder="Calculé automatiquement"
                  style={{ color: "var(--ink-muted)", background: "var(--surface)" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className="btn btn-primary">Soumettre le dossier</button>
              <button className="btn btn-ghost">Sauvegarder brouillon</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PHASE 4 — COMMUNICATION & TÉLÉMÉDECINE
// ════════════════════════════════════════════

// ── DATA PHASE 4 ──
const TELECONSULTS = [
  {
    id: "TC-012",
    patiente: "Fatou Sène",
    medecin: "Dr. Diallo",
    date: "2025-04-30",
    heure: "10:00",
    motif: "Suivi contraception",
    statut: "programmé",
    duree: 20
  },
  {
    id: "TC-011",
    patiente: "Coumba Ba",
    medecin: "Dr. Sène",
    date: "2025-04-30",
    heure: "11:30",
    motif: "Résultats labo",
    statut: "programmé",
    duree: 15
  },
  {
    id: "TC-010",
    patiente: "Aminata Diallo",
    medecin: "Dr. Diallo",
    date: "2025-04-28",
    heure: "09:00",
    motif: "Suivi grossesse S22",
    statut: "terminé",
    duree: 25
  },
  {
    id: "TC-009",
    patiente: "Khady Gueye",
    medecin: "Dr. Sène",
    date: "2025-04-27",
    heure: "14:00",
    motif: "Questions post-op",
    statut: "terminé",
    duree: 18
  }
];

const WA_MESSAGES = [
  {
    id: 1,
    patiente: "Aminata Diallo",
    tel: "+221 77 432 11 23",
    type: "rappel_rdv",
    message:
      "Bonjour Aminata ! Rappel de votre RDV demain mardi 30 avril à 08h30 avec Dr. Diallo. Clinique Santé Féminine. Répondez OUI pour confirmer.",
    statut: "lu",
    heure: "Hier 18:00",
    direction: "out"
  },
  {
    id: 2,
    patiente: "Aminata Diallo",
    tel: "+221 77 432 11 23",
    type: "reponse",
    message: "OUI merci !",
    statut: "lu",
    heure: "Hier 18:12",
    direction: "in"
  },
  {
    id: 3,
    patiente: "Awa Mbaye",
    tel: "+221 77 123 45 67",
    type: "relance_impaye",
    message:
      "Bonjour Awa, votre facture du 27/04 de 20 000 FCFA est en attente. Vous pouvez régler via Wave au +221 77 000 00 00. Merci.",
    statut: "envoyé",
    heure: "Auj. 09:00",
    direction: "out"
  },
  {
    id: 4,
    patiente: "Rokhaya Ndiaye",
    tel: "+221 78 234 56 78",
    type: "resultat",
    message:
      "Bonjour Rokhaya, vos résultats de bilan hormonal sont disponibles. Connectez-vous à votre espace patiente ou appelez-nous. Dr. Diallo.",
    statut: "lu",
    heure: "Auj. 10:30",
    direction: "out"
  },
  {
    id: 5,
    patiente: "Rokhaya Ndiaye",
    tel: "+221 78 234 56 78",
    type: "question",
    message: "Docteure bonjour, est-ce que je dois jeûner avant mon prochain bilan ?",
    statut: "non_lu",
    heure: "Auj. 11:05",
    direction: "in"
  },
  {
    id: 6,
    patiente: "Ndéye Diop",
    tel: "+221 76 234 56 78",
    type: "prise_rdv",
    message:
      "Bonjour, je voudrais prendre un rendez-vous pour une première consultation gynécologique s'il vous plaît.",
    statut: "non_lu",
    heure: "Auj. 11:45",
    direction: "in"
  }
];

const PORTAIL_STATS = {
  inscrits: 87,
  actifs_mois: 43,
  rdv_en_ligne: 28,
  messages: 15
};

const CAMPAGNES = [
  {
    id: 1,
    titre: "Rappel dépistage cancer col",
    cible: "Patientes 30-65 ans",
    nb_destinataires: 45,
    canal: "WhatsApp+SMS",
    statut: "envoyé",
    date: "2025-04-15",
    taux_ouverture: 78
  },
  {
    id: 2,
    titre: "Promotion bilan hormonal mai",
    cible: "Toutes patientes",
    nb_destinataires: 124,
    canal: "WhatsApp",
    statut: "programmé",
    date: "2025-05-05",
    taux_ouverture: null
  },
  {
    id: 3,
    titre: "Suivi grossesse — conseils S2",
    cible: "Patientes enceintes",
    nb_destinataires: 12,
    canal: "SMS",
    statut: "envoyé",
    date: "2025-04-20",
    taux_ouverture: 92
  }
];

// ── MODULE TÉLÉCONSULTATION ──
function TeleconsultModule() {
  const [activeCall, setActiveCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [micro, setMicro] = useState(true);
  const [camera, setCamera] = useState(true);
  const timerRef = useRef(null);

  const startCall = (tc) => {
    setActiveCall(tc);
    setCallActive(true);
    setCallTimer(0);
    timerRef.current = setInterval(() => setCallTimer((t) => t + 1), 1000);
  };

  const endCall = () => {
    setCallActive(false);
    clearInterval(timerRef.current);
  };

  const formatTimer = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fade-in">
      {/* Live call UI */}
      {callActive && activeCall && (
        <div
          style={{
            background: "#0f1117",
            borderRadius: "var(--radius)",
            padding: 24,
            marginBottom: 20,
            border: "2px solid var(--teal)",
            display: "flex",
            gap: 20,
            alignItems: "stretch",
            minHeight: 300
          }}
        >
          {/* Remote video (patiente) */}
          <div
            style={{
              flex: 2,
              borderRadius: 10,
              background: "#1a1f2e",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              position: "relative",
              minHeight: 220
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#2a3045",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 600,
                color: "#7dd3c8",
                fontFamily: "var(--font-display)"
              }}
            >
              {activeCall.patiente
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
              {activeCall.patiente}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>{activeCall.motif}</div>
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "rgba(20,200,100,0.15)",
                border: "1px solid rgba(20,200,100,0.4)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                color: "#4ade80",
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <span className="online-dot" /> En direct — {formatTimer(callTimer)}
            </div>
          </div>
          {/* Local video (médecin) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                flex: 1,
                borderRadius: 10,
                background: "#1a1f2e",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 140
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#2a1535",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#e9a0c0",
                  fontFamily: "var(--font-display)"
                }}
              >
                AD
              </div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>Dr. Aminata Diallo</div>
              {!camera && (
                <div style={{ fontSize: 11, color: "var(--danger)" }}>Caméra désactivée</div>
              )}
            </div>
            {/* Controls */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                onClick={() => setMicro((m) => !m)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: micro ? "#2a3045" : "var(--danger)",
                  color: "white",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {micro ? "🎤" : "🔇"}
              </button>
              <button
                onClick={() => setCamera((c) => !c)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: camera ? "#2a3045" : "var(--amber)",
                  color: "white",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {camera ? "📷" : "🚫"}
              </button>
              <button
                onClick={endCall}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: "var(--danger)",
                  color: "white",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>
          </div>
          {/* IA panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#1a1f2e", borderRadius: 10, padding: 14, flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#9ca3af",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span className="ai-badge">✨ IA Live</span>
              </div>
              <div style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.6 }}>
                Patiente : {activeCall.patiente}
                <br />
                Motif : {activeCall.motif}
                <br />
                <br />
                <span style={{ color: "#fbbf24" }}>⚠ Allergie : Pénicilline</span>
                <br />
                <span style={{ color: "#34d399" }}>✓ Dernière visite : 10/04</span>
                <br />
                <br />
                <span style={{ color: "#9ca3af", fontSize: 11 }}>🎤 Transcription active...</span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ justifyContent: "center" }}>
              💊 Générer ordonnance
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{
                justifyContent: "center",
                color: "white",
                borderColor: "rgba(255,255,255,0.2)"
              }}
            >
              📋 Compte-rendu
            </button>
          </div>
        </div>
      )}

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card teal">
          <div className="stat-label">Téléconsults ce mois</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">+45% vs mars</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-label">Programmées</div>
          <div className="stat-value">
            {TELECONSULTS.filter((t) => t.statut === "programmé").length}
          </div>
          <div className="stat-sub">aujourd'hui</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Durée moyenne</div>
          <div className="stat-value">21</div>
          <div className="stat-sub">minutes</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Satisfaction</div>
          <div className="stat-value">4.9</div>
          <div className="stat-sub">/ 5 patientes</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Sessions du jour</span>
            <button className="btn btn-primary btn-sm">+ Programmer</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {TELECONSULTS.map((tc) => (
              <div
                key={tc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                <div style={{ textAlign: "center", minWidth: 48 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--rose)",
                      fontFamily: "var(--font-display)"
                    }}
                  >
                    {tc.heure}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>{tc.duree}min</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{tc.patiente}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {tc.motif} · {tc.medecin}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    className={`tag ${tc.statut === "programmé" ? "tag-amber" : "tag-success"}`}
                  >
                    {tc.statut === "programmé" ? "Programmé" : "✓ Terminé"}
                  </span>
                  {tc.statut === "programmé" && (
                    <button className="btn btn-teal btn-sm" onClick={() => startCall(tc)}>
                      Démarrer ▶
                    </button>
                  )}
                  {tc.statut === "terminé" && <button className="btn btn-ghost btn-sm">CR</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Compte-rendu post-consultation</span>
            <span className="ai-badge">✨ IA</span>
          </div>
          <div className="card-body">
            <div className="alert alert-info" style={{ marginBottom: 14 }}>
              L'IA génère automatiquement le compte-rendu à partir de la transcription vocale de la
              consultation.
            </div>
            <div className="form-group">
              <label className="form-label">Consultation — TC-010 · Aminata Diallo</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 120, fontSize: 12 }}
                defaultValue={`Téléconsultation du 28/04/2025 — Suivi grossesse S22

Patiente vue en bonne forme générale. Grossesse évoluant normalement à 22 SA. Pas de contractions ni de métrorragies signalées. Mouvements fœtaux perçus depuis 2 semaines.

Constantes : TA 120/75 mmHg. Poids non mesuré (domicile).

Plan : Écho morphologique T2 à programmer. Maintien sulfate de fer + acide folique. RDV dans 4 semaines.

Dr. Aminata Diallo`}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm">🖨 Imprimer / PDF</button>
              <button className="btn btn-ghost btn-sm">💬 Envoyer patiente</button>
              <button className="btn btn-ghost btn-sm">📋 Archiver dossier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODULE PORTAIL PATIENTE ──
function PortailModule() {
  const [preview, setPreview] = useState("accueil");

  const screens = [
    { id: "accueil", label: "Accueil" },
    { id: "rdv", label: "Prendre RDV" },
    { id: "attente", label: "Ma file" },
    { id: "dossier", label: "Mon dossier" }
  ];

  return (
    <div className="fade-in">
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card rose">
          <div className="stat-label">Patientes inscrites</div>
          <div className="stat-value">{PORTAIL_STATS.inscrits}</div>
          <div className="stat-sub">sur le portail</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Actives ce mois</div>
          <div className="stat-value">{PORTAIL_STATS.actifs_mois}</div>
          <div className="stat-sub">connexions</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">RDV pris en ligne</div>
          <div className="stat-value">{PORTAIL_STATS.rdv_en_ligne}</div>
          <div className="stat-sub">ce mois</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Messages reçus</div>
          <div className="stat-value">{PORTAIL_STATS.messages}</div>
          <div className="stat-sub">ce mois</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Mobile preview */}
        <div>
          <div
            className="card-header"
            style={{ background: "none", border: "none", padding: "0 0 12px" }}
          >
            <span className="card-title">Aperçu — Application patiente</span>
            <div style={{ display: "flex", gap: 6 }}>
              {screens.map((s) => (
                <button
                  key={s.id}
                  className={`btn btn-sm ${preview === s.id ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setPreview(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {/* Phone frame */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 280,
                border: "8px solid #1a1118",
                borderRadius: 36,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
              }}
            >
              {/* Status bar */}
              <div
                style={{
                  background: "var(--rose)",
                  padding: "8px 16px 6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ color: "white", fontSize: 11, fontWeight: 500 }}>9:41</span>
                <span style={{ color: "white", fontSize: 11 }}>●●●</span>
              </div>
              {/* App content */}
              <div style={{ minHeight: 500, background: "var(--surface)" }}>
                {preview === "accueil" && (
                  <div>
                    <div style={{ background: "var(--rose)", padding: "16px", color: "white" }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Bienvenue</div>
                      <div
                        style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}
                      >
                        Clinique Santé Féminine
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                        Dr. Diallo & Dr. Sène
                      </div>
                    </div>
                    <div style={{ padding: "12px" }}>
                      {[
                        {
                          icon: "📅",
                          label: "Prendre un RDV",
                          color: "var(--rose-pale)",
                          border: "var(--rose-light)"
                        },
                        {
                          icon: "⏱",
                          label: "Ma file d'attente",
                          color: "var(--teal-light)",
                          border: "var(--teal)"
                        },
                        {
                          icon: "📋",
                          label: "Mon dossier",
                          color: "var(--amber-light)",
                          border: "var(--amber)"
                        },
                        {
                          icon: "💬",
                          label: "Contacter le cabinet",
                          color: "#f0f9ff",
                          border: "#7dd3fc"
                        },
                        { icon: "✨", label: "Assistant IA", color: "#faf5ff", border: "#c4b5fd" }
                      ].map((item, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setPreview(
                              i === 0
                                ? "rdv"
                                : i === 1
                                  ? "attente"
                                  : i === 2
                                    ? "dossier"
                                    : "accueil"
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "11px 12px",
                            border: `1px solid ${item.border}`,
                            borderRadius: 10,
                            marginBottom: 8,
                            background: item.color,
                            cursor: "pointer"
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{item.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                            {item.label}
                          </span>
                          <span style={{ marginLeft: "auto", color: "var(--ink-muted)" }}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {preview === "rdv" && (
                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 12
                      }}
                    >
                      Prendre rendez-vous
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>Médecin</div>
                      <select className="form-select" style={{ fontSize: 12 }}>
                        <option>Dr. Aminata Diallo</option>
                        <option>Dr. Fatou Sène</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>Service</div>
                      <select className="form-select" style={{ fontSize: 12 }}>
                        <option>Consultation gynécologique</option>
                        <option>Suivi grossesse</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
                        Date souhaitée
                      </div>
                      <input type="date" className="form-input" style={{ fontSize: 12 }} />
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                    >
                      Confirmer →
                    </button>
                  </div>
                )}
                {preview === "attente" && (
                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 12
                      }}
                    >
                      Ma position
                    </div>
                    <div
                      style={{
                        background: "var(--rose)",
                        borderRadius: 16,
                        padding: "24px",
                        textAlign: "center",
                        color: "white",
                        marginBottom: 12
                      }}
                    >
                      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>
                        Votre numéro
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 52,
                          fontWeight: 600,
                          lineHeight: 1
                        }}
                      >
                        3
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 6 }}>
                        2 personnes avant vous
                      </div>
                    </div>
                    <div
                      style={{
                        background: "white",
                        borderRadius: 12,
                        padding: "14px",
                        border: "1px solid var(--line)",
                        marginBottom: 10
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                        Temps d'attente estimé
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 28,
                          fontWeight: 600,
                          color: "var(--amber)"
                        }}
                      >
                        ~34 min
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 4 }}>
                        Mise à jour en temps réel
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--teal-light)",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontSize: 12,
                        color: "var(--teal)"
                      }}
                    >
                      ✓ Vous recevrez un SMS quand c'est votre tour
                    </div>
                  </div>
                )}
                {preview === "dossier" && (
                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 12
                      }}
                    >
                      Mon dossier
                    </div>
                    {[
                      { icon: "📋", label: "Dernière consultation", val: "10 Avril 2025" },
                      { icon: "🤱", label: "Grossesse", val: "24 semaines" },
                      { icon: "💊", label: "Ordonnances actives", val: "2 traitements" },
                      { icon: "🔬", label: "Résultats en attente", val: "Bilan hormonal" },
                      { icon: "📄", label: "Factures", val: "1 impayée" }
                    ].map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 0",
                          borderBottom: "1px solid var(--line)"
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{d.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{d.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{d.val}</div>
                        </div>
                        <span style={{ color: "var(--ink-muted)" }}>›</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Config panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Configuration portail</span>
            </div>
            <div className="card-body">
              {[
                { label: "Prise de RDV en ligne", actif: true },
                { label: "Suivi file d'attente temps réel", actif: true },
                { label: "Accès dossier médical", actif: true },
                { label: "Messagerie sécurisée", actif: true },
                { label: "Paiement en ligne (Wave)", actif: false },
                { label: "Téléconsultation depuis portail", actif: true },
                { label: "Résultats d'examens", actif: true },
                { label: "Ordonnances PDF", actif: true }
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--line)"
                  }}
                >
                  <span style={{ fontSize: 13 }}>{f.label}</span>
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                  >
                    <input type="checkbox" defaultChecked={f.actif} />
                    <span
                      style={{
                        fontSize: 12,
                        color: f.actif ? "var(--success)" : "var(--ink-muted)"
                      }}
                    >
                      {f.actif ? "Actif" : "Inactif"}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Partager le portail</span>
            </div>
            <div className="card-body">
              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginBottom: 10,
                  wordBreak: "break-all"
                }}
              >
                https://santefem.app/portail/clinique-dakar
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm">📋 Copier lien</button>
                <button className="btn btn-ghost btn-sm">📱 QR Code</button>
                <button className="btn btn-ghost btn-sm">💬 WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODULE ÉCRAN SALLE D'ATTENTE ──
function EcranAttenteModule() {
  const [mode, setMode] = useState("preview");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const enCours = QUEUE_INIT.find((p) => p.statut === "en_cours");
  const prochains = QUEUE_INIT.filter((p) => p.statut === "attente" || p.statut === "urgent").slice(
    0,
    4
  );

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <div>
          <div className="alert alert-info" style={{ margin: 0 }}>
            💡 Cet écran est conçu pour être affiché sur une TV en salle d'attente (grand format,
            plein écran).
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          <button
            className={`btn btn-sm ${mode === "preview" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("preview")}
          >
            Aperçu
          </button>
          <button
            className={`btn btn-sm ${mode === "config" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("config")}
          >
            Configuration
          </button>
        </div>
      </div>

      {mode === "preview" && (
        <div
          style={{
            border: "4px solid #1a1118",
            borderRadius: 16,
            overflow: "hidden",
            background: "#0f1117"
          }}
        >
          {/* TV Screen */}
          <div
            style={{
              background: "linear-gradient(135deg, #b5446e 0%, #8c2f52 100%)",
              padding: "20px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
              >
                Clinique Santé Féminine
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "white",
                  fontSize: 26,
                  fontWeight: 600,
                  marginTop: 2
                }}
              >
                Salle d'attente
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "white",
                  fontSize: 36,
                  fontWeight: 600,
                  lineHeight: 1
                }}
              >
                {heure}
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
                Mercredi 30 Avril 2025
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {/* En consultation */}
            <div style={{ padding: "24px 28px", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 16
                }}
              >
                En consultation maintenant
              </div>
              {enCours ? (
                <div
                  style={{
                    background: "rgba(26,127,110,0.2)",
                    border: "1px solid rgba(26,127,110,0.4)",
                    borderRadius: 16,
                    padding: "20px 24px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "rgba(26,127,110,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#5dcaa5"
                      }}
                    >
                      {enCours.num}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 24,
                          fontWeight: 600,
                          color: "white"
                        }}
                      >
                        {enCours.nom}
                      </div>
                      <div style={{ color: "#5dcaa5", fontSize: 13, marginTop: 4 }}>
                        {enCours.motif}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                        {enCours.medecin}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#6b7280", fontSize: 14 }}>Aucune consultation en cours</div>
              )}
            </div>

            {/* Prochains */}
            <div style={{ padding: "24px 28px" }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 16
                }}
              >
                Prochains appels
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {prochains.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 16px",
                      background:
                        p.statut === "urgent" ? "rgba(220,38,38,0.15)" : "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      border:
                        p.statut === "urgent"
                          ? "1px solid rgba(220,38,38,0.3)"
                          : "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          p.statut === "urgent" ? "rgba(220,38,38,0.3)" : "rgba(181,68,110,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        fontWeight: 600,
                        color: p.statut === "urgent" ? "#f87171" : "#e9a0c0",
                        flexShrink: 0
                      }}
                    >
                      {p.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{p.nom}</div>
                      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 1 }}>{p.motif}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          color: p.statut === "urgent" ? "#f87171" : "#fbbf24",
                          fontSize: 13,
                          fontWeight: 500
                        }}
                      >
                        {p.statut === "urgent" ? "URGENT" : "~" + p.attente + " min"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom ticker */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="online-dot" />
              <span style={{ color: "#4ade80", fontSize: 12 }}>Temps réel</span>
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              {prochains.length} patiente(s) en attente · Délai moyen estimé : ~45 minutes · Merci
              de vous munir de votre carte d'assurance
            </div>
          </div>
        </div>
      )}

      {mode === "config" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Configuration de l'affichage</span>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Message d'accueil</label>
                <input className="form-input" defaultValue="Clinique Santé Féminine — Bienvenue" />
              </div>
              <div className="form-group">
                <label className="form-label">Message bas de page</label>
                <input
                  className="form-input"
                  defaultValue="Merci de vous munir de votre carte d'assurance"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Afficher les noms complets</label>
                <select className="form-select">
                  <option>Oui — afficher prénom + nom</option>
                  <option>Non — prénom seulement</option>
                  <option>Non — numéro seulement</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Rafraîchissement automatique</label>
                <select className="form-select">
                  <option>Toutes les 30 secondes</option>
                  <option>Toutes les 60 secondes</option>
                  <option>Toutes les 5 secondes (temps réel)</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn btn-primary">Sauvegarder</button>
              <button className="btn btn-ghost" onClick={() => window.open("", "_blank")}>
                Ouvrir en plein écran ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// PHASE 5 — SAAS, PILOTAGE & CONFORMITÉ
// ════════════════════════════════════════════

// ── DATA PHASE 5 ──
const CABINETS_SAAS = [
  {
    id: 1,
    nom: "Clinique Santé Féminine Dakar",
    ville: "Dakar",
    medecins: 2,
    patientes: 287,
    plan: "Pro",
    mrr: 89000,
    statut: "actif",
    depuis: "2024-01-15",
    backup_derniere: "2025-04-30 06:00"
  },
  {
    id: 2,
    nom: "Cabinet Dr. Ndiaye — Thiès",
    ville: "Thiès",
    medecins: 1,
    patientes: 143,
    plan: "Starter",
    mrr: 45000,
    statut: "actif",
    depuis: "2024-03-01",
    backup_derniere: "2025-04-30 06:00"
  },
  {
    id: 3,
    nom: "Polyclinique Femme & Santé",
    ville: "Saint-Louis",
    medecins: 3,
    patientes: 412,
    plan: "Enterprise",
    mrr: 185000,
    statut: "actif",
    depuis: "2023-11-20",
    backup_derniere: "2025-04-30 06:00"
  },
  {
    id: 4,
    nom: "Cabinet Maternité Ziguinchor",
    ville: "Ziguinchor",
    medecins: 1,
    patientes: 98,
    plan: "Starter",
    mrr: 45000,
    statut: "trial",
    depuis: "2025-04-15",
    backup_derniere: "2025-04-30 06:00"
  },
  {
    id: 5,
    nom: "Centre Gynéco Kaolack",
    ville: "Kaolack",
    medecins: 2,
    patientes: 0,
    plan: "Pro",
    mrr: 0,
    statut: "onboarding",
    depuis: "2025-04-28",
    backup_derniere: "—"
  }
];

const AUDIT_LOG = [
  {
    id: 1,
    date: "2025-04-30 11:42",
    user: "Dr. Diallo",
    action: "Consultation ouverte",
    ressource: "Dossier Aminata Diallo",
    ip: "192.168.1.12"
  },
  {
    id: 2,
    date: "2025-04-30 11:38",
    user: "Secrétaire Faye",
    action: "Facture créée",
    ressource: "F-2025-041",
    ip: "192.168.1.14"
  },
  {
    id: 3,
    date: "2025-04-30 10:55",
    user: "Dr. Sène",
    action: "Ordonnance générée",
    ressource: "Dossier Fatou Sène",
    ip: "192.168.1.13"
  },
  {
    id: 4,
    date: "2025-04-30 10:12",
    user: "Secrétaire Faye",
    action: "Connexion",
    ressource: "—",
    ip: "192.168.1.14"
  },
  {
    id: 5,
    date: "2025-04-30 09:30",
    user: "Dr. Diallo",
    action: "Export dossier",
    ressource: "Dossier Rokhaya Ndiaye (PDF)",
    ip: "192.168.1.12"
  },
  {
    id: 6,
    date: "2025-04-29 18:45",
    user: "Système IA",
    action: "Backup automatique",
    ressource: "Base de données complète",
    ip: "Système"
  }
];

const ROLES_PERMISSIONS = [
  {
    role: "Médecin",
    permissions: ["Dossiers (lecture+écriture)", "Ordonnances", "Téléconsult", "IA médicale"],
    couleur: "rose"
  },
  {
    role: "Sage-femme",
    permissions: [
      "Dossiers grossesse (lecture+écriture)",
      "Ordonnances limitées",
      "IA médicale (lecture)"
    ],
    couleur: "teal"
  },
  {
    role: "Secrétaire",
    permissions: ["Agenda", "File d'attente", "Facturation", "WhatsApp"],
    couleur: "amber"
  },
  { role: "Caissier", permissions: ["Caisse uniquement", "Factures (lecture)"], couleur: "gray" },
  {
    role: "Direction",
    permissions: ["Tout en lecture", "Statistiques", "Personnel", "Comptabilité"],
    couleur: "purple"
  }
];

const ONBOARDING_STEPS = [
  { id: 1, label: "Informations cabinet", done: true, desc: "Nom, adresse, spécialité, logo" },
  { id: 2, label: "Équipe médicale", done: true, desc: "Médecins, rôles, accès" },
  { id: 3, label: "Services & tarifs", done: true, desc: "Grille tarifaire, actes" },
  { id: 4, label: "Assurances partenaires", done: false, desc: "IPM, mutuelles acceptées" },
  { id: 5, label: "Configuration paiements", done: false, desc: "Wave, Orange Money, CB" },
  { id: 6, label: "WhatsApp Business", done: false, desc: "Connexion compte professionnel" },
  { id: 7, label: "Formation équipe", done: false, desc: "Tutoriels, documentation" },
  { id: 8, label: "Mise en ligne", done: false, desc: "Validation & go-live" }
];

// ── MODULE ONBOARDING ──
function OnboardingModule() {
  const [step, setStep] = useState(1);
  const [cabinet, setCabinet] = useState({
    nom: "",
    ville: "Dakar",
    medecins: "1",
    plan: "pro",
    specialite: "Gynécologie-Obstétrique"
  });
  const [done, setDone] = useState(false);

  const completedSteps = ONBOARDING_STEPS.filter((s) => s.done).length;
  const pct = Math.round((completedSteps / ONBOARDING_STEPS.length) * 100);

  const plans = [
    {
      id: "starter",
      nom: "Starter",
      prix: "45 000",
      desc: "1 médecin",
      features: ["Dossiers patientes", "Agenda", "Caisse", "File d'attente", "WhatsApp basique"]
    },
    {
      id: "pro",
      nom: "Pro",
      prix: "89 000",
      desc: "Jusqu'à 3 médecins",
      features: [
        "Tout Starter +",
        "Téléconsultation",
        "IA médicale",
        "Tiers payant",
        "Statistiques avancées"
      ],
      recommande: true
    },
    {
      id: "enterprise",
      nom: "Enterprise",
      prix: "185 000",
      desc: "Illimité",
      features: [
        "Tout Pro +",
        "Multi-sites",
        "API sur mesure",
        "Support dédié",
        "Formation sur place"
      ]
    }
  ];

  if (done)
    return (
      <div
        className="fade-in"
        style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 10
          }}
        >
          Cabinet activé !
        </div>
        <div style={{ fontSize: 15, color: "var(--ink-muted)", marginBottom: 32 }}>
          Le cabinet est opérationnel. L'équipe peut se connecter dès maintenant.
        </div>
        <div className="alert alert-success" style={{ textAlign: "left", marginBottom: 20 }}>
          ✓ Backup automatique configuré · ✓ WhatsApp connecté · ✓ Conformité CDP activée
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => setDone(false)}>
            Voir le tableau de bord
          </button>
          <button className="btn btn-ghost" onClick={() => setStep(1)}>
            Nouveau cabinet
          </button>
        </div>
      </div>
    );

  return (
    <div className="fade-in">
      <div className="grid-2">
        {/* Progress sidebar */}
        <div style={{ maxWidth: 320 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                Progression de l'onboarding
              </div>
              <div className="progress-bar" style={{ height: 8, marginBottom: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: pct + "%", background: "var(--teal)" }}
                />
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 16 }}>
                {pct}% complété · {completedSteps}/{ONBOARDING_STEPS.length} étapes
              </div>
              {ONBOARDING_STEPS.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setStep(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--line)",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: s.done
                        ? "var(--teal)"
                        : step === s.id
                          ? "var(--rose)"
                          : "var(--line)",
                      color: s.done || step === s.id ? "white" : "var(--ink-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 600,
                      flexShrink: 0,
                      marginTop: 1
                    }}
                  >
                    {s.done ? "✓" : s.id}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: step === s.id ? 500 : 400,
                        color: step === s.id ? "var(--rose)" : "var(--ink)"
                      }}
                    >
                      {s.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="alert alert-info">
            <span className="ai-badge">✨ IA</span>
            <div style={{ marginLeft: 8, fontSize: 12 }}>
              Onboarding assisté par IA — Le système configure automatiquement les paramètres
              optimaux selon votre profil de cabinet.
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="card">
          {step === 1 && (
            <>
              <div className="card-header">
                <span className="card-title">Étape 1 — Informations du cabinet</span>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom du cabinet</label>
                    <input
                      className="form-input"
                      placeholder="Ex: Clinique Santé Féminine"
                      value={cabinet.nom}
                      onChange={(e) => setCabinet({ ...cabinet, nom: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ville</label>
                    <select
                      className="form-select"
                      value={cabinet.ville}
                      onChange={(e) => setCabinet({ ...cabinet, ville: e.target.value })}
                    >
                      {[
                        "Dakar",
                        "Thiès",
                        "Saint-Louis",
                        "Ziguinchor",
                        "Kaolack",
                        "Diourbel",
                        "Tambacounda",
                        "Kolda",
                        "Fatick",
                        "Louga",
                        "Matam",
                        "Kaffrine",
                        "Kédougou",
                        "Sédhiou"
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Spécialité</label>
                    <input
                      className="form-input"
                      value={cabinet.specialite}
                      onChange={(e) => setCabinet({ ...cabinet, specialite: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nb. médecins</label>
                    <select
                      className="form-select"
                      value={cabinet.medecins}
                      onChange={(e) => setCabinet({ ...cabinet, medecins: e.target.value })}
                    >
                      {["1", "2", "3", "4", "5+"].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" placeholder="+221 77 000 00 00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="cabinet@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse complète</label>
                  <input className="form-input" placeholder="Rue, quartier, ville" />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 8 }}
                  onClick={() => setStep(2)}
                >
                  Suivant →
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="card-header">
                <span className="card-title">Étape 2 — Choisir un plan</span>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 12,
                    marginBottom: 16
                  }}
                >
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setCabinet({ ...cabinet, plan: p.id })}
                      style={{
                        border: `${cabinet.plan === p.id ? "2px solid var(--rose)" : "1px solid var(--line)"}`,
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        background: cabinet.plan === p.id ? "var(--rose-pale)" : "var(--white)",
                        position: "relative"
                      }}
                    >
                      {p.recommande && (
                        <div
                          style={{
                            position: "absolute",
                            top: -10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--rose)",
                            color: "white",
                            fontSize: 10,
                            padding: "2px 10px",
                            borderRadius: 10,
                            whiteSpace: "nowrap",
                            fontWeight: 500
                          }}
                        >
                          Recommandé
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--ink)",
                          marginBottom: 2
                        }}
                      >
                        {p.nom}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 8 }}>
                        {p.desc}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                          fontWeight: 600,
                          color: cabinet.plan === p.id ? "var(--rose)" : "var(--teal)",
                          marginBottom: 8
                        }}
                      >
                        {p.prix} <span style={{ fontSize: 11, fontWeight: 400 }}>FCFA/mois</span>
                      </div>
                      {p.features.map((f, i) => (
                        <div
                          key={i}
                          style={{ fontSize: 11, color: "var(--ink-soft)", padding: "2px 0" }}
                        >
                          ✓ {f}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>
                    ← Retour
                  </button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>
                    Suivant →
                  </button>
                </div>
              </div>
            </>
          )}
          {step >= 3 && (
            <>
              <div className="card-header">
                <span className="card-title">
                  Étape {step} — {ONBOARDING_STEPS[step - 1]?.label}
                </span>
              </div>
              <div className="card-body">
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  <span className="ai-badge">✨ IA</span>
                  <div style={{ marginLeft: 8, fontSize: 12 }}>
                    L'IA configure automatiquement les paramètres recommandés pour votre type de
                    cabinet. Vous pouvez personnaliser après la mise en ligne.
                  </div>
                </div>
                {step === 3 && (
                  <div>
                    <div style={{ fontSize: 13, marginBottom: 14 }}>
                      Sélectionnez les assurances acceptées :
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        "IPRES",
                        "CSS",
                        "AXA Sénégal",
                        "Allianz Sénégal",
                        "Sanlam",
                        "CNSS",
                        "Mutuelles communautaires"
                      ].map((a, i) => (
                        <label
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            border: "1px solid var(--line)",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 13
                          }}
                        >
                          <input type="checkbox" defaultChecked={i < 4} /> {a}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div>
                    <div style={{ fontSize: 13, marginBottom: 14 }}>
                      Modes de paiement à activer :
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { n: "Wave", c: "#1a56db" },
                        { n: "Orange Money", c: "#f97316" },
                        { n: "Espèces", c: "var(--success)" },
                        { n: "Carte bancaire", c: "#7c3aed" },
                        { n: "Virement", c: "var(--teal)" }
                      ].map((m, i) => (
                        <label
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            border: `1px solid var(--line)`,
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 13
                          }}
                        >
                          <input type="checkbox" defaultChecked={i < 3} />
                          <span style={{ color: m.c, fontWeight: 500 }}>●</span> {m.n}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {step >= 5 && step <= 7 && (
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>
                      Configuration en cours pour :{" "}
                      <strong>{ONBOARDING_STEPS[step - 1]?.label}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.8 }}>
                      {step === 5 &&
                        "Entrez le numéro WhatsApp Business du cabinet pour activer les rappels automatiques, les réponses IA et les notifications aux patientes."}
                      {step === 6 &&
                        "Assignez les rôles à chaque membre de l'équipe. Chaque utilisateur recevra un email d'invitation avec ses accès personnalisés."}
                      {step === 7 &&
                        "Tutoriels disponibles pour chaque rôle. La formation prend en moyenne 45 minutes. Tout est documenté en français."}
                    </div>
                    <div className="form-group" style={{ marginTop: 14 }}>
                      <label className="form-label">
                        {step === 5
                          ? "Numéro WhatsApp Business"
                          : step === 6
                            ? "Email de l'admin"
                            : "Code de validation formation"}
                      </label>
                      <input
                        className="form-input"
                        placeholder={
                          step === 5
                            ? "+221 77 000 00 00"
                            : step === 6
                              ? "admin@cabinet.com"
                              : "Entrez le code reçu par email"
                        }
                      />
                    </div>
                  </div>
                )}
                {step === 8 && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
                      Récapitulatif avant mise en ligne
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginBottom: 16
                      }}
                    >
                      {[
                        { l: "Cabinet", v: cabinet.nom || "Non renseigné" },
                        { l: "Ville", v: cabinet.ville },
                        { l: "Plan", v: plans.find((p) => p.id === cabinet.plan)?.nom },
                        { l: "Médecins", v: cabinet.medecins },
                        { l: "Backup auto", v: "Toutes les 6h ✓" },
                        { l: "Conformité CDP", v: "Activée ✓" },
                        { l: "Chiffrement", v: "AES-256 ✓" },
                        { l: "Mode offline", v: "Activé ✓" }
                      ].map((r, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "8px 12px",
                            background: "var(--surface)",
                            borderRadius: 8,
                            fontSize: 12
                          }}
                        >
                          <span style={{ color: "var(--ink-muted)" }}>{r.l} : </span>
                          <span style={{ fontWeight: 500 }}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    ← Retour
                  </button>
                  {step < 8 ? (
                    <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                      Suivant →
                    </button>
                  ) : (
                    <button
                      className="btn btn-teal"
                      style={{ padding: "9px 24px" }}
                      onClick={() => setDone(true)}
                    >
                      🚀 Mettre en ligne !
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MODULE MULTI-CABINETS ──
function MultiCabinetModule() {
  const [selected, setSelected] = useState(null);

  const totalMRR = CABINETS_SAAS.filter((c) => c.statut === "actif").reduce((s, c) => s + c.mrr, 0);
  const totalPatientes = CABINETS_SAAS.reduce((s, c) => s + c.patientes, 0);
  const totalMedecins = CABINETS_SAAS.reduce((s, c) => s + c.medecins, 0);

  return (
    <div className="fade-in">
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card teal">
          <div className="stat-label">Cabinets actifs</div>
          <div className="stat-value">
            {CABINETS_SAAS.filter((c) => c.statut === "actif").length}
          </div>
          <div className="stat-sub">sur {CABINETS_SAAS.length} total</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-label">MRR total</div>
          <div className="stat-value">{(totalMRR / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA/mois</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Patientes gérées</div>
          <div className="stat-value">{totalPatientes}</div>
          <div className="stat-sub">sur la plateforme</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Médecins actifs</div>
          <div className="stat-value">{totalMedecins}</div>
          <div className="stat-sub">utilisateurs</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cabinets clients</span>
            <button className="btn btn-primary btn-sm">+ Nouveau client</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {CABINETS_SAAS.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  borderBottom: "1px solid var(--line)",
                  cursor: "pointer",
                  background: selected?.id === c.id ? "var(--rose-pale)" : "transparent",
                  transition: "background 0.15s"
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "var(--rose-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--rose)",
                    flexShrink: 0
                  }}
                >
                  {c.nom[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {c.nom}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {c.ville} · {c.medecins} médecin(s) · {c.patientes} patientes
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span
                    className={`tag ${c.statut === "actif" ? "tag-success" : c.statut === "trial" ? "tag-amber" : "tag-gray"}`}
                    style={{ marginBottom: 3, display: "block" }}
                  >
                    {c.statut === "actif" ? "Actif" : c.statut === "trial" ? "Essai" : "Onboarding"}
                  </span>
                  <span
                    className={`tag ${c.plan === "Enterprise" ? "tag-rose" : c.plan === "Pro" ? "tag-teal" : "tag-gray"}`}
                    style={{ fontSize: 10 }}
                  >
                    {c.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selected ? (
            <div className="card fade-in">
              <div
                className="dossier-header"
                style={{ borderRadius: "var(--radius) var(--radius) 0 0" }}
              >
                <div className="dossier-avatar">{selected.nom[0]}</div>
                <div style={{ flex: 1 }}>
                  <div className="dossier-name" style={{ fontSize: 16 }}>
                    {selected.nom}
                  </div>
                  <div className="dossier-meta">
                    {selected.ville} · Plan {selected.plan} · Depuis {selected.depuis}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                    marginBottom: 14
                  }}
                >
                  {[
                    { l: "MRR", v: (selected.mrr / 1000).toFixed(0) + "k FCFA", c: "var(--teal)" },
                    { l: "Patientes", v: selected.patientes, c: "var(--rose)" },
                    { l: "Médecins", v: selected.medecins, c: "var(--amber)" }
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--surface)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        textAlign: "center"
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                          fontWeight: 600,
                          color: s.c
                        }}
                      >
                        {s.v}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
                  Dernier backup :{" "}
                  <strong style={{ color: "var(--success)" }}>{selected.backup_derniere}</strong>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost btn-sm">📊 Rapport</button>
                  <button className="btn btn-ghost btn-sm">⚙ Config</button>
                  <button className="btn btn-ghost btn-sm">📞 Support</button>
                  <button className="btn btn-primary btn-sm">Accéder →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <div className="empty-icon">🏥</div>
                  <p>Sélectionnez un cabinet pour voir les détails</p>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <span className="card-title">Revenus SaaS</span>
              <span className="ai-badge">✨ IA</span>
            </div>
            <div className="card-body">
              {[
                { plan: "Starter (45k)", nb: 2, total: 90000, pct: 24 },
                { plan: "Pro (89k)", nb: 2, total: 178000, pct: 47 },
                { plan: "Enterprise (185k)", nb: 1, total: 185000, pct: 49 }
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 4
                    }}
                  >
                    <span>
                      {r.plan} · {r.nb} cabinet(s)
                    </span>
                    <span style={{ fontWeight: 500, color: "var(--teal)" }}>
                      {r.total.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: r.pct + "%", background: "var(--teal)" }}
                    />
                  </div>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
                <span>MRR Total</span>
                <span
                  style={{ color: "var(--teal)", fontFamily: "var(--font-display)", fontSize: 18 }}
                >
                  {totalMRR.toLocaleString()} FCFA
                </span>
              </div>
              <div className="alert alert-success" style={{ marginTop: 12, fontSize: 11 }}>
                ✨ IA : À ce rythme (+2 clients/mois), vous atteignez 10M FCFA MRR dans 18 mois.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODULE SÉCURITÉ & CDP ──
function SecuriteModule() {
  const [backupStatus, setBackupStatus] = useState("ok");
  const [runningBackup, setRunningBackup] = useState(false);

  const lancerBackup = () => {
    setRunningBackup(true);
    setTimeout(() => {
      setRunningBackup(false);
      setBackupStatus("ok");
    }, 3000);
  };

  return (
    <div className="fade-in">
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card success">
          <div className="stat-label">Dernier backup</div>
          <div className="stat-value">6h</div>
          <div className="stat-sub">il y a</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Chiffrement</div>
          <div className="stat-value">AES</div>
          <div className="stat-sub">256 bits</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-label">Conformité CDP</div>
          <div className="stat-value">✓</div>
          <div className="stat-sub">Certifiée</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Accès actifs</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">utilisateurs</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Backup & sécurité */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Sauvegarde des données</span>
            </div>
            <div className="card-body">
              <div
                style={{
                  background: "var(--success-light)",
                  border: "1px solid #6ee7b7",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <span style={{ fontSize: 28 }}>✓</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--success)" }}>
                    Données sécurisées
                  </div>
                  <div style={{ fontSize: 11, color: "var(--success)", opacity: 0.8 }}>
                    Dernier backup : Aujourd'hui à 06:00 · Stockage cloud chiffré
                  </div>
                </div>
              </div>
              {[
                { label: "Backup automatique toutes les 6h", actif: true },
                { label: "Backup avant chaque mise à jour", actif: true },
                { label: "Rétention 90 jours", actif: true },
                { label: "Réplication multi-région", actif: false }
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--line)"
                  }}
                >
                  <span style={{ fontSize: 13 }}>{b.label}</span>
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                  >
                    <input type="checkbox" defaultChecked={b.actif} />
                    <span
                      style={{
                        fontSize: 12,
                        color: b.actif ? "var(--success)" : "var(--ink-muted)"
                      }}
                    >
                      {b.actif ? "Actif" : "Inactif"}
                    </span>
                  </label>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 14 }}
                onClick={lancerBackup}
                disabled={runningBackup}
              >
                {runningBackup ? "⏳ Backup en cours..." : "↻ Lancer backup maintenant"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Chiffrement & sécurité</span>
            </div>
            <div className="card-body">
              {[
                { l: "Données au repos", v: "AES-256 ✓", c: "var(--success)" },
                { l: "Données en transit", v: "TLS 1.3 ✓", c: "var(--success)" },
                { l: "Mots de passe", v: "Bcrypt ✓", c: "var(--success)" },
                { l: "Tokens API", v: "JWT RS256 ✓", c: "var(--success)" },
                { l: "2FA médecins", v: "Activé ✓", c: "var(--success)" },
                { l: "Accès IP whitelist", v: "Configuré", c: "var(--amber)" }
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--line)",
                    fontSize: 13
                  }}
                >
                  <span>{s.l}</span>
                  <span style={{ fontWeight: 500, color: s.c }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CDP + Rôles + Audit */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ border: "2px solid var(--rose-light)" }}>
            <div className="card-header">
              <span className="card-title">Conformité CDP Sénégal</span>
              <span className="tag tag-success">✓ Conforme</span>
            </div>
            <div className="card-body">
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  marginBottom: 14,
                  lineHeight: 1.6
                }}
              >
                La Commission des Données Personnelles (CDP) du Sénégal — Loi n°2008-12 sur la
                protection des données personnelles.
              </div>
              {[
                { l: "Déclaration CDP effectuée", done: true },
                { l: "Consentement explicite patientes", done: true },
                { l: "Droit d'accès aux données", done: true },
                { l: "Droit à l'effacement (droit à l'oubli)", done: true },
                { l: "Durée de conservation limitée (10 ans)", done: true },
                { l: "Désignation d'un DPO", done: false },
                { l: "Registre des traitements", done: true },
                { l: "Notification violations sous 72h", done: true }
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 0",
                    borderBottom: "1px solid var(--line)"
                  }}
                >
                  <span style={{ fontSize: 14, color: r.done ? "var(--success)" : "var(--amber)" }}>
                    {r.done ? "✓" : "⚠"}
                  </span>
                  <span style={{ fontSize: 12, color: r.done ? "var(--ink)" : "var(--amber)" }}>
                    {r.l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Rôles & droits d'accès</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {ROLES_PERMISSIONS.map((r, i) => (
                <div
                  key={i}
                  style={{ padding: "11px 16px", borderBottom: "1px solid var(--line)" }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}
                  >
                    <span
                      className={`tag tag-${r.couleur === "purple" ? "rose" : r.couleur === "gray" ? "gray" : r.couleur}`}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      {r.role}
                    </span>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                      Modifier
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {r.permissions.slice(0, 2).join(" · ")}
                    {r.permissions.length > 2 ? ` + ${r.permissions.length - 2} autres` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Journal d'audit */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">Journal d'audit — Traçabilité complète</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="ai-badge">✨ IA</span>
            <button className="btn btn-ghost btn-sm">⬇ Exporter</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & heure</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Ressource</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-muted)" }}>
                    {l.date}
                  </td>
                  <td className="name" style={{ fontSize: 12 }}>
                    {l.user}
                  </td>
                  <td style={{ fontSize: 12 }}>{l.action}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-muted)" }}>{l.ressource}</td>
                  <td style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-muted)" }}>
                    {l.ip}
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

// ── MODULE ADMINISTRATION SAAS ──
function SaasAdminModule() {
  const mrr = CABINETS_SAAS.filter((c) => c.statut === "actif").reduce((s, c) => s + c.mrr, 0);
  const arr = mrr * 12;

  return (
    <div className="fade-in">
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <span className="ai-badge">✨ IA</span>
        <div style={{ marginLeft: 8, fontSize: 12 }}>
          Tableau de bord SaaS — Vue globale de votre activité. L'IA analyse les tendances et vous
          suggère des actions pour accélérer la croissance.
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 20 }}
      >
        <div className="stat-card teal">
          <div className="stat-label">MRR</div>
          <div className="stat-value">{(mrr / 1000).toFixed(0)}k</div>
          <div className="stat-sub">FCFA/mois</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-label">ARR</div>
          <div className="stat-value">{(arr / 1000000).toFixed(1)}M</div>
          <div className="stat-sub">FCFA/an</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Churn rate</div>
          <div className="stat-value">0%</div>
          <div className="stat-sub">ce mois</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">NPS Score</div>
          <div className="stat-value">72</div>
          <div className="stat-sub">Excellent</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pipeline commercial</span>
            <button className="btn btn-primary btn-sm">+ Prospect</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {[
              { stage: "Essai gratuit", nb: 2, valeur: 90000, color: "var(--amber)" },
              { stage: "Démo planifiée", nb: 3, valeur: 267000, color: "var(--rose)" },
              { stage: "Proposition envoyée", nb: 2, valeur: 274000, color: "var(--teal)" },
              { stage: "Négociation", nb: 1, valeur: 185000, color: "#7c3aed" },
              { stage: "Clients actifs", nb: 4, valeur: mrr, color: "var(--success)" }
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: s.color,
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.stage}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: s.color }}>
                    {s.nb} cabinet(s)
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                    {s.valeur.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Insights IA croissance</span>
              <span className="ai-badge">✨ IA</span>
            </div>
            <div className="card-body">
              <div className="alert alert-success" style={{ marginBottom: 10 }}>
                📈{" "}
                <div>
                  <strong>Tendance :</strong> 2 nouveaux clients/mois. À ce rythme : 10 clients =
                  890k FCFA MRR dans 3 mois.
                </div>
              </div>
              <div className="alert alert-info" style={{ marginBottom: 10 }}>
                🎯{" "}
                <div>
                  <strong>Opportunité :</strong> 3 cabinets à Thiès et 2 à Ziguinchor sont actifs
                  sur Facebook et non digitalisés. Cibler maintenant.
                </div>
              </div>
              <div className="alert alert-warning">
                ⚠{" "}
                <div>
                  <strong>Attention :</strong> Cabinet Maternité Ziguinchor (essai) n'a pas connecté
                  WhatsApp. Risque de non-conversion. Relancer sous 48h.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Santé technique</span>
            </div>
            <div className="card-body">
              {[
                { l: "Uptime plateforme", v: "99.97%", c: "var(--success)" },
                { l: "Latence API moyenne", v: "142ms", c: "var(--success)" },
                { l: "Backups actifs", v: "5/5 ✓", c: "var(--success)" },
                { l: "Erreurs (24h)", v: "0", c: "var(--success)" },
                { l: "Utilisateurs connectés", v: "12", c: "var(--teal)" },
                { l: "Mode offline actif", v: "3 cabinets", c: "var(--teal)" }
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 0",
                    borderBottom: "1px solid var(--line)",
                    fontSize: 12
                  }}
                >
                  <span style={{ color: "var(--ink-muted)" }}>{s.l}</span>
                  <span style={{ fontWeight: 500, color: s.c }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">Feuille de route produit</span>
          <span className="ai-badge">✨ IA priorise</span>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              {
                titre: "En cours",
                color: "var(--teal)",
                items: ["Phase 5 — SaaS complet", "Intégration Wave API", "Mode offline robuste"]
              },
              {
                titre: "Prochain sprint",
                color: "var(--amber)",
                items: [
                  "App mobile native",
                  "Intégration SNPS Sénégal",
                  "Wolof dans l'interface patiente",
                  "API laboratoires partenaires"
                ]
              },
              {
                titre: "Roadmap 6 mois",
                color: "var(--rose)",
                items: [
                  "Expansion Côte d'Ivoire",
                  "Module radiologie",
                  "IA prédictive pathologies",
                  "Marketplace modules"
                ]
              }
            ].map((col, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: col.color,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: col.color,
                      display: "inline-block"
                    }}
                  />
                  {col.titre}
                </div>
                {col.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 12,
                      color: "var(--ink-soft)",
                      padding: "6px 10px",
                      background: "var(--surface)",
                      borderRadius: 6,
                      marginBottom: 6,
                      borderLeft: `3px solid ${col.color}`
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE TITLES ──
const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  queue: "File d'attente",
  calendar: "Rendez-vous",
  patients: "Dossiers patientes",
  ai: "Assistant IA",
  invoice: "Factures & devis",
  cash: "Caisse",
  tiers_payant: "Tiers payant & IPM",
  comptabilite: "Comptabilité",
  stocks: "Stocks & consommables",
  personnel: "Gestion du personnel",
  teleconsult: "Téléconsultation",
  whatsapp: "WhatsApp & SMS",
  portail: "Portail patiente",
  ecran_attente: "Écran salle d'attente",
  stats: "Statistiques & IA",
  fiscal: "Rapports fiscaux",
  onboarding: "Onboarding cabinet",
  multi_cabinet: "Multi-cabinets",
  securite: "Sécurité & conformité CDP",
  saas_admin: "Administration SaaS"
};

// ── APP ──
function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard setActive={setPage} queueData={QUEUE_INIT} rdvToday={RDV_TODAY} />;
      case "queue":
        return <QueueModule initialQueue={QUEUE_INIT} />;
      case "calendar":
        return <CalendarModule rdvToday={RDV_TODAY} />;
      case "patients":
        return <PatientsModule />;
      case "ai":
        return <AIModule aiProxyUrl={AI_PROXY_URL} aiResponses={AI_RESPONSES} />;
      case "invoice":
        return <InvoiceModule factures={FACTURES} />;
      case "cash":
        return <CaisseModule patientes={PATIENTES} factures={FACTURES} />;
      case "tiers_payant":
        return <TiersPayantModule />;
      case "comptabilite":
        return <ComptabiliteModule ecrituresCompta={ECRITURES_COMPTA} moisData={MOIS_DATA} />;
      case "stocks":
        return <StocksModule stocks={STOCKS} />;
      case "personnel":
        return <PersonnelModule personnel={PERSONNEL} />;
      case "teleconsult":
        return <TeleconsultModule />;
      case "whatsapp":
        return (
          <WhatsAppModule aiProxyUrl={AI_PROXY_URL} waMessages={WA_MESSAGES} campagnes={CAMPAGNES} />
        );
      case "portail":
        return <PortailModule />;
      case "ecran_attente":
        return <EcranAttenteModule />;
      case "stats":
        return <StatsModule />;
      case "fiscal":
        return <FiscalModule />;
      case "onboarding":
        return <OnboardingModule />;
      case "multi_cabinet":
        return <MultiCabinetModule />;
      case "securite":
        return <SecuriteModule />;
      case "saas_admin":
        return <SaasAdminModule />;
      default:
        return <Dashboard setActive={setPage} queueData={QUEUE_INIT} rdvToday={RDV_TODAY} />;
    }
  };

  return (
    <>
      <Sidebar active={page} setActive={setPage} Icon={Icon} />
      <div className="main-layout">
        <div className="topbar">
          <h1 className="topbar-title">{PAGE_TITLES[page] || "SantéFem Pro"}</h1>
          <div className="topbar-actions">
            <button className="btn btn-ghost btn-sm">🔔</button>
            <button className="btn btn-ghost btn-sm">💬 WhatsApp</button>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("queue")}>
              <span className="online-dot" style={{ marginRight: 4 }} /> File d'attente (6)
            </button>
          </div>
        </div>
        <div className="page-content">{renderPage()}</div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
