document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearchModal = document.getElementById('close-search-modal');
    const modalSearchInput = document.getElementById('modal-search-input');
    const modalSearchResults = document.getElementById('modal-search-results');

    if (searchBtn && searchModal) {
        // Open Modal on click
        searchBtn.addEventListener('click', () => {
            searchModal.style.display = 'flex';
            modalSearchInput.focus();
        });

        // Close Modal on 'X' click
        closeSearchModal.addEventListener('click', () => {
            searchModal.style.display = 'none';
            modalSearchInput.value = '';
            modalSearchResults.innerHTML = `<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 20px; font-size: 0.9rem;">Type something to search from database...</div>`;
        });

        // Close Modal when clicking outside the box
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });

        // Live Search from Backend Database
        modalSearchInput.addEventListener('input', async (e) => {
            const query = e.target.value.trim();

            if (!query) {
                modalSearchResults.innerHTML = `<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 20px; font-size: 0.9rem;">Type something to search from database...</div>`;
                return;
            }

            try {
                const response = `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`;
                const res = await fetch(response);
                const data = await res.json();

                if (!data || data.length === 0) {
                    modalSearchResults.innerHTML = `<div style="color: rgba(255,255,255,0.6); text-align: center; padding: 15px; font-size: 0.9rem;">No results found</div>`;
                    return;
                }

                modalSearchResults.innerHTML = data.map(item => `
                    <div style="padding: 10px 14px; margin-bottom: 6px; background: rgba(255,255,255,0.04); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(124,58,237,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.04)'">
                        <span style="color: white; font-size: 0.9rem;">${item.title}</span>
                        <span style="font-size: 0.75rem; color: #a78bfa; background: rgba(124,58,237,0.15); padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${item.type}</span>
                    </div>
                `).join('');

            } catch (err) {
                console.error("Search error:", err);
                modalSearchResults.innerHTML = `<div style="color: #f87171; text-align: center; padding: 15px; font-size: 0.9rem;">Error connecting to server</div>`;
            }
        });
    }
});