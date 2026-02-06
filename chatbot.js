// ==============================
// GLOBAL STATE
// ==============================
let passportFlow = false;
let userCountry = "";

// ==============================
// TOGGLE CHATBOT
// ==============================
function toggleChatbot() {
    const window = document.getElementById("chatbot-window");
    window.classList.toggle("active");
}

// ==============================
// INITIAL TIME
// ==============================
document.getElementById("init-time").innerText = getTime();

// ==============================
// ENTER KEY HANDLER
// ==============================
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// ==============================
// SEND MESSAGE
// ==============================
function sendMessage() {
    const input = document.getElementById("chatbot-input");
    const message = input.value.trim();

    if (message === "") return;

    addMessage("user", message);
    input.value = "";

    setTimeout(() => {
        botReply(message);
    }, 600);
}

// ==============================
// ADD MESSAGE
// ==============================
function addMessage(sender, text) {
    const messages = document.getElementById("chatbot-messages");

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <i class="fas fa-${sender === "bot" ? "robot" : "user"}"></i>
                <span>${sender === "bot" ? "AI Assistant" : "You"}</span>
            </div>
            <div>${text}</div>
            <div class="message-time">${getTime()}</div>
        </div>
    `;

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// ==============================
// BOT LOGIC
// ==============================
function botReply(userMessage) {
    const msg = userMessage.toLowerCase();
    let reply = "🤖 I'm here to help! Can you tell me more?";

    // ==============================
    // LOST PASSPORT - STEP 2
    // ==============================
    if (passportFlow) {
        userCountry = userMessage;
        passportFlow = false;

        const mapQuery = `${userCountry} embassy Cambodia`;

        reply = `
🛂 <strong>Lost Passport Help</strong><br>
Please contact your <b>${userCountry} Embassy</b> immediately.<br><br>

📍 <strong>Nearest Embassy:</strong><br>
<iframe
    src="https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed"
    width="100%"
    height="200"
    style="border:0;border-radius:10px;"
    loading="lazy">
</iframe>

📌 <strong>Bring with you:</strong><br>
• Police report<br>
• Passport copy (if any)<br>
• National ID<br><br>
If you need help finding a police station, just tell me.
        `;

        addMessage("bot", reply);
        return;
    }

    // ==============================
    // LOST PASSPORT - STEP 1
    // ==============================
    if (
        msg.includes("lost my passport") ||
        msg.includes("passport lost") ||
        msg.includes("lost passport")
    ) {
        passportFlow = true;
        reply = `
😟 <strong>I'm sorry this happened.</strong><br>
I can help you find your embassy.<br><br>
🌍 <strong>Which country are you from?</strong>
        `;
        addMessage("bot", reply);
        return;
    }

    // ==============================
    // EMERGENCY
    // ==============================
    if (msg.includes("emergency")) {
        reply = `
🚨 <strong>Emergency Help</strong><br>
• Ambulance: <b>119</b><br>
• Police: <b>117</b><br>
• Tourist Police: <b>031 201 234</b>
        `;
    }

    // ==============================
    // DESTINATIONS
    // ==============================
    else if (msg.includes("destination")) {
        reply = `
📍 <strong>Popular Destinations</strong><br>
• Angkor Wat<br>
• Phnom Penh City<br>
• Siem Reap Night Market<br>
• Koh Rong Island
        `;
    }

    // ==============================
    // TOUR PACKAGES
    // ==============================
    else if (msg.includes("package") || msg.includes("tour")) {
        reply = `
🎒 <strong>Tour Packages</strong><br>
• City Tour (1 Day)<br>
• Temple Tour (2 Days)<br>
• Adventure Trip<br>
Contact us for prices 😊
        `;
    }

    // ==============================
    // CONTACT INFO
    // ==============================
    else if (msg.includes("contact")) {
        reply = `
📞 <strong>Contact Info</strong><br>
• Phone: +855 12 345 678<br>
• Email: support@tostrip.com<br>
• Instagram: @tostrip
        `;
    }

    addMessage("bot", reply);
}

// ==============================
// QUICK ACTION BUTTONS
// ==============================
function quickAction(type) {
    if (type === "emergency") botReply("emergency");
    if (type === "destinations") botReply("destination");
    if (type === "packages") botReply("tour packages");
    if (type === "contact") botReply("contact");
}

// ==============================
// TIME FORMAT
// ==============================
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
