
import { writable } from 'svelte/store';


export let aBtn = writable(
    localStorage.getItem('aBtn') || "1"
);
aBtn.subscribe(value => {
    localStorage.setItem('aBtn', value);
});