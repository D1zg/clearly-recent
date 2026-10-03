# Device regression tests

The user confirmed the 0.1.1 implementation loads in Decky, keeps Home working and hides games not installed locally. This does not establish the SteamOS channel or complete 1.0.0 regression coverage.

On 2026-10-03, the user reported that 1.0.0 Home works and the Hidden from Recent counter displays 11 on SteamOS 3.8.16 Stable. This confirms Home and counter rendering; Active status, actual removed-card count, installed-card preservation and remaining regression cases were not explicitly reported. Beta is a separate later step. Preview is not requested for this frontend-only plugin.

| Check | Stable | Beta |
|---|---|---|
| Plugin installs | Pending | Pending |
| Home loads normally | PASS — SteamOS 3.8.16 | Pending |
| Installed Recent remains | PASS — during installation and after completion | Pending |
| Uninstalled Recent is hidden | PASS — immediately after uninstall | Pending |
| Hidden count matches removed items | Pending | Pending |
| Minimal Decky panel opens | Counter observed: 11; Active status unconfirmed | Pending |
| Game Mode restart preserves behaviour | PASS — full device restart | Pending |
| Uninstall restores native behaviour after rerender | PASS — native Recent restored | Pending |

Also check Remote Play with explicit local false, unknown/non-Steam retention, all-hidden Home, controller focus and compatibility failure when practical. Report the actual SteamOS/Steam/Decky versions with test outcomes; screenshots are not required.

## First stage

Uninstall the earlier test plugin, install clearly-recent-1.0.0.zip, open Library → Home → Clearly Recent. Report whether Home works and the panel shows Active / Hidden from Recent. Later stages cover removal, restart and channel-specific regression.

## Stable follow-up — 2026-10-03

On SteamOS 3.8.16 Stable, the user confirmed the game remains visible during installation and after installation completes, and disappears immediately after uninstall. The user reported correct behaviour. Counter accuracy, Active status, restart and plugin-uninstall restoration were not separately confirmed. Immediate disappearance is an observed result of this test, not a guarantee of forced refresh on all Steam versions.

## Stable restart follow-up — 2026-10-03

The user confirmed that everything continues to work after a full device restart on SteamOS 3.8.16 Stable. Plugin-uninstall restoration remains pending. No separate literal Active-status or numerical counter-accuracy report was provided.

## Stable plugin-uninstall follow-up — 2026-10-03

The user confirmed that uninstalling Clearly Recent restored the native Recent contents. Core Stable scenarios are now confirmed: Home, installation-in-progress/installed visibility, hiding after game removal, full device restart and native restoration after plugin uninstall. Exact counter accuracy and a literal Active-status observation were not independently reported. Beta remains untested.
