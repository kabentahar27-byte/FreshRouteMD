import assert from 'node:assert/strict';
import {defaultProfile,demoResources,foodItems,mealTemplates} from '../lib/freshroute-demo.ts';
import {buildBasket,compatibleMeals,completeMeal,getFreshRouteMatch,hasEquipment,optimizeFreeAndPaid,productAllergenState,recommendResources,resourceAllergenState} from '../lib/freshroute-engine.ts';

const profile={...defaultProfile,zipCode:'21204',householdSize:4,weeklyBudget:'$50–75',priority:'balance',transportation:['Car','Walking'],assistance:['SNAP'],allergens:['peanuts'],nutritionGoals:['More fruits and vegetables','Increase fiber','Reduce added sugar'],healthPreferences:['Healthy-weight support'],kitchenEquipment:['Microwave','Stove','Air fryer','Frying pan','Pot','Refrigerator'],foodStorage:['Refrigerator'],onboardingComplete:true};
const pantry=demoResources.find(resource=>resource.id==='harbor-harvest');
assert.equal(resourceAllergenState(pantry,['peanuts']).kind,'unknown');
const matching=recommendResources(profile);assert.ok(matching.length>0);assert.ok(matching[0].match.matched.some(label=>['Produce','Fiber','Whole grains'].includes(label)));
const snapOnly={...pantry,paymentOptions:['SNAP']};assert.equal(getFreshRouteMatch(pantry,profile).score,getFreshRouteMatch(snapOnly,profile).score,'SNAP cannot change a nutrition/access match score');
const microwaveMeals=compatibleMeals({...profile,kitchenEquipment:['Microwave','Mixing bowl']},['brown-rice','black-beans','frozen-broccoli']);assert.ok(microwaveMeals.some(({meal})=>meal.id==='bean-rice-bowl'));assert.ok(!microwaveMeals.some(({meal})=>meal.id==='airfryer-chicken'));
assert.equal(hasEquipment(mealTemplates.find(meal=>meal.id==='bean-rice-bowl'),{...profile,kitchenEquipment:['Microwave']}),true);
assert.equal(hasEquipment(mealTemplates.find(meal=>meal.id==='airfryer-chicken'),{...profile,kitchenEquipment:['Microwave']}),false);
const basket=buildBasket(profile,25,7);assert.ok(basket.total<=25);assert.ok(!basket.basket.some(item=>item.allergens.includes('peanuts')));
const optimized=optimizeFreeAndPaid(profile,25);assert.equal(optimized.pantry.costType,'Free');assert.ok(optimized.total<=25);assert.ok(optimized.freeItems.length>0);
const completed=completeMeal(['whole-grain-pasta','tomato-sauce']);assert.ok(completed.additions.some(item=>item.id==='black-beans'));assert.ok(completed.additions.some(item=>item.id==='spinach'));
assert.equal(productAllergenState(foodItems.find(item=>item.id==='peanut-butter'),['peanuts']),'Contains peanuts');
assert.equal(demoResources.length,15);assert.ok(foodItems.length>=25);assert.ok(mealTemplates.length>=15);
console.log('PASS: personalized profile, transparent matching, SNAP separation, allergy state, microwave equipment, $25 basket, free + paid optimizer, complete-meal additions and demo-data coverage.');
