import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BottomNav, NotifModal } from "./modules/layout";
import { PageChat } from "./modules/chat";
import { PageAccueil, PageQueue } from "./modules/pages";
import { PageRDV, PageDossier as PageDossierModule } from "./modules/records";
const AI_PROXY_URL = window.__AI_PROXY_URL__ || "http://localhost:8787/api/ai/message";

// ── MOCK DATA ──
const PATIENTE = {
  id: 1,
  prenom: "Aminata",
  nom: "Diallo",
  age: 28,
  tel: "+221 77 432 11 23",
  assurance: "IPRES",
  groupe_sanguin: "A+",
  allergies: "Pénicilline",
  statut: "grossesse",
  semaines: 24,
  terme: "15 Août 2025",
  medecin: "Dr. Aminata Diallo",
  cabinet: "Clinique Santé Féminine Dakar",
  numero_queue: 3,
  rdv_prochain: {
    date: "Mercredi 30 Avril",
    heure: "08:30",
    medecin: "Dr. Diallo",
    motif: "Suivi grossesse S24"
  }
};

const RDV_LIST = [
  {
    id: 1,
    date: "Mer 30 Avril",
    heure: "08:30",
    medecin: "Dr. Diallo",
    motif: "Suivi grossesse S24",
    statut: "confirmé"
  },
  {
    id: 2,
    date: "Mer 28 Mai",
    heure: "10:00",
    medecin: "Dr. Diallo",
    motif: "Écho morphologique T2",
    statut: "programmé"
  },
  {
    id: 3,
    date: "Mer 25 Juin",
    heure: "09:00",
    medecin: "Dr. Diallo",
    motif: "Suivi grossesse S32",
    statut: "programmé"
  }
];

const EXAMS = [
  {
    id: 1,
    date: "10/04/2025",
    type: "Échographie obstétricale",
    resultat: "Normale — développement fœtal conforme",
    statut: "normal",
    medecin: "Dr. Diallo"
  },
  {
    id: 2,
    date: "20/03/2025",
    type: "NFS + Bilan martial",
    resultat: "Hb 10.2 g/dL — légère anémie ⚠",
    statut: "anormal",
    medecin: "Dr. Diallo"
  },
  {
    id: 3,
    date: "14/02/2025",
    type: "Frottis cervical",
    resultat: "Absence de lésion — HPV négatif",
    statut: "normal",
    medecin: "Dr. Sène"
  }
];

const ORDONNANCES = [
  {
    id: 1,
    date: "10/04/2025",
    medecin: "Dr. Diallo",
    medicaments: [
      { nom: "Sulfate de fer 80mg", posologie: "1 comprimé/jour — 3 mois" },
      { nom: "Acide folique 5mg", posologie: "1 comprimé/jour" },
      { nom: "Vitamine C 500mg", posologie: "1 comprimé/jour" }
    ]
  },
  {
    id: 2,
    date: "14/02/2025",
    medecin: "Dr. Sène",
    medicaments: [
      { nom: "Métronidazole 500mg", posologie: "2×/jour — 7 jours" },
      { nom: "Probiotiques", posologie: "1 gélule/jour" }
    ]
  }
];

const FACTURES = [
  {
    id: "F-2025-040",
    date: "10/04/2025",
    actes: "Suivi grossesse + Échographie",
    montant: 45000,
    statut: "payé",
    mode: "Espèces"
  },
  {
    id: "F-2025-035",
    date: "20/03/2025",
    actes: "NFS + Bilan martial",
    montant: 35000,
    statut: "payé",
    mode: "Wave"
  },
  {
    id: "F-2025-028",
    date: "14/02/2025",
    actes: "Consultation + Frottis",
    montant: 33000,
    statut: "payé",
    mode: "Orange Money"
  }
];

const HISTORIQUE = [
  {
    date: "10/04/2025",
    type: "Consultation",
    notes: "Suivi grossesse S20 — Écho normale, poids OK (+6kg), tension 120/75",
    medecin: "Dr. Diallo"
  },
  {
    date: "20/03/2025",
    type: "Examen",
    notes: "NFS et bilan martial — Anémie légère Hb 10.2. Traitement prescrit.",
    medecin: "Dr. Diallo"
  },
  {
    date: "14/02/2025",
    type: "Consultation",
    notes: "Grossesse confirmée à 8 SA. DPA calculée : 15 août 2025.",
    medecin: "Dr. Sène"
  },
  {
    date: "10/01/2025",
    type: "Consultation",
    notes: "Consultation préconceptionnelle. Bilan de base demandé.",
    medecin: "Dr. Sène"
  }
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "rdv",
    msg: "Rappel : RDV demain à 08h30 avec Dr. Diallo",
    heure: "Hier 18:00",
    lu: false
  },
  {
    id: 2,
    type: "resultat",
    msg: "Vos résultats d'échographie sont disponibles",
    heure: "10/04 14:22",
    lu: true
  },
  {
    id: 3,
    type: "conseil",
    msg: "✨ Conseil IA : À 24 SA, pensez à dormir sur le côté gauche pour améliorer la circulation.",
    heure: "Auj. 08:00",
    lu: false
  },
  {
    id: 4,
    type: "medicament",
    msg: "Rappel : Prenez votre sulfate de fer ce soir avec un verre de jus d'orange.",
    heure: "Auj. 20:00",
    lu: false
  }
];

const QUEUE_DATA = {
  mon_numero: 3,
  en_cours: 1,
  avant_moi: 2,
  temps_estime: 34,
  medecin: "Dr. Diallo"
};

// ── COMPONENTS ──

// ── APP ──
function App() {
  const [page, setPage] = useState("accueil");
  const [notifOpen, setNotifOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Login screen
  if (!authed)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--rose)"
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            gap: 0
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 16 }}>🌸</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 600,
              color: "white",
              marginBottom: 4
            }}
          >
            SantéFem
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 40 }}>
            Votre espace santé féminine
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "var(--white)",
              borderRadius: "var(--radius)",
              padding: 24
            }}
          >
            {loginStep === 1 ? (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 4
                  }}
                >
                  Se connecter
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 18 }}>
                  Entrez votre numéro de téléphone
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button
                  className="btn-full"
                  onClick={() => setLoginStep(2)}
                  disabled={phone.length < 8}
                >
                  Recevoir le code SMS →
                </button>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 14,
                    fontSize: 12,
                    color: "var(--ink-muted)"
                  }}
                >
                  Première visite ? Connectez-vous avec le numéro fourni à l'accueil.
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 4
                  }}
                >
                  Code de vérification
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 18 }}>
                  Code envoyé au {phone || "+221 77 432 11 23"}
                </div>
                <div className="form-group">
                  <label className="form-label">Code à 6 chiffres</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ letterSpacing: "0.3em", fontSize: 22, textAlign: "center" }}
                  />
                </div>
                <button className="btn-full" onClick={() => setAuthed(true)}>
                  Valider et accéder →
                </button>
                <button
                  className="btn-full ghost"
                  style={{ marginTop: 10 }}
                  onClick={() => setLoginStep(1)}
                >
                  ← Retour
                </button>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            fontSize: 12,
            color: "rgba(255,255,255,0.6)"
          }}
        >
          Clinique Santé Féminine · Dakar, Sénégal
        </div>
      </div>
    );

  const renderPage = () => {
    switch (page) {
      case "accueil":
        return (
          <PageAccueil
            setPage={setPage}
            setNotifOpen={setNotifOpen}
            patiente={PATIENTE}
            queueData={QUEUE_DATA}
            notifications={NOTIFICATIONS}
          />
        );
      case "queue":
        return <PageQueue queueData={QUEUE_DATA} patiente={PATIENTE} />;
      case "rdv":
        return <PageRDV rdvList={RDV_LIST} patiente={PATIENTE} />;
      case "dossier":
        return (
          <PageDossierModule
            patiente={PATIENTE}
            exams={EXAMS}
            ordonnances={ORDONNANCES}
            factures={FACTURES}
            historique={HISTORIQUE}
          />
        );
      case "chat":
        return <PageChat aiProxyUrl={AI_PROXY_URL} />;
      default:
        return (
          <PageAccueil
            setPage={setPage}
            setNotifOpen={setNotifOpen}
            patiente={PATIENTE}
            queueData={QUEUE_DATA}
            notifications={NOTIFICATIONS}
          />
        );
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {notifOpen && <NotifModal onClose={() => setNotifOpen(false)} notifications={NOTIFICATIONS} />}
      {renderPage()}
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
