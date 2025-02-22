document.getElementById("identifyForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    const responseElement = document.getElementById("response");
    responseElement.textContent = "Processing...";

    try {
        const response = await fetch("/identify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, phoneNumber })
        });

        const data = await response.json();
        responseElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        responseElement.textContent = "Error: " + error.message;
    }
});
