// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for contact page
    const style = document.createElement('style');
    style.textContent = `
        .contact-content {
            padding: 3rem 0;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
        }
        
        .contact-info h2 {
            color: var(--forest-primary);
            margin-bottom: 1.5rem;
        }
        
        .contact-info > p {
            font-size: 1.125rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .contact-methods {
            margin-bottom: 2rem;
        }
        
        .contact-method {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--cream-white);
            border-radius: 8px;
            border-left: 4px solid var(--forest-accent);
        }
        
        .contact-method h3 {
            color: var(--forest-primary);
            margin-bottom: 0.75rem;
            font-size: 1.125rem;
        }
        
        .contact-method p {
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        
        .contact-link {
            color: var(--forest-accent);
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-color 0.3s ease;
        }
        
        .contact-link:hover {
            border-bottom-color: var(--forest-accent);
        }
        
        .response-time {
            background: var(--forest-light);
            padding: 1.5rem;
            border-radius: 8px;
        }
        
        .response-time h3 {
            color: var(--forest-primary);
            margin-bottom: 1rem;
        }
        
        .contact-form-container {
            background: white;
            padding: 2.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .contact-form h2 {
            color: var(--forest-primary);
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--forest-primary);
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--forest-accent);
            box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            cursor: pointer;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        
        .form-disclaimer {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }
        
        .form-disclaimer p {
            color: var(--stone-gray);
            font-size: 0.875rem;
            line-height: 1.4;
            margin: 0;
        }
        
        .faq-section {
            background: var(--cream-white);
            padding: 4rem 0;
        }
        
        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .faq-item {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .faq-item h3 {
            color: var(--forest-primary);
            margin-bottom: 1rem;
            font-size: 1.125rem;
        }
        
        .faq-item p {
            color: var(--stone-gray);
            margin: 0;
            line-height: 1.5;
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            
            .contact-form-container {
                padding: 2rem;
            }
            
            .faq-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Get form values
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');
            const inquiryType = formData.get('inquiry-type');
            const subject = formData.get('subject');
            const message = formData.get('message');
            const newsletter = formData.get('newsletter');
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Disable button during submission
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you within 48 hours.', 'success');
                this.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                
                // Track form submission
                trackEvent('contact_form_submit', {
                    inquiry_type: inquiryType,
                    has_company: !!company,
                    newsletter_signup: !!newsletter
                });
                
                // If newsletter was checked, handle that separately
                if (newsletter) {
                    trackEvent('newsletter_signup', {
                        source: 'contact_form'
                    });
                }
            }, 1500);
        });
    }
    
    function validateForm(formData) {
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const inquiryType = formData.get('inquiry-type');
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        if (!name) {
            showNotification('Please enter your full name.', 'error');
            return false;
        }
        
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!inquiryType) {
            showNotification('Please select an inquiry type.', 'error');
            return false;
        }
        
        if (!subject) {
            showNotification('Please enter a subject for your message.', 'error');
            return false;
        }
        
        if (!message || message.length < 10) {
            showNotification('Please provide a detailed message (at least 10 characters).', 'error');
            return false;
        }
        
        return true;
    }
    
    // Auto-update subject based on inquiry type
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    const subjectInput = document.getElementById('subject');
    
    if (inquiryTypeSelect && subjectInput) {
        inquiryTypeSelect.addEventListener('change', function() {
            const value = this.value;
            const currentSubject = subjectInput.value;
            
            // Only auto-fill if subject is empty
            if (!currentSubject) {
                const subjectTemplates = {
                    'investment-discussion': 'Investment Discussion - ',
                    'research-question': 'Research Question - ',
                    'collaboration': 'Collaboration Opportunity - ',
                    'job-opportunity': 'Job Opportunity - ',
                    'media-interview': 'Media/Interview Request - ',
                    'other': ''
                };
                
                subjectInput.value = subjectTemplates[value] || '';
                if (subjectTemplates[value]) {
                    subjectInput.focus();
                    subjectInput.setSelectionRange(subjectInput.value.length, subjectInput.value.length);
                }
            }
        });
    }
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--stone-gray);
            margin-top: 0.5rem;
        `;
        
        messageTextarea.parentNode.appendChild(charCounter);
        
        function updateCharCounter() {
            const length = messageTextarea.value.length;
            charCounter.textContent = `${length} characters`;
            
            if (length < 10) {
                charCounter.style.color = 'var(--danger-red)';
            } else {
                charCounter.style.color = 'var(--stone-gray)';
            }
        }
        
        messageTextarea.addEventListener('input', updateCharCounter);
        updateCharCounter(); // Initial update
    }
    
    // FAQ accordion functionality (optional enhancement)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        const content = item.querySelector('p');
        
        title.style.cursor = 'pointer';
        title.style.userSelect = 'none';
        
        title.addEventListener('click', function() {
            const isOpen = content.style.display !== 'none';
            
            // Close all other FAQ items (accordion style)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('p').style.display = 'none';
                    otherItem.querySelector('h3').style.color = 'var(--forest-primary)';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                content.style.display = 'none';
                title.style.color = 'var(--forest-primary)';
            } else {
                content.style.display = 'block';
                title.style.color = 'var(--forest-accent)';
            }
            
            trackEvent('faq_click', {
                question: title.textContent.substring(0, 50) + '...'
            });
        });
        
        // Initially hide all answers
        content.style.display = 'none';
    });
});

// Form validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}