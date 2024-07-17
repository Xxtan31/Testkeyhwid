function proceed() {
    const hwid = new URLSearchParams(window.location.search).get('hwid');
    if (hwid) {
        const nextUrl = document.body.dataset.nextUrl;
        window.location.href = `${nextUrl}?hwid=${hwid}`;
    } else {
        console.error('HWID not found in URL');
    }
}

function isKeyValid() {
    const now = new Date().getTime();
    const expiration = localStorage.getItem('expiration');
    return expiration && now < expiration;
}

window.onload = function() {
    if (isKeyValid()) {
        const hwid = new URLSearchParams(window.location.search).get('hwid');
        window.location.href = `get-key.html?hwid=${hwid}`;
    }
};

async function detectBrave() {
    const isBrave = (window.navigator.brave && await window.navigator.brave.isBrave()) || false;
    return isBrave;
}

function detectKiwi() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return userAgent.includes("Kiwi");
}

(async function() {
    if (await detectBrave() || detectKiwi()) {
        window.location.href = "error.html";
    }
})();
