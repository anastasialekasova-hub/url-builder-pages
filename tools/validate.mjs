import {readFileSync,existsSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(), failures=[], sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const check=(ok,msg)=>{if(!ok)failures.push(msg)};
for(const name of ['welcome','uninstall','feedback']){
 const file=path.join(root,name,'index.html'),html=readFileSync(file,'utf8');
 check((html.match(/data-website-id="328e350f-b770-4529-9500-92b514123a6c"/g)||[]).length===1,name+' Umami');
 check(/<html lang="en">/.test(html)&&/name="robots" content="noindex"/.test(html),name+' metadata');
 check(!/demo|mockup|Local design preview|Token Counter|Python Runner/i.test(html),name+' old/preview content');
 check(html.includes('https://pinwisp.com/url-builder/privacy/')&&html.includes('https://github.com/anastasialekasova-hub/url-builder-pages/issues'),name+' external targets');
 for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) if(!/^https?:|^data:/.test(ref))check(existsSync(path.resolve(root,name,ref)),name+' missing '+ref);
}
check(!existsSync(path.join(root,'privacy')),'privacy must be on pinwisp');
const config=readFileSync('assets/forms-config.js','utf8');check(!/formId: '[^']+'/.test(config),'build forms IDs must be blank');
mkdirSync('tools/e2e/out',{recursive:true});
const result={status:failures.length?'FAIL':'PASS',failures,source:Object.fromEntries(['welcome/index.html','uninstall/index.html','feedback/index.html','assets/pages.css','assets/forms.js','assets/forms-config.js','assets/icon128.png','assets/newsletter-copy.png'].map(f=>[f,sha(f)]))};
writeFileSync('tools/e2e/out/validate.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(failures.length)process.exitCode=1;
