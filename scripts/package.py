"""Create and verify a frontend-only Decky installer archive."""
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
version = (root / 'VERSION').read_text().strip()
package = json.loads((root / 'package.json').read_text())
plugin = json.loads((root / 'plugin.json').read_text())
assert package['version'] == plugin['version'] == version
assert plugin['api_version'] == 1 and plugin['flags'] == []
assert (root / 'dist/index.js').stat().st_size > 0
files = ['plugin.json', 'package.json', 'VERSION', 'LICENSE', 'README.md', 'CHANGELOG.md', 'dist/index.js', 'THIRD_PARTY_NOTICES.md']
files += [str(p.relative_to(root)) for p in sorted((root / 'third-party').rglob('*')) if p.is_file()]
prefix = 'clearly-recent'
release = root / 'releases'
release.mkdir(exist_ok=True)
archive = release / f'{prefix}-{version}.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
    for name in files:
        output.write(root / name, f'{prefix}/{name}')
    # Build inputs allow relinking the LGPL API; no tests or internal reports.
    source_files = ['package.json', 'plugin.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json', 'rollup.config.js', 'scripts/build.mjs'] + [str(p.relative_to(root)) for p in sorted((root / 'src').glob('*')) if p.is_file()]
    for name in source_files:
        output.write(root / name, f'{prefix}/source/relink/{name}')
with zipfile.ZipFile(archive) as output:
    assert output.testzip() is None
    assert set(output.namelist()) == {f'{prefix}/{name}' for name in files} | {f'{prefix}/source/relink/{name}' for name in source_files}
    metadata = json.loads(output.read(f'{prefix}/plugin.json'))
    assert metadata == plugin
checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix('.zip.sha256').write_text(f'{checksum}  {archive.name}\n')
print(f'ZIP verified: {archive}\nSHA256: {checksum}')
