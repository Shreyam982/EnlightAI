// Track which goal card is currently displayed
let currentGoalIndex = 0;
let goalsData = [];

// Fetch the JSON data when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        goalsData = data.goals;
        
        // Initialize the Enlighten tab with the first goal card
        initializeEnlightenTab();
    } catch (error) {
        console.error('Error loading goals data:', error);
    }
});

// Initialize the goals in the Enlighten tab
function initializeEnlightenTab() {
    if (goalsData.length > 0) {
        renderGoalCard(goalsData[0]);
    }
}

// Create and render a goal card based on the data
function renderGoalCard(goalData) {
    // Clear the cards container
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';
    
    // Clone the template
    const template = document.getElementById('goal-card-template');
    const goalCard = template.content.cloneNode(true);
    
    // Set card ID
    goalCard.querySelector('.goal-card').id = `goal-card-${goalData.id}`;
    
    // Handle different card layouts based on the data
    if (goalData.title === 'Goal 1' || goalData.title === 'Goal 2') {
        // Standard goal card layout
        goalCard.querySelector('.card-subtitle').textContent = goalData.title;
        goalCard.querySelector('.card-title').textContent = goalData.description;
        
        // Add tags
        const tagsContainer = goalCard.querySelector('.tags');
        goalData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = `tag ${tag.color}`;
            tagElement.textContent = tag.text;
            tagsContainer.appendChild(tagElement);
        });
        
        // Add content
        if (goalData.content) {
            goalCard.querySelector('.card-description').textContent = goalData.content;
            
            // Add list items if available
            if (goalData.list && goalData.list.length > 0) {
                const listElement = goalCard.querySelector('.card-list');
                goalData.list.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    listElement.appendChild(li);
                });
            } else {
                goalCard.querySelector('.card-list').remove();
            }
        }
        
    } else {
        // Fluids card layout (special case for card 2)
        const headerDiv = goalCard.querySelector('.goal-header');
        headerDiv.innerHTML = ''; // Clear default structure
        
        // Create tag container
        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';
        
        // Add tags
        goalData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = `tag ${tag.color}`;
            tagElement.textContent = tag.text;
            tagContainer.appendChild(tagElement);
        });
        
        // Add author tag if available
        if (goalData.author) {
            const authorTag = document.createElement('span');
            authorTag.className = 'tag red author-tag';
            authorTag.textContent = goalData.author;
            tagContainer.appendChild(authorTag);
        }
        
        headerDiv.appendChild(tagContainer);
        
        // Add description
        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = goalData.description;
        headerDiv.appendChild(descriptionPara);
        
        // Remove unnecessary elements for this card type
        goalCard.querySelector('.card-description').remove();
        goalCard.querySelector('.card-list').remove();
        
        // Change the explain link text
        const explainLink = goalCard.querySelector('.explain-link');
        explainLink.textContent = 'Close Trace ▲';
        explainLink.classList.add('collapse');
        
        // Show explanation by default
        const explanation = goalCard.querySelector('.explanation');
        explanation.style.display = 'block';
        
        // Remove Edit button for Fluids card
        goalCard.querySelector('.edit-btn').remove();
    }
    
    // Set explanation text
    goalCard.querySelector('.explanation').textContent = goalData.explanation;
    
    // Append the card to the container
    cardsContainer.appendChild(goalCard);
    
    // Add event listeners to the newly created card
    addCardEventListeners(goalData);
}

// Add event listeners to goal card
function addCardEventListeners(goalData) {
    // Explanation toggle
    document.querySelectorAll('.explain-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const explanation = this.nextElementSibling;
            const isCollapsed = explanation.style.display === 'none' || !explanation.style.display;
            
            // Update ARIA attributes
            this.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
            
            if (isCollapsed) {
                explanation.style.display = 'block';
                if (!this.classList.contains('collapse')) {
                    this.textContent = 'Explain why ▲';
                    this.classList.add('collapse');
                } else {
                    this.textContent = 'Close Trace ▼';
                    this.classList.remove('collapse');
                }
            } else {
                explanation.style.display = 'none';
                if (!this.classList.contains('collapse')) {
                    this.textContent = 'Explain why ▼';
                } else {
                    this.textContent = 'Close Trace ▲';
                    this.classList.add('collapse');
                }
            }
        });
    });

    // Card click for sources
    document.querySelectorAll('.goal-card').forEach(function(card) {
        card.addEventListener('click', function(event) {
            // Don't show sources panel if clicking on buttons or links
            if (event.target.tagName === 'BUTTON' || 
                event.target.tagName === 'A' || 
                event.target.closest('.card-actions') || 
                event.target.closest('.explain-section')) {
                return;
            }
            
            // Show source content for the clicked card
            const sourcesPanel = document.querySelector('.sources-panel');
            const sourceContent = document.getElementById('source-content');
            
            // Update source content from the goal data
            sourceContent.innerHTML = `
                <p>${goalData.source.content}</p>
                <p><strong>Citation:</strong> ${goalData.source.citation}</p>
            `;
            
            sourcesPanel.style.display = 'block';
        });
    });
}

// Handle tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const currentNoteContent = document.querySelector('.current-note-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update aria-selected attribute for all tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            
            // Set current tab as selected
            this.setAttribute('aria-selected', 'true');
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
            // Add list items if available
            if (goalData.list && goalData.list.length > 0) {
                const listElement = goalCard.querySelector('.card-list');
                goalData.list.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    listElement.appendChild(li);
                });
            } else {
                goalCard.querySelector('.card-list').remove();
            }
        }
        
    } else {
        // Fluids card layout (special case for card 2)
        const headerDiv = goalCard.querySelector('.goal-header');
        headerDiv.innerHTML = ''; // Clear default structure
        
        // Create tag container
        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';
        
        // Add tags
        goalData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = `tag ${tag.color}`;
            tagElement.textContent = tag.text;
            tagContainer.appendChild(tagElement);
        });
        
        // Add author tag if available
        if (goalData.author) {
            const authorTag = document.createElement('span');
            authorTag.className = 'tag red author-tag';
            authorTag.textContent = goalData.author;
            tagContainer.appendChild(authorTag);
        }
        
        headerDiv.appendChild(tagContainer);
        
        // Add description
        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = goalData.description;
        headerDiv.appendChild(descriptionPara);
        
        // Remove unnecessary elements for this card type
        goalCard.querySelector('.card-description').remove();
        goalCard.querySelector('.card-list').remove();
        
        // Change the explain link text
        const explainLink = goalCard.querySelector('.explain-link');
        explainLink.textContent = 'Close Trace ▲';
        explainLink.classList.add('collapse');
        
        // Show explanation by default
        const explanation = goalCard.querySelector('.explanation');
        explanation.style.display = 'block';
        
        // Remove Edit button for Fluids card
        goalCard.querySelector('.edit-btn').remove();
    }
    
    // Set explanation text
    goalCard.querySelector('.explanation').textContent = goalData.explanation;
    
    // Append the card to the container
    cardsContainer.appendChild(goalCard);
    
    // Add event listeners to the newly created card
    addCardEventListeners(goalData);
}

// Add event listeners to goal card
function addCardEventListeners(goalData) {
    // Explanation toggle
    document.querySelectorAll('.explain-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const explanation = this.nextElementSibling;
            const isCollapsed = explanation.style.display === 'none' || !explanation.style.display;
            
            // Update ARIA attributes
            this.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
            
            if (isCollapsed) {
                explanation.style.display = 'block';
                if (!this.classList.contains('collapse')) {
                    this.textContent = 'Explain why ▲';
                    this.classList.add('collapse');
                } else {
                    this.textContent = 'Close Trace ▼';
                    this.classList.remove('collapse');
                }
            } else {
                explanation.style.display = 'none';
                if (!this.classList.contains('collapse')) {
                    this.textContent = 'Explain why ▼';
                } else {
                    this.textContent = 'Close Trace ▲';
                    this.classList.add('collapse');
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
    // Card click for sources
    document.querySelectorAll('.goal-card').forEach(function(card) {
        card.addEventListener('click', function(event) {
            // Don't show sources panel if clicking on buttons or links
            if (event.target.tagName === 'BUTTON' || 
                event.target.tagName === 'A' || 
                event.target.closest('.card-actions') || 
                event.target.closest('.explain-section')) {
                return;
            }
            
            // Show source content for the clicked card
            const sourcesPanel = document.querySelector('.sources-panel');
            const sourceContent = document.getElementById('source-content');
            
            // Update source content from the goal data
            sourceContent.innerHTML = `
                <p>${goalData.source.content}</p>
                <p><strong>Citation:</strong> ${goalData.source.citation}</p>
            `;
            
            sourcesPanel.style.display = 'block';
        });
    });
}

// Handle tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update aria-selected attribute for all tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            
            // Set current tab as selected
            this.setAttribute('aria-selected', 'true');
            this.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
                panel.style.display = 'none';
            });
            
            // Show corresponding tab content
            if (this.id === 'abridge-tab') {
                document.getElementById('abridge-content').style.display = 'block';
            } else if (this.id === 'enlighten-tab') {
                document.getElementById('enlighten-content').style.display = 'block';
            } else if (this.id === 'current-note-tab') {
                document.querySelector('.current-note-content').style.display = 'block';
            }
        });
    });
});

// Create note button functionality - now also cycles through goal cards
document.getElementById('create-note').addEventListener('click', function() {
    // Add note to the notes panel as before
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
    
    // Switch to the next goal card if we're in the Enlighten tab
    if (document.getElementById('enlighten-tab').getAttribute('aria-selected') === 'true') {
        currentGoalIndex = (currentGoalIndex + 1) % goalsData.length;
        renderGoalCard(goalsData[currentGoalIndex]);
    }
});