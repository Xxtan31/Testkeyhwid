.then(data => {
    // Anahtarın döndüğünü kontrol et
    const generatedKey = data.message;
    if (generatedKey.startsWith("ATA-")) {
        window.location.href = `key_display.html?key=${generatedKey}`;
    } else {
        console.error('Geçersiz anahtar:', generatedKey);
    }
})

if (navigator.userAgent.includes("Brave") || navigator.userAgent.includes("Kiwi")) {
    window.location.href = "error.html";
}
