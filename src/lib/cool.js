import {browser} from "$app/environment";

export function cool() {
    if(browser) {
        alert('cool')
    }
}