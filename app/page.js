"use client";

import { useEffect, useMemo, useState } from "react";

const KEY_ENTRIES = "cdj.entries";

// Local-only Verse of the Day (safe MVP):
// Option B: rotate a curated list by day-of-year.
// Later we can swap to YouVersion or admin set.
const VERSES = [
  { ref: "Psalm 46:1 (ESV)", url: "https://www.bible.com/bible/59/PSA.46.1.ESV" },
  { ref: "Psalm 121:1–2 (ESV)", url: "https://www.bible.com/bible/59/PSA.121.1-2.ESV" },
  { ref: "Matthew 6:33 (ESV)", url: "https://www.bible.com/bible/59/MAT.6.33.ESV" },
  { ref: "1 Peter 5:7 (ESV)", url: "https://www.bible.com/bible/59/1PE.5.7.ESV" },
  { ref: "John 15:5 (ESV)", url: "https://www.bible.com/bible/59/JHN.15.5.ESV" },
  { ref: "Romans 12:2 (ESV)", url: "https://www.bible.com/bible/59/ROM.12.2.ESV" }
];

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

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
  const [tab, setTab] = useState("Journal"); // Journal | Entries | Prompts | Settings
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const votd = useMemo(() => {
    const idx = dayOfYear() % VERSES.length;
    return VERSES[idx];
  }, []);

  function finish() {
    if (!text.trim()) return;
    saveEntry(text.trim());
    setEntries(loadEntries());
    setText("");
    setTab("Entries");
  }

  return (
    <div className="dash">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar glass">
        <div className="sideTitle">Coram Deo</div>
        <div className="sideSub">Live before the face of God.</div>

        <nav className="nav">
          {["Journal", "Entries", "Prompts", "Settings"].map((t) => (
            <button
              key={t}
              className={"navItem " + (tab === t ? "active" : "")}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="sideFoot muted2">
          Boundary: this tool does not diagnose or speak for God. It points you back to Scripture and community.
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BANNER */}
        <section className="banner glass">
          <div className="bannerBg" />
          <div className="bannerInner">
            <div className="brandRow">
              <div className="brandBig">CORAM DEO</div>
              <div className="votd">
                <div className="muted2 small">Verse of the day</div>
                <div className="vref">
                  {votd.ref}{" "}
                  <a href={votd.url} target="_blank" rel="noreferrer">
                    Read
                  </a>
                </div>
              </div>
            </div>
            <div className="muted2">
              A quiet place to lay down the load—then let Scripture lead.
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {tab === "Journal" && (
          <section className="panel glass">
            <div className="panelHead">
              <div>
                <div className="h2">Today’s Journal</div>
                <div className="muted2">
                  Write it straight. No performing. Bring what’s true into the light.
                </div>
              </div>
              <button className="btn primary" onClick={finish}>Finish</button>
            </div>

            <div className="glass-inner pad">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What are you carrying today?"
              />
              <div className="chips" style={{ marginTop: 12 }}>
                {[
                  "I feel…",
                  "I’m tempted to…",
                  "I’m avoiding…",
                  "I need to confess…",
                  "Lord, help me trust You with…"
                ].map((c) => (
                  <button
                    key={c}
                    className="chip"
                    onClick={() => setText((prev) => (prev ? prev + "\n\n" + c : c))}
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "Entries" && (
          <section className="panel glass">
            <div className="panelHead">
              <div>
                <div className="h2">Recent Entries</div>
                <div className="muted2">Local to this browser for now.</div>
              </div>
              <button className="btn" onClick={() => setTab("Journal")}>New</button>
            </div>

            <div className="glass-inner pad">
              {entries.length === 0 ? (
                <div className="muted2">No entries yet.</div>
              ) : (
                entries.slice(0, 20).map((e) => (
                  <div key={e.id} className="entry">
                    <div className="small muted2">{new Date(e.createdAt).toLocaleString()}</div>
                    <div className="entryText">{e.text}</div>
                    <div className="divider" />
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {tab === "Prompts" && (
          <section className="panel glass">
            <div className="panelHead">
              <div>
                <div className="h2">Prompts</div>
                <div className="muted2">Truth-first prompts—no fluff.</div>
              </div>
            </div>

            <div className="glass-inner pad">
              <div className="promptGrid">
                {[
                  { title: "Refuge", verse: "Psalm 46:1", text: "Where are you seeking refuge besides God?" },
                  { title: "Worry", verse: "Matthew 6", text: "What are you trying to control today?" },
                  { title: "Confession", verse: "1 John 1:9", text: "What needs to come into the light?" }
                ].map((p) => (
                  <button key={p.title} className="promptCard" onClick={() => { setTab("Journal"); setText(`${p.text}\n\n(${p.verse})`); }}>
                    <div className="promptTitle">{p.title}</div>
                    <div className="small muted2">{p.verse}</div>
                    <div className="promptBody">{p.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "Settings" && (
          <section className="panel glass">
            <div className="panelHead">
              <div>
                <div className="h2">Settings</div>
                <div className="muted2">Keep it simple. Keep it clean.</div>
              </div>
            </div>

            <div className="glass-inner pad">
              <div className="muted2">
                Later: translation options (ESV default), verse source integration, cloud sync.
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
