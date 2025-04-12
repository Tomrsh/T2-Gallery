// DOM elements
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('upload-progress');
const progressText = document.getElementById('progress-text');
const statusMessage = document.getElementById('status-message');

// Handle form submission
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const files = fileInput.files;
  if (files.length === 0) {
    showStatus('Please select at least one file', 'error');
    return;
  }
  
  try {
    progressContainer.style.display = 'block';
    statusMessage.textContent = '';
    
    // Upload each file sequentially
    for (let i = 0; i < files.length; i++) {
      await uploadFileWithProgress(files[i]);
    }
    
    showStatus('All files uploaded successfully!', 'success');
  } catch (error) {
    console.error('Upload error:', error);
    showStatus('Error uploading files: ' + error.message, 'error');
  } finally {
    progressContainer.style.display = 'none';
    fileInput.value = ''; // Clear file input
  }
});

// Upload file with progress tracking
function uploadFileWithProgress(file) {
  return new Promise((resolve, reject) => {
    const fileType = getFileType(file.type);
    const timestamp = Date.now();
    
    // Determine storage path
    const folder = fileType === 'image' ? 'images' : 
                  fileType === 'video' ? 'videos' : 'documents';
    const storagePath = `gallery/${folder}/${timestamp}_${file.name}`;
    
    const storageRef = storage.ref(storagePath);
    
    const metadata = {
      customMetadata: {
        originalName: file.name,
        type: fileType,
        timestamp: timestamp.toString()
      }
    };
    
    // Upload file
    const uploadTask = storageRef.put(file, metadata);
    
    // Progress tracking
    uploadTask.on('state_changed',
      (snapshot) => {
        // Update progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}%`;
      },
      (error) => {
        // Handle errors
        reject(error);
      },
      async () => {
        // Upload complete
        try {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          
          // Save to database
          await database.ref('galleryItems').push({
            name: file.name,
            url: downloadURL,
            type: fileType,
            timestamp: timestamp,
            storagePath: storagePath
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// Determine file type from MIME type
function getFileType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
}