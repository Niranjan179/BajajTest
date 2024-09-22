const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.use(cors());

// Function to validate the Base64 string and get MIME type
function validateBase64File(fileB64) {
    if (!fileB64 || typeof fileB64 !== 'string') {
        return { valid: false, mimeType: null, sizeKb: null };
    }

    // Validate and extract mime type
    let mimeType = fileB64.match(/^data:(.*);base64,/);
    if (!mimeType || !mimeType[1]) {
        return { valid: false, mimeType: null, sizeKb: null };
    }

    // Remove base64 headers to get pure base64 string for size calculation
    const base64Data = fileB64.replace(/^data:(.*);base64,/, '');

    // Get file size in KB
    const fileSizeKb = Buffer.from(base64Data, 'base64').length / 1024;

    return {
        valid: true,
        mimeType: mimeType[1],
        sizeKb: fileSizeKb.toFixed(2),
    };
}

app.post("/bfhl", (req, res) => {
    const data = req.body.data;
    const file_b64 = req.body.file_b64;

    var highest = [];
    const alphabets = [];
    const numbers = [];
    let is_success = true;

    // Separate alphabets and numbers, find highest alphabet
    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else {
            alphabets.push(item);
            if (highest.length === 0 || item.localeCompare(highest[0]) > 0) {
                highest = [item];
            }
        }
    });

    // Validate Base64 file
    const fileValidation = validateBase64File(file_b64);

    // If file is invalid, mark is_success as false
    if (!fileValidation.valid) {
        res.json({
            is_success: false,
            user_id: "john_doe_17091999",
            email: "john@xyz.com",
            roll_number: "AP21110011475",
            alphabets: alphabets,
            numbers: numbers,
            highest_alphabet: highest,
            file_valid: fileValidation.valid,
        });
    }

    // Send the response
    res.json({
        is_success: is_success,
        user_id: "john_doe_17091999",
        email: "john@xyz.com",
        roll_number: "AP21110011475",
        alphabets: alphabets,
        numbers: numbers,
        highest_alphabet: highest,
        file_valid: fileValidation.valid,
        file_mime_type: fileValidation.mimeType,
        file_size_kb: fileValidation.sizeKb,
    });
    
});

app.get("/bfhl", (req, res) => {
    res.json({ "operation_code": 1 });
});

app.listen(PORT, () => {
    console.log(`listening on http://127.0.0.1:${PORT}`);
});