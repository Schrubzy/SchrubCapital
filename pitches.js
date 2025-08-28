// Pitches page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for pitches page
    const style = document.createElement('style');
    style.textContent = `
        .overview-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
            text-align: center;
        }
        
        .overview-stat {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .pitches-overview {
            background: var(--forest-light);
            padding: 2rem 0;
        }
        
        .pitch-card {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            margin-bottom: 2rem;
        }
        
        .pitch-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .pitch-card.featured {
            border-left: 4px solid var(--success-green);
            background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
        }
        
        .pitch-status {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .pitch-status.active {
            background: rgba(5, 150, 105, 0.1);
            color: var(--success-green);
        }
        
        .pitch-status.monitoring {
            background: rgba(217, 119, 6, 0.1);
            color: var(--warning-amber);
        }
        
        .pitch-status.watchlist {
            background: rgba(107, 114, 128, 0.1);
            color: var(--stone-gray);
        }
        
        .pitch-status.closed {
            background: rgba(55, 65, 81, 0.1);
            color: var(--charcoal);
        }
        
        .pitch-status.successful {
            background: rgba(5, 150, 105, 0.1);
            color: var(--success-green);
        }
        
        .pitch-header {
            margin-bottom: 1.5rem;
        }
        
        .company-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .company-info h3 {
            margin: 0;
            color: var(--forest-primary);
        }
        
        .ticker {
            background: var(--forest-primary);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .sector {
            background: var(--forest-light);
            color: var(--forest-accent);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .pitch-date {
            font-size: 0.875rem;
            color: var(--sage-green);
            font-weight: 500;
        }
        
        .thesis-summary {
            margin-bottom: 1.5rem;
        }
        
        .thesis-summary h4 {
            color: var(--forest-primary);
            margin-bottom: 0.75rem;
            font-size: 1rem;
        }
        
        .thesis-summary p {
            color: var(--stone-gray);
            font-style: italic;
            line-height: 1.5;
        }
        
        .pitch-financials {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin: 1.5rem 0;
            padding: 1.5rem;
            background: var(--cream-white);
            border-radius: 6px;
        }
        
        .financial-metric {
            text-align: center;
        }
        
        .financial-metric .metric-label {
            display: block;
            font-size: 0.75rem;
            color: var(--stone-gray);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        
        .financial-metric .metric-value {
            display: block;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--forest-primary);
            font-family: 'Crimson Text', serif;
        }
        
        .metric-value.upside {
            color: var(--success-green);
        }
        
        .metric-value.downside {
            color: var(--danger-red);
        }
        
        .metric-value.successful {
            color: var(--success-green);
        }
        
        .key-catalysts,
        .risk-factors {
            margin: 1.5rem 0;
        }
        
        .key-catalysts h5,
        .risk-factors h5 {
            color: var(--forest-primary);
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .key-catalysts ul,
        .risk-factors ul {
            list-style: none;
            padding: 0;
        }
        
        .key-catalysts li,
        .risk-factors li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: var(--stone-gray);
            font-size: 0.875rem;
        }
        
        .key-catalysts li::before {
            content: '↗';
            position: absolute;
            left: 0;
            color: var(--success-green);
            font-weight: bold;
        }
        
        .risk-factors li::before {
            content: '⚠';
            position: absolute;
            left: 0;
            color: var(--warning-amber);
        }
        
        .pitch-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .pitch-framework {
            background: white;
            padding: 4rem 0;
        }
        
        .framework-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .framework-step {
            text-align: center;
            padding: 2rem;
            background: var(--cream-white);
            border-radius: 8px;
            position: relative;
        }
        
        .step-number {
            width: 60px;
            height: 60px;
            background: var(--forest-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 auto 1rem;
            font-family: 'Crimson Text', serif;
        }
        
        .framework-step h3 {
            color: var(--forest-primary);
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            .company-info {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .pitch-financials {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .pitch-actions {
                flex-direction: column;
            }
            
            .overview-stats {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Track pitch interactions
    const pitchCards = document.querySelectorAll('.pitch-card');
    pitchCards.forEach(card => {
        const ticker = card.querySelector('.ticker')?.textContent;
        const status = card.querySelector('.pitch-status')?.textContent;
        
        card.addEventListener('click', function(e) {
            // Don't track if clicking on a button/link
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            trackEvent('pitch_card_click', {
                ticker: ticker || 'Unknown',
                status: status || 'Unknown'
            });
        });
    });
    
    // Track model downloads
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function() {
            const ticker = this.closest('.pitch-card')?.querySelector('.ticker')?.textContent;
            trackEvent('model_download', {
                ticker: ticker || 'Unknown',
                file: this.getAttribute('href')
            });
        });
    });
});

// Animation for pitch cards on scroll
function animatePitchCards() {
    const cards = document.querySelectorAll('.pitch-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', animatePitchCards);
