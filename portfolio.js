// Portfolio page styling and functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add comprehensive CSS for portfolio page
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
        
        .performance-overview {
            background: var(--forest-light);
            padding: 3rem 0;
        }
        
        .performance-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .performance-stat {
            background: white;
            padding: 2.5rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .performance-stat .stat-number {
            display: block;
            font-size: 3rem;
            font-weight: 600;
            color: var(--success-green);
            font-family: 'Crimson Text', serif;
            margin-bottom: 0.5rem;
        }
        
        .performance-stat .stat-label {
            display: block;
            font-size: 1.125rem;
            color: var(--forest-primary);
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        .performance-stat .stat-period {
            display: block;
            font-size: 0.875rem;
            color: var(--stone-gray);
        }
        
        .track-record {
            padding: 4rem 0;
            background: white;
        }
        
        .performance-table-container {
            overflow-x: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .performance-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .performance-table th {
            background: var(--forest-primary);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 500;
            border-bottom: 2px solid var(--forest-secondary);
        }
        
        .performance-table td {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .performance-table tr:hover {
            background: var(--cream-white);
        }
        
        .return-positive {
            color: var(--success-green);
            font-weight: 600;
        }
        
        .return-negative {
            color: var(--danger-red);
            font-weight: 600;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.active {
            background: rgba(5, 150, 105, 0.1);
            color: var(--success-green);
        }
        
        .status-badge.closed {
            background: rgba(55, 65, 81, 0.1);
            color: var(--charcoal);
        }
        
        .price-controls {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            background: var(--cream-white);
            border-radius: 8px;
        }
        
        .price-controls button {
            margin-right: 1rem;
        }
        
        .last-updated {
            font-size: 0.875rem;
            color: var(--stone-gray);
        }
        
        .professional-profile {
            background: var(--cream-white);
            padding: 4rem 0;
        }
        
        .profile-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            align-items: start;
        }
        
        .skills-list, .tools-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            list-style: none;
            padding: 0;
        }
        
        .skills-list li, .tools-list li {
            background: white;
            padding: 0.75rem;
            border-radius: 4px;
            border-left: 3px solid var(--forest-accent);
            font-size: 0.9rem;
        }
        
        .achievements-sidebar {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .achievement-item {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .achievement-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .achievement-item h4 {
            color: var(--forest-primary);
            margin-bottom: 0.5rem;
        }
        
        .contact-cta {
            background: var(--forest-primary);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .contact-cta h2 {
            color: white;
            margin-bottom: 1rem;
        }
        
        .contact-cta p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.125rem;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
            .profile-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .performance-table-container {
                font-size: 0.875rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .performance-stats {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-calculate returns for active positions
    function updateReturns() {
        // Update Apple (AAPL) return
        const aaplPrice = document.querySelector('.price-element[data-ticker="AAPL"]');
        const aaplReturn = document.getElementById('return-AAPL');
        if (aaplPrice && aaplReturn) {
            const currentPrice = parseFloat(aaplPrice.textContent.replace('$', ''));
            const entryPrice = 176.00;
            if (!isNaN(currentPrice)) {
                const returnPct = ((currentPrice - entryPrice) / entryPrice) * 100;
                aaplReturn.textContent = `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(1)}%`;
                aaplReturn.className = returnPct >= 0 ? 'return-positive' : 'return-negative';
            }
        }
        
        // Update JNJ return
        const jnjPrice = document.querySelector('.price-element[data-ticker="JNJ"]');
        const jnjReturn = document.getElementById('return-JNJ');
        if (jnjPrice && jnjReturn) {
            const currentPrice = parseFloat(jnjPrice.textContent.replace('$', ''));
            const entryPrice = 157.00;
            if (!isNaN(currentPrice)) {
                const returnPct = ((currentPrice - entryPrice) / entryPrice) * 100;
                jnjReturn.textContent = `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(1)}%`;
                jnjReturn.className = returnPct >= 0 ? 'return-positive' : 'return-negative';
            }
        }
        
        // Update Visa (V) return
        const vPrice = document.querySelector('.price-element[data-ticker="V"]');
        const vReturn = document.getElementById('return-V');
        if (vPrice && vReturn) {
            const currentPrice = parseFloat(vPrice.textContent.replace('$', ''));
            const entryPrice = 285.00;
            if (!isNaN(currentPrice)) {
                const returnPct = ((currentPrice - entryPrice) / entryPrice) * 100;
                vReturn.textContent = `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(1)}%`;
                vReturn.className = returnPct >= 0 ? 'return-positive' : 'return-negative';
            }
        }
    }
    
    // Update returns when prices change
    const observer = new MutationObserver(updateReturns);
    document.querySelectorAll('.price-element').forEach(element => {
        observer.observe(element, { childList: true, subtree: true, characterData: true });
    });
    
    // Initial calculation after prices load
    setTimeout(updateReturns, 3000);
});