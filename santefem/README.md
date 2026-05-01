# SantéFem Pro — Code Source Complet

## Solution de gestion cabinet gynécologique · Sénégal

---

## CONTENU DU PACKAGE

```
santefem/
├── cabinet/              ← PWA Cabinet (médecins & admin)
│   ├── index.html
│   ├── app.jsx           ← 3 051 lignes — 20 modules
│   ├── style.css
│   └── manifest.json
│
├── patiente/             ← PWA Patiente (mobile)
│   ├── index.html
│   ├── app.jsx           ← 804 lignes — 5 écrans
│   ├── style.css
│   └── manifest.json
│
├── presentation.html     ← Site vitrine + chatbot IA
├── vercel.json           ← Config déploiement
├── package.json
└── README.md
```

---

## CE QUI EST INCLUS ✓

### Interface complète (frontend)

- PWA Cabinet : 20 modules sur 5 phases
- PWA Patiente : 5 écrans mobile-first
- Page de présentation avec chatbot Claude
- Design system complet (couleurs, typographie, composants)
- Manifests PWA installables sur Android & iPhone

### Modules Cabinet inclus

Phase 1 : Tableau de bord · File d'attente · Agenda · Dossiers · Caisse · Assistant IA
Phase 2 : Transcription vocale · Ordonnances IA · Résumé dossier · Aide diagnostic
Phase 3 : Factures · Tiers payant · Comptabilité · Stocks · Personnel · Rapports fiscaux
Phase 4 : Téléconsultation · WhatsApp · Portail patiente · Écran salle d'attente
Phase 5 : Onboarding · Multi-cabinets · Sécurité CDP · Admin SaaS

### IA Claude intégrée (fonctionne réellement)

- Assistant médical connecté à l'API Claude
- Chatbot commercial sur la page de présentation

---

## CE QUI RESTE À CONSTRUIRE ✗

Pour passer de la démo au produit en production :

1. **Authentification** (Firebase Auth)
   - Comptes cabinets · Login · Rôles médecin/secrétaire/patiente
2. **Base de données réelle** (Cloud Firestore)
   - Remplacer les données fictives par des données persistantes
   - Synchronisation temps réel entre appareils
3. **Isolation multi-cabinet**
   - Chaque cabinet voit uniquement ses données
4. **Paiements Wave & Orange Money**
   - Boutons présents — à connecter aux vraies API
5. **WhatsApp Business API**
   - Interface présente — à connecter à Meta API
6. **SMS OTP patientes**
   - Login patiente par code SMS (Africa's Talking)
7. **Notifications push** (Firebase Cloud Messaging)
   - Rappels RDV, tour d'attente
8. **Génération PDF**
   - Ordonnances et factures imprimables (Cloud Functions)
9. **Backup automatique** (Cloud Storage)

---

## LANCEMENT RAPIDE (démo)

```bash
# Installer un serveur local
npm install -g serve

# Lancer
serve . -p 3000

# Accès :
# Présentation  → http://localhost:3000/presentation.html
# PWA Cabinet   → http://localhost:3000/cabinet/
# PWA Patiente  → http://localhost:3000/patiente/
```

---

## DÉPLOIEMENT PRODUCTION (Firebase)

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialiser
firebase init hosting

# Déployer
firebase deploy
```

### Variables d'environnement requises

```env
ANTHROPIC_API_KEY=sk-ant-...        # Claude API
FIREBASE_API_KEY=...                # Firebase
WAVE_API_KEY=...                    # Wave Sénégal
ORANGE_MONEY_CLIENT_ID=...          # Orange Money
WHATSAPP_TOKEN=...                  # WhatsApp Business
AFRICAS_TALKING_API_KEY=...         # SMS OTP
```

---

## ARCHITECTURE CIBLE (Google Cloud)

```
Firebase Hosting    → PWA Cabinet + PWA Patiente + Présentation
Firebase Auth       → Authentification + rôles
Cloud Firestore     → Base de données temps réel
Cloud Storage       → PDF, ordonnances, résultats labo
Cloud Run           → API backend Node.js
Cloud Functions     → Rappels SMS, notifications, backup
Secret Manager      → Clés API sécurisées
Vertex AI / Claude  → IA médicale
```

---

## MODÈLE TARIFAIRE SAAS

| Plan       | Prix              | Inclus                     |
| ---------- | ----------------- | -------------------------- |
| Starter    | 45 000 FCFA/mois  | 1 médecin, modules de base |
| Pro        | 89 000 FCFA/mois  | 3 médecins, IA complète    |
| Enterprise | 185 000 FCFA/mois | Illimité, multi-sites      |

---

## SPÉCIALITÉS SUPPORTÉES

- ✓ Gynécologie & Obstétrique (100% prêt)
- ~ Médecine générale (75% prêt — 3 ajustements)
- ~ Pédiatrie (60% prêt — modules croissance/vaccins à ajouter)

---

_SantéFem Pro v1.0 · Dakar, Sénégal · Conformité CDP loi n°2008-12_
