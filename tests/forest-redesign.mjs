import assert from 'node:assert/strict';import fs from 'node:fs';
import {calculateBudget} from '../lib/budget-math.mjs';
assert.deepEqual(calculateBudget('10',[{price:'.10',quantity:'3'},{price:'.20',quantity:'2'}]),{total:.7,remaining:9.3});
assert.deepEqual(calculateBudget('4',[{price:'2.5',quantity:'2'}]),{total:5,remaining:-1});
for(const budget of ['', '-1','NaN','Infinity'])assert.equal(calculateBudget(budget,[]),null);
for(const item of [{price:'',quantity:1},{price:-1,quantity:1},{price:2,quantity:.5},{price:2,quantity:1.5},{price:2,quantity:0},{price:Infinity,quantity:1}])assert.equal(calculateBudget(10,[item]),null);
const luminance=color=>{const rgb=color.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
for(const accent of ['#345e45','#58613b','#426365','#ffffff','#ffff00','#000000','#ff0000','#00ff00','#0000ff']){const text=luminance(accent)>.179?'#111111':'#ffffff';assert.ok(contrast(accent,text)>=4.5,accent)}
assert.ok(contrast('#27392e','#f4f2e9')>=4.5);assert.ok(contrast('#657064','#fffef8')>=4.5);assert.ok(contrast('#fffef8','#193e32')>=4.5);
assert.ok(fs.readFileSync('app/globals.css','utf8').includes('prefers-reduced-motion'));
console.log('Budget precision, over-budget and invalid values, palette/custom button contrast, and reduced-motion rule passed.');
