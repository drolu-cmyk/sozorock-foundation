#!/usr/bin/env python3
"""Exercise the restricted deployment and rollback without contacting AWS."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

MOCK = r'''#!/usr/bin/env python3
import json, os, pathlib, sys
a=sys.argv[1:]
root=pathlib.Path(os.environ['MOCK_ROOT'])
state=json.loads((root/'state.json').read_text())
mode=os.environ['MOCK_MODE']
def arg(k): return a[a.index(k)+1]
def emit(v): print(json.dumps(v))
def save(): (root/'state.json').write_text(json.dumps(state))
if pathlib.Path(sys.argv[0]).name == 'aws':
    op=' '.join(a[:2])
    state['calls'].append(op); save()
    if op == 'sts get-caller-identity': print('test-account')
    elif op == 'lambda get-function':
        emit({'Configuration': {'Handler':'src/handler.handler','State':'Active','RevisionId':'r1','Environment':{'Variables':state['env']}},'Code':{'Location':'https://example.invalid/original.zip'}})
    elif op == 'lambda get-function-configuration': print('r2')
    elif op == 'lambda update-function-configuration':
        state['env']=json.loads(pathlib.Path(arg('--environment')[7:]).read_text())['Variables']; save()
    elif op == 'lambda update-function-code':
        state['code']=pathlib.Path(arg('--zip-file')[8:]).read_text(); save()
    elif op == 'lambda wait': pass
    elif op == 'apigatewayv2 get-apis': emit({'Items':[{'Name':'test-api','ApiId':'test-id'}]})
    elif op == 'apigatewayv2 get-api': print('https://example.invalid')
    elif op == 'apigatewayv2 get-routes':
        auth='NONE' if mode == 'unsafe-route' else 'AWS_IAM'
        emit({'Items':[{'RouteId':str(i),'RouteKey':r,'AuthorizationType':auth} for i,r in enumerate(['GET /internal/health','GET /internal/v1/graphs','POST /internal/v1/run'])]})
    else: sys.exit('Unexpected AWS operation: '+op)
else:
    url=next(x for x in a if x.startswith('https://'))
    if url.endswith('original.zip'):
        pathlib.Path(arg('--output')).write_text('original-code'); sys.exit(0)
    payload={}; status='200'
    if '/publication/' in url:
        status='308'
        pathlib.Path(arg('--dump-header')).write_text('location: https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=guidance-release\r\n')
    elif url.endswith('/public/v1/navigate'):
        payload={'knowledgeVersion':'2026-10-19-primary-care-access','answer':'January 2027 Purcell Integrative Osteopathic Care'}
        if mode == 'bad-guidance': payload['answer']='obsolete content'
    elif url.endswith('/internal/health'):
        if '--aws-sigv4' in a: payload={'ok':True,'modelConfigured':False,'modelExecutionEnabled':False}
        else: status='403'
    elif url.endswith('/internal/v1/run'):
        status='503'; payload={'error':'model_execution_paused'}
        if mode == 'not-paused': status='200'
    else: sys.exit('Unexpected request')
    if arg('--output') != '/dev/null': pathlib.Path(arg('--output')).write_text(json.dumps(payload))
    print(status,end='')
'''

script = Path(__file__).with_name('deploy-public-guidance.sh')
for mode in ('success', 'unsafe-route', 'bad-guidance', 'not-paused'):
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        for command in ('aws', 'curl'):
            (root / command).write_text(MOCK)
            (root / command).chmod(0o700)
        initial = {'env': {'EXISTING_SETTING': 'preserved'}, 'code': 'original-code', 'calls': []}
        (root / 'state.json').write_text(json.dumps(initial))
        (root / 'package.zip').write_text('new-code')
        env = dict(os.environ, PATH=f'{root}:{os.environ["PATH"]}', MOCK_ROOT=str(root), MOCK_MODE=mode,
                   AWS_REGION='test-region', ACCOUNT_ID='test-account', FUNCTION_NAME='test-function',
                   API_NAME='test-api', LAMBDA_ZIP=str(root / 'package.zip'), RUNNER_TEMP=str(root),
                   GITHUB_OUTPUT=str(root / 'output'), FOUNDATION_MODEL_EXECUTION_ENABLED='false',
                   AWS_ACCESS_KEY_ID='test', AWS_SECRET_ACCESS_KEY='test', AWS_SESSION_TOKEN='test')
        result = subprocess.run(['bash', str(script)], env=env, capture_output=True, text=True)
        state = json.loads((root / 'state.json').read_text())
        if mode == 'success':
            assert result.returncode == 0, result.stderr
            assert state['code'] == 'new-code'
            assert state['env'] == {**initial['env'], 'FOUNDATION_MODEL_EXECUTION_ENABLED': 'false'}
            assert 'model_execution_paused=true' in (root / 'output').read_text()
        else:
            assert result.returncode != 0, mode
            assert state['code'] == initial['code'], mode
            assert state['env'] == initial['env'], mode
            if mode == 'unsafe-route':
                assert not any('update-' in call for call in state['calls'])
        assert not list(root.glob('foundation-guidance.*')), 'Temporary backup was not removed'
        print(f'Public guidance deployment: {mode} passed')
