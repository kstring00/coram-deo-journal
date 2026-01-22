"use client";

import { useEffect, useState } from "react";

const KEY_ENTRIES = "cdj.entries";

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(KEY_ENTRIES)) || [];
  } catch {
    return [];
  }
}

function saveEntry(text) {
  const entries = loadEntries();
  entries.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    text
  });
  localStorage.setItem(KEY_ENTRIES, JSON.stringify(entries));
}

export default function Page() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  function finish() {
    if (!text.trim()) return;
    saveEntry(text.trim());
    setEntries(loadEntries());
    setText("");
  }

  return (
    <>
      <div className="topbar">
        <div className="brand">
          Coram Deo Journal <span className="pill">Local MVP</span>
        </div>
      </div>

      <div className="card">
        <div className="h1">Bring what you’re carrying into the light.</div>
        <div className="muted">
          Write freely. This space is meant to help you lay things before God.
        </div>

        <div style={{ marginTop: 16 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pour it out. Keep it honest."
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={finish}>
            Finish
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="small muted"><b>Recent entries</b></div>
        <div className="divider"></div>
        {entries.length === 0 ? (
          <div className="muted">No entries yet.</div>
        ) : (
          entries.map(e => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div className="small muted">
                {new Date(e.createdAt).toLocaleString()}
              </div>
              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                {e.text}
              </div>
              <div className="divider"></div>
            </div>
          ))
        )}
      </div>

      <div className="footer-note">
        Boundary: This is a journaling aid. It does not diagnose or speak for God.
        Christ alone heals (John 15:5).
      </div>
    </>
  );
}
