

const express = require('express');
const multer = require('multer');
const path = require('path');
const io = require('socket.io')(require('http').createServer()); // Ensure you import and initialize Socket.io correctly

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ensure the 'uploads' directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.post('/', ensureAuthenticated, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileInfo = {
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
  };

  // Emit file information to all connected clients
  io.emit('receive_file', {
    sender: req.user.username, // Assuming req.user.username contains the sender's username
    ...fileInfo,
  });

  res.status(200).send(fileInfo);
});

module.exports = router;
