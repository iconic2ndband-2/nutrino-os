/* FILE: nitrorace.pass.ui.js — UI for Season 1 Pass, Battle Pass Track, Missions, and Garage */
(function() {
  let activeTab = 'pass'; // 'pass' | 'missions' | 'garage'
  let garageCategory = 'car'; // 'car' | 'paint' | 'underglow' | 'trail' | 'title'
  let previewAnimId = null;
  let previewScene = null, previewCamera = null, previewRenderer = null, previewCarGroup = null;

  function render(container, onClose) {
    if (!container) return;
    const pState = window.nitroracePass.getState();
    const info = window.nitroracePass.SEASON_INFO;
    const progressPercent = Math.min(100, Math.round((pState.xp / info.xpPerTier) * 100));

    container.innerHTML = `
      <div class="nr-pass-overlay" style="position:absolute;inset:0;background:radial-gradient(circle at top, #1e1b4b 0%, #090514 100%);color:#fff;display:flex;flex-direction:column;z-index:30;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;">
        <!-- Top Navigation Bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(15,23,42,0.85);border-bottom:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(8px);">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">🏆</span>
            <div>
              <div style="font-size:14px;font-weight:900;letter-spacing:0.5px;background:linear-gradient(90deg,#38bdf8,#ec4899,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                SEASON 1: NEON VELOCITY
              </div>
              <div style="font-size:10px;color:#94a3b8;display:flex;gap:6px;align-items:center;">
                <span>⏳ ${info.endDateText}</span>
                <span>•</span>
                <span style="color:${pState.isPremium ? '#fbbf24' : '#94a3b8'};font-weight:700;">
                  ${pState.isPremium ? '★ PREMIUM PASS ACTIVE (+25% XP)' : 'FREE PASS'}
                </span>
              </div>
            </div>
          </div>
          <button id="nr-pass-close-btn" class="btn-secondary" style="font-size:12px;padding:6px 12px;border-radius:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;cursor:pointer;">✕ Close</button>
        </div>

        <!-- Season Header Progress Banner -->
        <div style="padding:10px 16px;background:rgba(30,27,75,0.6);border-bottom:1px solid rgba(255,255,255,0.08);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:240px;">
            <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#f43f5e,#ec4899);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(244,63,94,0.5);border:1px solid rgba(255,255,255,0.3);">
              <span style="font-size:8px;font-weight:800;color:rgba(255,255,255,0.8);line-height:1;">TIER</span>
              <span style="font-size:16px;font-weight:900;color:#fff;line-height:1;">${pState.tier}</span>
            </div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;margin-bottom:3px;">
                <span>Tier Progression</span>
                <span style="color:#38bdf8;">${pState.tier >= info.totalTiers ? 'MAX TIER' : `${pState.xp} / ${info.xpPerTier} XP`}</span>
              </div>
              <div style="width:100%;height:8px;background:rgba(255,255,255,0.12);border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
                <div style="width:${pState.tier >= info.totalTiers ? 100 : progressPercent}%;height:100%;background:linear-gradient(90deg,#06b6d4,#3b82f6,#ec4899);border-radius:4px;transition:width 0.3s ease;"></div>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:6px;align-items:center;">
            ${!pState.isPremium ? `
              <button id="nr-pass-buy-premium-btn" style="background:linear-gradient(90deg,#f59e0b,#ec4899);color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;box-shadow:0 0 10px rgba(245,158,11,0.5);display:flex;align-items:center;gap:4px;">
                <span>👑 GET PREMIUM PASS ($15)</span>
              </button>
            ` : `
              <div style="background:rgba(234,179,8,0.15);border:1px solid #eab308;color:#facc15;padding:5px 10px;border-radius:6px;font-size:10px;font-weight:800;">
                ✓ PREMIUM PASS OWNED
              </div>
            `}
            ${pState.tier < info.totalTiers ? `
              <button id="nr-pass-buy-tier-btn" style="background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;padding:7px 10px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
                + Skip Tier ($2)
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Main Tab Navigation -->
        <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(15,23,42,0.5);">
          <button id="nr-tab-btn-pass" style="flex:1;padding:10px 4px;font-size:12px;font-weight:800;border:none;background:${activeTab === 'pass' ? 'rgba(56,189,248,0.15)' : 'transparent'};color:${activeTab === 'pass' ? '#38bdf8' : '#94a3b8'};border-bottom:${activeTab === 'pass' ? '2px solid #38bdf8' : '2px solid transparent'};cursor:pointer;">
            🏆 REWARDS TRACK (20 TIERS)
          </button>
          <button id="nr-tab-btn-missions" style="flex:1;padding:10px 4px;font-size:12px;font-weight:800;border:none;background:${activeTab === 'missions' ? 'rgba(56,189,248,0.15)' : 'transparent'};color:${activeTab === 'missions' ? '#38bdf8' : '#94a3b8'};border-bottom:${activeTab === 'missions' ? '2px solid #38bdf8' : '2px solid transparent'};cursor:pointer;">
            🎯 SEASON MISSIONS
          </button>
          <button id="nr-tab-btn-garage" style="flex:1;padding:10px 4px;font-size:12px;font-weight:800;border:none;background:${activeTab === 'garage' ? 'rgba(56,189,248,0.15)' : 'transparent'};color:${activeTab === 'garage' ? '#38bdf8' : '#94a3b8'};border-bottom:${activeTab === 'garage' ? '2px solid #38bdf8' : '2px solid transparent'};cursor:pointer;">
            🚗 SEASON GARAGE
          </button>
        </div>

        <!-- Tab Content Body -->
        <div id="nr-pass-tab-content" style="flex:1;overflow-y:auto;padding:14px;position:relative;">
          ${renderActiveTabContent(pState, info)}
        </div>
      </div>
    `;

    bindEvents(container, onClose);
    if (activeTab === 'garage') {
      initGarage3DPreview(container);
    }
  }

  function renderActiveTabContent(pState, info) {
    if (activeTab === 'pass') {
      return renderTiersTrack(pState, info);
    } else if (activeTab === 'missions') {
      return renderMissions(pState);
    } else if (activeTab === 'garage') {
      return renderGarage(pState);
    }
    return '';
  }

  function renderTiersTrack(pState, info) {
    const tiers = window.nitroracePass.TIERS;

    return `
      <div style="max-width:850px;margin:0 auto;">
        <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
          <span>Earn XP by racing, collecting coins, and completing Season Missions to unlock rewards!</span>
          <span style="color:#f59e0b;font-weight:700;">★ 20 Epic Tiers</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          ${tiers.map(t => {
            const isUnlocked = pState.tier >= t.tier;
            const isCurrent = pState.tier === t.tier;
            const freeClaimed = pState.claimedFree.includes(t.tier);
            const premClaimed = pState.claimedPremium.includes(t.tier);

            return `
              <div style="background:rgba(255,255,255,${isCurrent ? '0.08' : '0.03'});border:1px solid ${isCurrent ? '#38bdf8' : 'rgba(255,255,255,0.08)'};border-radius:12px;padding:12px;display:grid;grid-template-columns:50px 1fr 1fr;gap:12px;align-items:center;box-shadow:${isCurrent ? '0 0 12px rgba(56,189,248,0.2)' : 'none'};">
                <!-- Tier Badge -->
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:${isUnlocked ? '#3b82f6' : 'rgba(255,255,255,0.08)'};border-radius:8px;padding:8px 4px;text-align:center;">
                  <span style="font-size:9px;font-weight:800;color:rgba(255,255,255,0.8);">TIER</span>
                  <span style="font-size:16px;font-weight:900;color:#fff;">${t.tier}</span>
                  <span style="font-size:8px;color:${isUnlocked ? '#a7f3d0' : '#94a3b8'};font-weight:700;margin-top:2px;">
                    ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <!-- Free Reward Card -->
                <div style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="font-size:24px;width:36px;height:36px;background:rgba(255,255,255,0.05);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                      ${t.free.icon}
                    </div>
                    <div>
                      <div style="font-size:9px;color:#94a3b8;font-weight:800;letter-spacing:0.5px;">FREE REWARD</div>
                      <div style="font-size:12px;font-weight:800;color:#fff;">${t.free.name}</div>
                      <div style="font-size:10px;color:#64748b;">${t.free.desc}</div>
                    </div>
                  </div>
                  <div>
                    ${freeClaimed ? `
                      <span style="font-size:10px;color:#10b981;font-weight:800;background:rgba(16,185,129,0.15);padding:4px 8px;border-radius:6px;">✓ CLAIMED</span>
                    ` : (isUnlocked ? `
                      <button class="nr-claim-btn" data-tier="${t.tier}" data-type="free" style="background:#10b981;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">
                        CLAIM
                      </button>
                    ` : `
                      <span style="font-size:10px;color:#64748b;font-weight:700;">🔒 Tier ${t.tier}</span>
                    `)}
                  </div>
                </div>

                <!-- Premium Reward Card -->
                <div style="background:linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(236,72,153,0.12) 100%);border:1px solid ${pState.isPremium ? '#eab308' : 'rgba(234,179,8,0.3)'};border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="font-size:24px;width:36px;height:36px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                      ${t.premium.icon}
                    </div>
                    <div>
                      <div style="font-size:9px;color:#fbbf24;font-weight:800;letter-spacing:0.5px;">★ PREMIUM PASS</div>
                      <div style="font-size:12px;font-weight:800;color:#fef08a;">${t.premium.name}</div>
                      <div style="font-size:10px;color:#cbd5e1;">${t.premium.desc}</div>
                    </div>
                  </div>
                  <div>
                    ${premClaimed ? `
                      <span style="font-size:10px;color:#facc15;font-weight:800;background:rgba(250,204,21,0.15);padding:4px 8px;border-radius:6px;">✓ CLAIMED</span>
                    ` : (isUnlocked && pState.isPremium ? `
                      <button class="nr-claim-btn" data-tier="${t.tier}" data-type="premium" style="background:linear-gradient(90deg,#f59e0b,#ec4899);color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">
                        CLAIM
                      </button>
                    ` : (isUnlocked && !pState.isPremium ? `
                      <button class="nr-prem-unlock-btn" style="background:rgba(234,179,8,0.2);border:1px solid #eab308;color:#facc15;padding:5px 8px;border-radius:6px;font-size:10px;font-weight:800;cursor:pointer;">
                        👑 GET PASS
                      </button>
                    ` : `
                      <span style="font-size:10px;color:#64748b;font-weight:700;">🔒 Tier ${t.tier}</span>
                    `))}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderMissions(pState) {
    const missions = pState.missions || [];

    return `
      <div style="max-width:700px;margin:0 auto;">
        <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:16px;">
          <h3 style="font-size:15px;font-weight:900;color:#38bdf8;margin-bottom:4px;">🎯 Season 1 Mission Board</h3>
          <p style="font-size:11px;color:#94a3b8;">Complete challenges during your runs to level up your Season 1 Battle Pass tiers instantly!</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          ${missions.map(m => {
            const pct = Math.min(100, Math.round((m.current / m.target) * 100));
            return `
              <div style="background:rgba(255,255,255,0.04);border:1px solid ${m.completed ? (m.claimed ? 'rgba(255,255,255,0.08)' : '#10b981') : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-size:13px;font-weight:800;color:#fff;">${m.name}</span>
                    <span style="background:rgba(56,189,248,0.15);color:#38bdf8;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;">+${m.rewardXP} XP</span>
                  </div>
                  <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">${m.desc}</div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                      <div style="width:${pct}%;height:100%;background:${m.completed ? '#10b981' : '#38bdf8'};border-radius:3px;"></div>
                    </div>
                    <span style="font-size:10px;font-weight:700;color:#cbd5e1;">${m.current} / ${m.target} ${m.unit}</span>
                  </div>
                </div>

                <div>
                  ${m.claimed ? `
                    <span style="font-size:10px;color:#64748b;font-weight:700;background:rgba(255,255,255,0.05);padding:4px 8px;border-radius:6px;">✓ CLAIMED</span>
                  ` : (m.completed ? `
                    <button class="nr-mission-claim-btn" data-id="${m.id}" style="background:#10b981;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 0 8px rgba(16,185,129,0.5);">
                      CLAIM XP
                    </button>
                  ` : `
                    <span style="font-size:10px;color:#94a3b8;font-weight:700;">IN PROGRESS</span>
                  `)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderGarage(pState) {
    const cars = window.nitroraceGarage.CARS;
    const paints = window.nitroraceGarage.PAINTS;
    const underglows = window.nitroraceGarage.UNDERGLOWS;
    const trails = window.nitroraceGarage.TRAILS;
    const titles = pState.unlockedTitles || ['Highway Rookie'];

    return `
      <div style="max-width:850px;margin:0 auto;display:flex;flex-direction:column;gap:14px;">
        <!-- 3D Car Turntable Display -->
        <div style="background:#0a0e1a;border:1px solid rgba(255,255,255,0.12);border-radius:14px;overflow:hidden;position:relative;height:200px;display:flex;align-items:center;justify-content:center;">
          <div id="nr-garage-preview-box" style="width:100%;height:100%;"></div>
          <div style="position:absolute;bottom:10px;left:12px;font-size:11px;background:rgba(0,0,0,0.6);padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);">
            Equipped: <strong style="color:#38bdf8;">${cars[pState.equipped.car]?.name || 'Vulcan GT'}</strong> •
            Paint: <strong style="color:#ec4899;">${paints[pState.equipped.paint]?.name || 'Crimson'}</strong> •
            Underglow: <strong style="color:#a855f7;">${underglows[pState.equipped.underglow]?.name || 'None'}</strong>
          </div>
          <div style="position:absolute;top:10px;right:12px;font-size:10px;color:#94a3b8;background:rgba(0,0,0,0.5);padding:3px 8px;border-radius:4px;">
            3D Turntable Active 🔄
          </div>
        </div>

        <!-- Garage Category Tabs -->
        <div style="display:flex;gap:6px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;overflow-x:auto;">
          ${['car', 'paint', 'underglow', 'trail', 'title'].map(cat => `
            <button class="nr-garage-cat-btn" data-cat="${cat}" style="padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;border:1px solid ${garageCategory === cat ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${garageCategory === cat ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)'};color:${garageCategory === cat ? '#38bdf8' : '#94a3b8'};cursor:pointer;white-space:nowrap;">
              ${cat.toUpperCase()}S
            </button>
          `).join('')}
        </div>

        <!-- Category Items Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:10px;">
          ${renderGarageItemsGrid(pState, garageCategory)}
        </div>
      </div>
    `;
  }

  function renderGarageItemsGrid(pState, cat) {
    if (cat === 'car') {
      const allCars = window.nitroraceGarage.CARS;
      return Object.values(allCars).map(c => {
        const isUnlocked = pState.unlockedCars.includes(c.id);
        const isEquipped = pState.equipped.car === c.id;
        return `
          <div style="background:rgba(255,255,255,${isEquipped ? '0.08' : '0.03'});border:1px solid ${isEquipped ? '#38bdf8' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:800;margin-bottom:4px;">
                <span style="color:#ec4899;">${c.rarity.toUpperCase()}</span>
                <span style="color:#94a3b8;">${c.tier}</span>
              </div>
              <div style="font-size:13px;font-weight:900;color:#fff;margin-bottom:3px;">${c.name}</div>
              <div style="font-size:10px;color:#94a3b8;line-height:1.3;">${c.desc}</div>
            </div>
            <div>
              ${isEquipped ? `
                <button disabled style="width:100%;background:rgba(56,189,248,0.2);border:1px solid #38bdf8;color:#38bdf8;padding:6px;border-radius:6px;font-size:10px;font-weight:800;">✓ EQUIPPED</button>
              ` : (isUnlocked ? `
                <button class="nr-equip-btn" data-cat="car" data-id="${c.id}" style="width:100%;background:#38bdf8;border:none;color:#0f172a;padding:6px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">EQUIP</button>
              ` : `
                <div style="text-align:center;font-size:10px;color:#64748b;font-weight:700;padding:6px;background:rgba(0,0,0,0.3);border-radius:6px;">🔒 Unlock via Season 1 Pass</div>
              `)}
            </div>
          </div>
        `;
      }).join('');
    }

    if (cat === 'paint') {
      const allPaints = window.nitroraceGarage.PAINTS;
      return Object.values(allPaints).map(p => {
        const isUnlocked = pState.unlockedPaints.includes(p.id);
        const isEquipped = pState.equipped.paint === p.id;
        return `
          <div style="background:rgba(255,255,255,${isEquipped ? '0.08' : '0.03'});border:1px solid ${isEquipped ? '#ec4899' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:28px;height:28px;border-radius:50%;background:${p.hex};border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 8px ${p.hex};"></div>
              <div>
                <div style="font-size:12px;font-weight:800;color:#fff;">${p.name}</div>
                <div style="font-size:9px;color:#94a3b8;">${p.rarity}</div>
              </div>
            </div>
            <div>
              ${isEquipped ? `
                <button disabled style="width:100%;background:rgba(236,72,153,0.2);border:1px solid #ec4899;color:#ec4899;padding:6px;border-radius:6px;font-size:10px;font-weight:800;">✓ EQUIPPED</button>
              ` : (isUnlocked ? `
                <button class="nr-equip-btn" data-cat="paint" data-id="${p.id}" style="width:100%;background:#ec4899;border:none;color:#fff;padding:6px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">APPLY PAINT</button>
              ` : `
                <div style="text-align:center;font-size:10px;color:#64748b;font-weight:700;padding:6px;background:rgba(0,0,0,0.3);border-radius:6px;">🔒 Pass Tier</div>
              `)}
            </div>
          </div>
        `;
      }).join('');
    }

    if (cat === 'underglow') {
      const allUg = window.nitroraceGarage.UNDERGLOWS;
      return Object.values(allUg).map(u => {
        const isUnlocked = pState.unlockedUnderglows.includes(u.id);
        const isEquipped = pState.equipped.underglow === u.id;
        return `
          <div style="background:rgba(255,255,255,${isEquipped ? '0.08' : '0.03'});border:1px solid ${isEquipped ? '#a855f7' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:24px;height:24px;border-radius:6px;background:${u.hex};border:1px solid rgba(255,255,255,0.3);box-shadow:0 0 10px ${u.hex};"></div>
              <div>
                <div style="font-size:12px;font-weight:800;color:#fff;">${u.name}</div>
                <div style="font-size:9px;color:#94a3b8;">${u.rarity || 'Base'}</div>
              </div>
            </div>
            <div>
              ${isEquipped ? `
                <button disabled style="width:100%;background:rgba(168,85,247,0.2);border:1px solid #a855f7;color:#a855f7;padding:6px;border-radius:6px;font-size:10px;font-weight:800;">✓ EQUIPPED</button>
              ` : (isUnlocked ? `
                <button class="nr-equip-btn" data-cat="underglow" data-id="${u.id}" style="width:100%;background:#a855f7;border:none;color:#fff;padding:6px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">EQUIP NEON</button>
              ` : `
                <div style="text-align:center;font-size:10px;color:#64748b;font-weight:700;padding:6px;background:rgba(0,0,0,0.3);border-radius:6px;">🔒 Pass Tier</div>
              `)}
            </div>
          </div>
        `;
      }).join('');
    }

    if (cat === 'trail') {
      const allTrails = window.nitroraceGarage.TRAILS;
      return Object.values(allTrails).map(t => {
        const isUnlocked = pState.unlockedTrails.includes(t.id);
        const isEquipped = pState.equipped.trail === t.id;
        return `
          <div style="background:rgba(255,255,255,${isEquipped ? '0.08' : '0.03'});border:1px solid ${isEquipped ? '#f59e0b' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">${t.icon}</span>
              <div>
                <div style="font-size:12px;font-weight:800;color:#fff;">${t.name}</div>
                <div style="font-size:9px;color:#94a3b8;">${t.rarity || 'Default'}</div>
              </div>
            </div>
            <div>
              ${isEquipped ? `
                <button disabled style="width:100%;background:rgba(245,158,11,0.2);border:1px solid #f59e0b;color:#f59e0b;padding:6px;border-radius:6px;font-size:10px;font-weight:800;">✓ EQUIPPED</button>
              ` : (isUnlocked ? `
                <button class="nr-equip-btn" data-cat="trail" data-id="${t.id}" style="width:100%;background:#f59e0b;border:none;color:#0f172a;padding:6px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">EQUIP TRAIL</button>
              ` : `
                <div style="text-align:center;font-size:10px;color:#64748b;font-weight:700;padding:6px;background:rgba(0,0,0,0.3);border-radius:6px;">🔒 Pass Tier</div>
              `)}
            </div>
          </div>
        `;
      }).join('');
    }

    if (cat === 'title') {
      const titles = pState.unlockedTitles || ['Highway Rookie'];
      return titles.map(t => {
        const isEquipped = pState.equipped.title === t;
        return `
          <div style="background:rgba(255,255,255,${isEquipped ? '0.08' : '0.03'});border:1px solid ${isEquipped ? '#10b981' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            <div style="font-size:13px;font-weight:800;color:#fff;">👑 ${t}</div>
            <div>
              ${isEquipped ? `
                <button disabled style="width:100%;background:rgba(16,185,129,0.2);border:1px solid #10b981;color:#10b981;padding:6px;border-radius:6px;font-size:10px;font-weight:800;">✓ EQUIPPED</button>
              ` : `
                <button class="nr-equip-btn" data-cat="title" data-id="${t}" style="width:100%;background:#10b981;border:none;color:#fff;padding:6px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">EQUIP TITLE</button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    return '';
  }

  function initGarage3DPreview(container) {
    if (previewAnimId) cancelAnimationFrame(previewAnimId);
    const box = container.querySelector('#nr-garage-preview-box');
    if (!box || typeof THREE === 'undefined') return;

    box.innerHTML = '';
    const w = box.clientWidth || 360, h = box.clientHeight || 200;

    previewScene = new THREE.Scene();
    previewScene.background = new THREE.Color(0x0a0e1a);

    previewCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    previewCamera.position.set(0, 2.0, 4.5);
    previewCamera.lookAt(0, 0.4, 0);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 1.4);
    previewScene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(5, 10, 7);
    previewScene.add(dir);

    // Floor grid
    const grid = new THREE.GridHelper(10, 10, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    previewScene.add(grid);

    previewRenderer = new THREE.WebGLRenderer({ antialias: true });
    previewRenderer.setSize(w, h);
    previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    box.appendChild(previewRenderer.domElement);

    const pState = window.nitroracePass.getState();
    previewCarGroup = window.nitroraceGarage.create3DCarGroup(
      pState.equipped.car,
      pState.equipped.paint,
      pState.equipped.underglow
    );
    if (previewCarGroup) previewScene.add(previewCarGroup);

    const animate = () => {
      previewAnimId = requestAnimationFrame(animate);
      if (previewCarGroup) {
        previewCarGroup.rotation.y += 0.015;
      }
      if (previewRenderer && previewScene && previewCamera) {
        previewRenderer.render(previewScene, previewCamera);
      }
    };
    animate();
  }

  function bindEvents(container, onClose) {
    const closeBtn = container.querySelector('#nr-pass-close-btn');
    if (closeBtn) closeBtn.onclick = () => {
      if (previewAnimId) cancelAnimationFrame(previewAnimId);
      if (onClose) onClose();
    };

    // Tab buttons
    const tabPass = container.querySelector('#nr-tab-btn-pass');
    const tabMiss = container.querySelector('#nr-tab-btn-missions');
    const tabGar = container.querySelector('#nr-tab-btn-garage');

    if (tabPass) tabPass.onclick = () => { activeTab = 'pass'; render(container, onClose); };
    if (tabMiss) tabMiss.onclick = () => { activeTab = 'missions'; render(container, onClose); };
    if (tabGar) tabGar.onclick = () => { activeTab = 'garage'; render(container, onClose); };

    // Buy Premium Pass button
    const buyPremBtn = container.querySelector('#nr-pass-buy-premium-btn');
    if (buyPremBtn) {
      buyPremBtn.onclick = () => {
        window.nitroracePass.buyPremiumPass(() => {
          render(container, onClose);
        });
      };
    }

    // Buy Tier Skip button
    const buyTierBtn = container.querySelector('#nr-pass-buy-tier-btn');
    if (buyTierBtn) {
      buyTierBtn.onclick = () => {
        window.nitroracePass.buyTierWithCash(() => {
          render(container, onClose);
        });
      };
    }

    // Claim reward buttons
    container.querySelectorAll('.nr-claim-btn').forEach(btn => {
      btn.onclick = () => {
        const tier = parseInt(btn.dataset.tier);
        const isPrem = btn.dataset.type === 'premium';
        window.nitroracePass.claimReward(tier, isPrem);
        render(container, onClose);
      };
    });

    // Premium unlock prompt buttons inside track
    container.querySelectorAll('.nr-prem-unlock-btn').forEach(btn => {
      btn.onclick = () => {
        window.nitroracePass.buyPremiumPass(() => {
          render(container, onClose);
        });
      };
    });

    // Mission claim buttons
    container.querySelectorAll('.nr-mission-claim-btn').forEach(btn => {
      btn.onclick = () => {
        const mId = btn.dataset.id;
        window.nitroracePass.claimMission(mId);
        render(container, onClose);
      };
    });

    // Garage category switcher
    container.querySelectorAll('.nr-garage-cat-btn').forEach(btn => {
      btn.onclick = () => {
        garageCategory = btn.dataset.cat;
        render(container, onClose);
      };
    });

    // Equip item buttons
    container.querySelectorAll('.nr-equip-btn').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat;
        const id = btn.dataset.id;
        window.nitroracePass.equipItem(cat, id);
        render(container, onClose);
      };
    });
  }

  window.nitroracePassUI = {
    open(container, onClose) {
      render(container, onClose);
    },
    close() {
      if (previewAnimId) cancelAnimationFrame(previewAnimId);
    }
  };
})();
