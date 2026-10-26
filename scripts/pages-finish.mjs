import fs from 'node:fs';
const html=fs.readFileSync('dist-pages/index.html','utf8');
fs.writeFileSync('dist-pages/404.html',html);
fs.writeFileSync('dist-pages/.nojekyll','');
for(const dir of fs.readdirSync('app',{withFileTypes:true})){if(dir.isDirectory()&&fs.existsSync(`app/${dir.name}/page.tsx`)){fs.mkdirSync(`dist-pages/${dir.name}`,{recursive:true});fs.writeFileSync(`dist-pages/${dir.name}/index.html`,html)}}
