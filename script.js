function generateRandomKey(length = 20) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomPart = '';
    for (let i = 0; i < length - 4; i++) {
        randomPart += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return 'ATA-' + randomPart;
}

function saveKeyToLocalStorage(key) {
    const now = new Date();
    const expiration = now.getTime() + (24 * 60 * 60 * 1000); // 24 saat
    localStorage.setItem('generatedKey', key);
    localStorage.setItem('expiration', expiration);
}

function isKeyValid() {
    const now = new Date().getTime();
    const expiration = localStorage.getItem('expiration');
    return expiration && now < expiration;
}

function showKeyUI(key) {
    document.getElementById('generatedKey').innerText = key;
    document.getElementById('keyUI').style.display = 'flex';
    document.getElementById('generateButton').style.display = 'none';
    document.getElementById('mainTitle').style.display = 'none';
    startCountdown();
}

function startCountdown() {
    const expiration = parseInt(localStorage.getItem('expiration'));
    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiration - now;
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerText = `Expires in: ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerText = 'Key has expired.';
            localStorage.removeItem('generatedKey');
            localStorage.removeItem('expiration');
            document.getElementById('keyUI').style.display = 'none';
            document.getElementById('generateButton').style.display = 'block';
            document.getElementById('mainTitle').style.display = 'block';
        }
    }, 1000);
}

document.getElementById('generateButton').onclick = function() {
    if (isKeyValid()) {
        alert('24 saat içinde sadece bir kez anahtar oluşturabilirsiniz.');
        showKeyUI(localStorage.getItem('generatedKey'));
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hwid = urlParams.get('hwid');

    if (hwid) {
        const url = 'http://127.0.0.1:5000/create_key';
        const payload = {
            key: generateRandomKey(),
            usage_limit: 1,
            expiration_minutes: 3,
            hwid: hwid
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Anahtar oluşturulurken bir hata oluştu.');
            }
            return response.json();
        })
        .then(data => {
            alert(`Anahtarınız: ${data.message}`);
            saveKeyToLocalStorage(data.message);
            showKeyUI(data.message);
        })
        .catch(error => {
            alert('Hata: ' + error.message);
            console.error('Hata:', error);
        });
    } else {
        alert('URL\'de hwid bulunamadı');
    }
};

// Tarayıcı kontrolü
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

// Sayfa yüklendiğinde geçerli bir anahtar varsa UI'yi göster
window.onload = function() {
    if (isKeyValid()) {
        showKeyUI(localStorage.getItem('generatedKey'));
    }
};
