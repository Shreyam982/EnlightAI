document.getElementById('abridge-tab').addEventListener('click', function() {
    // Change active tab styling
    document.querySelector('.tab.active').classList.remove('active');
    this.classList.add('active');
    
    // Show Abridge content
    const abridgeContent = document.getElementById('abridge-content');
    abridgeContent.style.display = 'block';
    abridgeContent.textContent = 'Abridge Assistant Active – Listening for patient context...';
});

document.getElementById('create-note').addEventListener('click', function() {
    const notesContent = document.querySelector('.notes-content');
    const newNote = document.createElement('div');
    newNote.classList.add('note-section');
    newNote.innerHTML = `
        <div class="note-header">Auto-filled note (Abridge)</div>
        <div class="note-content">Automatically generated note content</div>
        <div class="placeholder-lines">
            <div class="placeholder-line"></div>
            <div class="placeholder-line"></div>
            <div class="placeholder-line"></div>
            <div class="placeholder-line"></div>
        </div>
    `;
    notesContent.appendChild(newNote);
    
    // Scroll to the new note
    newNote.scrollIntoView({ behavior: 'smooth' });
});