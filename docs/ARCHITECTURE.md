# Architecture

Clearly Recent is a frontend-only Decky plugin with three responsibilities:

- index.tsx owns the Decky lifecycle and minimal status panel.
- steamAdapter.ts contains all private Steam UI hooks and teardown.
- filter.ts contains conservative install-state filtering.

The Home route `/library/home` is patched through Decky's router hook. The existing nested afterPatch render chain locates Recent by autoFocus/showBackground, then locates the native games/onItemFocus holder. AppIDs are read from its games input. The Steam appStore provides GetAppOverviewByAppID; no global store data is written.

Local clientid 0 (number/string) installed/is_installed wins; otherwise numeric display_status 11/9 provides true/false. Dedicated local_per_client_data accepts absent clientid. Object/array forms and the earlier guarded negative aggregate aliases are retained. Unknown, transitional states and non-Steam shortcuts remain visible. Remote-only with explicit local false is hidden; remote evidence without local evidence is preserved. Each lookup error preserves its AppID.

Filtered AppIDs retain order and are passed into a cloned native holder. Empty filtered input suppresses only that holder. Component render exceptions in our callbacks return original output. WeakSet prevents duplicate patches. Active gates, deferred publication, route removal and reverse component unpatch preserve the lifecycle; stop is idempotent. Unload affects the next native rerender, without forced navigation or CSS/DOM mutation.

The working 0.1.1 chain is retained for 1.0.0. The user confirmed core 1.0.0 behaviour on SteamOS 3.8.16 Stable, including restart and native restoration after uninstall. Beta testing is pending. The panel becomes Active only after a holder has been processed; a compatibility timeout/errors report Inactive. No settings, backend, telemetry or recent limit are implemented.

Reference: official Decky Plugin Template and Deck Shelves Home/per-client patterns; notices are included. See TESTING.md and docs/PROVENANCE.md for validation and development provenance.
