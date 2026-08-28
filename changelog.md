# Changelog — Nutrino OS

All notable changes to the Nutrino OS project will be documented in this file.

## [1.1.2.1] - 2026-08-28

### Added
- **Company Website (`makeracingstudio.nos`, `makeracingstudio.nos.js`, `makeracingstudio.tabs.js`, `makeracingstudio.se.js`)**:
  - Full developer portal for Nutrino Games studio accessible via `makeracingstudio.nos` in the local Web Explorer.
  - 7 persistently accessible navigation tabs:
    - **Home**: Studio branding ("Making Racing Games Since 2025"), high-speed canvas artwork banner, studio patch notes and announcement feed, and direct SoftStore download link.
    - **Games**: Complete studio game catalog showcasing OG Nitro Race (7.0 GB, $20.00, Released) and Special Edition Nitro Race SE (9.61 GB, $100.00).
    - **About**: Studio company overview, headquarters in Nutrino City NOS-11, and core leadership team profiles (Alex Vance, Marcus Speed, Elena Shift).
    - **Support**: Comprehensive FAQ knowledge base (Installation, ISP broadband troubleshooting, Silent Pay runtime billing), support contact routing, and an interactive feedback submission form saved to local storage.
    - **Careers**: Active job board for game engineering, 2D art, and QA roles with one-click direct application processing.
    - **Community**: Forum discussion threads, community statistics (1.2K members), and player leaderboards.
    - **Special Edition (SE)**: Exclusive expansion hub. Verifies base Nitro Race installation, renders 2D Canvas screenshot previews of 3 maps and 2 car classes, connects to the unified 3-step checkout flow ($100.00), and runs a 9.61 GB download simulation with real-time ETA, bandwidth data consumption, and Home Screen app installation.

- **Nitro Race SE Expansion Game (`nitroracese.js`, `nitroracese.canvas.js`, `nitroracese.pay.js`)**:
  - Exclusive standalone Special Edition racer installed directly via `makeracingstudio.nos` to the Home Screen.
  - Pure 2D Canvas graphics engine (0 WebGL / Three.js dependencies, 100% compatible with legacy Intel HD Graphics 2000).
  - **Special Menu Screen**: Interactive 2D rotating car showcase, volume settings, customizable controls (Arrow Keys or WASD / Mobile Touch Buttons), and developer credits.
  - **3 Distinct Track Environments**:
    - **Desert Highway**: Arid golden sands and roadside desert dunes.
    - **Neon Metropolis**: Cyberpunk dark asphalt, skyscraper rooftops, and neon crosswalks.
    - **Frozen Tundra**: Icy blue road, snow banks, and dynamic drifting snowflakes.
  - **2 Vehicle Classes**:
    - **Vulcan GT**: Balanced crimson sports chassis (Top Speed 140, Accel 75, Handling 80).
    - **Cobalt Surge**: High-acceleration cobalt supercar (Top Speed 125, Accel 95, Handling 85).
  - **Silent Pay Metering System (`nitroracese.pay.js`)**:
    - Real-time in-game runtime billing deducting $2.99 per second from SuperBank checking account.
    - Insufficient funds detection displaying warning modal followed by graceful system halt error ("Nitro Race SE has stopped.") and return to Home Screen.
  - **Stateless Session Design**:
    - Zero local save state; each run is an arcade sprint.
    - Explicit unsupported status display inside Gamesafe vault dashboard ("Nitro Race SE is not supported yet.").

### Fixed
- **Nitro Race SE GameOver UI & Navigation**: Fixed overlay pointer events and dynamic display toggling so "Restart Race", "Main Menu", and menu selection buttons respond instantly to clicks and touch input.

### Added (App Management & Deletion)
- **App Uninstall / Deletion Support Across Nutrino OS**:
  - `confirmModal.js`: Custom in-OS native confirmation dialog bypassing browser iframe restrictions, with destructive styling and explicit storage reclamation breakdown.
  - `os.uninstallApp(appId)`: Central OS kernel method to cleanly remove applications from `installedApps` state, wipe app sandbox preferences/links, and synchronize persistent `localStorage`.
  - **Home Screen Jiggle / Edit Mode**: Long-press any app icon or tap the delete badge to enter uninstall mode with animated icon jiggle and instant modal deletion confirmation.
  - **SoftStore App Detail Page**: Added dedicated "Uninstall" button alongside "Open App" for installed software with instant state toggle.
  - **SoftStore Library View**: Added "Delete" action button next to "Launch" in the installed applications inventory.
  - **About Device Storage Breakdown**: Real-time storage stats now list installed apps with individual "Uninstall" triggers and immediate storage recalculation.

### Added (Wipe Fresh & Clean Rejuvenation)
- **Wipe Fresh Version Detection & 5-Stage Rejuvenation**:
  - **Target OS Build Detection**: Inspects active build (`v1.1.2.1`), Linux kernel build, release channel, and cryptographic integrity before formatting.
  - **5-Stage Animated Wipe Sequence**:
    1. *Unmounting Storage & Services* (kills daemons, unlinks downloaded apps, purges sandbox locks)
    2. *Cryptographic Data & Partition Purge* (erases IndexedDB notes & gallery photos, resets credentials)
    3. *Verifying Target Firmware Build* (validates clean kernel image and checksum integrity)
    4. *Restoring Factory OS Manifest* (writes pristine system registries, reset themes, initial $100 starting funds)
    5. *Finalizing Storage & Clean State* (compacts partitions and prepares cold bootloader)
  - **3-Second Cinematic Godrays Reboot Engine**:
    - Fullscreen dynamic canvas rendering rotating volumetric godrays, ambient lighting, core glowing badge, multi-stage kernel boot status, and seamless cold boot transition into the clean lockscreen session.

---

## [1.1.2] - 2026-08-28

### Added
- **Nitro Race 3D Game (`nitrorace.js`, `three.min.js`)**:
  - Full 3D Three.js high-speed racing simulation featuring automatic acceleration, steerable sports car group, procedural obstacles, collectible coins, dynamic fog, and lighting.
  - Multi-lane keyboard controls (Arrow keys / A / D) and touch screen overlay buttons for mobile precision.
  - HUD displaying speed in KM/H, distance traveled in meters, coin balance, and speed level tiers.
  - Game Over modal with Restart and direct "Save Progress" integration with Gamesafe.
  - Local bundling of `three.min.js` (IIFE global `THREE`, 0 remote CDN/API calls).

- **Gamesafe Cloud Save Manager (`gamesafe.js`)**:
  - Game progress backup and synchronization vault.
  - 1-step account authentication (Sign In / Sign Up with persistent credentials).
  - High-frequency subscription engine ($0.99 / 20-second active duration) with automatic bank deduction and real-time countdown timer badge.
  - One-click game linking to Nitro Race with cloud save progress viewer (high score, distance, coins, level, timestamp).
  - API methods: `window.gamesafe.saveGame()`, `window.gamesafe.loadGame()`, `window.gamesafe.isSubscribed()`, and `window.gamesafe.isConnected()`.

- **SoftStore App Detail Page & Download Flow (`softstoredetail.js`, `softstore.js`)**:
  - Comprehensive App Detail page displaying app icon, developer, version, category, star rating, downloads count, and file size.
  - Interactive Canvas Screenshot generator (`screenshots.js`) rendering realistic previews:
    - Nitro Race: 3D perspective road, neon horizon, speedster car, HUD.
    - Gamesafe: Cloud dashboard UI, subscription badges, game save sync cards.
    - Wipe Fresh: Security warning dialog, partition erase overview.
  - Download simulation reflecting real-time active network speed (`time = size / speed`), live ETA, percentage, and downloaded MB/GB metrics.
  - Automatic routing into the unified 3-step purchase flow for paid applications.

- **Internet Data Limits & Speed Throttling (`network.nos.js`, `os.js`, `constants.js`)**:
  - Monthly data limits added across ISP tiers: Free (1 GB), Basic (10 GB), Standard (50 GB), Premium (100 GB), Ultra (200 GB).
  - Data usage tracking during app downloads and web browsing.
  - Visual data progress bar in `network.nos` with warning state and automatic speed throttling to 1 Mbps upon exceeding the monthly quota.

- **SuperBank Add Funds Deposit Feature (`superbank.nos.js`, `os.js`)**:
  - Instant direct deposit input field and "+ Add Funds" action in SuperBank portal.
  - Increases checking balance, registers deposit transactions in history, and updates global OS state.

- **Wipe Fresh Gamesafe Preservation (`wipefresh.js`, `os.js`)**:
  - Automatic detection of active Gamesafe subscriptions during factory reset initiation.
  - Dual wipe modes:
    - **Delete All**: complete factory reset of all partitions.
    - **Keep Savegame**: preserves Gamesafe app, account credentials, subscription, and game save data while clearing other apps, notes, photos, and preferences.

---

## [1.1.1] - 2026-08-28

### Added
- **About Device in Settings (`aboutdevice.js`, `settingsapp.js`, `deviceinfo.js`)**:
  - Full hardware and software specification panel in Settings with tabbed navigation ("General" & "About Device").
  - Persistent hardware identity: automatically generates and stores unique Serial Number (`NOS-XXXXXXXX`) and 15-digit IMEI code in `localStorage` on initial boot.
  - Live Storage Analytics Engine:
    - Calculates storage utilization across system partitions: Base OS & Core (8.5 GB), Notes (1 KB per note), Gallery Photos (2 MB per photo), and Downloaded Applications (10 MB per app).
    - Visual storage capacity progress bar with real-time used/free gigabytes display.
  - Complete device specifications breakdown: Model (NOS-N1-2026), Processor (Nutrino Octa-Core 2.8 GHz), RAM (8 GB LPDDR5), Battery (4500 mAh Li-Po), Display (6.1" AMOLED 1080x2400 120Hz).

- **Unified 3-Step Purchase Flow Modal (`purchasemodal.js`, `os.js`)**:
  - OS-wide interactive 3-step checkout flow triggered via `os.purchase(itemName, price, onSuccess, onCancel)`:
    - **Step 1 (Confirmation)**: Product title, unit price, and review dialog with Confirm / Cancel actions.
    - **Step 2 (Payment Method)**: Payment source selector displaying live SuperBank checking balance and authorization trigger.
    - **Step 3 (Result State)**: 
      - Success screen with green verification checkmark, unique transaction receipt reference ID (`TX-XXXXXXX`), remaining balance readout, and execution of fulfillment callback.
      - Error handling for insufficient funds with deposit navigation option to SuperBank.

- **Broadband Purchase Flow Integration (`network.nos.js`)**:
  - Connected ISP broadband subscription tiers directly to the unified `os.purchase` flow, providing seamless confirmation and payment authorization before speed upgrades.

- **Storage Engine Metric API (`store.js`)**:
  - Added `getTotalStorageUsed()` to query IndexedDB notes and gallery collections and calculate exact byte usage metrics.

---

## [1.1.0] - 2026-08-28

### Added
- **Local Web Browser (`browser.js`)**:
  - Full-featured browser UI with URL address bar, Back, Forward, Reload, and Home navigation buttons.
  - Interactive Start page with bookmarks to `network.nos` and `superbank.nos`.
  - Local domain routing for `.nos` simulation sites with dynamic loading progress bar.
  - Network-speed-dependent page rendering delay and simulated data consumption tracker.
  - Graceful "Site Not Found" handler for unregistered offline domains.

- **Broadband ISP Subscription Portal (`network.nos.js`)**:
  - Interactive ISP provider website rendered inside the browser at `network.nos`.
  - Live readout of current active plan, real-time download speed, and data consumption.
  - 5 broadband subscription tiers: Free (1 Mbps), Basic (10 Mbps, $5/mo), Standard (50 Mbps, $10/mo), Premium (100 Mbps, $20/mo), Ultra (500 Mbps, $50/mo).
  - Integrated billing: subscribing deducts fees from SuperBank account balance with insufficient funds protection.
  - Interactive Transfer Time Calculator estimating exact seconds for any file size across active speed tiers.

- **Local Digital Banking Site (`superbank.nos.js`)**:
  - Online banking portal rendered inside the browser at `superbank.nos`.
  - Persistent checking account balance starting at $100.00.
  - Real transactions engine supporting Cash Deposits, ATM Withdrawals, and Wire Transfers to recipient accounts.
  - Real-time transaction history log recording timestamps, debit/credit indicators, and transaction descriptions.

- **Steam-Inspired App Store (`softstore.js`)**:
  - Modern SoftStore marketplace featuring Featured Banner, App Catalog, and Library tabs.
  - Download & install flow for "Wipe Fresh" (10 MB package).
  - Dynamic download progress bar with real-time ETA calculation bound to active ISP speed (`time = size / speed`).
  - Automatic deployment: installs app onto Home Screen launcher grid and marks as available in Library.

- **Factory Reset Utility (`wipefresh.js`)**:
  - System rejuvenation and factory reset application.
  - Confirmation dialog outlining storage and preference wipe scope.
  - Multi-stage reset sequence: clears IndexedDB object stores (Notes & Gallery), wipes `localStorage` preferences, resets ISP plan to Free, restores bank balance to $100, and triggers complete OS reboot.

- **Status Bar Network Indicator (`statusbar.js`)**:
  - Live broadband speed badge (`⚡ X Mbps`) displayed in system status bar, updating instantly upon plan change.

- **Database Store Enhancements (`store.js`)**:
  - Added `clearAll()` method to transactional IndexedDB engine to clear all user data partitions simultaneously.

- **Operating System Kernel Upgrades (`os.js`)**:
  - State management for broadband plans, network speeds, data usage, bank balances, transaction histories, and installed downloadable packages.
  - Added `setInternetPlan()`, `getDownloadTime()`, `installApp()`, `isAppInstalled()`, `deductBank()`, `addBank()`, `addDataUsage()`, and `resetFactory()`.

---

## [1.0.0] - 2026-08-28

### Added
- **Core Operating System Kernel (`os.js`)**:
  - Boot sequence coordinating preferences, theme engine, IndexedDB initialization, and screen mounting.
  - State management for current active screen, app lifecycle, and settings.
  - App launch and back navigation dispatchers.

- **System Layout & Theme Engine (`index.html`, `style.css`, `theme.js`)**:
  - Mobile viewport container with adaptive desktop frame and responsive mobile layout.
  - Hardware-accelerated CSS variables for theme colors, surfaces, and active wallpaper gradients.
  - Full-screen brightness overlay controlled via `theme.js` and persisted in `localStorage`.
  - Dark mode and light mode global switching.

- **Touch & Gesture Engine (`touch.js`)**:
  - Finger drag tracker supporting both Touch and Mouse pointer events.
  - Dynamic Y-axis translation with resistance and threshold-based unlock trigger.

- **Lock Screen (`lockscreen.js`)**:
  - Full-screen lock display with dynamic real-time digital clock and formatted date.
  - Interactive "Swipe up to unlock" drag handle with smooth transition to the Home screen.

- **Status Bar (`statusbar.js`)**:
  - Real-time time display synchronized with system clock.
  - Dynamic battery percentage with visual fill icon (integrates Battery Status API with local fallback).
  - Simulated 4-bar cellular connection indicator.

- **Home Screen (`homescreen.js`)**:
  - 4x4 responsive app launcher grid featuring built-in applications.
  - Frosted-glass dock housing Phone, Messages, and Browser launchers.
  - Tactile press feedback and spring transitions into applications.

- **Clock App (`clockapp.js`)**:
  - HTML5 Canvas analog clock renderer with smooth 60fps hand rotations for hours, minutes, and milliseconds-accurate seconds.
  - Digital clock face with active seconds counter and full calendar date display.

- **Calculator App (`calculatorapp.js`)**:
  - Arithmetic engine supporting operator precedence, decimals, backspace, and chained evaluations.
  - Color-coded keypad with high-contrast keys and clear display readout.

- **Settings App (`settingsapp.js`)**:
  - Global Dark Mode toggle switch.
  - 3 preset wallpaper gradients (Midnight Indigo, Obsidian Slate, Emerald Abyss).
  - Real-time brightness slider with immediate viewport dimming.
  - System metadata and storage engine version readout.

- **Notes App (`notesapp.js`, `store.js`)**:
  - Local IndexedDB database storage engine (`NutrinoOS_DB`).
  - Saved notes list with 20-character previews and timestamps.
  - Full-screen note editor for composing, updating, and deleting notes across sessions.

- **Camera App (`cameraapp.js`)**:
  - Webcam video stream receiver using `navigator.mediaDevices.getUserMedia`.
  - Frame capture rendering to internal canvas with thumbnail preview.
  - Save action persisting photos directly to IndexedDB gallery storage.
  - Graceful fallback for environments without camera hardware.

- **Music Player (`musicapp.js`)**:
  - Web Audio API integration with `AudioContext`, `GainNode`, and `AudioBufferSourceNode`.
  - Local file selector supporting MP3, WAV, OGG, and M4A audio files.
  - Seekable progress bar, volume slider, and playback status controls.

- **Gallery App (`galleryapp.js`)**:
  - Responsive thumbnail photo grid fetching saved photos from IndexedDB.
  - Full-screen photo lightbox viewer with instant photo deletion.
  - Empty-state instructions when no photos are present.

- **Weather App (`weatherapp.js`)**:
  - Deterministic seed-based local weather simulator (0 network calls).
  - Current conditions (Sunny, Cloudy, Rainy, Snowy) with temperatures in Celsius.
  - 5-day weather forecast and interactive "Refresh Weather" trigger.

- **Animations & Navigation Router (`animations.js`, `router.js`)**:
  - Hardware-accelerated 60fps fade and slide view transitions.
  - History stack enabling backward navigation across all views and apps.
  - System toast notification manager for user feedback.
