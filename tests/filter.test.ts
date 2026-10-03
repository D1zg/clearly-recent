import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filterRecent, localInstalled } from '../src/filter';
test('local state wins over aggregate remote installation', () => {
  assert.equal(localInstalled({ installed: true, per_client_data: [{ clientid: '0', installed: false }, { clientid: '7', installed: true }] }), false);
  assert.equal(localInstalled({ installed: false, per_client_data: [{ clientid: 0, installed: true }] }), true);
});
test('unknown state remains visible; ordering and input are preserved', () => {
  const ids = [1, 2, 3, 4];
  const result = filterRecent(ids, (id) => id === 2 ? { installed: false } : id === 3 ? { per_client_data: [{ clientid: 0, installed: true }] } : undefined);
  assert.deepEqual(result.games, [1, 3, 4]);
  assert.deepEqual(ids, [1, 2, 3, 4]);
  assert.equal(result.hidden, 1);
});
test('empty and all-uninstalled lists are handled', () => {
  assert.deepEqual(filterRecent([], () => undefined).games, []);
  assert.deepEqual(filterRecent([1, 2], () => ({ installed: false })).games, []);
});
test('remote-only and malformed entries do not hide a game', () => {
  assert.equal(localInstalled({ per_client_data: [{ clientid: 9, installed: true }] }), undefined);
  assert.equal(localInstalled({ installed: true }), undefined);
  assert.equal(localInstalled({ local_per_client_data: [{ clientid: 0, installed: false }] }), false);
});
test('local status without installed flag resolves the v0.1.0 UNKNOWN case', () => {
  assert.equal(localInstalled({ installed: true, per_client_data: [{ clientid: 0, display_status: 11 }] }), true);
  assert.equal(localInstalled({ per_client_data: [{ clientid: 0, display_status: 9 }] }), false);
});
test('remote only is hidden, local plus remote stays visible', () => {
  const remote_per_client_data = [{ clientid: 8, display_status: 11 }];
  const result = filterRecent([1, 2], (id) => ({ per_client_data: [{ clientid: 0, display_status: id === 1 ? 9 : 11 }], remote_per_client_data }));
  assert.deepEqual(result.games, [2]);
  assert.equal(result.hidden, 1);
});
test('non-Steam shortcuts are preserved even with installed=false', () => {
  const result = filterRecent([1], () => ({ app_type: 1073741824, installed: false }));
  assert.equal(result.hidden, 0);
  assert.deepEqual(result.games, [1]);
});
test('local object aliases work and explicit boolean wins over status', () => {
  assert.equal(localInstalled({ local_per_client_data: { is_installed: false, display_status: 11 } }), false);
  assert.equal(localInstalled({ per_client_data: { clientid: 0, display_status: 11 } }), true);
});
test('transient, invalid and missing-client states remain unknown', () => {
  for (const display_status of [0, 3, 6, 19, 999]) assert.equal(localInstalled({ per_client_data: [{ clientid: 0, display_status }] }), undefined);
  assert.equal(localInstalled({ per_client_data: [{ display_status: 9 }] }), undefined);
});
test('lookup errors do not prevent filtering other apps', () => {
  const result = filterRecent([1, 2], (id) => { if (id === 1) throw Error('not ready'); return { local_per_client_data: { display_status: 9 } }; });
  assert.equal(result.hidden, 1);
  assert.deepEqual(result.games, [1]);
});
test('aggregate aliases stay guarded by conflicting flags and remote evidence', () => {
  for (const key of ['installed', 'is_installed', 'm_bInstalled', 'bInstalled']) {
    assert.equal(localInstalled({ [key]: false }), false);
    assert.equal(localInstalled({ [key]: false, per_client_data: [{ clientid: 8, installed: true }] }), undefined);
  }
  assert.equal(localInstalled({ m_bInstalled: false, bInstalled: true }), undefined);
  assert.deepEqual(filterRecent([1], () => ({ is_non_steam: true, bInstalled: false })).games, [1]);
});
