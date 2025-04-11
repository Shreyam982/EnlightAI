document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const currentNoteContent = document.querySelector('.current-note-content');
    const marContent = document.querySelector('.mar-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content sections
            currentNoteContent.style.display = 'none';
            marContent.style.display = 'none';
            
            // Show content based on tab
            if (this.id === 'current-note-tab') {
                currentNoteContent.style.display = 'block';
            } else if (this.id === 'mar-tab') {
                marContent.style.display = 'block';
                
                // Start the MAR animation if it's the first time clicking the tab
                if (!marContent.classList.contains('animated')) {
                    marContent.classList.add('animated');
                    startMARAnimation();
                }
            }
        });
    });

    // Initialize with Current Note tab active
    const currentNoteTab = document.getElementById('current-note-tab');
    if (currentNoteTab) {
        currentNoteTab.click();
    }
    
    // Function to animate typing in an input field
    function typeInField(field, text, speed, callback) {
        field.classList.add('typing');
        
        let i = 0;
        const typeChar = () => {
            if (i < text.length) {
                field.value += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                field.classList.remove('typing');
                if (callback) callback();
            }
        };
        
        field.value = '';
        typeChar();
    }
    
    // Function to simulate a click on an element
    function simulateClick(element, callback) {
        element.classList.add('highlight');
        
        setTimeout(() => {
            element.classList.remove('highlight');
            element.click();
            if (callback) callback();
        }, 600);
    }
    
    // Function to start the MAR animation sequence
    function startMARAnimation() {
        const actionSelect = document.getElementById('action-select');
        const dateInput = document.getElementById('date-input');
        const timeInput = document.getElementById('time-input');
        const commentInput = document.getElementById('comment-input');
        const submitButton = document.getElementById('submit-med');
        
        // Existing medication form content should be cleared for the animation
        actionSelect.value = '';
        dateInput.value = '';
        timeInput.value = '';
        commentInput.value = '';
        
        // Append a completion message div to the medication form
        const completionMessage = document.createElement('div');
        completionMessage.className = 'completion-message';
        completionMessage.textContent = 'Medication administration record saved successfully!';
        document.querySelector('.medication-form').appendChild(completionMessage);
        
        // Start animation sequence with delays
        setTimeout(() => {
            // Step 1: Select "Given" from dropdown
            simulateClick(actionSelect, () => {
                setTimeout(() => {
                    actionSelect.value = 'Given';
                    actionSelect.dispatchEvent(new Event('change'));
                    
                    // Step 2: Type the date
                    setTimeout(() => {
                        typeInField(dateInput, '11/03/25', 100, () => {
                            
                            // Step 3: Type the time
                            setTimeout(() => {
                                typeInField(timeInput, '12:00', 100, () => {
                                    
                                    // Step 4: Type a comment
                                    setTimeout(() => {
                                        typeInField(commentInput, 'Medication given as scheduled', 50, () => {
                                            
                                            // Step 5: Click submit button
                                            setTimeout(() => {
                                                simulateClick(submitButton, () => {
                                                    // Step 6: Show completion message
                                                    setTimeout(() => {
                                                        completionMessage.style.display = 'block';
                                                        completionMessage.classList.add('completion-animation');
                                                        
                                                        // Highlight form with success color
                                                        document.querySelector('.medication-form').classList.add('highlight-success');
                                                        
                                                        // Update "Next Actions" to show completion for the first date
                                                        setTimeout(() => {
                                                            const firstStatus = document.querySelector('.action-status');
                                                            firstStatus.textContent = 'Completed';
                                                            firstStatus.style.color = '#28a745';
                                                        }, 500);
                                                    }, 500);
                                                });
                                            }, 800);
                                        });
                                    }, 500);
                                });
                            }, 500);
                        });
                    }, 500);
                }, 300);
            });
        }, 1000);
    }
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