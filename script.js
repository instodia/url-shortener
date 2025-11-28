function updateColor() {
  const input = document.getElementById("customAlias");
  input.style.color = input.value ? "#000" : "#999";
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

async function shortenUrl() {
  let longUrl = document.getElementById("longUrl").value.trim();
  const alias = document.getElementById("customAlias").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
    longUrl = "https://" + longUrl;
  }

  if (!isValidUrl(longUrl)) {
    resultDiv.innerHTML =
      '<div class="error">Please enter a valid URL.<br>Example: <b>https://example.com</b></div>';
    return;
  }

  let apiUrl = `https://da.gd/s?url=${encodeURIComponent(longUrl)}`;
  if (alias) {
    apiUrl += `&shorturl=${encodeURIComponent(alias)}`;
  }

  try {
    const response = await fetch(apiUrl);
    const shortUrl = await response.text();

    if (
      shortUrl.toLowerCase().includes("error") ||
      shortUrl.toLowerCase().includes("already taken") ||
      shortUrl.toLowerCase().includes("not a valid")
    ) {
      resultDiv.innerHTML = `<div class="error">❌ ${shortUrl}</div>`;
    } else {
      resultDiv.innerHTML = `
        <div class="short-url" id="shortUrl">${shortUrl}</div>
        <button class="copy-btn" onclick="copyToClipboard()">Copy URL</button>
      `;
    }
  } catch (err) {
    resultDiv.innerHTML = `<div class="error">❌ ${err.message}</div>`;
  }
}

function copyToClipboard() {
  const shortUrlElement = document.getElementById("shortUrl");
  const copyBtn = document.querySelector(".copy-btn");

  if (shortUrlElement) {
    const text = shortUrlElement.textContent.trim();
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    const success = document.execCommand("copy");
    document.body.removeChild(tempInput);

    if (success) {
      copyBtn.textContent = "URL Copied!";
      copyBtn.disabled = true;
      setTimeout(() => {
        copyBtn.textContent = "Copy URL";
        copyBtn.disabled = false;
      }, 2000);
    } else {
      alert("❌ Failed to copy URL.");
    }
  } else {
    alert("❌ No short URL to copy.");
  }
}

// Disable right-click
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Disable DevTools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});
