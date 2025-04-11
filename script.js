document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const currentNoteContent = document.querySelector('.current-note-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show/hide content based on tab
            if (this.id === 'current-note-tab') {
                currentNoteContent.style.display = 'block';
            } else {
                currentNoteContent.style.display = 'none';
            }
        });
    });

    // Initialize with Current Note tab active
    const currentNoteTab = document.getElementById('current-note-tab');
    if (currentNoteTab) {
        currentNoteTab.click();
    }
});

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