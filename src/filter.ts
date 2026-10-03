export interface ClientData {
  clientid?: string | number;
  installed?: boolean;
  is_installed?: boolean;
  display_status?: number;
}
export interface Overview {
  app_type?: number;
  is_non_steam?: boolean;
  installed?: boolean;
  is_installed?: boolean;
  m_bInstalled?: boolean;
  bInstalled?: boolean;
  per_client_data?: ClientData[] | ClientData;
  local_per_client_data?: ClientData[] | ClientData;
  remote_per_client_data?: ClientData[] | ClientData;
}
function entries(value: ClientData[] | ClientData | undefined): ClientData[] {
  return Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
}

function installed(entry: ClientData | undefined): boolean | undefined {
  if (!entry) return undefined;
  if (typeof entry.installed === 'boolean') return entry.installed;
  if (typeof entry.is_installed === 'boolean') return entry.is_installed;
  if (entry.display_status === 11) return true;
  if (entry.display_status === 9) return false;
  return undefined;
}

export function localInstalled(overview: Overview | undefined): boolean | undefined {
  if (!overview || overview.app_type === 1073741824 || overview.is_non_steam === true) return undefined;
  const clients = entries(overview.per_client_data);
  const dedicated = entries(overview.local_per_client_data);
  const local = clients.find((client) => String(client.clientid) === '0');
  const fallback = dedicated.find((client) => client.clientid === undefined || String(client.clientid) === '0');
  const state = installed(local) ?? installed(fallback);
  if (state !== undefined) return state;

  // Aggregate true can mean Remote Play; false is used only without conflicting client evidence.
  const remote = [...entries(overview.remote_per_client_data), ...clients.filter((client) => client.clientid !== undefined && String(client.clientid) !== '0')];
  const flags = [overview.installed, overview.is_installed, overview.m_bInstalled, overview.bInstalled];
  if (!clients.length && !dedicated.length && !remote.some((client) => installed(client) === true) && flags.includes(false) && !flags.includes(true)) return false;
  return undefined;
}

export function filterRecent(ids: number[], lookup: (id: number) => Overview | undefined) {
  const games = ids.filter((id) => {
    try { return localInstalled(lookup(id)) !== false; }
    catch { return true; }
  });
  return { games, hidden: ids.length - games.length };
}
