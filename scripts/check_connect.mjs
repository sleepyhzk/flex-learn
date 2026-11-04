// Mô phỏng 400 ván Nối thẻ để kiểm tra luật chơi. Chạy:  npm run check:connect (Node 22.6 trở lên)
import { findPath, findMove, makeGrid, tilesOf, layoutFor } from '../src/views/games/connectLogic.ts';
function mk(n){const t=[];for(let i=0;i<n;i++){t.push({key:i*2,vid:i,kind:'w',text:'w'+i},{key:i*2+1,vid:i,kind:'m',text:'m'+i});}return t;}
function locate(grid,key){for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++)if(grid[r][c]?.key===key)return{r,c};}
function valid(grid,a,b,p){
  let turns=0,pd=null;
  for(let i=1;i<p.length;i++){const dr=Math.sign(p[i].r-p[i-1].r),dc=Math.sign(p[i].c-p[i-1].c);
    if(dr&&dc) return 'diag'; const d=dr+','+dc; if(pd&&d!==pd) turns++; pd=d;
    let r=p[i-1].r,c=p[i-1].c; while(r!==p[i].r||c!==p[i].c){r+=dr;c+=dc; if(!(r===b.r&&c===b.c)&&grid[r][c]) return 'blocked';}
  }
  if(turns>2) return 'turns'; if(p[0].r!==a.r||p[0].c!==a.c||p.at(-1).r!==b.r||p.at(-1).c!==b.c) return 'ends';
  return null;
}
let errors=0, games=0, reshuffles=0;
for(let g=0;g<400;g++){
  const pairs=2+Math.floor(Math.random()*11); const {rows,cols}=layoutFor(pairs*2,g%2===0);
  let grid=makeGrid(mk(pairs),rows,cols);
  if(!findMove(grid)){errors++;console.log('no initial move',pairs,rows,cols);continue;}
  let guard=0;
  while(tilesOf(grid).length>0 && guard++<200){
    let mv=findMove(grid);
    if(!mv){ reshuffles++; grid=makeGrid(tilesOf(grid),rows,cols); mv=findMove(grid); if(!mv){errors++;console.log('stuck after reshuffle',tilesOf(grid).length);break;} }
    const [a,b,path]=mv; const pa=locate(grid,a.key), pb=locate(grid,b.key);
    const err=valid(grid,pa,pb,path); if(err){errors++;console.log('bad path',err);break;}
    grid[pa.r][pa.c]=null; grid[pb.r][pb.c]=null;
  }
  if(tilesOf(grid).length===0) games++; else errors++;
}
console.log({games,errors,reshuffles});
if (errors) process.exit(1);
