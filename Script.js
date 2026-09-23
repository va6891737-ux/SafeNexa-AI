
// ==========================================
// SAFENEXA AI - FRONTEND FUNCTIONS
// ==========================================


// ==========================================
// 1. EMERGENCY SOS
// ==========================================

function activateSOS() {

    alert(
        "🚨 SafeNexa Emergency Mode Activated!\n\n" +
        "Please stay calm.\n" +
        "Use the location sharing option and contact your local emergency services."
    );

    getLocation();
}


// ==========================================
// 2. GET USER LOCATION
// ==========================================

function getLocation() {

    const locationStatus =
        document.getElementById("locationStatus");

    if (!navigator.geolocation) {

        locationStatus.innerText =
            "❌ Location is not supported by this browser.";

        return;
    }

    locationStatus.innerText =
        "📍 Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            locationStatus.innerHTML =
                "✅ Location detected.<br>" +
                "Latitude: " + latitude.toFixed(6) +
                "<br>" +
                "Longitude: " + longitude.toFixed(6);

            console.log("User Location:", {
                latitude: latitude,
                longitude: longitude
            });

        },

        function (error) {

            console.error(error);

            locationStatus.innerText =
                "❌ Location permission was denied or unavailable.";

        }

    );
}


// ==========================================
// 3. AI CHAT
// ==========================================

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const chatArea =
        document.getElementById("chatArea");

    const message =
        input.value.trim();

    if (message === "") {

        alert("Please describe your situation.");

        return;
    }


    // Show user message

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "user-message";

    userMessage.innerText =
        message;

    chatArea.appendChild(userMessage);


    // Clear input

    input.value = "";


    // Temporary AI response

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "ai-message";

    aiMessage.innerText =
        "🤖 SafeNexa AI is analyzing your situation...";

    chatArea.appendChild(aiMessage);


    chatArea.scrollTop =
        chatArea.scrollHeight;


    /*
       BACKEND CONNECTION
       
       We will connect this section
       to the Flask + AI backend
       in the next steps.
    */

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            });


        const data =
            await response.json();


        if (data.reply) {

            aiMessage.innerText =
                "🤖 SafeNexa AI: " + data.reply;

        } else {

            aiMessage.innerText =
                "⚠️ AI response was not received.";

        }

    }

    catch (error) {

        console.error(error);

        aiMessage.innerText =
            "⚠️ Backend is not connected yet.";

    }


    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// ==========================================
// 4. SAVE EMERGENCY CONTACT
// ==========================================

function saveContact() {

    const name =
        document.getElementById("contactName").value.trim();

    const number =
        document.getElementById("contactNumber").value.trim();

    const contactList =
        document.getElementById("contactList");


    if (name === "" || number === "") {

        alert("Please enter contact name and number.");

        return;
    }


    const contact =
        document.createElement("div");

    contact.className =
        "ai-message";

    contact.innerHTML =
        "👤 <strong>" +
        name +
        "</strong><br>" +
        "📞 " +
        number;


    contactList.appendChild(contact);


    document.getElementById("contactName").value = "";

    document.getElementById("contactNumber").value = "";


    alert("✅ Emergency contact saved.");
}

