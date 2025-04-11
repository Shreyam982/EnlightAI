// Track which goal card is currently displayed
let currentGoalIndex = 0;
let goalsData = [];

// Main initialization when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize tab system
    initializeTabs();
    
    // Initialize MAR tab animation
    initializeMAR();
    
    // Initialize Create Note button
    initializeCreateNote();
    
    // Setup all action buttons with event listeners
    setupActionButtons();
    
    // Add direct event listener for our test action button
    const testActionBtn = document.getElementById('test-action-btn');
    if (testActionBtn) {
        console.log('Test action button found, verifying event listener');
    }
    
    // Try to load JSON data for Enlighten tab
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        goalsData = data.goals;
        
        // Initialize the Enlighten tab with the first goal card
        if (goalsData.length > 0) {
            renderGoalCard(goalsData[0]);
            // Setup action buttons again after rendering cards
            setupActionButtons();
        }
    } catch (error) {
        console.error('Error loading goals data:', error);
        // Create fallback content for enlighten tab if JSON fails to load
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            // Don't clear the container as we now have a sample card
            if (cardsContainer.children.length === 0) {
                cardsContainer.innerHTML = '<p>Unable to load additional goal data. Using sample card.</p>';
            }
            // Still setup action buttons for the sample card
            setupActionButtons();
        }
    }
});

// Initialize tab switching functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchToTab(this.id);
        });
    });
    
    // Activate the MAR tab by default
    const marTab = document.getElementById('mar-tab');
    if (marTab) {
        marTab.click();
    }
}

// Function to switch to a specific tab by ID
function switchToTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const tab = document.getElementById(tabId);
    
    if (!tab) return;
    
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Hide all tab contents
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show the corresponding tab content
    const contentId = tabId.replace('-tab', '-content');
    const content = document.getElementById(contentId);
    
    if (content) {
        content.style.display = 'block';
        
        // If this is the MAR tab and hasn't been animated yet, start animation
        if (tabId === 'mar-tab' && !content.classList.contains('animated')) {
            content.classList.add('animated');
            startMARAnimation();
        }
    }
    
    return content;
}

// Initialize Create Note button functionality
function initializeCreateNote() {
    const createNoteBtn = document.getElementById('create-note');
    if (createNoteBtn) {
        createNoteBtn.addEventListener('click', function() {
            const notesContent = document.querySelector('.notes-content');
            if (!notesContent) return;
            
            const newNote = document.createElement('div');
            newNote.classList.add('note-section');
            newNote.innerHTML = `
                <div class="note-header">Auto-filled note</div>
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
    }
}

// Initialize MAR tab elements
function initializeMAR() {
    // Add event listener to Submit button even outside of animation
    const submitButton = document.getElementById('submit-med');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            completeMAR();
        });
    }
}

// Function to animate typing in an input field
function typeInField(field, text, speed, callback) {
    if (!field) {
        if (callback) callback();
        return;
    }
    
    field.classList.add('typing');
    
    let i = 0;
    field.value = '';
    
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
    
    typeChar();
}

// Function to simulate a click on an element
function simulateClick(element, callback) {
    if (!element) {
        if (callback) callback();
        return;
    }
    
    element.classList.add('highlight');
    
    setTimeout(() => {
        element.classList.remove('highlight');
        if (typeof element.click === 'function') {
            element.click();
        }
        if (callback) callback();
    }, 600);
}

// Function to complete the MAR entry (called by submit button or animation)
function completeMAR() {
    // Get the medication form
    const medicationForm = document.querySelector('.medication-form');
    if (!medicationForm) return;
    
    // Check if completion message already exists, if not create it
    let completionMessage = document.querySelector('.completion-message');
    if (!completionMessage) {
        completionMessage = document.createElement('div');
        completionMessage.className = 'completion-message';
        completionMessage.textContent = 'Medication administration record saved successfully!';
        medicationForm.appendChild(completionMessage);
    }
    
    // Show completion message
    completionMessage.style.display = 'block';
    completionMessage.classList.add('completion-animation');
    
    // Highlight form with success color
    medicationForm.classList.add('highlight-success');
    
    // Update "Next Actions" to show completion for the first date
    setTimeout(() => {
        const firstStatus = document.querySelector('.action-status');
        if (firstStatus) {
            firstStatus.textContent = 'Completed';
            firstStatus.style.color = '#28a745';
        }
    }, 500);
}

// Function to start the MAR animation sequence
function startMARAnimation() {
    const actionSelect = document.getElementById('action-select');
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const commentInput = document.getElementById('comment-input');
    const submitButton = document.getElementById('submit-med');
    
    if (!actionSelect || !dateInput || !timeInput || !commentInput || !submitButton) {
        console.error('One or more MAR form elements not found');
        return;
    }
    
    // Clear any existing form data
    actionSelect.value = '';
    dateInput.value = '';
    timeInput.value = '';
    commentInput.value = '';
    
    // Remove existing completion messages
    const existingMessage = document.querySelector('.completion-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Remove success highlighting
    const medicationForm = document.querySelector('.medication-form');
    if (medicationForm) {
        medicationForm.classList.remove('highlight-success');
    }
    
    // Reset the completed status if it was set
    const firstStatus = document.querySelector('.action-status');
    if (firstStatus) {
        firstStatus.textContent = 'Due';
        firstStatus.style.color = '#e74c3c';
    }
    
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
                                            simulateClick(submitButton, null);
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

// Create and render a goal card based on the data
function renderGoalCard(goalData) {
    if (!goalData) return;
    
    // Clear the cards container
    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    // Get the template
    const template = document.getElementById('goal-card-template');
    if (!template) return;
    
    // Clone the template
    const goalCard = template.content.cloneNode(true);
    
    // Set card ID
    const cardElement = goalCard.querySelector('.goal-card');
    if (cardElement) {
        cardElement.id = `goal-card-${goalData.id}`;
    }
    
    // Handle different card layouts based on the data type
    try {
        if (goalData.title === 'Goal 1' || goalData.title === 'Goal 2') {
            // Standard goal card layout
            const subtitle = goalCard.querySelector('.card-subtitle');
            if (subtitle) subtitle.textContent = goalData.title;
            
            const title = goalCard.querySelector('.card-title');
            if (title) title.textContent = goalData.description;
            
            // Add tags
            const tagsContainer = goalCard.querySelector('.tags');
            if (tagsContainer && goalData.tags) {
                goalData.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = `tag ${tag.color}`;
                    tagElement.textContent = tag.text;
                    tagsContainer.appendChild(tagElement);
                });
            }
            
            // Add content
            if (goalData.content) {
                const description = goalCard.querySelector('.card-description');
                if (description) description.textContent = goalData.content;
                
                // Add list items if available
                if (goalData.list && goalData.list.length > 0) {
                    const listElement = goalCard.querySelector('.card-list');
                    if (listElement) {
                        goalData.list.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            listElement.appendChild(li);
                        });
                    }
                } else {
                    const listElement = goalCard.querySelector('.card-list');
                    if (listElement) listElement.remove();
                }
            }
        } else {
            // Fluids card layout (special case)
            const headerDiv = goalCard.querySelector('.goal-header');
            if (headerDiv) {
                headerDiv.innerHTML = ''; // Clear default structure
                
                // Create tag container
                const tagContainer = document.createElement('div');
                tagContainer.className = 'tag-container';
                
                // Add tags
                if (goalData.tags) {
                    goalData.tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = `tag ${tag.color}`;
                        tagElement.textContent = tag.text;
                        tagContainer.appendChild(tagElement);
                    });
                }
                
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
                const cardDescription = goalCard.querySelector('.card-description');
                if (cardDescription) cardDescription.remove();
                
                const cardList = goalCard.querySelector('.card-list');
                if (cardList) cardList.remove();
                
                // Change the explain link text
                const explainLink = goalCard.querySelector('.explain-link');
                if (explainLink) {
                    explainLink.textContent = 'Close Trace ▲';
                    explainLink.classList.add('collapse');
                }
                
                // Show explanation by default
                const explanation = goalCard.querySelector('.explanation');
                if (explanation) explanation.style.display = 'block';
                
                // Remove Edit button for Fluids card
                const editBtn = goalCard.querySelector('.edit-btn');
                if (editBtn) editBtn.remove();
            }
        }
        
        // Set explanation text
        const explanation = goalCard.querySelector('.explanation');
        if (explanation && goalData.explanation) {
            explanation.textContent = goalData.explanation;
        }
        
        // Append the card to the container
        cardsContainer.appendChild(goalCard);
        
        // Add event listeners to the newly created card
        addCardEventListeners(goalData);
        
        // Setup action buttons for the newly added card
        setupActionButtons();
    } catch (error) {
        console.error('Error rendering goal card:', error);
        cardsContainer.innerHTML = '<p>Error displaying goal card. Please try again.</p>';
    }
}

// Add event listeners to goal card
function addCardEventListeners(goalData) {
    if (!goalData) return;
    
    // Explanation toggle
    document.querySelectorAll('.explain-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const explanation = this.nextElementSibling;
            if (!explanation) return;
            
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
            
            if (!sourcesPanel || !sourceContent || !goalData.source) return;
            
            // Update source content from the goal data
            sourceContent.innerHTML = `
                <p>${goalData.source.content || 'No source content available.'}</p>
                <p><strong>Citation:</strong> ${goalData.source.citation || 'No citation available.'}</p>
            `;
            
            sourcesPanel.style.display = 'block';
        });
    });
    
    // Wrapper function to handle an action button click
    function handleActionButtonClick(event) {
        console.log('Action button clicked!');
        event.preventDefault();
        event.stopPropagation();
        
        // Get the button that was clicked
        const button = event.currentTarget;
        
        // Provide visual feedback on the button
        button.classList.add('highlight');
        
        // Switch to the MAR tab with delay for feedback
        setTimeout(() => {
            button.classList.remove('highlight');
            
            // Switch to the MAR tab
            const marContent = switchToTab('mar-tab');
            
            // Force a new animation
            if (marContent) {
                marContent.classList.remove('animated');
                setTimeout(() => {
                    marContent.classList.add('animated');
                    startMARAnimation();
                }, 300);
            }
        }, 300);
    }

    // Add event listeners to all action buttons using event delegation
    function setupActionButtons() {
        // First, use direct approach for any existing buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            console.log('Adding event listener to action button');
            // Remove any existing listeners first to avoid duplicates
            button.removeEventListener('click', handleActionButtonClick);
            button.addEventListener('click', handleActionButtonClick);
        });
        
        // Then add event delegation to the container for dynamically added buttons
        const cardsContainer = document.getElementById('cards-container');
        if (cardsContainer) {
            cardsContainer.addEventListener('click', function(event) {
                // Check if the clicked element or its parent is an action button
                const actionButton = event.target.closest('.action-btn');
                if (actionButton) {
                    handleActionButtonClick(event);
                }
            });
        }
    }
}


