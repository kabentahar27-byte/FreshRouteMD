'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {demoResources,type DemoResource} from '@/lib/freshroute-demo';
export type ResourceUpdate=Partial<Pick<DemoResource,'hours'|'temporarilyClosed'|'eligibility'|'inventory'|'lowStock'|'unavailable'|'donationNeeds'|'lastVerified'|'verificationSource'>>;
const key='freshroute-demo-updates-v1';
function load():Record<string,ResourceUpdate>{try{return JSON.parse(window.localStorage.getItem(key)||'{}')}catch{return {}}}
export function useDemoUpdates(){const [updates,setUpdates]=useState<Record<string,ResourceUpdate>>({});const [ready,setReady]=useState(false);useEffect(()=>{setUpdates(load());setReady(true)},[]);const resources=useMemo(()=>demoResources.map(resource=>({...resource,...updates[resource.id]})),[updates]);const update=useCallback((id:string,patch:ResourceUpdate)=>{setUpdates(current=>{const next={...current,[id]:{...current[id],...patch}};window.localStorage.setItem(key,JSON.stringify(next));return next})},[]);const reset=useCallback(()=>{window.localStorage.removeItem(key);setUpdates({})},[]);return {resources,ready,update,reset};}
