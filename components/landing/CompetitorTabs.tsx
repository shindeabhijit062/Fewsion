'use client';

import { useState } from 'react';
import { COMPETITORS } from './content';

// Global platforms / Indian players / the gap Fewsion fills, as switchable tables.
export default function CompetitorTabs() {
  const [active, setActive] = useState(COMPETITORS.tabs[0].id);
  const tab = COMPETITORS.tabs.find((t) => t.id === active) ?? COMPETITORS.tabs[0];

  return (
    <div className="fx-compare" data-reveal="1">
      <div className="fx-compare__tabs" role="tablist" aria-label="Compare Fewsion">
        {COMPETITORS.tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`fx-tab-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={`fx-panel-${t.id}`}
            className="fx-compare__tab"
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="fx-compare__panel" role="tabpanel" id={`fx-panel-${tab.id}`} aria-labelledby={`fx-tab-${tab.id}`} key={tab.id}>
        <div className="fx-compare__scroll">
          <table className="fx-table" data-cols={tab.head.length}>
            <thead>
              <tr>
                {tab.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tab.rows.map((row, ri) => {
                const ours = ri === tab.rows.length - 1;
                return (
                  <tr key={row[0]} data-ours={ours ? '' : undefined}>
                    {row.map((cell, ci) => {
                      const tick = cell.startsWith('✓');
                      const cross = cell.startsWith('✗');
                      return ci === 0 ? (
                        <th key={ci} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={ci} data-mark={tick ? 'yes' : cross ? 'no' : undefined}>
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
