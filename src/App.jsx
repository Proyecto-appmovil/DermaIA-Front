import { useState } from 'react'
import { 
  Container, 
  Box, 
  Button, 
  Typography, 
  CircularProgress,
  Paper,
  Alert
} from '@mui/material'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [fileUrl, setFileUrl] = useState('')

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadStatus(null)
      setFileUrl('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Por favor selecciona un archivo' })
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setUploadStatus(null)

    try {
      const response = await axios.post('https://derma-ia-backend.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadStatus({ type: 'success', message: 'Archivo subido correctamente' })
      setFileUrl(response.data.fileUrl)
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Error al subir el archivo' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Subir Archivo a S3
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                fullWidth
                disabled={uploading}
              >
                Seleccionar Archivo
              </Button>
            </label>
          </Box>

          {file && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              Archivo seleccionado: {file.name}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
            fullWidth
            sx={{ mb: 2 }}
          >
            {uploading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Subiendo...
              </>
            ) : (
              'Subir Archivo'
            )}
          </Button>

          {uploadStatus && (
            <Alert severity={uploadStatus.type} sx={{ mb: 2 }}>
              {uploadStatus.message}
            </Alert>
          )}

          {fileUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                URL del archivo:
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  wordBreak: 'break-all',
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {fileUrl}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default App
