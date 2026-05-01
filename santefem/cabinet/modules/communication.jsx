import React, { useEffect, useRef, useState } from "react";

export function AIModule({ aiProxyUrl, aiResponses }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour Docteure ! Je suis votre assistant IA médical. Je peux vous aider à analyser des symptômes, générer des ordonnances, résumer des dossiers ou répondre à vos questions cliniques."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollBottom, [messages]);

  const getAIResponse = async (text) => {
    try {
      const response = await fetch(aiProxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "Tu es un assistant médical IA pour un cabinet de gynécologie au Sénégal. Tu aides les médecins avec des suggestions cliniques, résumés de dossiers, aide à la rédaction d'ordonnances et informations médicales. Tu réponds toujours en français de manière professionnelle et concise. Tu rappelles toujours que tes suggestions doivent être validées par le médecin.",
          messages: [{ role: "user", content: text }]
        })
      });
      const data = await response.json();
      return data.content?.[0]?.text || "Je n'ai pas pu traiter votre demande.";
    } catch (_e) {
      const lower = text.toLowerCase();
      if (lower.includes("symptôme") || lower.includes("diagnostic")) return aiResponses.symptome;
      if (lower.includes("ordonnance")) return aiResponses.ordonnance;
      if (lower.includes("grossesse")) return aiResponses.grossesse;
      if (lower.includes("résumé") || lower.includes("dossier")) return aiResponses.résumé;
      return aiResponses.default;
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: txt }]);
    setLoading(true);
    const reply = await getAIResponse(txt);
    setLoading(false);
    setMessages((m) => [...m, { role: "bot", text: reply }]);
  };

  const quickActions = [
    "Résumer le dossier d'Aminata Diallo",
    "Générer ordonnance grossesse S24",
    "Diagnostics douleurs pelviennes",
    "Protocole suivi grossesse"
  ];

  return (
    <div className="fade-in">
      <div className="grid-2">
        <div style={{ gridColumn: "1/-1" }}>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <span className="ai-badge">✨ IA Claude</span>
            <div style={{ marginLeft: 8, fontSize: 12 }}>
              Assistant médical alimenté par Claude (Anthropic). Toutes les suggestions doivent être
              validées par le médecin avant application.
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "1/-1" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="card-title">Assistant IA Médical</span>
              <span className="ai-badge">✨ Claude</span>
            </div>
          </div>
          <div className="chat-wrap">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  {m.role === "bot" && <div className="chat-avatar">IA</div>}
                  <div className="chat-bubble" style={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg bot">
                  <div className="chat-avatar">IA</div>
                  <div className="chat-bubble">
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                borderTop: "1px solid var(--line)"
              }}
            >
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setInput(a);
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                className="form-input"
                placeholder="Posez une question médicale, demandez un résumé, une ordonnance..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button className="btn btn-primary" onClick={send} disabled={loading}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppModule({ aiProxyUrl, waMessages, campagnes }) {
  const [activeContact, setActiveContact] = useState(
    waMessages.find((m) => m.direction === "in" && m.statut === "non_lu") || waMessages[0]
  );
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState(waMessages);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("conversations");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact, messages]);

  const contacts = [...new Map(messages.map((m) => [m.tel, m])).values()];
  const contactMsgs = messages.filter((m) => m.tel === activeContact?.tel);
  const nonLus = messages.filter((m) => m.direction === "in" && m.statut === "non_lu").length;

  const sendWA = async () => {
    if (!newMsg.trim()) return;
    const txt = newMsg.trim();
    setNewMsg("");
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        patiente: activeContact.patiente,
        tel: activeContact.tel,
        type: "reponse",
        message: txt,
        statut: "envoyé",
        heure: "Maintenant",
        direction: "out"
      }
    ]);
    setLoading(true);
    try {
      const res = await fetch(aiProxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system:
            "Tu es l'assistante virtuelle de la Clinique Santé Féminine au Sénégal. Tu réponds aux messages WhatsApp des patientes de façon brève, professionnelle et bienveillante. Maximum 3 phrases. Tu réponds toujours en français.",
          messages: [
            {
              role: "user",
              content: `Message de la patiente ${activeContact.patiente}: "${txt}". Génère une réponse courte et professionnelle.`
            }
          ]
        })
      });
      const data = await res.json();
      const reply =
        data.content?.[0]?.text ||
        "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.";
      setTimeout(() => {
        setLoading(false);
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            patiente: activeContact.patiente,
            tel: activeContact.tel,
            type: "ia_reponse",
            message: `[Suggestion IA] ${reply}`,
            statut: "brouillon",
            heure: "Maintenant",
            direction: "out_draft"
          }
        ]);
      }, 1200);
    } catch {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Bonjour ! Quel est votre motif de consultation ?",
    "Votre RDV est confirmé.",
    "Nous vous rappelons dans la journée.",
    "Oui, le jeûne n'est pas nécessaire."
  ];

  return (
    <div className="fade-in">
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
          ["conversations", "Conversations" + (nonLus > 0 ? ` (${nonLus})` : "")],
          ["campagnes", "Campagnes & relances"],
          ["rappels", "Rappels automatiques"]
        ].map(([id, label]) => (
          <div
            key={id}
            className={`dossier-tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </div>
        ))}
      </div>

      {tab === "conversations" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            border: "1px solid var(--line)",
            borderRadius: "0 var(--radius) var(--radius) var(--radius)",
            overflow: "hidden",
            background: "var(--white)",
            minHeight: 500
          }}
        >
          <div style={{ borderRight: "1px solid var(--line)", overflow: "auto" }}>
            <div
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid var(--line)",
                background: "var(--surface)"
              }}
            >
              <input
                className="form-input"
                style={{ fontSize: 12, padding: "6px 10px" }}
                placeholder="Rechercher..."
              />
            </div>
            {contacts.map((c) => {
              const lastMsg = [...messages].filter((m) => m.tel === c.tel).pop();
              const unread = messages.filter(
                (m) => m.tel === c.tel && m.direction === "in" && m.statut === "non_lu"
              ).length;
              return (
                <div
                  key={c.tel}
                  onClick={() => setActiveContact(c)}
                  style={{
                    padding: "12px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--line)",
                    background: activeContact?.tel === c.tel ? "var(--rose-pale)" : "transparent",
                    transition: "background 0.15s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: unread > 0 ? 600 : 500,
                        color: "var(--ink)"
                      }}
                    >
                      {c.patiente}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--ink-muted)" }}>{lastMsg?.heure}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--ink-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 160
                      }}
                    >
                      {lastMsg?.direction === "in" ? "" : "Vous: "}
                      {lastMsg?.message?.substring(0, 40)}...
                    </span>
                    {unread > 0 && (
                      <span
                        style={{
                          background: "var(--teal)",
                          color: "white",
                          borderRadius: "50%",
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 600,
                          flexShrink: 0
                        }}
                      >
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                background: "var(--white)",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                {activeContact?.patiente
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{activeContact?.patiente}</div>
                <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{activeContact?.tel}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-sm">📋 Dossier</button>
                <button className="btn btn-teal btn-sm">📞 Appeler</button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#f0ece8",
                minHeight: 240
              }}
            >
              {contactMsgs.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.direction === "in" ? "flex-start" : "flex-end"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "72%",
                      padding: "9px 13px",
                      borderRadius: 16,
                      fontSize: 12,
                      lineHeight: 1.5,
                      background:
                        m.direction === "in"
                          ? "white"
                          : m.direction === "out_draft"
                            ? "#fef3c7"
                            : "#25d366",
                      color:
                        m.direction === "in"
                          ? "var(--ink)"
                          : m.direction === "out_draft"
                            ? "var(--amber)"
                            : "white",
                      borderBottomLeftRadius: m.direction === "in" ? 4 : 16,
                      borderBottomRightRadius: m.direction === "out" ? 4 : 16,
                      border: m.direction === "out_draft" ? "1px dashed var(--amber)" : "none"
                    }}
                  >
                    {m.direction === "out_draft" && (
                      <div style={{ fontSize: 10, marginBottom: 4, fontWeight: 500 }}>
                        ✨ Suggestion IA — cliquez pour envoyer
                      </div>
                    )}
                    {m.message}
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, textAlign: "right" }}>
                      {m.heure} {m.direction !== "in" && "✓✓"}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      background: "white",
                      padding: "10px 14px",
                      borderRadius: 16,
                      borderBottomLeftRadius: 4
                    }}
                  >
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                background: "var(--surface)"
              }}
            >
              {quickReplies.map((r, i) => (
                <button
                  key={i}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11 }}
                  onClick={() => setNewMsg(r)}
                >
                  {r.substring(0, 30)}...
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 8
              }}
            >
              <input
                className="form-input"
                placeholder="Message WhatsApp..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendWA()}
              />
              <button className="btn btn-primary btn-sm" onClick={sendWA} style={{ whiteSpace: "nowrap" }}>
                ✨ IA + Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "campagnes" && (
        <div className="card" style={{ borderRadius: "0 var(--radius) var(--radius) var(--radius)" }}>
          <div className="card-header">
            <span className="card-title">Campagnes de communication</span>
            <button className="btn btn-primary btn-sm">+ Nouvelle campagne</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campagne</th>
                  <th>Cible</th>
                  <th>Destinataires</th>
                  <th>Canal</th>
                  <th>Date</th>
                  <th>Taux lecture</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {campagnes.map((c) => (
                  <tr key={c.id}>
                    <td className="name">{c.titre}</td>
                    <td style={{ fontSize: 12, color: "var(--ink-muted)" }}>{c.cible}</td>
                    <td style={{ fontWeight: 500 }}>{c.nb_destinataires}</td>
                    <td>
                      <span className="tag tag-teal">{c.canal}</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{c.date}</td>
                    <td>
                      {c.taux_ouverture ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div
                              className="progress-fill"
                              style={{ width: c.taux_ouverture + "%", background: "var(--teal)" }}
                            />
                          </div>
                          <span style={{ fontWeight: 500, color: "var(--teal)", fontSize: 12 }}>
                            {c.taux_ouverture}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "var(--ink-muted)", fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`tag ${c.statut === "envoyé" ? "tag-success" : "tag-amber"}`}>
                        {c.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "rappels" && (
        <div className="card" style={{ borderRadius: "0 var(--radius) var(--radius) var(--radius)" }}>
          <div className="card-header">
            <span className="card-title">Rappels automatiques IA</span>
            <span className="ai-badge">✨ IA</span>
          </div>
          <div className="card-body">
            {[
              {
                titre: "Rappel RDV J-1",
                desc: "Envoyé automatiquement la veille de chaque rendez-vous",
                canal: "WhatsApp + SMS",
                actif: true,
                nb_envois_mois: 42
              },
              {
                titre: "Rappel RDV J-7",
                desc: "Rappel 1 semaine avant pour les RDV programmés",
                canal: "WhatsApp",
                actif: true,
                nb_envois_mois: 38
              },
              {
                titre: "Relance patiente perdue de vue",
                desc: "Patientes sans visite depuis plus de 6 mois",
                canal: "SMS",
                actif: true,
                nb_envois_mois: 8
              },
              {
                titre: "Relance impayés",
                desc: "J+3, J+7, J+30 après la facture",
                canal: "WhatsApp + SMS",
                actif: true,
                nb_envois_mois: 5
              },
              {
                titre: "Rappel prise médicaments",
                desc: "Patientes avec ordonnance active (grossesse, pilule...)",
                canal: "SMS",
                actif: false,
                nb_envois_mois: 0
              },
              {
                titre: "Résultats disponibles",
                desc: "Notification automatique quand résultats uploadés",
                canal: "WhatsApp",
                actif: true,
                nb_envois_mois: 12
              }
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{r.titre}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{r.desc}</div>
                  <div style={{ fontSize: 11, color: "var(--teal)", marginTop: 2 }}>
                    Canal : {r.canal} · {r.nb_envois_mois} envois ce mois
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                    marginLeft: 14
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      fontSize: 12
                    }}
                  >
                    <input type="checkbox" defaultChecked={r.actif} /> Actif
                  </label>
                  <button className="btn btn-ghost btn-sm">Config.</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
