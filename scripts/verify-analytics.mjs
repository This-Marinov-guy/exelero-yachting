import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { generateKeyPairSync, verify } from 'node:crypto';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function loadTs(file, overrides = {}) {
  const source = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', source)((id) => id in overrides ? overrides[id] : require(id), mod, mod.exports);
  return mod.exports;
}
const helpers = loadTs('../src/lib/analytics/report.ts');
const { resolvePeriod, validatePage, parseAnalytics, pieSegments, searchPageExpression } = helpers;
const now = new Date('2026-10-05T11:00:00Z');
assert.equal(resolvePeriod('month', '2024-02', 'Europe/Amsterdam', now).end, '2024-02-29');
assert.equal(resolvePeriod('month', '2026-10', 'Europe/Amsterdam', now).end, '2026-10-05');
assert.equal(resolvePeriod(null, null, 'America/Los_Angeles', new Date('2026-10-01T00:30:00Z')).date, '2026-09');
const range=resolvePeriod('range',null,'Europe/Amsterdam',now,'2026-09-29','2026-10-05');
assert.equal(range.start,'2026-09-29');assert.equal(range.end,'2026-10-05');
for(const [from,to] of [['2026-02-30','2026-03-01'],['2026-10-06','2026-10-06'],['2026-10-04','2026-10-03'],['2024-01-01','2025-01-02']]) assert.throws(()=>resolvePeriod('range',null,'Europe/Amsterdam',now,from,to));
for (const [kind,date] of [['week','2026-10'],['day','2026-02-30'],['month','2026-13'],['day','2026-10-06'],['month','1999-01']]) assert.throws(()=>resolvePeriod(kind,date,'Europe/Amsterdam',now));
for (const page of ['//evil.test','/account?secret=x','/hello\nworld','https://example.com','/back\\slash']) assert.throws(()=>validatePage(page));
assert.equal(validatePage('/partners/udeck'),'/partners/udeck');
const expression = new RegExp(searchPageExpression('/boats/a.b', ['example.com','www.example.com']));
assert(expression.test('https://www.example.com/boats/a.b?utm_source=test'));
assert(!expression.test('https://example.com/boats/axb'));
assert(!expression.test('https://evil.com/boats/a.b'));
const rows = (dimensions, metrics, values) => ({dimensionHeaders:dimensions.map(name=>({name})),metricHeaders:metrics.map(name=>({name})),rows:values.map(([d,m])=>({dimensionValues:d.map(value=>({value})),metricValues:m.map(value=>({value:String(value)}))})), rowCount:values.length,metadata:{timeZone:'Europe/Amsterdam'}});
const summary=rows([],['sessions','totalUsers','screenPageViews','engagementRate'],[[[],[12,7,25,0.5]]]);
const series=rows(['date'],['sessions','totalUsers','screenPageViews'],[[['20261001'],[6,5,12]],[['20261002'],[6,5,13]]]);
const empty=rows([],[],[]);
const countries=rows(['country'],['sessions'],[[['Bulgaria'],[8]],[['Netherlands'],[4]]]);
const devices=rows(['deviceCategory'],['sessions'],[[['desktop'],[9]],[['mobile'],[3]]]);
const channels=rows(['sessionDefaultChannelGroup'],['sessions'],[[['Direct'],[10]],[['Referral'],[2]]]);
const sources=rows(['sessionSource','sessionMedium'],['sessions'],[[['(direct)','(none)'],[10]],[['example.com','referral'],[2]]]);
const parsed=parseAnalytics([summary,series,empty,countries,devices,channels,sources],resolvePeriod('month','2026-10','Europe/Amsterdam',now),now);
assert.equal(parsed.totals.visitors,7,'Period unique visitors must not be summed from daily users.');
assert.deepEqual(parsed.countries,[{name:'Bulgaria',value:8},{name:'Netherlands',value:4}]);
assert.deepEqual(parsed.devices,[{name:'Desktop',value:9},{name:'Mobile',value:3}]);
assert.deepEqual(parsed.channels,[{name:'Direct',value:10},{name:'Referral',value:2}]);
assert.equal(parsed.sources[1].name,'example.com / referral');
assert.equal(parsed.traffic.reduce((n,row)=>n+row.visitors,0),10);
assert.equal(parsed.traffic.length,5);
assert.equal(parsed.traffic[4].visits,0);
assert.equal(parseAnalytics([summary,empty,empty,empty,empty,empty,empty],resolvePeriod('day','2026-10-05','Europe/Amsterdam',now),now).traffic.length,14);
assert.equal(parseAnalytics([summary,empty,empty,empty,empty,empty,empty],resolvePeriod('day','2026-09-01','Europe/Amsterdam',now),now).traffic.length,24);
assert.equal(parseAnalytics([summary,series,empty,empty,empty,empty,empty],resolvePeriod('range',null,'Europe/Amsterdam',now,'2026-10-01','2026-10-03'),now).traffic.length,3);
assert.throws(()=>parseAnalytics([],resolvePeriod(null,null,'Europe/Amsterdam',now)));
const segments=pieSegments(Array.from({length:10},(_,i)=>({name:`Source ${i}`,value:i+1})));
assert.equal(segments.length,7);assert.equal(segments.reduce((sum,item)=>sum+item.value,0),55);
assert.deepEqual(pieSegments([{name:'None',value:0}]),[]);

// Exercise the real server implementation with generated credentials and intercepted Google HTTP.
const savedEnv={...process.env};
const {privateKey, publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
process.env.GOOGLE_SERVICE_ACCOUNT_JSON=JSON.stringify({client_email:'test@example.invalid',private_key:privateKey.export({type:'pkcs8',format:'pem'})});
process.env.GA4_PROPERTY_ID='123';process.env.SEARCH_CONSOLE_SITE_URL='sc-domain:example.com';process.env.ANALYTICS_HOSTNAMES='example.com,www.example.com';process.env.ANALYTICS_TIME_ZONE='Europe/Amsterdam';
let calls=[];let failSearch=false;let expectedStart='2026-09-01';let expectedEnd='2026-09-30';const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{
  calls.push({url,options});
  if(url==='https://oauth2.googleapis.com/token') {
    const assertion=options.body.get('assertion');const [header,payload,signature]=assertion.split('.');
    assert(verify('RSA-SHA256',Buffer.from(`${header}.${payload}`),publicKey,Buffer.from(signature,'base64url')));
    const claims=JSON.parse(Buffer.from(payload,'base64url'));assert.match(claims.scope,/analytics.readonly/);assert.match(claims.scope,/webmasters.readonly/);
    return Response.json({access_token:'fixture-secret-token',expires_in:3600});
  }
  assert.equal(options.headers.Authorization,'Bearer fixture-secret-token');
  const body=JSON.parse(options.body);
  if(url.includes('batchRunReports')) {
    assert(body.requests.length<=5);
    return Response.json({reports:body.requests.map(request=>{
      assert.equal(request.dateRanges[0].startDate,expectedStart);assert.equal(request.dateRanges[0].endDate,expectedEnd);
      assert(request.dimensionFilter.andGroup.expressions.some(item=>item.filter?.fieldName==='hostName'));
      assert(request.dimensionFilter.andGroup.expressions.some(item=>item.notExpression));
      if(!request.dimensions.length)return summary;
      return rows(request.dimensions.map(item=>item.name),request.metrics.map(item=>item.name),[]);
    })});
  }
  assert(url.includes(encodeURIComponent('sc-domain:example.com')));
  if(failSearch)return Response.json({error:{message:'PRIVATE-UPSTREAM-DETAIL'}},{status:403});
  assert.equal(body.dataState,'all');
  return Response.json({rows:[{keys:['yachts for sale'],clicks:12,impressions:150,ctr:0.08,position:4.2}],metadata:{first_incomplete_date:'2026-09-30'}});
};
try {
  const clarity={status:'not_configured',dashboardUrl:'https://clarity.microsoft.com/projects/view/test/dashboard'};
  const {getAnalyticsReport}=loadTs('../src/lib/analytics/server.ts',{'server-only':{},'./report':helpers,'@/lib/clarityServer':{getTrackingReport:async()=>clarity}});
  const params=new URLSearchParams({period:'month',date:'2026-09'});
  const results=await Promise.all(Array.from({length:3},()=>getAnalyticsReport(params)));
  assert.equal(calls.length,4,'Concurrent requests must share token and provider work.');
  const requestedDimensions=calls.filter(call=>call.url.includes('batchRunReports')).flatMap(call=>JSON.parse(call.options.body).requests.map(request=>request.dimensions.map(item=>item.name).join(',')));
  for(const dimension of ['country','deviceCategory','sessionDefaultChannelGroup','sessionSource,sessionMedium']) assert(requestedDimensions.includes(dimension));
  assert.deepEqual(results[1],results[0]);assert.equal(results[0].analytics.status,'ready');assert.equal(results[0].search.data.queries[0].clicks,12);assert.deepEqual(results[0].clarity,clarity);
  await getAnalyticsReport(params);assert.equal(calls.length,4,'Successful reports are cached.');
  expectedStart='2026-09-15';expectedEnd='2026-09-17';
  const ranged=await getAnalyticsReport(new URLSearchParams({period:'range',from:expectedStart,to:expectedEnd}));assert.equal(ranged.period.kind,'range');assert.equal(ranged.analytics.data.traffic.length,3);
  expectedStart='2026-09-01';expectedEnd='2026-09-30';
  assert(!JSON.stringify(results).includes('fixture-secret-token'));
  failSearch=true;params.set('page','/partners/udeck');
  const partial=await getAnalyticsReport(params);assert.equal(partial.analytics.status,'ready');assert.equal(partial.search.status,'error');assert(!JSON.stringify(partial).includes('PRIVATE-UPSTREAM-DETAIL'));
  const gaRequest=calls.filter(call=>call.url.includes('batchRunReports')).at(-2);
  assert(JSON.parse(gaRequest.options.body).requests[0].dimensionFilter.andGroup.expressions.some(item=>item.filter?.fieldName==='pagePath'&&item.filter.stringFilter.value==='/partners/udeck'));
  const before=calls.length;await getAnalyticsReport(params);assert(calls.length>before,'Retry must not reuse failed reports.');
  delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const disconnected=await getAnalyticsReport(params);assert.equal(disconnected.analytics.status,'not-connected');assert.equal(disconnected.search.status,'not-connected');
  assert(!JSON.stringify(disconnected).includes('private_key'));
} finally {globalThis.fetch=originalFetch;process.env=savedEnv;}
console.log('PASS: calendar and date-range boundaries, page validation, country/device/channel breakdowns, unique-user totals, hourly bounds, pie totals, signed OAuth, read-only scopes, date/page/host filters, independent providers, token privacy and cache coalescing.');
