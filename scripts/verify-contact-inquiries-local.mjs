import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync, openSync, closeSync } from 'node:fs';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

// Never loads .env.local into the test process. All database/mail credentials
// passed to the isolated Next server explicitly target local services.
const local = Object.fromEntries(execFileSync('supabase', ['status', '-o', 'env'], {encoding:'utf8',stdio:['ignore','pipe','pipe']}).split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1).replace(/^"|"$/g,'')]}));
assert.match(local.API_URL, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const directDatabase = process.argv.includes('--direct-db');
const db = createClient(local.API_URL, local.SERVICE_ROLE_KEY, {auth:{persistSession:false}});
const anon = createClient(local.API_URL, local.ANON_KEY, {auth:{persistSession:false}});
const tag = `inquiry-test-${Date.now()}`;
const site = 'http://localhost:3002';
const recipients = ['notify-one@example.invalid','notify-two@example.invalid'];
const messages = [];
const sockets = new Set();
let rejectRecipient;
const smtp = createServer(socket=>{
  sockets.add(socket); socket.on('close',()=>sockets.delete(socket));
  socket.write('220 localhost Test SMTP\r\n');
  let buffer='', inData=false, content=[], to=[];
  socket.on('data',chunk=>{
    buffer+=chunk.toString();
    while(buffer.includes('\r\n')){
      const i=buffer.indexOf('\r\n'), line=buffer.slice(0,i); buffer=buffer.slice(i+2);
      if(inData){
        if(line==='.') { messages.push({to:[...to],raw:content.join('\r\n')}); inData=false; socket.write('250 Accepted\r\n'); }
        else content.push(line.replace(/^\.\./,'.'));
      } else if (/^(EHLO|HELO)/i.test(line)) socket.write('250-localhost\r\n250-AUTH PLAIN\r\n250 SIZE 1048576\r\n');
      else if (/^AUTH/i.test(line)) socket.write('235 Authenticated\r\n');
      else if (/^MAIL FROM/i.test(line)) {to=[];content=[];socket.write('250 OK\r\n');}
      else if (/^RCPT TO/i.test(line)) {
        const address=line.match(/<([^>]+)>/)?.[1];
        if(address===rejectRecipient) socket.write('451 Temporary test failure\r\n');
        else {to.push(address);socket.write('250 OK\r\n');}
      } else if (/^DATA$/i.test(line)) {inData=true;socket.write('354 Send data\r\n');}
      else if (/^QUIT$/i.test(line)) socket.end('221 Bye\r\n');
      else socket.write('250 OK\r\n');
    }
  });
});
let server, uid, partnerId, boatId, log;
const backups = new Map(['tsconfig.json','next-env.d.ts'].map(name=>[name,readFileSync(name)]));
const request = async(path, body)=>{
  const response=await fetch(site+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {status:response.status,body:await response.json()};
};
const payload = (patch={})=>({request_id:randomUUID(),name:'Local inquiry verification',email:'visitor@example.invalid',phone:'+31 20 123 4567',message:'Please send details. <script>test</script>\nThank you.',...patch});
const ensure = result=>{assert.ifError(result.error);return result.data};
try {
  smtp.listen(0,'127.0.0.1'); await once(smtp,'listening');
  const password=randomUUID();
  const user=ensure(await db.auth.admin.createUser({email:`${tag}@example.invalid`,password,email_confirm:true}));uid=user.user.id;
  const account=createClient(local.API_URL,local.ANON_KEY,{auth:{persistSession:false}});
  ensure(await account.auth.signInWithPassword({email:`${tag}@example.invalid`,password}));
  const cookies=new Map();
  const accountWithCookies=createServerClient(local.API_URL,local.ANON_KEY,{cookies:{
    getAll:()=>[...cookies].map(([name,value])=>({name,value})),
    setAll:items=>items.forEach(({name,value})=>cookies.set(name,value)),
  }});
  ensure(await accountWithCookies.auth.signInWithPassword({email:`${tag}@example.invalid`,password}));
  const cookieHeader=()=>[...cookies].map(([name,value])=>`${name}=${value}`).join('; ');
  const partner=ensure(await db.from('partners').insert({slug:tag,name:'Inquiry verification partner',logo_url:'/assets/images/logo/udeck.png',breadcrumb_image_url:'/assets/images/breadcrumbs/udeck.jpg',content:'Local inquiry verification.',status:'published',form_type:'custom',custom_fields:[{id:'interest',label:'Interest',type:'select',required:true,options:['Sailing','Motor']}]}).select('id').single());partnerId=partner.id;
  const boat=ensure(await db.from('boats').insert({user_id:uid,slug:tag,active:true,bought:false}).select('id').single());boatId=boat.id;
  ensure(await db.from('boat_data').insert({boat_id:boatId,title:'Inquiry verification yacht',manufacturer:'Local test',build_year:'2025',location:'Amsterdam',description:'Local contact form verification.',hull_length:12,beam:4,draft:2,displacement:8000,engine_power:40}));
  log=openSync('/private/tmp/exelero-inquiry-server.log','w');
  const serverEnv={...process.env,NEXT_DIST_DIR:'.next-inquiry-check',NEXT_PUBLIC_SUPABASE_URL:local.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:local.ANON_KEY,NEXT_PUBLIC_SITE_URL:site,GMAIL_HOST:'127.0.0.1',GMAIL_PORT:String(smtp.address().port),GMAIL_USERNAME:'test@example.invalid',GMAIL_PASSWORD:'local-test-only',GMAIL_ENCRYPTION:'none',GMAIL_FROM_ADDRESS:'test@example.invalid',NOTIFICATION_TO_EMAIL:JSON.stringify(recipients)};
  delete serverEnv.SUPABASE_SECRET_KEY;
  delete serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  delete serverEnv.SUPABASE_DB_URL;
  if(directDatabase) serverEnv.SUPABASE_DB_URL=local.DB_URL;
  else serverEnv.SUPABASE_SERVICE_ROLE_KEY=local.SERVICE_ROLE_KEY;
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--port','3002'],{stdio:['ignore',log,log],env:serverEnv});
  for(let i=0;i<90;i++){
    if(server.exitCode!==null) throw new Error('Verification server failed to start. See /private/tmp/exelero-inquiry-server.log');
    try{await fetch(site+'/api/boats/invalid/inquiries',{method:'POST'});break;}catch{await delay(1000);}
  }
  const boatPath=`/api/boats/${boatId}/inquiries`, partnerPath=`/api/partners/${tag}/inquiries`;
  const before=messages.length;
  assert.equal((await request(boatPath,payload({message:'x'.repeat(3001)}))).status,400);
  assert.equal((await request(boatPath,payload({email:'bad-email'}))).status,400);
  assert.equal((await request(partnerPath,payload({interest:'Invalid'}))).status,400);
  assert.equal((await request(boatPath,payload({website_check:'spam'}))).status,200);
  assert.equal(messages.length,before);
  const standard=payload();
  { const result=await request(boatPath,standard); assert.equal(result.status,200,JSON.stringify(result.body)); }
  let row=ensure(await db.from('boat_inquiries').select('*').eq('id',standard.request_id).single());
  for(const key of ['name','email','phone','message']) assert.equal(row[key],standard[key]);
  assert.equal(row.boat_id,boatId);assert(row.notification_sent_at);assert.deepEqual(row.notification_delivered_to,recipients);
  assert.equal(messages.length,2);
  assert(messages.every(mail=>mail.raw.includes('Reply-To:')));
  assert(messages.every(mail=>mail.raw.includes('&lt;script&gt;')));
  assert(messages.every(mail=>mail.raw.includes('Phone:')));
  assert(messages.every(mail=>mail.raw.includes('/services/brokerage/')));
  { const result=await request(boatPath,standard); assert.equal(result.status,200,JSON.stringify(result.body)); }
  assert.equal(messages.length,2,'Retry after success must not resend emails.');
  assert.equal((await request(boatPath,{...standard,message:'Attempt to overwrite'})).status,409);
  rejectRecipient=recipients[1];
  const custom=payload({interest:'Sailing'});
  const failed=await request(partnerPath,custom);
  assert.equal(failed.status,202);assert.equal(failed.body.ok,true);assert.equal(failed.body.notification,'pending');
  row=ensure(await db.from('partner_inquiries').select('*').eq('id',custom.request_id).single());
  assert.equal(row.phone,custom.phone);assert.equal(row.message,custom.message);assert.equal(row.answers.interest,'Sailing');
  assert.equal(row.notification_sent_at,null);assert.deepEqual(row.notification_delivered_to,[recipients[0]]);
  rejectRecipient=undefined;
  const retryPath=`/api/admin/inquiries/partner/${custom.request_id}/retry`;
  assert.equal((await fetch(site+retryPath,{method:'POST',headers:{origin:site}})).status,403,'Anonymous visitors cannot retry email.');
  const retry=await fetch(site+retryPath,{method:'POST',headers:{origin:site,cookie:cookieHeader()}});
  assert.equal(retry.status,200,JSON.stringify(await retry.json()));
  assert.equal(messages.length,4,'Partial failure retry must send only to the outstanding recipient.');
  row=ensure(await db.from('partner_inquiries').select('*').eq('id',custom.request_id).single());
  assert(row.notification_sent_at);assert.deepEqual(row.notification_delivered_to,recipients);
  const race=payload();
  const concurrent=await Promise.all([request(boatPath,race),request(boatPath,race)]);
  assert(concurrent.every(result=>[200,202].includes(result.status)));
  assert(concurrent.some(result=>result.status===200));
  assert.equal(messages.length,6,'Concurrent requests must send only one message per recipient.');
  const blankBoat=payload({message:''});
  { const result=await request(boatPath,blankBoat); assert.equal(result.status,200,JSON.stringify(result.body)); }
  row=ensure(await db.from('boat_inquiries').select('*').eq('id',blankBoat.request_id).single());
  assert.equal(row.message,'');
  const blankPartner=payload({interest:'Sailing',message:undefined});
  { const result=await request(partnerPath,blankPartner); assert.equal(result.status,200,JSON.stringify(result.body)); }
  row=ensure(await db.from('partner_inquiries').select('*').eq('id',blankPartner.request_id).single());
  assert.equal(row.message,'');
  assert(messages.slice(-4).every(mail=>!mail.raw.includes('Message:')),'Blank messages should be omitted from notifications.');
  const contactEmail=`${tag}-contact@example.invalid`;
  { const result=await request('/api/contact',{firstName:'Local',lastName:'Contact',email:contactEmail,number:'1234567890',message:''}); assert.equal(result.status,200,JSON.stringify(result.body)); }
  row=ensure(await db.from('contact').select('message').eq('email',contactEmail).single());
  assert.equal(row.message,'');
  for(const table of ['boat_inquiries','partner_inquiries']){
    const result=await anon.from(table).select('*');assert(result.error || result.data.length===0,'Public inquiry reads must fail.');
    const rows=ensure(await account.from(table).select('id'));assert(rows.length>0,'An invited account can read inquiries.');
    const write=await anon.from(table).insert(table==='boat_inquiries'?{boat_id:boatId,name:'Anonymous',email:'a@example.invalid',message:'Direct write',context_name:'test',context_path:'/'}:{partner_id:partnerId,name:'Anonymous',email:'a@example.invalid',message:'Direct write'});
    assert(write.error,'Direct public inserts must be denied.');
  }
  ensure(await db.from('boats').update({active:false}).eq('id',boatId));
  assert.equal((await request(boatPath,payload())).status,404);
  ensure(await db.from('boats').update({active:true,bought:true}).eq('id',boatId));
  assert.equal((await request(boatPath,payload())).status,404);
  ensure(await db.from('boats').update({bought:false}).eq('id',boatId));
  ensure(await db.from('partners').update({status:'draft'}).eq('id',partnerId));
  assert.equal((await request(partnerPath,payload({interest:'Sailing'}))).status,404);
  ensure(await db.from('partners').update({status:'published',form_type:'standard'}).eq('id',partnerId));
  assert.equal((await request(partnerPath,payload())).status,200);
  console.log(`PASS (${directDatabase?'direct database':'Supabase API'}): boat, partner, and contact forms accept blank messages; inquiry fields, notifications, validation, privacy, retries, and concurrent submits verified.`);
  if(process.argv.includes('--serve')){
    const pending=ensure(await db.from('boat_inquiries').insert({boat_id:boatId,name:'Pending inquiry check',email:'pending@example.invalid',message:'Please send the yacht details.',context_name:'Inquiry verification yacht',context_path:`/services/brokerage/${tag}`}).select('id').single());
    console.log(`Browser fixtures: ${site}/services/brokerage/${tag} and ${site}/partners/${tag}`);
    writeFileSync('/private/tmp/exelero-inquiry-fixtures.json',JSON.stringify({site,tag,boatId,partnerId,pendingId:pending.id,email:`${tag}@example.invalid`,password}),{mode:0o600});
    await Promise.race([once(process,'SIGINT'),once(process,'SIGTERM')]);
  }
} finally {
  if(server && server.exitCode===null){server.kill('SIGTERM');await Promise.race([once(server,'exit'),delay(10000)]);if(server.exitCode===null)server.kill('SIGKILL');}
  if(log!==undefined) closeSync(log);
  for(const socket of sockets)socket.destroy();
  await new Promise(resolve=>smtp.close(resolve));
  if(boatId){await db.from('boat_inquiries').delete().eq('boat_id',boatId);await db.from('boats').delete().eq('id',boatId);}
  if(partnerId){await db.from('partner_inquiries').delete().eq('partner_id',partnerId);await db.from('partners').delete().eq('id',partnerId);}
  if(uid)await db.auth.admin.deleteUser(uid);
  await db.from('contact').delete().eq('email',`${tag}-contact@example.invalid`);
  for(const [name,content] of backups)writeFileSync(name,content);
  rmSync('.next-inquiry-check',{recursive:true,force:true});
  rmSync('/private/tmp/exelero-inquiry-fixtures.json',{force:true});
}
