/* FILE: nitrorace.pass.js — Season 1 Pass Logic, 20 Tiers, Progression, and Missions */
(function() {
  const SEASON_INFO = {
    id: 's1',
    name: 'Season 1: Neon Velocity',
    theme: 'Cyberpunk Neon Racing',
    priceUSD: 15.00,
    priceTierUSD: 2.00,
    priceTierCoins: 150,
    totalTiers: 20,
    xpPerTier: 100,
    endDateText: '28 Days Remaining'
  };

  const TIERS = [
    {
      tier: 1,
      free: { type: 'coins', amount: 50, icon: '🪙', name: '50 Nitro Coins', desc: 'Starter bonus currency' },
      premium: { type: 'car', id: 'venom_gtx', icon: '🏎️', name: 'Venom GT-X Supercar', desc: 'Season 1 Tier 1 Exclusive Hypercar with dual vortex spoilers', rarity: 'Epic' }
    },
    {
      tier: 2,
      free: { type: 'title', title: 'Highway Rookie', icon: '🔰', name: 'Title: Highway Rookie', desc: 'Display on leaderboards' },
      premium: { type: 'underglow', id: 'cyan', icon: '💡', name: 'Neon Underglow: Cyan Electric', desc: 'Glowing neon light beneath your vehicle', rarity: 'Rare' }
    },
    {
      tier: 3,
      free: { type: 'paint', id: 'cobalt_frost', icon: '🎨', name: 'Paint: Cobalt Frost', desc: 'Icy metallic blue body coating', rarity: 'Rare' },
      premium: { type: 'coins', amount: 200, icon: '🪙', name: '200 Nitro Coins', desc: 'Premium currency bonus' }
    },
    {
      tier: 4,
      free: { type: 'coins', amount: 75, icon: '🪙', name: '75 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'paint', id: 'midnight_obsidian', icon: '🎨', name: 'Paint: Midnight Obsidian', desc: 'Stealth matte carbon black coating', rarity: 'Epic' }
    },
    {
      tier: 5,
      free: { type: 'trail', id: 'sparks', icon: '✨', name: 'Trail: Plasma Sparks', desc: 'White plasma sparks flying from wheels in 3D', rarity: 'Rare' },
      premium: { type: 'trail', id: 'flame', icon: '🔥', name: 'Trail: Afterburner Flame', desc: 'Fiery jet afterburner exhaust flames', rarity: 'Epic' }
    },
    {
      tier: 6,
      free: { type: 'coins', amount: 100, icon: '🪙', name: '100 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'coins', amount: 250, icon: '🪙', name: '250 Nitro Coins', desc: 'Bonus coins stash' }
    },
    {
      tier: 7,
      free: { type: 'title', title: 'Speed Cadet', icon: '⚡', name: 'Title: Speed Cadet', desc: 'Player title' },
      premium: { type: 'underglow', id: 'acid_green', icon: '💡', name: 'Neon Underglow: Acid Green', desc: 'High-visibility bio-luminescent glow', rarity: 'Epic' }
    },
    {
      tier: 8,
      free: { type: 'paint', id: 'solar_amber', icon: '🎨', name: 'Paint: Solar Amber', desc: 'Warm metallic sunset golden coat', rarity: 'Rare' },
      premium: { type: 'paint', id: 'hyper_purple', icon: '🎨', name: 'Paint: Hyper Violet', desc: 'Vibrant iridescent cyberpunk purple', rarity: 'Epic' }
    },
    {
      tier: 9,
      free: { type: 'coins', amount: 120, icon: '🪙', name: '120 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'title', title: 'Apex Predator', icon: '👑', name: 'Title: Apex Predator', desc: 'Exclusive Season 1 Pass title' }
    },
    {
      tier: 10,
      free: { type: 'coins', amount: 150, icon: '🪙', name: '150 Nitro Coins', desc: 'Mid-season coin milestone' },
      premium: { type: 'car', id: 'cyber_interceptor', icon: '🚔', name: 'Cyber Interceptor S1', desc: 'High-tech pursuit police cruiser with active roof strobes', rarity: 'Epic' }
    },
    {
      tier: 11,
      free: { type: 'title', title: 'Lane Weaver', icon: '〰️', name: 'Title: Lane Weaver', desc: 'Player title' },
      premium: { type: 'coins', amount: 300, icon: '🪙', name: '300 Nitro Coins', desc: 'Coin reward' }
    },
    {
      tier: 12,
      free: { type: 'coins', amount: 180, icon: '🪙', name: '180 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'underglow', id: 'ultra_violet', icon: '💡', name: 'Neon Underglow: Ultra Violet', desc: 'Deep violet neon illumination', rarity: 'Epic' }
    },
    {
      tier: 13,
      free: { type: 'title', title: 'Drift Specialist', icon: '🏁', name: 'Title: Drift Specialist', desc: 'Player title' },
      premium: { type: 'trail', id: 'lightning', icon: '⚡', name: 'Trail: Electric Arc', desc: 'Crackling blue high-voltage lightning discharge', rarity: 'Legendary' }
    },
    {
      tier: 14,
      free: { type: 'coins', amount: 200, icon: '🪙', name: '200 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'paint', id: 'gold_chrome', icon: '🏆', name: 'Paint: 24K Gold Plated', desc: 'Ultra-gloss metallic gold finish', rarity: 'Legendary' }
    },
    {
      tier: 15,
      free: { type: 'title', title: 'Highway Phantom', icon: '👻', name: 'Title: Highway Phantom', desc: 'Player title' },
      premium: { type: 'coins', amount: 400, icon: '🪙', name: '400 Nitro Coins', desc: 'Major currency payout' }
    },
    {
      tier: 16,
      free: { type: 'coins', amount: 220, icon: '🪙', name: '220 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'underglow', id: 'rgb_pulse', icon: '🌈', name: 'Neon: Rainbow RGB Spectrum', desc: 'Continuously cycling RGB underglow in 3D!', rarity: 'Legendary' }
    },
    {
      tier: 17,
      free: { type: 'title', title: 'Vortex Chaser', icon: '🌪️', name: 'Title: Vortex Chaser', desc: 'Player title' },
      premium: { type: 'title', title: 'Neon Overlord', icon: '⚡', name: 'Title: Neon Overlord', desc: 'Legendary season title' }
    },
    {
      tier: 18,
      free: { type: 'coins', amount: 250, icon: '🪙', name: '250 Nitro Coins', desc: 'Currency boost' },
      premium: { type: 'paint', id: 'quantum_holo', icon: '💎', name: 'Paint: Quantum Hologram', desc: 'Prismatic shifting light dispersion paint', rarity: 'Legendary' }
    },
    {
      tier: 19,
      free: { type: 'coins', amount: 300, icon: '🪙', name: '300 Nitro Coins', desc: 'Pre-grand finale coin stash' },
      premium: { type: 'coins', amount: 500, icon: '🪙', name: '500 Nitro Coins', desc: 'Massive gold reward' }
    },
    {
      tier: 20,
      free: { type: 'coins', amount: 500, icon: '🏆', name: '500 Season Coins + Trophy', desc: 'Free track completion grand award!' },
      premium: { type: 'car', id: 'apex_valkyrie', icon: '👑', name: 'Apex Valkyrie S1 Legendary Hypercar', desc: 'The crown jewel of Season 1. Gold-trimmed jet widebody with quad thrusters!', rarity: 'Legendary' }
    }
  ];

  const DEFAULT_MISSIONS = [
    { id: 'm1', name: 'Highway Stretcher', desc: 'Drive 1,000 meters across your race runs', target: 1000, current: 0, rewardXP: 150, type: 'distance', unit: 'm', completed: false, claimed: false },
    { id: 'm2', name: 'Coin Collector', desc: 'Collect 30 Nitro Coins on the highway', target: 30, current: 0, rewardXP: 120, type: 'coins', unit: 'coins', completed: false, claimed: false },
    { id: 'm3', name: 'Speed Demon', desc: 'Reach 180 KM/H top speed in a single run', target: 180, current: 0, rewardXP: 130, type: 'speed', unit: 'km/h', completed: false, claimed: false },
    { id: 'm4', name: 'Near Miss Maestro', desc: 'Successfully dodge 20 traffic obstacles', target: 20, current: 0, rewardXP: 160, type: 'dodge', unit: 'cars', completed: false, claimed: false },
    { id: 'm5', name: 'Highway Marathon', desc: 'Complete 5 race attempts', target: 5, current: 0, rewardXP: 200, type: 'runs', unit: 'runs', completed: false, claimed: false },
    { id: 'm6', name: 'Clean Lap Specialist', desc: 'Reach 600 meters in a single run', target: 600, current: 0, rewardXP: 250, type: 'singledist', unit: 'm', completed: false, claimed: false }
  ];

  let state = {
    tier: 1,
    xp: 0,
    totalXp: 0,
    isPremium: false,
    claimedFree: [],
    claimedPremium: [],
    unlockedCars: ['default'],
    unlockedPaints: ['crimson'],
    unlockedUnderglows: ['none'],
    unlockedTrails: ['none'],
    unlockedTitles: ['Highway Rookie'],
    equipped: {
      car: 'default',
      paint: 'crimson',
      underglow: 'none',
      trail: 'none',
      title: 'Highway Rookie'
    },
    missions: JSON.parse(JSON.stringify(DEFAULT_MISSIONS))
  };

  const STORAGE_KEY = 'nitrorace_season1_pass';

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.osdb?.put('appdata', { id: 'nitrorace_season1', val: state });
    } catch (e) {}
  }

  function loadState() {
    try {
      const cached = window.osdb?.cache?.['nitrorace_season1'] || localStorage.getItem(STORAGE_KEY);
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
      if (parsed && typeof parsed === 'object') {
        state = {
          ...state,
          ...parsed,
          equipped: { ...state.equipped, ...(parsed.equipped || {}) },
          missions: Array.isArray(parsed.missions) && parsed.missions.length === DEFAULT_MISSIONS.length ? parsed.missions : DEFAULT_MISSIONS
        };
      }
    } catch (e) {}
  }

  loadState();

  window.nitroracePass = {
    SEASON_INFO,
    TIERS,
    getState() { return state; },

    addXP(amount, reason = '') {
      if (amount <= 0) return { leveledUp: false, newTier: state.tier };
      const xpMultiplier = state.isPremium ? 1.25 : 1.0;
      const actualXP = Math.round(amount * xpMultiplier);

      state.totalXp += actualXP;
      state.xp += actualXP;

      let leveledUp = false;
      const oldTier = state.tier;

      while (state.xp >= SEASON_INFO.xpPerTier && state.tier < SEASON_INFO.totalTiers) {
        state.xp -= SEASON_INFO.xpPerTier;
        state.tier += 1;
        leveledUp = true;
      }

      if (state.tier >= SEASON_INFO.totalTiers) {
        state.xp = Math.min(state.xp, SEASON_INFO.xpPerTier);
      }

      saveState();

      if (leveledUp) {
        window.animations?.showToast?.(`🏆 Season 1 Tier Up! You reached Tier ${state.tier}!`);
      }

      return { leveledUp, oldTier, newTier: state.tier, gainedXp: actualXP, reason };
    },

    updateMissionProgress(type, amount) {
      let anyChanged = false;
      state.missions.forEach(m => {
        if (m.type === type && !m.completed) {
          if (type === 'singledist' || type === 'speed') {
            if (amount > m.current) {
              m.current = Math.min(m.target, amount);
              anyChanged = true;
            }
          } else {
            m.current = Math.min(m.target, m.current + amount);
            anyChanged = true;
          }
          if (m.current >= m.target) {
            m.completed = true;
            window.animations?.showToast?.(`🎯 Mission Complete: ${m.name} (+${m.rewardXP} XP)`);
          }
        }
      });
      if (anyChanged) saveState();
    },

    claimMission(missionId) {
      const m = state.missions.find(x => x.id === missionId);
      if (!m || !m.completed || m.claimed) return false;
      m.claimed = true;
      this.addXP(m.rewardXP, `Mission: ${m.name}`);
      saveState();
      return true;
    },

    buyPremiumPass(onSuccess, onCancel) {
      if (state.isPremium) {
        window.animations?.showToast?.('You already own the Season 1 Premium Pass!');
        return;
      }

      window.os?.purchase?.('Nitro Race Season 1 Premium Pass', SEASON_INFO.priceUSD, () => {
        state.isPremium = true;
        // Auto unlock Tier 1 Premium car right away
        if (!state.unlockedCars.includes('venom_gtx')) state.unlockedCars.push('venom_gtx');
        state.equipped.car = 'venom_gtx';
        this.claimReward(1, true, true);
        saveState();
        window.animations?.showToast?.('🎉 Season 1 Premium Pass Activated! Venom GT-X Unlocked!');
        if (onSuccess) onSuccess();
      }, onCancel);
    },

    buyTierWithCash(onSuccess, onCancel) {
      if (state.tier >= SEASON_INFO.totalTiers) {
        window.animations?.showToast?.('Already at Max Tier (Tier 20)!');
        return;
      }
      window.os?.purchase?.('Nitro Race Season 1 Tier Skip (+100 XP)', SEASON_INFO.priceTierUSD, () => {
        this.addXP(SEASON_INFO.xpPerTier, 'Tier Purchase');
        if (onSuccess) onSuccess();
      }, onCancel);
    },

    buyTierWithCoins(currentCoins, deductCoinCb, onSuccess) {
      if (state.tier >= SEASON_INFO.totalTiers) {
        window.animations?.showToast?.('Already at Max Tier (Tier 20)!');
        return false;
      }
      if (currentCoins < SEASON_INFO.priceTierCoins) {
        window.animations?.showToast?.(`Need ${SEASON_INFO.priceTierCoins} Nitro Coins! (You have ${currentCoins})`);
        return false;
      }
      deductCoinCb(SEASON_INFO.priceTierCoins);
      this.addXP(SEASON_INFO.xpPerTier, 'Tier Purchase (Coins)');
      window.animations?.showToast?.(`⚡ Tier Skipped! -${SEASON_INFO.priceTierCoins} Coins`);
      if (onSuccess) onSuccess();
      return true;
    },

    claimReward(tierNumber, isPremiumTrack, silent = false) {
      const tierObj = TIERS.find(t => t.tier === tierNumber);
      if (!tierObj) return { success: false, message: 'Invalid tier' };
      if (state.tier < tierNumber) return { success: false, message: 'Tier not unlocked yet' };

      const list = isPremiumTrack ? state.claimedPremium : state.claimedFree;
      if (list.includes(tierNumber)) return { success: false, message: 'Already claimed' };

      if (isPremiumTrack && !state.isPremium) {
        return { success: false, message: 'Requires Premium Season 1 Pass' };
      }

      const reward = isPremiumTrack ? tierObj.premium : tierObj.free;
      if (!reward) return { success: false, message: 'No reward on this track' };

      list.push(tierNumber);

      // Grant reward
      if (reward.type === 'car') {
        if (!state.unlockedCars.includes(reward.id)) state.unlockedCars.push(reward.id);
        state.equipped.car = reward.id;
      } else if (reward.type === 'paint') {
        if (!state.unlockedPaints.includes(reward.id)) state.unlockedPaints.push(reward.id);
        state.equipped.paint = reward.id;
      } else if (reward.type === 'underglow') {
        if (!state.unlockedUnderglows.includes(reward.id)) state.unlockedUnderglows.push(reward.id);
        state.equipped.underglow = reward.id;
      } else if (reward.type === 'trail') {
        if (!state.unlockedTrails.includes(reward.id)) state.unlockedTrails.push(reward.id);
        state.equipped.trail = reward.id;
      } else if (reward.type === 'title') {
        if (!state.unlockedTitles.includes(reward.title)) state.unlockedTitles.push(reward.title);
        state.equipped.title = reward.title;
      } else if (reward.type === 'coins') {
        window.nitroraceApp?.addCoins?.(reward.amount);
      }

      saveState();
      if (!silent) {
        window.animations?.showToast?.(`🎁 Claimed: ${reward.name}!`);
      }
      return { success: true, reward };
    },

    equipItem(category, itemId) {
      if (category === 'car' && state.unlockedCars.includes(itemId)) state.equipped.car = itemId;
      if (category === 'paint' && state.unlockedPaints.includes(itemId)) state.equipped.paint = itemId;
      if (category === 'underglow' && state.unlockedUnderglows.includes(itemId)) state.equipped.underglow = itemId;
      if (category === 'trail' && state.unlockedTrails.includes(itemId)) state.equipped.trail = itemId;
      if (category === 'title' && state.unlockedTitles.includes(itemId)) state.equipped.title = itemId;
      saveState();
      window.animations?.showToast?.(`✨ Equipped ${category.toUpperCase()}: ${itemId}`);
    }
  };
})();
