const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname, '../dist');
const init=require(path.join(root,'vendor/sql-wasm.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'problems.json'),'utf8'));
let response;
const context={importScripts(){},initSqlJs:()=>init({locateFile:f=>path.join(root,'vendor',f)}),postMessage:x=>response=x};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'sql-worker.js'),'utf8'),context);
async function run(input){response=null;await context.onmessage({data:input});return response}
(async()=>{
 let count=0;
 for(const p of data.filter(p=>p.verified)){
  const r=await run({setup:p.setup,code:p.answer});assert(r.ok,p.id+': '+r.error);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(r.result[0].values)).sort(),p.expected.values.sort(),p.id);count++;
 }
 const p=data.find(p=>p.id==='SQL094');
 assert(!(await run({setup:p.setup,code:'DELETE FROM Logs;'})).ok);
 assert(!(await run({setup:p.setup,code:'SELECT 1; SELECT 2;'})).ok);
 assert(!(await run({setup:p.setup,code:'SELEC no;'})).ok);
 let r=await run({free:true,setup:'',code:"CREATE TABLE t(id INT); INSERT INTO t VALUES (42); SELECT * FROM t;"});
 assert(r.ok,r.error);assert.equal(r.result[0].values[0][0],42);
 r=await run({free:true,setup:'',code:'SELECT * FROM t;'});assert(!r.ok,'Database must reset');
 assert.equal(data.length,175);assert(data.every(p=>p.answer&&p.html));
 console.log(`PASS: ${count} repository examples, read-only protection, multiple-query rejection, syntax errors, free SQL and database isolation; 175 statements and solutions.`);
})().catch(e=>{console.error(e);process.exit(1)});

