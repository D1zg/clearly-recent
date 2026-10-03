# Clearly Recent

Clearly Recent keeps your Steam Deck Home screen clean by hiding recently played games that are no longer installed locally.

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

Clearly Recent has not yet been accepted into the Decky Plugin Store. Once available, install through Decky Loader → Plugin Store → Clearly Recent → Install.

### Development / Manual installation

Transfer the release ZIP to your Steam Deck. In Decky settings, enable Developer mode and use Install from ZIP.

For upgrades from the earlier test names, uninstall the old plugin first to prevent two Home patches from running together. The manifest name and installation directory have changed; no stable separate Decky ID or saved settings are used. Open Library and return to Home after installation.

## Uninstallation

Decky → Plugins → Clearly Recent → Uninstall. The native behaviour returns after the next Home rerender, such as opening Library and returning to Home.

## Compatibility

Steam Deck with Decky Loader. The earlier 0.1.1 implementation was confirmed working on a real Steam Deck. For 1.0.0, the user confirmed Home works and the hidden counter displays 11 on SteamOS 3.8.16 Stable. The user also confirmed that a game remains visible during and after installation and disappears immediately after uninstall. The user confirmed correct operation after a full device restart. Uninstalling the plugin was confirmed to restore native Recent contents. Beta testing is pending.

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

AI tools were used during development. See [development provenance](docs/PROVENANCE.md) for the disclosure. Store eligibility and Beta testing remain pending.

## License

BSD-3-Clause; see LICENSE and THIRD_PARTY_NOTICES.md for upstream notices and bundled dependency terms.
