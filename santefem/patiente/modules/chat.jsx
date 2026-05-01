import React, { useEffect, useRef, useState } from "react";

const AI_FALLBACK = [
  {
    k: "douleur",
    r: "Des douleurs légères peuvent être normales pendant la grossesse. Cependant, si la douleur est intense, accompagnée de saignements ou de fièvre, consultez votre médecin en urgence. 🏥"
  },
  {
    k: "nausée|vomissement",
    r: "Les nausées sont très fréquentes, surtout au 1er trimestre. Conseils : mangez en petites quantités, souvent. Le gingembre peut aider. Si vous ne pouvez plus rien avaler, consultez. 🫚"
  },
  {
    k: "bébé|mouvement|bouge",
    r: "À 24 SA, les mouvements fœtaux sont bien présents ! Vous devriez sentir votre bébé bouger régulièrement. Si vous ne sentez plus de mouvement pendant 24h, contactez votre médecin. 🤱"
  },
  {
    k: "tension|hypertension",
    r: "Votre dernière tension était normale (120/75). Pendant la grossesse, une tension supérieure à 140/90 nécessite une consultation urgente car elle peut indiquer une prééclampsie. ⚠"
  },
  {
    k: "fer|anémie",
    r: "Votre dernier bilan montrait une légère anémie (Hb 10.2). Continuez votre sulfate de fer quotidiennement, de préférence avec du jus d'orange (vitamine C) qui améliore l'absorption. 💊"
  },
  {
    k: "alimentation|manger|régime",
    r: "Pendant la grossesse, privilégiez : légumes verts (folates), viandes (fer), produits laitiers (calcium), poissons gras (oméga-3). Évitez : poissons crus, charcuterie, alcool, fromages non pasteurisés. 🥗"
  },
  {
    k: "sport|exercice|activité",
    r: "L'activité physique modérée est bénéfique pendant la grossesse ! La marche, la natation et le yoga prénatal sont excellents. Évitez les sports de contact et les efforts intenses. 🚶‍♀️"
  },
  {
    k: "rendez-vous|rdv|consultation",
    r: "Votre prochain rendez-vous est le Mercredi 30 Avril à 08h30 avec Dr. Diallo pour votre suivi S24. Souhaitez-vous le modifier ou avez-vous des questions à préparer ? 📅"
  }
];

function getAIResponse(text) {
  const lower = text.toLowerCase();
  for (const item of AI_FALLBACK) {
    if (new RegExp(item.k).test(lower)) return item.r;
  }
  if (/urgence|saignement|fort|intense|grave|aide/.test(lower)) {
    return "⚠️ Si vous décrivez une urgence médicale, veuillez appeler le cabinet immédiatement au +221 77 000 00 00 ou vous rendre aux urgences les plus proches. Votre sécurité est prioritaire.";
  }
  return "Bonne question ! Pour vous donner une réponse personnalisée et fiable, je vous recommande d'en parler directement avec Dr. Diallo lors de votre prochain rendez-vous le 30 Avril. En cas d'urgence, appelez le +221 77 000 00 00. 💬";
}

export function PageChat({ aiProxyUrl }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour Aminata ! 👋 Je suis votre assistante santé IA. Je suis disponible 24h/24 pour répondre à vos questions sur votre grossesse, vos médicaments, vos examens ou vos rendez-vous.\n\nComment puis-je vous aider aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const txt = input.trim();
    if (!txt) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: txt }]);
    setLoading(true);
    try {
      const res = await fetch(aiProxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system:
            "Tu es une assistante santé virtuelle pour la Clinique Santé Féminine au Sénégal. Tu aides Aminata Diallo, 28 ans, enceinte de 24 semaines (terme prévu le 15 août 2025), avec une légère anémie (Hb 10.2), allergie à la pénicilline, sous sulfate de fer + acide folique. Tu réponds en français, de façon chaleureuse, rassurante et concise (max 4 phrases). Tu ne fais jamais de diagnostic. En cas d'urgence tu orientes immédiatement vers le médecin ou les urgences.",
          messages: [{ role: "user", content: txt }]
        })
      });
      const data = await res.json();
      setLoading(false);
      setMessages((m) => [...m, { role: "bot", text: data.content?.[0]?.text || getAIResponse(txt) }]);
    } catch {
      setLoading(false);
      setMessages((m) => [...m, { role: "bot", text: getAIResponse(txt) }]);
    }
  };

  const quickQ = [
    "C'est quoi la prééclampsie ?",
    "Mon bébé bouge peu",
    "Puis-je voyager en avion ?",
    "Quand faire l'écho T2 ?",
    "Aliments à éviter ?"
  ];

  return (
    <>
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18
            }}
          >
            ✨
          </div>
          <div>
            <div className="header-title" style={{ fontSize: 15 }}>
              Assistante IA Santé
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}>
              <span className="online-dot" style={{ width: 6, height: 6 }} />
              Disponible 24h/24
            </div>
          </div>
        </div>
      </div>

      <div className="page page-full fade-in">
        <div className="chat-wrap">
          <div className="chat-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`bubble-row ${m.role === "bot" ? "bot" : "mine"}`}>
                {m.role === "bot" && <div className="bot-avatar">✨</div>}
                <div className="bubble" style={{ whiteSpace: "pre-wrap" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="bubble-row bot">
                <div className="bot-avatar">✨</div>
                <div className="bubble">
                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="quick-chips">
            {quickQ.map((q, i) => (
              <button
                key={i}
                className="qchip"
                onClick={() => {
                  setInput(q);
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chat-input-bar">
            <input
              className="chat-input"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="send-btn" onClick={send} disabled={loading}>
              ➤
            </button>
          </div>
        </div>

        <div style={{ padding: "10px 14px 0", fontSize: 11, color: "var(--ink-muted)", textAlign: "center" }}>
          ⚠ En cas d'urgence : appelez le +221 77 000 00 00
        </div>
      </div>
    </>
  );
}
