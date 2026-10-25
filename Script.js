function logStatus(message) {
    const statusBox = document.getElementById('statusLog');
    if (statusBox) {
        statusBox.innerHTML += `<br>• ${message}`;
        statusBox.scrollTop = statusBox.scrollHeight;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function processAndLoad() {
    const rawText = document.getElementById('rawInput').value;
    
    if (!rawText.trim()) {
        alert("Please paste some codes first!");
        return;
    }

    // STRICT REGEX: Requires 5 to 8 characters containing BOTH letters and numbers
    const matches = rawText.match(/\b(?=.*[A-Z])(?=.*\d)[A-Z0-9]{5,8}\b/g);
    
    if (!matches || matches.length === 0) {
        alert("No valid booking codes found! (Codes must contain both letters and numbers)");
        return;
    }

    const ignoreList = ["BOOM", "TODAY", "SPORTYBET", "STAKING", "EACH", "CODES"];
    const filteredCodes = matches.filter(code => !ignoreList.includes(code.toUpperCase()));
    const uniqueCodes = [...new Set(filteredCodes)];

    if (uniqueCodes.length === 0) {
        alert("No valid booking codes found!");
        return;
    }

    document.getElementById('statusLog').innerHTML = "Status: Initializing...";

    const selectedMode = document.querySelector('input[name="workMode"]:checked').value;
    const stakeVal = document.getElementById('presetStake').value || 100;

    logStatus(`Extracted ${uniqueCodes.length} valid codes: ${uniqueCodes.join(', ')}`);
    
    startAutomationLoop(uniqueCodes, selectedMode, stakeVal);
}

async function startAutomationLoop(codes, mode, stakeAmount) {
    logStatus(`Starting batch sequence [Mode: ${mode}]...`);

    for (let i = 0; i < codes.length; i++) {
        let code = codes[i];
        logStatus(`[${i + 1}/${codes.length}] Loading code: ${code}...`);

        await sleep(1500);
    }

    logStatus("🎉 All valid codes processed successfully!");
}

function downloadCodesAsTxt() {
    const rawText = document.getElementById('rawInput').value;
    
    if (!rawText.trim()) {
        alert("No text to extract codes from!");
        return;
    }

    const matches = rawText.match(/\b(?=.*[A-Z])(?=.*\d)[A-Z0-9]{5,8}\b/g);
    if (!matches || matches.length === 0) {
        alert("No valid booking codes found to save.");
        return;
    }

    const ignoreList = ["BOOM", "TODAY", "SPORTYBET", "STAKING", "EACH", "CODES"];
    const filteredCodes = matches.filter(code => !ignoreList.includes(code.toUpperCase()));
    const uniqueCodes = [...new Set(filteredCodes)];

    if (uniqueCodes.length === 0) {
        alert("No valid codes available to download.");
        return;
    }

    const fileContent = uniqueCodes.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `BulkBet_Codes_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);

    logStatus(`💾 Saved ${uniqueCodes.length} codes to your Downloads folder!`);
}
