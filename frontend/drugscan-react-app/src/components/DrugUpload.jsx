import { useState } from 'react'
import { uploadDrugImage } from '../services/drugService'

function DrugUpload() {
	const [file, setFile] = useState(null)
	const [preview, setPreview] = useState(null)
	const [uploading, setUploading] = useState(false)
	const [response, setResponse] = useState(null)

	function handleFileChange(e) {
		const selected = e.target.files[0]
		setFile(selected)
		setPreview(URL.createObjectURL(selected))
	}

	async function handleUpload() {
		if (!file) return alert('Please select a file')
		setUploading(true)
		try {
			const result = await uploadDrugImage(file)
			setResponse(result)
			alert('Upload success!')
		} catch (err) {
			alert('Upload failed')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div style={{ marginBottom: '1rem' }}>
			<h3>Upload Drug Image</h3>
			<input type='file' onChange={handleFileChange} accept='image/*' />
			{preview && (
				<div style={{ marginTop: '0.5rem' }}>
					<img
						src={preview}
						alt='preview'
						width='150'
						style={{ border: '1px solid #ccc', borderRadius: '4px' }}
					/>
				</div>
			)}
			<button onClick={handleUpload} disabled={uploading} style={{ marginTop: '0.5rem' }}>
				{uploading ? 'Uploading...' : 'Upload'}
			</button>

			{response && (
				<div style={{ marginTop: '0.5rem' }}>
					<p>✅ Log ID: {response.log_id}</p>
					<p>📁 Path: {response.path}</p>
				</div>
			)}
		</div>
	)
}

export default DrugUpload
