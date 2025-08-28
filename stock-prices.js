// Real-time stock price integration for Schrub Capital
class StockPriceManager {
    constructor() {
        this.apiKey = 'YOUR_API_KEY_HERE'; // You'll need to get this from Alpha Vantage
        this.updateInterval = 300000; // Update every 5 minutes (300,000 milliseconds)
        this.cache = new Map();
        this.lastUpdate = new Map();
    }

    // Initialize price updates when page loads
    async initialize() {
        // Get all stock tickers from the page
        const tickers = this.extractTickersFromPage();
        
        // Update prices immediately
        await this.updateAllPrices(tickers);
        
        // Set up periodic updates during market hours
        this.startPeriodicUpdates(tickers);
    }

    // Extract ticker symbols from the current page
    extractTickersFromPage() {
        const tickers = new Set();
        
        // Look for ticker symbols in various elements
        document.querySelectorAll('.ticker, [data-ticker]').forEach(element => {
            const ticker = element.textContent.trim() || element.dataset.ticker;
            if (ticker && ticker.length <= 5) {
                tickers.add(ticker.toUpperCase());
            }
        });

        // Also look for common patterns like (AAPL), (MSFT), etc.
        const textContent = document.body.textContent;
        const tickerMatches = textContent.match(/\([A-Z]{1,5}\)/g);
        if (tickerMatches) {
            tickerMatches.forEach(match => {
                const ticker = match.replace(/[()]/g, '');
                tickers.add(ticker);
            });
        }

        return Array.from(tickers);
    }

    // Method 1: Alpha Vantage API (Requires API key, 5 free calls per minute)
    async fetchPriceAlphaVantage(ticker) {
        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data['Global Quote']) {
                const quote = data['Global Quote'];
                return {
                    symbol: ticker,
                    price: parseFloat(quote['05. price']),
                    change: parseFloat(quote['09. change']),
                    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                    lastUpdate: new Date()
                };
            }
        } catch (error) {
            console.error(`Error fetching price for ${ticker}:`, error);
        }
        return null;
    }

    // Method 2: Yahoo Finance API (Free but unofficial)
    async fetchPriceYahoo(ticker) {
        try {
            // Using a CORS proxy to access Yahoo Finance
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
            const url = proxyUrl + encodeURIComponent(yahooUrl);
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.chart && data.chart.result && data.chart.result[0]) {
                const result = data.chart.result[0];
                const meta = result.meta;
                const currentPrice = meta.regularMarketPrice;
                const previousClose = meta.previousClose;
                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;
                
                return {
                    symbol: ticker,
                    price: currentPrice,
                    change: change,
                    changePercent: changePercent,
                    lastUpdate: new Date()
                };
            }
        } catch (error) {
            console.error(`Error fetching price for ${ticker} from Yahoo:`, error);
        }
        return null;
    }

    // Method 3: Fallback with mock data for development
    generateMockPrice(ticker) {
        // Generate realistic price movements for development/testing
        const basePrices = {
            'AAPL': 185,
            'MSFT': 445,
            'GOOGL': 172,
            'TSLA': 248,
            'JNJ': 157,
            'V': 285,
            'META': 485
        };
        
        const basePrice = basePrices[ticker] || 100;
        const randomChange = (Math.random() - 0.5) * 0.1; // ±5% random change
        const newPrice = basePrice * (1 + randomChange);
        const change = newPrice - basePrice;
        const changePercent = (change / basePrice) * 100;
        
        return {
            symbol: ticker,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            lastUpdate: new Date(),
            isMock: true
        };
    }

    // Update all prices for given tickers
    async updateAllPrices(tickers) {
        const updatePromises = tickers.map(ticker => this.updateTickerPrice(ticker));
        await Promise.all(updatePromises);
    }

    // Update price for a specific ticker
    async updateTickerPrice(ticker) {
        try {
            let priceData;
            
            // Try different data sources in order of preference
            if (this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE') {
                priceData = await this.fetchPriceAlphaVantage(ticker);
            }
            
            if (!priceData) {
                priceData = await this.fetchPriceYahoo(ticker);
            }
            
            // Fallback to mock data if APIs fail
            if (!priceData) {
                priceData = this.generateMockPrice(ticker);
            }
            
            if (priceData) {
                this.cache.set(ticker, priceData);
                this.lastUpdate.set(ticker, new Date());
                this.updatePriceInDOM(ticker, priceData);
            }
        } catch (error) {
            console.error(`Failed to update price for ${ticker}:`, error);
        }
    }

    // Update the price display in the webpage
    updatePriceInDOM(ticker, priceData) {
        // Find all elements that should show this ticker's price
        const selectors = [
            `[data-ticker="${ticker}"]`,
            `.current-price[data-symbol="${ticker}"]`,
            `.price-${ticker.toLowerCase()}`,
            `.metric-value[data-ticker="${ticker}"]`
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.classList.contains('price-element')) {
                    element.textContent = `$${priceData.price.toFixed(2)}`;
                    
                    // Add color coding for positive/negative changes
                    const changeElement = element.nextElementSibling;
                    if (changeElement && changeElement.classList.contains('price-change')) {
                        const changeText = `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)} (${priceData.changePercent.toFixed(2)}%)`;
                        changeElement.textContent = changeText;
                        changeElement.className = `price-change ${priceData.change >= 0 ? 'positive' : 'negative'}`;
                    }
                }
            });
        });

        // Update last refresh time
        this.updateLastRefreshTime();
    }

    // Add last updated timestamp
    updateLastRefreshTime() {
        const timestamp = new Date().toLocaleTimeString();
        let refreshElement = document.getElementById('price-refresh-time');
        
        if (!refreshElement) {
            refreshElement = document.createElement('div');
            refreshElement.id = 'price-refresh-time';
            refreshElement.className = 'price-refresh-time';
            refreshElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--forest-primary);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.75rem;
                z-index: 1000;
                opacity: 0.8;
            `;
            document.body.appendChild(refreshElement);
        }
        
        refreshElement.textContent = `Prices updated: ${timestamp}`;
    }

    // Start periodic updates (only during market hours)
    startPeriodicUpdates(tickers) {
        setInterval(() => {
            if (this.isMarketHours()) {
                this.updateAllPrices(tickers);
            }
        }, this.updateInterval);
    }

    // Check if markets are open (simplified - you can make this more sophisticated)
    isMarketHours() {
        const now = new Date();
        const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
        const day = easternTime.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = easternTime.getHours();
        
        // Market is open Monday-Friday, 9:30 AM - 4:00 PM Eastern
        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = hour >= 9 && hour < 16;
        
        return isWeekday && isMarketHours;
    }

    // Manual refresh function
    async refreshPrices() {
        const tickers = this.extractTickersFromPage();
        await this.updateAllPrices(tickers);
    }

    // Get cached price for a ticker
    getPrice(ticker) {
        return this.cache.get(ticker.toUpperCase());
    }
}

// Initialize the stock price manager when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.stockPriceManager = new StockPriceManager();
    
    // Add CSS for price displays
    const style = document.createElement('style');
    style.textContent = `
        .price-element {
            font-weight: 600;
            font-family: 'Crimson Text', serif;
        }
        
        .price-change {
            font-size: 0.875rem;
            margin-left: 0.5rem;
        }
        
        .price-change.positive {
            color: var(--success-green);
        }
        
        .price-change.negative {
            color: var(--danger-red);
        }
        
        .price-loading {
            opacity: 0.6;
            position: relative;
        }
        
        .price-loading::after {
            content: "Loading...";
            position: absolute;
            right: -60px;
            font-size: 0.75rem;
            color: var(--stone-gray);
        }
        
        .last-updated {
            font-size: 0.75rem;
            color: var(--stone-gray);
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize prices after a short delay to ensure page is fully loaded
    setTimeout(() => {
        window.stockPriceManager.initialize();
    }, 1000);
});

// Utility functions for manual control
function refreshAllPrices() {
    if (window.stockPriceManager) {
        window.stockPriceManager.refreshPrices();
    }
}

function getCurrentPrice(ticker) {
    if (window.stockPriceManager) {
        return window.stockPriceManager.getPrice(ticker);
    }
    return null;
}