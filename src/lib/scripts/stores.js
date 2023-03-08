
import { writable } from 'svelte/store';


export let aBtn = writable(
    localStorage.getItem('aBtn') || "1"
);
aBtn.subscribe(value => {
    localStorage.setItem('aBtn', value);
}); 

export let currentPage = writable(
    localStorage.getItem('currentPage') || "Home"
);
currentPage.subscribe(value => {
    localStorage.setItem('currentPage', value);
});

export function syncPageBtn(aBtn, currentPage) {
    if (localStorage.getItem('aBtn') == 1)
        currentPage.set('Home');
    else if (localStorage.getItem('aBtn') == 2)
        currentPage.set('About');
    else if (localStorage.getItem('aBtn') == 3)
        currentPage.set('Admissions');
    else if (localStorage.getItem('aBtn') == 4)
        currentPage.set('Contact');
    else if (localStorage.getItem('aBtn') == 5)
        currentPage.set('Academics');
    else if (localStorage.getItem('aBtn') == 6)
        currentPage.set('Student');
    else if (localStorage.getItem('aBtn') == 7)
        currentPage.set('Careers');
    else if (localStorage.getItem('aBtn') == 8)
        currentPage.set('News');
    else if (localStorage.getItem('aBtn') == 9) ////
        currentPage.set('Apply');
    else if (localStorage.getItem('aBtn') == 10)
        currentPage.set('Campus');
    else if (localStorage.getItem('aBtn') == 11)
        currentPage.set('Faculty');
    else if (localStorage.getItem('aBtn') == 12)
        currentPage.set('Library');
    else if (localStorage.getItem('aBtn') == 13)
        currentPage.set('Map');
    else if (localStorage.getItem('aBtn') == 14)
        currentPage.set('StudentP');
    else if (localStorage.getItem('aBtn') == 15)
        currentPage.set('PrivacyP');
    else if (localStorage.getItem('aBtn') == 16) ////
        currentPage.set('Login');
    else if (localStorage.getItem('aBtn') == 17)
        currentPage.set('LoggedIn');
}