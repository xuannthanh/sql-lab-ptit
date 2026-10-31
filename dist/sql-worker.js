importScripts('vendor/sql-wasm.js');
let ready=initSqlJs({locateFile:f=>'vendor/'+f});
onmessage=async({data})=>{
 let db;
 try{
  const SQL=await ready;db=new SQL.Database();
  db.create_function('YEAR',x=>x==null?null:+String(x).slice(0,4));
  db.create_function('MONTH',x=>x==null?null:+String(x).slice(5,7));
  db.create_function('DAY',x=>x==null?null:+String(x).slice(8,10));
  db.create_function('CONCAT',(...x)=>x.some(v=>v==null)?null:x.join(''));
  db.create_function('CHAR_LENGTH',x=>x==null?null:String(x).length);
  db.create_function('IF',(x,y,z)=>x?y:z);
  db.create_function('DATEDIFF',(a,b)=>Math.round((Date.parse(a)-Date.parse(b))/86400000));
  db.exec(data.setup);
  if(data.free){
   let result=db.exec(data.code);
   if(!result.length){
    const names=db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if(names.length)for(const row of names[0].values){const r=db.exec('SELECT * FROM "'+row[0].replace(/"/g,'""')+'" LIMIT 200');if(r.length)result.push({...r[0],name:row[0]});}
   }
   if(result.reduce((n,r)=>n+r.values.length,0)>10000)throw Error('Kết quả vượt 10.000 dòng. Hãy thêm LIMIT.');
   postMessage({ok:true,result});return;
  }
  db.exec('PRAGMA query_only=ON;');
  // Exactly one read-only query, regardless of comments or quoted semicolons.
  let count=0,result=[];
  for(const stmt of db.iterateStatements(data.code)){
   count++;if(count>1)throw Error('Mỗi lần chỉ chạy một truy vấn SELECT / WITH.');
   const columns=stmt.getColumnNames();const values=[];
   if(!columns.length)throw Error('Chế độ chạy thử chỉ hỗ trợ truy vấn trả về bảng kết quả.');
   while(stmt.step()){
    values.push(stmt.get());
    if(values.length>10000)throw Error('Kết quả vượt 10.000 dòng. Hãy thêm LIMIT.');
   }
   result.push({columns,values});
  }
  if(!count)throw Error('Hãy nhập một truy vấn SQL.');
  postMessage({ok:true,result});
 }catch(e){postMessage({ok:false,error:e.message});}finally{if(db)db.close();}
};
