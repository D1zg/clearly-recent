# Clearly Recent — Hide Uninstalled Games from Steam Deck Home

[Download v1.0.0](https://github.com/D1zg/clearly-recent/releases/tag/v1.0.0) · [Source code](https://github.com/D1zg/clearly-recent) · [Store submission](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/1138)

A Decky Loader plugin that hides uninstalled games from the Steam Deck Home Recent Games carousel, keeping its native layout, navigation and game order.

Built to solve a small annoyance on my own Steam Deck, and shared freely with the community.

## Screenshots

The same Steam Deck Home carousel before and after enabling Clearly Recent. Games explicitly reported as not installed locally are hidden, while the remaining games keep their order.

| Before | After |
| --- | --- |
| ![Home carousel before enabling Clearly Recent](docs/screenshots/before.jpg) | ![Home carousel after enabling Clearly Recent](docs/screenshots/after.jpg) |

## What it does

Steam normally keeps recently played games on the Home screen even after they are uninstalled. Clearly Recent removes those uninstalled games from the Home Recent Games carousel. Installed games remain untouched.

## What it does NOT do

- Does not remove games from your Steam library.
- Does not modify play history.
- Does not uninstall games.
- Does not edit Steam database records.
- Does not replace the native Home carousel.

## Behaviour

Before:
- Installed Game A
- Uninstalled Game B
- Installed Game C

After:
- Installed Game A
- Installed Game C

## Remote Play

A remote-only game is hidden when Steam explicitly reports it as not installed locally. A remote installation without reliable local evidence remains visible.

## Non-Steam Games

Non-Steam shortcuts are intentionally preserved.

## Unknown states

If Steam does not provide enough reliable install-state information, Clearly Recent keeps the game visible instead of hiding it incorrectly. Unsupported and transitional states are preserved.

## Installation

Clearly Recent is available for manual installation from GitHub. The [Decky Plugin Store submission #1138](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/1138) was closed without merging on October 8, 2026. It is not available in the Store.

Development has concluded for this release. Version 1.0.0, its source code and release downloads remain available; no further updates are promised.

### Development / Manual installation

1. Download `clearly-recent-1.0.0.zip` from the [v1.0.0 release](https://github.com/D1zg/clearly-recent/releases/tag/v1.0.0).
2. Transfer the ZIP to your Steam Deck.
3. In Decky settings, enable Developer mode and use **Install from ZIP**.
4. Open Library and return to Home.

For upgrades from the earlier test names, uninstall the old plugin first to prevent two Home patches from running together. The manifest name and installation directory have changed; no stable separate Decky ID or saved settings are used. Open Library and return to Home after installation.

## Uninstallation

Decky → Plugins → Clearly Recent → Uninstall. The native behaviour returns after the next Home rerender, such as opening Library and returning to Home.

## Compatibility

Steam Deck with Decky Loader. The earlier 0.1.1 implementation was confirmed working on a real Steam Deck. For 1.0.0, the user confirmed Home works and the hidden counter displays 11 on SteamOS 3.8.16 Stable. The user also confirmed that a game remains visible during and after installation and disappears immediately after uninstall. The user confirmed correct operation after a full device restart. Uninstalling the plugin was confirmed to restore native Recent contents. The maintainer also reported successful Beta testing in the Store submission. No independent third-party testing report is claimed.

## Known limitations

- Relies on internal Steam UI structures.
- Major Steam UI changes may require an update.
- Conservative unknown handling may leave an uninstalled game visible if Steam exposes insufficient state.
- Installation changes are reflected on the next native Recent render.

## Development

Use Node 20 and pnpm 9.15.9:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm release` requires Python 3 and creates a verified ZIP with a SHA256 checksum. GitHub Actions produces artifacts; it does not publish releases automatically.

## Credits

- Decky Loader / Steam Deck Homebrew.
- The official [Decky Plugin Template](https://github.com/SteamDeckHomebrew/decky-plugin-template).
- [Deck Shelves](https://github.com/santojon/Deck-Shelves) / Jonathan Santos: technical reference for adapted Home render hooks and per-client installation signals.

AI tools were used during development. See [development provenance](docs/PROVENANCE.md) for the disclosure. The Store review raised concerns about an inaccurate AI checkbox and the use of hooks. The maintainer acknowledged substantial AI involvement and corrected the statement in the [PR discussion](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/1138#issuecomment-6065879528).

## License

BSD-3-Clause; see LICENSE and THIRD_PARTY_NOTICES.md for upstream notices and bundled dependency terms.

## Support

Clearly Recent is free and open source, built for my own Steam Deck and shared with the community. If it is useful to you, a small tip is always appreciated.

**USDT · TON receiving address:**

```text
UQADALs2Um3G3DQkc5C4ZjiZCqHMi-uL5cllUtgsRDMJLwD6
```

[![Open World — Donate](https://img.shields.io/badge/Open%20World-Donate-yellow.svg)](https://t.me/walt/start?startapp=main-utm_src__wb-utm_md__owned-utm_cp__EN)

Copy the address above, then click the button to open **Walt (formerly Telegram Wallet)** in Telegram. Send **USDT on the TON network** to the copied address; the button does not prefill the recipient or send funds.

**USDT · TON only.** Minimum deposit shown by Wallet: **0.01 USDT**, excluding sender fees. Check the asset, network and full address before confirming.

<img src="docs/support/usdt-ton-qr.png" alt="Original receiving QR code from Telegram Wallet" width="180" />

Scan the original Wallet QR code if preferred, and select USDT on TON in your wallet. Deposits from sanctioned exchanges may be frozen by the receiving Wallet.
