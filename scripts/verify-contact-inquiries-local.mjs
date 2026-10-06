import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync, openSync, closeSync } from 'node:fs';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient } from '@supabase/supabase-js';

// Never loads .env.local into the test process. All database/mail credentials
// passed to the isolated Next server explicitly target local services.
const local = Object.fromEntries(execFileSync('supabase', ['status', '-o', 'env'], {encoding:'utf8',stdio:['ignore','pipe','pipe']}).split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1).replace(/^"|"$/g,'')]}));
assert.match(local.API_URL, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
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
  const partner=ensure(await db.from('partners').insert({slug:tag,name:'Inquiry verification partner',logo_url:'/assets/images/logo/udeck.png',breadcrumb_image_url:'/assets/images/breadcrumbs/udeck.jpg',content:'Local inquiry verification.',status:'published',form_type:'custom',custom_fields:[{id:'interest',label:'Interest',type:'select',required:true,options:['Sailing','Motor']}]}).select('id').single());partnerId=partner.id;
  const boat=ensure(await db.from('boats').insert({user_id:uid,slug:tag,active:true,bought:false}).select('id').single());boatId=boat.id;
  ensure(await db.from('boat_data').insert({boat_id:boatId,title:'Inquiry verification yacht',manufacturer:'Local test',build_year:'2025',location:'Amsterdam',description:'Local contact form verification.',hull_length:12,beam:4,draft:2,displacement:8000,engine_power:40}));
  log=openSync('/private/tmp/exelero-inquiry-server.log','w');
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--port','3002'],{stdio:['ignore',log,log],env:{...process.env,NEXT_DIST_DIR:'.next-inquiry-check',NEXT_PUBLIC_SUPABASE_URL:local.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:local.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:local.SERVICE_ROLE_KEY,NEXT_PUBLIC_SITE_URL:site,GMAIL_HOST:'127.0.0.1',GMAIL_PORT:String(smtp.address().port),GMAIL_USERNAME:'test@example.invalid',GMAIL_PASSWORD:'local-test-only',GMAIL_ENCRYPTION:'none',GMAIL_FROM_ADDRESS:'test@example.invalid',NOTIFICATION_TO_EMAIL:JSON.stringify(recipients)}});
  for(let i=0;i<90;i++){
    if(server.exitCode!==null) throw new Error('Verification server failed to start. See /private/tmp/exelero-inquiry-server.log');
    try{await fetch(site+'/api/boats/invalid/inquiries',{method:'POST'});break;}catch{await delay(1000);}
  }
  const boatPath=`/api/boats/${boatId}/inquiries`, partnerPath=`/api/partners/${tag}/inquiries`;
  const before=messages.length;
  assert.equal((await request(boatPath,payload({message:''}))).status,400);
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
  assert.equal(failed.status,502);assert.equal(failed.body.saved,true);
  row=ensure(await db.from('partner_inquiries').select('*').eq('id',custom.request_id).single());
  assert.equal(row.phone,custom.phone);assert.equal(row.message,custom.message);assert.equal(row.answers.interest,'Sailing');
  assert.equal(row.notification_sent_at,null);assert.deepEqual(row.notification_delivered_to,[recipients[0]]);
  rejectRecipient=undefined;
  assert.equal((await request(partnerPath,custom)).status,200);
  assert.equal(messages.length,4,'Partial failure retry must send only to the outstanding recipient.');
  row=ensure(await db.from('partner_inquiries').select('*').eq('id',custom.request_id).single());
  assert(row.notification_sent_at);assert.deepEqual(row.notification_delivered_to,recipients);
  const race=payload();
  const concurrent=await Promise.all([request(boatPath,race),request(boatPath,race)]);
  assert(concurrent.every(result=>[200,409].includes(result.status)));
  assert(concurrent.some(result=>result.status===200));
  assert.equal(messages.length,6,'Concurrent requests must send only one message per recipient.');
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
  console.log('PASS: boat/partner fields saved, all notification recipients emailed, custom answers retained, validation, unpublished targets, honeypot, public data privacy, duplicate/concurrent submits, and partial SMTP failure retry.');
  if(process.argv.includes('--serve')){
    console.log(`Browser fixtures: ${site}/services/brokerage/${tag} and ${site}/partners/${tag}`);
    writeFileSync('/private/tmp/exelero-inquiry-fixtures.json',JSON.stringify({site,tag,boatId,partnerId}));
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
  for(const [name,content] of backups)writeFileSync(name,content);
  rmSync('.next-inquiry-check',{recursive:true,force:true});
  rmSync('/private/tmp/exelero-inquiry-fixtures.json',{force:true});
}
