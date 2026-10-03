# Third-party notices

Clearly Recent's own code is BSD-3-Clause (Dizg). LICENSE retains the official Decky Plugin Template notice and the Deck Shelves / Jonathan Santos notice for adapted Home/per-client patterns.

## Bundled code

- @decky/api 1.1.3: LGPL-2.1; its unmodified distributed source, JavaScript, manifest, README and license are included in third-party/decky-api. Original project: https://github.com/SteamDeckHomebrew/loader-api.
- react-icons 5.7.0: MIT wrapper; license in third-party/notices/react-icons.txt. The FaFilter artwork is from Font Awesome 5, CC BY 4.0, by Fonticons, Inc. https://fontawesome.com/ and https://creativecommons.org/licenses/by/4.0/. No icon artwork edits are made.
- tslib 2.8.1: BSD-0-Clause, notice in third-party/notices/tslib.txt (included conservatively, regardless of tree-shaken output).

React, React DOM and @decky/ui are external runtime modules supplied by Decky/Steam; this ZIP does not redistribute their implementation. Build tools are not bundled runtime code.

## Rebuilding with a modified Decky API

The ZIP contains source/relink, the plugin source and build inputs, and third-party/decky-api with the API's distributed source/JavaScript. Copy source/relink into a new working directory. Use Node 20 and pnpm 9, install frozen dependencies, replace node_modules/@decky/api with a copy of third-party/decky-api, modify/recompile the API as needed, then run pnpm build. The plugin itself supplies no integrity check preventing use of a modified API. Decky compatibility is a separate concern. The API's original manifest/source explains its TypeScript build and dependencies.

These notices document observed upstream terms and source availability; they are not a legal determination that every downstream redistribution condition has been satisfied. Review changed dependency versions before future releases.
