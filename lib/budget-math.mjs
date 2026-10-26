export function calculateBudget(budget,items){
 const numeric=v=>String(v).trim()!==''&&Number.isFinite(Number(v));
 if(!numeric(budget)||Number(budget)<0||!items.every(i=>numeric(i.price)&&Number(i.price)>=0&&numeric(i.quantity)&&Number.isSafeInteger(Number(i.quantity))&&Number(i.quantity)>=1))return null;
 const totalCents=items.reduce((sum,i)=>sum+Math.round(Number(i.price)*100)*Number(i.quantity),0);
 const budgetCents=Math.round(Number(budget)*100);
 if(!Number.isSafeInteger(totalCents)||!Number.isSafeInteger(budgetCents))return null;
 return {total:totalCents/100,remaining:(budgetCents-totalCents)/100};
}
