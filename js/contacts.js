// ============================================
// AUTO LUXE KENYA - CONTACTS PAGE FUNCTIONALITY
// Handles contact form, SMS modal, live chat, and contact automation
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initSMSModal();
    initLiveChat();
    initFAQAccordion();
    populateCarDropdown();
    initQuickContactButtons();
    initFileUpload();
    initCaptcha();
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryType = urlParams.get('inquiry');
    const carId = urlParams.get('car');
    
    if (inquiryType) {
        prefillInquiryType(inquiryType);
    }
    
    if (carId) {
        prefillCarSelection(carId);
    }
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateContactForm()) {
            return;
        }
        
        const submitBtn = this.querySelector('.submit-btn');
        setButtonLoading(submitBtn, true);
        
        // Get form data
        const formData = getContactFormData();
        
        // Simulate form submission
        setTimeout(() => {
            setButtonLoading(submitBtn, false);
            
            // Save submission
            saveContactSubmission(formData);
            
            // Show success message
            showToast('Message sent successfully! We will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset file upload display
            const fileName = document.getElementById('fileName');
            if (fileName) {
                fileName.textContent = 'No file chosen';
            }
            
            // Generate new CAPTCHA
            generateCaptcha();
            
            // Send auto-reply email (in a real app)
            sendAutoReplyEmail(formData);
            
        }, 2000);
    });
    
    // Initialize form validation on blur
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Initialize SMS modal
function initSMSModal() {
    const smsBtn = document.getElementById('smsBtn');
    const smsModalClose = document.getElementById('smsModalClose');
    const smsModalOverlay = document.getElementById('smsModalOverlay');
    
    if (!smsBtn || !smsModalOverlay) return;
    
    // Open SMS modal
    smsBtn.addEventListener('click', function() {
        openSMSModal();
    });
    
    // Close SMS modal
    if (smsModalClose) {
        smsModalClose.addEventListener('click', function() {
            smsModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on overlay click
    smsModalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Template buttons
    const templateButtons = document.querySelectorAll('.template-btn');
    templateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.dataset.template;
            applySMSTemplate(template);
        });
    });
}

// Initialize live chat
function initLiveChat() {
    const liveChatBtn = document.getElementById('liveChatBtn');
    const chatModalClose = document.getElementById('chatModalClose');
    const chatModalOverlay = document.getElementById('chatModalOverlay');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.querySelector('.send-chat-btn');
    
    if (!liveChatBtn || !chatModalOverlay) return;
    
    // Check if chat is available (business hours)
    const isChatAvailable = checkChatAvailability();
    if (!isChatAvailable) {
        if (liveChatBtn) {
            liveChatBtn.disabled = true;
            liveChatBtn.innerHTML = '<i class="fas fa-clock"></i><span>Offline</span>';
            liveChatBtn.title = 'Chat available Mon-Sat: 9AM-6PM';
        }
        return;
    }
    
    // Open chat modal
    liveChatBtn.addEventListener('click', function() {
        openLiveChat();
    });
    
    // Close chat modal
    if (chatModalClose) {
        chatModalClose.addEventListener('click', function() {
            chatModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on overlay click
    chatModalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Send chat message
    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', function() {
            sendChatMessage(chatInput.value);
            chatInput.value = '';
        });
        
        // Send on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage(this.value);
                this.value = '';
            }
        });
    }
}

// Initialize FAQ accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class
            this.classList.toggle('active');
            answer.classList.toggle('active');
            
            // Rotate icon
            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Close other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('active');
                    otherQuestion.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });
        });
    });
}

// Populate car dropdown
function populateCarDropdown() {
    const carSelection = document.getElementById('carSelection');
    if (!carSelection) return;
    
    // Add "Select a car" option
    carSelection.innerHTML = '<option value="">Select a car (optional)</option>';
    
    // Add car options
    carsData.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.year} ${car.make} ${car.model} - ${formatPrice(car.price)}`;
        carSelection.appendChild(option);
    });
    
    // Add "Other" option
    const otherOption = document.createElement('option');
    otherOption.value = 'other';
    otherOption.textContent = 'Other (specify in message)';
    carSelection.appendChild(otherOption);
}

// Initialize quick contact buttons
function initQuickContactButtons() {
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.dataset.message;
            fillQuickMessage(message);
        });
    });
}

// Initialize file upload
function initFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileName = document.getElementById('fileName');
    
    if (!fileUpload || !fileName) return;
    
    fileUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                this.value = '';
                fileName.textContent = 'No file chosen';
                return;
            }
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 
                               'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                showToast('Invalid file type. Please upload PDF, JPG, PNG, or DOC files.', 'error');
                this.value = '';
                fileName.textContent = 'No file chosen';
                return;
            }
            
            fileName.textContent = file.name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
}

// Initialize CAPTCHA
function initCaptcha() {
    generateCaptcha();
}

// Generate CAPTCHA
function generateCaptcha() {
    const captchaText = document.getElementById('captchaText');
    if (!captchaText) return;
    
    // Generate simple math CAPTCHA
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch (operator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
    }
    
    // Store answer in data attribute
    captchaText.dataset.answer = answer;
    captchaText.textContent = `${num1} ${operator} ${num2} = ?`;
}

// Validate contact form
function validateContactForm() {
    // Required fields
    const requiredFields = [
        'contactName',
        'contactPhone',
        'contactEmail',
        'messageType',
        'contactMessage'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            highlightError(field, 'This field is required');
        } else {
            clearError(field);
        }
    });
    
    // Validate email
    const emailField = document.getElementById('contactEmail');
    if (emailField && emailField.value.trim() && !validateEmail(emailField.value)) {
        isValid = false;
        highlightError(emailField, 'Please enter a valid email address');
    }
    
    // Validate phone
    const phoneField = document.getElementById('contactPhone');
    if (phoneField && phoneField.value.trim() && !validatePhone(phoneField.value)) {
        isValid = false;
        highlightError(phoneField, 'Please enter a valid Kenyan phone number');
    }
    
    // Validate CAPTCHA
    const captchaInput = document.getElementById('captchaInput');
    const captchaText = document.getElementById('captchaText');
    
    if (captchaInput && captchaText) {
        const userAnswer = parseInt(captchaInput.value);
        const correctAnswer = parseInt(captchaText.dataset.answer);
        
        if (isNaN(userAnswer) || userAnswer !== correctAnswer) {
            isValid = false;
            highlightError(captchaInput, 'Incorrect answer. Please try again.');
            generateCaptcha(); // Generate new CAPTCHA
        } else {
            clearError(captchaInput);
        }
    }
    
    // Check terms agreement
    const agreeCheckbox = document.getElementById('contactAgree');
    if (agreeCheckbox && !agreeCheckbox.checked) {
        isValid = false;
        showToast('Please agree to the privacy policy and terms of service', 'error');
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    if (!field.value.trim()) {
        highlightError(field, 'This field is required');
        return false;
    }
    
    // Field-specific validation
    switch (field.id) {
        case 'contactEmail':
            if (!validateEmail(field.value)) {
                highlightError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'contactPhone':
            if (!validatePhone(field.value)) {
                highlightError(field, 'Please enter a valid Kenyan phone number');
                return false;
            }
            break;
    }
    
    clearError(field);
    return true;
}

// Highlight field error
function highlightError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'var(--danger-color)';
    errorMessage.style.fontSize = '0.75rem';
    errorMessage.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorMessage);
}

// Clear field error
function clearError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Get contact form data
function getContactFormData() {
    const carSelection = document.getElementById('carSelection');
    const selectedCar = carSelection ? carSelection.value : '';
    let carDetails = null;
    
    if (selectedCar && selectedCar !== 'other') {
        carDetails = getCarById(selectedCar);
    }
    
    return {
        name: document.getElementById('contactName').value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        carSelection: selectedCar,
        carDetails: carDetails,
        messageType: document.getElementById('messageType').value,
        message: document.getElementById('contactMessage').value.trim(),
        files: document.getElementById('fileUpload').files,
        submittedAt: new Date().toISOString(),
        ipAddress: getClientIP(), // Would be server-side in production
        userAgent: navigator.userAgent
    };
}

// Save contact submission
function saveContactSubmission(formData) {
    // Remove files from formData for localStorage (files can't be stored)
    const submissionData = {
        ...formData,
        files: Array.from(formData.files || []).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        }))
    };
    
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(submissionData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // In a real application, you would send this to a server
    console.log('Contact form submission:', submissionData);
}

// Send auto-reply email
function sendAutoReplyEmail(formData) {
    // In a real application, this would send an email
    const autoReply = {
        to: formData.email,
        subject: `Thank you for contacting AutoLuxe Kenya - ${formData.messageType}`,
        body: `
Dear ${formData.name},

Thank you for contacting AutoLuxe Kenya. We have received your ${formData.messageType.toLowerCase()} inquiry.

Our team will review your message and contact you within 24 hours.

Inquiry Details:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Inquiry Type: ${formData.messageType}
${formData.carDetails ? `- Car: ${formData.carDetails.year} ${formData.carDetails.make} ${formData.carDetails.model}` : ''}

If you have any urgent questions, please call us at 07605455312 or WhatsApp us.

Best regards,
AutoLuxe Kenya Team
        `
    };
    
    console.log('Auto-reply email:', autoReply);
    
    // Create mailto link for demo purposes
    const mailtoLink = generateMailUrl(
        formData.email,
        autoReply.subject,
        autoReply.body
    );
    
    // In production, this would be done server-side
    // For demo, we'll just log it
    console.log('Mailto link:', mailtoLink);
}

// Open SMS modal
function openSMSModal() {
    const smsModalOverlay = document.getElementById('smsModalOverlay');
    const smsPreview = document.getElementById('smsPreview');
    
    if (!smsModalOverlay || !smsPreview) return;
    
    // Generate default SMS message
    const defaultMessage = "Hello AutoLuxe Kenya! I'm interested in your luxury vehicles. Please contact me with more information.";
    smsPreview.textContent = defaultMessage;
    
    // Show modal
    smsModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Apply SMS template
function applySMSTemplate(template) {
    const smsPreview = document.getElementById('smsPreview');
    if (!smsPreview) return;
    
    let message;
    
    switch (template) {
        case 'test-drive':
            message = "Hello AutoLuxe Kenya! I would like to schedule a test drive. Please contact me to arrange a suitable time.";
            break;
        case 'pricing':
            message = "Hello AutoLuxe Kenya! I'm interested in your vehicles and would like to know about pricing and available discounts.";
            break;
        case 'appointment':
            message = "Hello AutoLuxe Kenya! I would like to book an appointment to visit your showroom. Please suggest available times.";
            break;
        default:
            message = "Hello AutoLuxe Kenya! I'm interested in your luxury vehicles. Please contact me with more information.";
    }
    
    smsPreview.textContent = message;
}

// Check chat availability
function checkChatAvailability() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    
    // Available Mon-Sat: 9AM-6PM
    if (day === 0) return false; // Sunday
    if (day === 6 && hour >= 14) return false; // Saturday after 2PM
    
    return hour >= 9 && hour < 18;
}

// Open live chat
function openLiveChat() {
    const chatModalOverlay = document.getElementById('chatModalOverlay');
    if (!chatModalOverlay) return;
    
    // Show modal
    chatModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        setTimeout(() => chatInput.focus(), 100);
    }
}

// Send chat message
function sendChatMessage(message) {
    if (!message.trim()) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `
        <p>${message}</p>
        <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;
    chatMessages.appendChild(userMessage);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate agent response after delay
    setTimeout(() => {
        const agentResponse = getAgentResponse(message);
        
        const agentMessage = document.createElement('div');
        agentMessage.className = 'message agent';
        agentMessage.innerHTML = `
            <p>${agentResponse}</p>
            <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        chatMessages.appendChild(agentMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Get agent response based on user message
function getAgentResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('test drive') || message.includes('test-drive')) {
        return "We'd be happy to arrange a test drive for you! Please let us know which car you're interested in and your preferred time.";
    } else if (message.includes('price') || message.includes('cost')) {
        return "Our prices vary depending on the vehicle. Could you please specify which car model you're interested in?";
    } else if (message.includes('financing') || message.includes('loan')) {
        return "We offer various financing options through our partner banks. Would you like me to connect you with our financing specialist?";
    } else if (message.includes('available') || message.includes('stock')) {
        return "We have a wide selection of luxury vehicles in stock. You can browse our complete inventory on the Cars page.";
    } else if (message.includes('contact') || message.includes('phone') || message.includes('call')) {
        return "You can reach us at 07605455312. We're available Monday to Saturday, 8AM to 6PM.";
    } else if (message.includes('location') || message.includes('address') || message.includes('where')) {
        return "Our showroom is located in Nairobi. Would you like our exact address and directions?";
    } else {
        return "Thank you for your message! How can I assist you further?";
    }
}

// Prefill inquiry type from URL
function prefillInquiryType(inquiryType) {
    const messageTypeSelect = document.getElementById('messageType');
    if (!messageTypeSelect) return;
    
    const validTypes = ['inquiry', 'test-drive', 'financing', 'maintenance', 'sell', 'other'];
    if (validTypes.includes(inquiryType)) {
        messageTypeSelect.value = inquiryType;
    }
}

// Prefill car selection from URL
function prefillCarSelection(carId) {
    const carSelection = document.getElementById('carSelection');
    if (!carSelection) return;
    
    const car = getCarById(carId);
    if (car) {
        carSelection.value = carId;
    }
}

// Fill quick message
function fillQuickMessage(message) {
    const messageTextarea = document.getElementById('contactMessage');
    if (messageTextarea) {
        messageTextarea.value = message;
        messageTextarea.focus();
    }
}

// Get client IP (simulated for demo)
function getClientIP() {
    // In production, this would be done server-side
    return '192.168.1.1'; // Demo IP
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactForm,
        validateContactForm,
        saveContactSubmission,
        checkChatAvailability,
        getAgentResponse
    };
}