import React from "react";

export function BottomNav({ page, setPage }) {
  const items = [
    { id: "accueil", ico: "🏠", lbl: "Accueil" },
    { id: "queue", ico: "⏱", lbl: "Ma file" },
    { id: "rdv", ico: "📅", lbl: "RDV" },
    { id: "dossier", ico: "📋", lbl: "Dossier" },
    { id: "chat", ico: "✨", lbl: "IA" }
  ];
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`nav-btn${page === it.id ? " active" : ""}`}
          onClick={() => setPage(it.id)}
        >
          <div className="nav-ico">{it.ico}</div>
          <div className="nav-lbl">{it.lbl}</div>
        </button>
      ))}
    </nav>
  );
}

export function NotifModal({ onClose, notifications }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,17,24,0.5)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
      }}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius) var(--radius) 0 0",
          padding: 20,
          maxHeight: "70vh",
          overflow: "auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>
            Notifications
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        {notifications.map((n, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid var(--line)",
              opacity: n.lu ? 0.6 : 1
            }}
          >
            <div style={{ fontSize: 24, flexShrink: 0 }}>
              {n.type === "rdv"
                ? "📅"
                : n.type === "resultat"
                  ? "🔬"
                  : n.type === "conseil"
                    ? "✨"
                    : "💊"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: n.lu ? 400 : 500, lineHeight: 1.4 }}>{n.msg}</div>
              <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 3 }}>{n.heure}</div>
            </div>
            {!n.lu && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--rose)",
                  flexShrink: 0,
                  marginTop: 4
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
