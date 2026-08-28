# Changelog — Nutrino OS

All notable changes to the Nutrino OS project will be documented in this file.

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
