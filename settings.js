async function openSettingsModal() {
    if (!document.getElementById("settingsModal")) {
        try {
            const response = await fetch('settings.html');
            const data = await response.text();
            document.body.insertAdjacentHTML('beforeend', data);
        } catch (e) {
            console.error("Error loading settings:", e);
        }
    }
    document.getElementById("settingsModal").style.display = "flex";
}

function closeSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (modal) modal.style.display = "none";
}
window.onload = function() {
    const savedData = JSON.parse(localStorage.getItem('userSettings'));
    
    if (savedData) {
        document.getElementById('autoSave').checked = savedData.autoSave;
        document.getElementById('notifications').checked = savedData.notifications;
        document.getElementById('compactMode').checked = savedData.compactMode;
        document.getElementById('spellCheck').checked = savedData.spellCheck;
    }
};