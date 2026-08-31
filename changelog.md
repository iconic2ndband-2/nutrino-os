# Changelog — Nutrino OS

All notable changes to the Nutrino OS project will be documented in this file.

## [1.5.2] - 2026-08-31

### Added
- **Nitro Race Anniversary Edition (NRAE) (`nitroraceae.js`, `nitroraceae.menu.js`, `nitroraceae.game.js`, `nitroraceae.cars.js`, `nitroraceae.maps.js`, `nitroraceae.openworld.js`, `nitroraceae.screenshots.js`, `nitroraceae.controls.js`, `nitroraceae.icon.js`)**:
  - Exclusive Anniversary Edition game distributed exclusively via `makeracingstudio.nos` (not available in SoftStore).
  - 2-second custom loading screen with animated progress bar.
  - Strict 30 FPS physics/render lock with high-precision delta timing and real-time FPS telemetry.
  - 3 Playable Cars with distinctive tuning:
    - **CR-1** (Common): Balanced acceleration, 180 km/h top speed, agile street handling.
    - **FR-322** (Epic): High acceleration twin-turbo, 240 km/h top speed, responsive drift handling.
    - **456JJ** (Legendary): Extreme quad-turbo, 320 km/h top speed, stiff racing suspension.
  - 2 Playable Game Modes & Maps:
    - **Default Map**: 3-lane dynamic highway track with AI traffic avoidance and milestone checkpoints.
    - **Open World Map**: 300×300 unit 3D roamable environment with boundary fences, buildings, interactive ramps, dynamic mini-map with real-time player locator, and free-roam camera controls.
  - **Silent Pay System**: Seamless runtime balance metering at $5.00/second directly deducted from SuperBank checking account. Real-time balance check terminates session with warning if funds deplete.
  - **WebGL 2.0 / GPU Check**: Mandatory GPU hardware verification on launch; displays standard GPU failure screen if 3D acceleration is disabled or unsupported.
  - **Orientation Lock**: Landscape mode required with responsive orientation warning screen if portrait mode is detected.
  - **No Gamesafe / No Save System**: Raw arcade session persistence designed for pure anniversary celebration.
  - **Static Motion Blur Icon**: Custom canvas icon with static motion blur streaks for the home screen grid.
- **RaceMakingStudio Special Edition Integration (`makeracingstudio.se.js`, `makeracingstudio.nos.js`)**:
  - Anniversary Edition tab featuring NRAE with 3 official dynamic Canvas screenshots (Car Selection Menu, Default Track Race, 300×300 Open World).
  - Purchase flow ($200.00) with real-time SuperBank debiting.
  - Simulated 12.5 GB download progress tracking calculated against user ISP bandwidth speed.
  - Direct installation to Home Screen without SoftStore listing.

---

## [1.5.1] - 2026-08-29

### Added
- **Unified `osdb` IndexedDB Storage Engine (`osdb.js`, `store.js`, `os.js`)**:
  - Replaced all legacy `localStorage` persistence with a single unified IndexedDB database named `osdb` (version 1).
  - 9 structured object stores created natively: `settings`, `bank`, `internet`, `installed`, `notes`, `gallery`, `gamesafe`, `device`, `appdata`.
  - Automatic, non-destructive migration on first boot: pulls existing legacy `localStorage` keys into their respective `osdb` stores and cleans up `localStorage`.
  - Export and Import database backup functionality (`osdb.exportDatabase()`, `osdb.importDatabase()`).
- **`real-osdb` Live Storage & Database Inspector App (`realosdb.js`, `realosdb.render.js`, `realosdb.screenshots.js`)**:
  - Developed by *Rampage Report* (Utilities category, 10,000 MB, Free).
  - Live 1-second storage telemetry polling across all 9 object stores.
  - Interactive Store Explorer: filter by store, search records by key/query, view record sizes in bytes, and delete individual records.
  - Live Storage Breakdown chart and raw JSON database export with copy-to-clipboard and file download.
  - 4 Canvas screenshots generated dynamically in SoftStore (Overview, Stores, Search, Export) with screenshot tab switcher.
- **Rampage Report Company Portal (`rampage-report.nos.js`, `browser.js`)**:
  - Dedicated developer website on `.nos` sandbox network featuring dark red theme (`#1a0505`, `#ff3333`).
  - 4 informational and telemetry tabs: Home, Products, About, Support.
  - Direct integration with SoftStore for 1-click `real-osdb` acquisition.
- **Official Developer Branding Architecture (`constants.js`, `softstore.js`, `softstoredetail.js`, `settingsapp.js`)**:
  - Registered official developer identities across the OS:
    - **Wipe Fresh**: Developed by *Byloop*
    - **Nitro Race & Nitro Race SE**: Developed by *RaceMakingStudio*
    - **3DPapers**: Developed by *CoolFrost*
    - **Gamesafe**: Developed by *WhiteGames*
    - **Truespecs**: Developed by *Truespecs Technologies*
    - **real-osdb**: Developed by *Rampage Report*
  - **SoftStore Detail Integration**: App detail pages display prominent `Developer: [Name]` metadata with formatted typography.
  - **Settings App Manager**: Added an "Apps" section in Settings displaying all installed and catalog applications, their version, and official developer affiliations.
- **Dedicated Company Websites on Sandbox Browser (`byloop.nos.js`, `coolfrost.nos.js`, `whitegames.nos.js`, `rampage-report.nos.js`, `browser.js`)**:
  - **Byloop (`byloop.nos`)**: Dark blue/teal themed company portal with 5 interactive tabs (Home, About, Products, Support, Blog), featuring Wipe Fresh system recovery tools and direct SoftStore links.
  - **CoolFrost (`coolfrost.nos`)**: Cool blue/purple themed studio portal with 5 interactive tabs (Home, About, Products, Support, Blog), highlighting 3DPapers real-time WebGL engine shaders and battery preservation architecture.
  - **WhiteGames (`whitegames.nos`)**: High-contrast white/dark themed portal with 5 interactive tabs (Home, About, Products, Support, Blog), showcasing Gamesafe cloud save locking, security bulletins, and disaster recovery.
  - **Rampage Report (`rampage-report.nos`)**: Dark red themed developer portal highlighting deep database inspection tools.
  - **Browser Bookmark Cards & Address Bar Resolver**: Added home screen cards for all newly added `.nos` domains in the browser start page with fast, localized routing and responsive bandwidth delays.

---

## [1.5.0] - 2026-08-29

### Added
- **Separate Codebase Architecture Per App Version (`3dpapers.v1.js`, `3dpapers.v2.js`, `3dpapers.js`)**:
  - **Isolated v1.0.0 Base Codebase (`3dpapers.v1.js`)**: Complete, standalone v1.0.0 application featuring 5 premium 3D wallpapers (Nebula, Ocean, City, Volcano, Aurora), 2-step authentication, Gamesafe cloud persistence, 5-step billing, and direct desktop application (hiding v2.0-only assignment modals and lockscreen 3D).
  - **Cumulative v2.0.0 Codebase (`3dpapers.v2.js`)**: Comprehensive v2.0.0 release embedding all v1.0.0 features plus multi-screen wallpaper assignment (Home/Lock/Both), multi-buy / multi-assign capabilities, Lock Screen 3D rendering, and smart background performance pausing.
  - **Dynamic App Version Loader (`3dpapers.js`)**: Lightweight version dispatcher that dynamically queries the OS active version state (`os.getActiveVersion('3dpapers')`) and delegates mounting and unmounting to the active version codebase.
- **Universal 5-Second Update Scheduler (`os.js`, `os.versions.js`)**:
  - **`os.scheduleUpdateCheck(appId)` Engine**: Triggers an automated update check 5 seconds after installing or launching any application.
  - **In-App Toast & Modal Notifications**: Prompts user with options to "Download Update", "Remind Later", or "Ignore", seamlessly badging the SoftStore updates tab.
- **Fresh OS Initialization Protocol**:
  - **Latest OS Core (v1.5)**: Boots with complete Nutrino OS v1.5 kernel and device specs.
  - **All Pre-installed Apps at v1.0.0**: All pre-installed packages start on clean v1.0.0 builds with optional upgrade paths ready on demand.
  - **One-Active-Version Storage Accounting**: Update replaces active version with cumulative package; previous version files are retained cleanly for instantaneous or re-downloadable rollback.

---

## [1.2.3] - 2026-08-29

### Added
- **Home Screen Pagination Engine (`homescreen.js`, `style.css`)**:
  - **Dock Removal**: Completely removed the persistent bottom dock to maximize application grid space and align with the paginated layout.
  - **4×3 Grid Pagination (12 Apps Per Page)**: Home screen grid now cleanly divides applications across pages with exactly 12 apps per page (4 columns × 3 rows).
  - **Horizontal Swipe Navigation**: Smooth left and right swipe gestures to seamlessly paginate between home screen pages with minimum 50px threshold and vertical swipe rejection.
  - **Page Indicator Dots**: Glowing indicator dots at the bottom displaying active page state with direct-tap jump navigation.
  - **Alphabetized & Categorized App Sorting**: Applications are logically structured with System apps first (Phone, Messages, Clock, Calculator, Settings, Notes, Camera, Music, Gallery, Weather, Browser, SoftStore), followed by User-Installed apps, both ordered strictly alphabetically.
- **3DPapers Cumulative Storage & Download Accounting (`constants.js`, `softstore.js`, `softstoredetail.js`)**:
  - **Total App Size Display**: SoftStore Featured catalog and Detail page prominently display the comprehensive **2.7 GB** total device footprint (2.3 GB v1.0.0 base + 400 MB v2.0.0 update).
  - **Accurate Download Accounting**: Differentiates between fresh 2.7 GB full installation, incremental 400 MB updates, and 2.3 GB v1.0.0 rollbacks with real-time ISP bandwidth simulation.

---

## [1.2.2] - 2026-08-29

### Added
- **3DPapers v2.0.0 Live Upgrade (`3dpapers.update.js`, `3dpapers.assign.js`, `3dpapers.settings.js`, `3dpapers.wallpapers.js`)**:
  - **In-App 5-Second Update Detection**: Automatically prompts user to download the 400 MB v2.0.0 update package 5 seconds after launching 3DPapers v1.0.0, with "Remind Later" and "Ignore" actions that link to SoftStore badges.
  - **Wallpaper Assignment Engine**: Choose whether to apply 3D live wallpapers to **Home Screen Only**, **Lock Screen Only**, or **Both Screens**.
  - **Multi-Buy & Multi-Assign**: Full support for assigning distinct live 3D wallpapers to Home Screen (e.g. *Nebula Drift*) and Lock Screen (e.g. *Ocean Depths*), persisted in Gamesafe vault.
  - **Multi-Instance 3D Wallpaper Engine (`3dpapers.wallpapers.js`)**: Refactored to support concurrent rendering instances (`createInstance()`) for both Lock Screen and Home Screen canvases with independent animation loops.
  - **Performance Optimization & Visibility Pausing**: Intelligent lifecycle methods (`pause()`, `resume()`, `stop()`) that halt WebGL rendering loops whenever the respective screen is unmounted or in the background, conserving battery and GPU cycles.
  - **Lock Screen 3D Integration (`lockscreen.js`)**: Mounted interactive 3D WebGL background canvas for the lock screen with smooth swipe-to-unlock gesture coordination.
  - **Home Screen 3D Integration (`homescreen.js`)**: Background 3D WebGL canvas support with live rendering behind dynamic application grid and dock icons.
- **SoftStore Rollback Engine (`softstore.rollback.js`, `softstoredetail.versions.js`, `os.versions.js`)**:
  - **3DPapers v1.0.0 Rollback**: Dedicated "Rollback" action in SoftStore version history allowing downgrade from v2.0.0 back to v1.0.0.
  - **Full Package Re-download (2.3 GB)**: Real-time download progress modal with ISP-scaled bandwidth simulation and data usage accounting.
  - **Gamesafe Vault Data Preservation**: Completely preserves all multi-account profiles, usernames, active subscriptions, and user settings across rollbacks and version changes.
- **OS Kernel Versioning & Wallpaper Methods (`os.js`, `os.versions.js`)**:
  - Added `os.applyWallpaper(screen, wallpaperId)` to configure `nos_wp_home_3d` and `nos_wp_lock_3d`.
  - Added `os.getWallpaper3D(screen)` to query active 3D wallpaper per screen.
  - Added `os.rollbackApp(appId, targetVersion)` to handle safe version rollbacks.
  - Added `os.startUpdate(appId, targetVersion)` and `os.addUpdateBadge(appId)` for unified update state management.

---

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
