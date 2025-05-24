const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the URL of the uploaded file
    // Assuming your server serves static files from an 'uploads' directory
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

module.exports = { uploadFile }; 