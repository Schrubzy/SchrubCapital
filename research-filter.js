// Research page filtering and search functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const researchCards = document.querySelectorAll('.research-card');
    const searchInput = document.getElementById('researchSearch');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    let currentFilter = 'all';
    let visibleCards = 6; // Initially show 6 cards
    
    // Filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            visibleCards = 6; // Reset visible cards count
            filterAndShowCards();
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            visibleCards = 6; // Reset visible cards count
            filterAndShowCards();
        }, 300));
    }
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCards += 6;
            filterAndShowCards();
        });
    }
    
    function filterAndShowCards() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        let filteredCards = [];
        
        researchCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check if card matches filter
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            // Check if card matches search
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                content.includes(searchTerm) ||
                tags.some(tag => tag.includes(searchTerm));
            
            if (matchesFilter && matchesSearch) {
                filteredCards.push(card);
            }
        });
        
        // Hide all cards first
        researchCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show filtered cards up to visibleCards limit
        filteredCards.slice(0, visibleCards).forEach(card => {
            card.style.display = 'block';
            // Add animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
        
        // Show/hide load more button
        if (loadMoreBtn) {
            if (filteredCards.length > visibleCards) {
                loadMoreBtn.style.display = 'inline-block';
                loadMoreBtn.textContent = `Load More Research (${filteredCards.length - visibleCards} remaining)`;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        // Show no results message if needed
        showNoResults(filteredCards.length === 0);
    }
    
    function showNoResults(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--stone-gray);">
                    <h3 style="color: var(--forest-primary); margin-bottom: 1rem;">No research found</h3>
                    <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            `;
            document.querySelector('.research-grid').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize the page
    filterAndShowCards();
});

// Add CSS for page header and additional styles
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for research page specific styles
    const style = document.createElement('style');
    style.textContent = `
        .page-header {
            background: linear-gradient(135deg, var(--forest-light) 0%, var(--cream-white) 100%);
            padding: 3rem 0 2rem;
            text-align: center;
            margin-top: 80px;
        }
        
        .page-header h1 {
            font-size: 2.5rem;
            color: var(--forest-primary);
            margin-bottom: 1rem;
        }
        
        .page-header p {
            font-size: 1.125rem;
            color: var(--stone-gray);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .research-filters {
            background: white;
            padding: 2rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .filter-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .filter-tab {
            padding: 0.5rem 1rem;
            border: 1px solid var(--forest-accent);
            background: transparent;
            color: var(--forest-accent);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .filter-tab:hover,
        .filter-tab.active {
            background: var(--forest-accent);
            color: white;
        }
        
        .search-bar {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .search-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--forest-accent);
            box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
        }
        
        .research-archive {
            padding: 3rem 0;
        }
        
        .research-tags {
            display: flex;
            gap: 0.5rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        }
        
        .tag {
            background: var(--forest-light);
            color: var(--forest-primary);
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .research-stats {
            display: flex;
            gap: 2rem;
            margin: 1rem 0;
        }
        
        .research-stats .stat {
            text-align: left;
        }
        
        .research-stats .stat-label {
            font-size: 0.75rem;
            color: var(--stone-gray);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
            display: block;
        }
        
        .research-stats .stat-value {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--forest-primary);
            font-family: 'Crimson Text', serif;
            display: block;
        }
        
        .load-more {
            text-align: center;
            margin-top: 3rem;
        }
        
        .methodology {
            background: var(--forest-light);
            padding: 4rem 0;
        }
        
        .methodology-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .methodology-item {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .methodology-item h3 {
            color: var(--forest-primary);
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            .filter-tabs {
                justify-content: center;
            }
            
            .research-stats {
                justify-content: space-between;
            }
            
            .methodology-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});