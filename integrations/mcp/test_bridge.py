"""Check native/bridge negative-result parity without MCP transport dependencies."""
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NODE = shutil.which('node')
assert NODE, 'Node is required'
for capsule in ({}, {'files': []}, None):
    script = (
        "import {verifyResearchCapsuleBundle} from './packages/constraint-core/src/workbench.js';"
        'console.log(JSON.stringify(await verifyResearchCapsuleBundle('
        + json.dumps(capsule) + ')));'
    )
    native = subprocess.run([NODE, '--input-type=module', '-e', script], cwd=ROOT,
                            capture_output=True, check=True, timeout=30)
    bridge = subprocess.run([NODE, 'integrations/mcp/bridge.mjs'], cwd=ROOT,
                            input=json.dumps({'capsule': capsule}).encode(),
                            capture_output=True, check=True, timeout=30)
    actual = json.loads(bridge.stdout)
    assert actual == json.loads(native.stdout) and actual['ok'] is False
for raw in (b'{', b'x' * (1048576 + 1)):
    result = subprocess.run([NODE, 'integrations/mcp/bridge.mjs'], cwd=ROOT,
                            input=raw, capture_output=True, timeout=30)
    assert result.returncode != 0, 'Malformed/oversized input must not report success'
print('PASS: native/bridge negative parity; malformed and oversized input rejected')
