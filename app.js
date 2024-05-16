const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Middleware to parse JSON
app.use(express.json());

// Ensure the files directory exists
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

console.log('Files Directory:', FILES_DIR);  // Log directory path

// Endpoint to create a test file
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString();
    const filename = `${timestamp}.txt`;
    const filePath = path.join(FILES_DIR, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).send('Error creating file');
        }
        res.status(201).send(`File created: ${filename}`);
    });
});

// Endpoint to retrieve all text files
app.get('/files', (req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json(textFiles);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
