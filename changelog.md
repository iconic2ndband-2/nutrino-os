# Changelog — Nutrino OS

All notable changes to the Nutrino OS project will be documented in this file.

## [1.2.1] - 2026-08-29

### Added
- **3DPapers Live 3D Wallpaper Engine (`3dpapers.js`, `3dpapers.wallpapers.js`, `3dpapers.pay.js`, `3dpapers.auth.js`, `3dpapers.ui.js`, `style.3dpapers.css`)**:
  - Premium live 3D wallpaper app categorized under Personalization (2.3 GB simulated download, 100% Free app install in SoftStore).
  - 5 interactive live Three.js 3D wallpapers with dynamic particle physics and custom lighting:
    1. *Nebula Drift* ($5.00 / 60 sec at $0.083/sec): Rotating galaxies, floating stars, particle clouds, slow color shifts.
    2. *Ocean Depths* ($4.50 / 45 sec at $0.10/sec): 3D underwater terrain, light caustics, rising bubbles, swaying seaweed.
    3. *Neon Cityscape* ($4.00 / 30 sec at $0.133/sec): Cyberpunk skyline, rain particles, animated neon reflections, moving traffic.
    4. *Volcano Eruption* ($3.00 / 15 sec at $0.20/sec): 3D volcano cone, flowing lava glow, ash and smoke particle systems.
    5. *Aurora Borealis* ($10.00 / 1 sec at $10.00/sec): Snow-capped mountain landscape, dancing northern lights ribbons, starfield.
  - **2-Step Login/Signup Flow**: Username and password credentials with Gamesafe multi-account authentication and password confirmation on new registrations.
  - **5-Step Payment Flow**: Select Wallpaper → Select Duration (1x, 2x, 5x) → Confirm Payment Method → Cost Breakdown & SuperBank Balance → Final Confirmation & Apply.
  - **Silent Pay & Total Spending Counter**: Live background billing deductions from SuperBank without intrusive toast popups, paired with a persistent in-app spending tracker badge.
  - **Subscription & Renewal Manager**: Automated background duration countdown, silent auto-renewals, manual renew options, and full opt-out controls.
  - **Hardware 3D GPU Guard**: Automatic GPU capability verification with crash overlay protection if WebGL/3D hardware is unsupported.
- **Gamesafe Multi-Account Support & Re-login Fee Protection (`gamesafe.js`, `gamesafe.db.js`, `os.js`)**:
  - Upgraded Gamesafe cloud vault to support separate isolated saves per username (`gamesafeDB[appKey][username]`).
  - Added public database API: `gamesafe.save()`, `gamesafe.load()`, `gamesafe.exists()`, `gamesafe.getAllAccounts()`, and `gamesafe.delete()`.
  - Implemented **$50 Re-login Fee**: Free registration for new accounts; automatic $50 fee deduction and balance check via `os.chargeForReLogin()` when re-logging into existing accounts.
  - **Wipe Fresh Multi-Account Vault Preservation**: Retains all Gamesafe credentials, subscriptions, and multi-user save databases during factory rejuvenation when "Keep Savegame" is selected.

---

## [1.2.0] - 2026-08-29

### Added
- **SoftStore v2.0 — App Versioning & Update Engine (`softstore.js`, `softstore.updates.js`, `softstoredetail.js`, `softstoredetail.versions.js`)**:
  - Full versioning system for all apps with `CONSTANTS.APP_VERSIONS` catalog.
  - Added dedicated **Updates Tab** to SoftStore displaying all apps with newer available versions.
  - "Update All" sequential download and installation engine bound to active ISP bandwidth.
  - Individual "Update" button per app with live downloaded bytes counter, percentage progress bar, and ETA.
  - Dynamic notification badge on SoftStore tab header indicating count of available updates.
  - **Version History View on App Details**: Detailed breakdown of every version with version number, release date, download size, and changes changelog.
  - Download and install capability for specific versions with "Installed" indicators.
- **Hardware GPU Detection & 3D Crash System (`os.gpu.js`, `os.js`)**:
  - Implemented `os.isWebGLSupported()`, `os.isWebGL2Supported()`, `os.isWebGPUSupported()`, `os.getGPUInfo()`, and `os.canRun3D()`.
  - Comprehensive GPU capability check before launching 3D apps (`nitrorace.js`, `nitroracese.js`).
  - Full-screen animated Crash Overlay screen for unsupported hardware with detailed GPU diagnostic readout and "[Close App]" return button.
- **Home Screen Version & Update Badges (`homescreen.js`, `homescreen.icon.js`, `style.v12.css`)**:
  - Clean version badges displayed directly below application icons on the Home Screen grid (`v1.0.0`).
  - Glowing "Update" indicator pill displayed on apps when a newer version is released.
- **OS Kernel Versioning & Update API (`os.versions.js`, `os.js`)**:
  - Added `os.checkForUpdates()`, `os.getAppVersions(appId)`, `os.getLatestVersion(appId)`, `os.isUpdateAvailable(appId)`, `os.getInstalledVersion(appId)`, and `os.installVersion(appId, version)`.
  - Persistent version tracking in `localStorage` across app installs and system reboots.
- **OS Version & Build Synchronization (`constants.js`, `metadata.json`, `index.html`)**:
  - Updated OS version strings to `Nutrino OS v1.2` and build number to `NOS-1.2.0-20260829`.

---

## [1.1.2.2] - 2026-08-28

### Added
- **Company Website Exclusive App Distribution**:
  - Truespecs is now distributed exclusively through its official companion website (`truespecs.nos`) and removed from the public SoftStore catalog.
- **Nutrino Games Studio Portal — "What's New in SE" (`makeracingstudio.se.info.js`, `makeracingstudio.se.js`)**:
  - Added dedicated "What's New in Special Edition" changelog and comparison module to the Nitro Race SE download page on `makeracingstudio.nos`.
  - Detailed breakdown of 3 dynamic biome tracks, 2 vehicle classes, 60 FPS Canvas 2D engine physics, Gamesafe cloud save backup, and Silent Pay runtime metering.
- **Company Website (`truespecs.nos`, `truespecs.nos.js`, `truespecs.tabs.js`)**:
  - Official companion website for Truespecs Technologies accessible via `truespecs.nos` in the local Web Explorer.
  - 5 core informational tabs + 1 downloadable app tab:
    - **Home**: Welcome message ("Welcome to Truespecs — Your Device Specs Companion"), company intro, tagline, and latest firmware announcements.
    - **About**: Company background, engineering mission, and hardware transparency vision.
    - **Features**: Breakdown of 10-Core CPU monitoring, 2T-PEX GPU telemetry, 4GB LPDDR4 memory tracking, storage partitioning, and battery telemetry.
    - **Support**: Comprehensive FAQ on sensor accuracy, thermal polling, and 24/7 support contacts.
    - **Blog**: Technical deep dives into 10-Core Nutrino benchmarks and AMOLED display bandwidth optimization.
    - **App (Download)**: Full metadata card for Truespecs (Version 1.0.0, 800 MB, Free, Utilities). Includes interactive download progress simulation bound to active ISP bandwidth (`time = 800 / speed`), real-time downloaded MB counter, ETA, and automatic installation to the Home Screen.
- **Truespecs Hardware Monitor App (`truespecsapp.js`, `truespecsapp.sections.js`, `style.truespecs.css`)**:
  - Premium Pink Edition theme (#1a0a0f dark pink canvas, #FF1493 deep pink accent, #FF69B4 hot pink highlights, #FFD1DC secondary text).
  - 6 dedicated telemetry and hardware diagnostic sections:
    1. **Overview**: Device Name (Nutrino N1), Model (NOS-11), OS Version (Nutrino OS v1.1.2.2), Build Number (NOS-1.1.2.2-20250827), Serial Number, IMEI, Boot Uptime, and Device Age.
    2. **Performance (Real-Time 1Hz Polling)**:
       - 10-Core CPU (600MHz - 1.3GHz): Overall utilization gauge + individual Core 1-10 load bars and thermal sensor (40-70°C).
       - 2T-PEX GPU (4-core, 600MHz): Render pipeline load bar and thermal sensor (35-60°C).
       - 4GB LPDDR4 RAM: Used/Free gigabytes and live memory saturation percentage.
    3. **Storage**: 128GB UFS 2.1 total partition breakdown (Used, Free, System OS, Downloaded Apps, Gallery Media, Notes Database).
    4. **Display & Camera**: 6.7" AMOLED 2400×1080 120Hz display with live brightness percentage sync, 64MP+12MP+5MP rear sensors, 32MP front selfie camera, and Dual LED flash.
    5. **Battery & Network**: 4500mAh battery percentage, charging status, health, thermals (25-45°C), 5G cellular modem, active ISP plan & speed sync, 5G signal strength, Wi-Fi 802.11ax status, and Bluetooth 5.2.
    6. **Software**: OS Version, Security Patch (August 1, 2026), Kernel Version (6.1.0-nutrino+), Build Date, Uptime counter, and live list of installed packages.
- **Live Rotating 2D Canvas Icon (`truespecsicon.js`)**:
  - Interactive HTML5 Canvas 2D icon mounted directly onto the Home Screen grid.
  - Pink/purple gradient background (#FF1493 to #FF69B4) with subtle glowing borders.
  - Features CPU chip (center), GPU chip (top right), and RAM module (bottom left) rotating continuously together on a smooth ~5.5-second orbital cycle using `requestAnimationFrame`.
- **Real-Time Telemetry & OS Metrics Kernel Engine (`os.data.js`, `os.js`)**:
  - Implemented `os.getCPUUsage()`, `os.getGPUUsage()`, `os.getRAMUsage()`, `os.getStorageBreakdown()`, `os.getCPUTemp()`, `os.getGPUTemp()`, `os.getBatteryTemp()`, `os.getUptime()`, `os.getDeviceAge()`, `os.getBatteryStatus()`, `os.getSignalStrength()`, `os.getWiFiSignal()`, `os.getBrightness()`.
- **Updated Hardware Profile (`constants.js`, `deviceinfo.js`, `aboutdevice.js`)**:
  - Updated standard specifications across About Device and Settings to reflect Nutrino N1, NOS-11, 10-core CPU, 2T-PEX GPU, 4GB LPDDR4, and 128GB UFS 2.1 storage.

---

## [1.1.2.1] - 2026-08-28

### Added
- **Company Website (`makeracingstudio.nos`, `makeracingstudio.nos.js`, `makeracingstudio.tabs.js`, `makeracingstudio.se.js`)**:
  - Full developer portal for Nutrino Games studio accessible via `makeracingstudio.nos` in the local Web Explorer.
  - 7 persistently accessible navigation tabs: Home, Games, About, Support, Careers, Community, Special Edition.
- **Nitro Race SE Expansion Game (`nitroracese.js`, `nitroracese.canvas.js`, `nitroracese.pay.js`)**:
  - Exclusive standalone Special Edition racer installed directly via `makeracingstudio.nos` to the Home Screen.
  - 2D Canvas graphics engine with Desert Highway, Neon Metropolis, and Frozen Tundra maps, 2 car classes (Vulcan GT, Cobalt Surge).
  - Silent Pay runtime billing deducting $2.99/sec from SuperBank.
- **App Uninstall / Deletion Support Across Nutrino OS (`confirmmodal.js`, `os.js`, `homescreen.js`)**:
  - `confirmModal.js`: Custom in-OS native confirmation dialog.
  - `os.uninstallApp(appId)`: Kernel uninstallation method.
  - Home Screen Jiggle / Edit Mode: Long-press deletion support.
- **Wipe Fresh Version Detection & 5-Stage Rejuvenation (`wipefresh.js`)**:
  - 5-stage reset sequence and 3-second cinematic godrays reboot animation.

---

## [1.1.2] - 2026-08-28
- **Nitro Race 3D Game (`nitrorace.js`, `three.min.js`)**
- **Gamesafe Cloud Save Manager (`gamesafe.js`)**
- **SoftStore App Detail Page & Download Flow (`softstoredetail.js`, `softstore.js`)**
- **Internet Data Limits & Speed Throttling (`network.nos.js`)**
- **SuperBank Add Funds Deposit Feature (`superbank.nos.js`)**

---

## [1.1.1] - 2026-08-28
- **About Device in Settings (`aboutdevice.js`, `settingsapp.js`, `deviceinfo.js`)**
- **Unified 3-Step Purchase Flow Modal (`purchasemodal.js`, `os.js`)**

---

## [1.1.0] - 2026-08-28
- **Local Web Browser (`browser.js`)**
- **Broadband ISP Subscription Portal (`network.nos.js`)**
- **Local Digital Banking Site (`superbank.nos.js`)**
- **Steam-Inspired App Store (`softstore.js`)**
- **Factory Reset Utility (`wipefresh.js`)**

---

## [1.0.0] - 2026-08-28
- **Initial Release of Nutrino OS**
