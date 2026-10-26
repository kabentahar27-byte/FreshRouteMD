'use client';
import {useCallback,useEffect,useState} from 'react';
import {defaultProfile,type UserProfile} from '@/lib/freshroute-demo';

const key='freshroute-demo-profile-v1';
function read():UserProfile{try{const stored=window.localStorage.getItem(key);if(!stored)return defaultProfile;return {...defaultProfile,...JSON.parse(stored)};}catch{return defaultProfile;}}
export function useFreshRouteProfile(){const [profile,setProfile]=useState<UserProfile>(defaultProfile);const [ready,setReady]=useState(false);useEffect(()=>{setProfile(read());setReady(true)},[]);const save=useCallback((next:UserProfile)=>{setProfile(next);window.localStorage.setItem(key,JSON.stringify(next));},[]);const update=useCallback((partial:Partial<UserProfile>)=>save({...profile,...partial}),[profile,save]);const reset=useCallback(()=>{window.localStorage.removeItem(key);setProfile(defaultProfile)},[]);return {profile,ready,save,update,reset};}
