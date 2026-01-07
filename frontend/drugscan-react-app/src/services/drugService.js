import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:8000',
})

// 📦 GET /drugs
export async function getDrugs(name = '') {
	try {
		console.log('📡 Fetching from:', `${api.defaults.baseURL}/drugs?name=${name}`)
		const res = await api.get('/drugs/', { params: { name } })
		console.log('✅ Response:', res.data)
		return res.data
	} catch (err) {
		console.error('❌ Error fetching drugs:', err.message)
		if (err.response) console.error('Response data:', err.response.data)
		return []
	}
}

// ➕ POST /drugs
export async function createDrug(name) {
	try {
		const res = await api.post('/drugs/', null, { params: { name } })
		return res.data
	} catch (err) {
		console.error('Error creating drug:', err)
		throw err
	}
}

// 🔍 GET /drugs/:id
export async function getDrugById(id) {
	try {
		const res = await api.get(`/drugs/${id}/`)
		return res.data
	} catch (err) {
		console.error('Error fetching drug:', err)
		throw err
	}
}

// 🖼️ POST /drugs/upload
export async function uploadDrugImage(file) {
	const formData = new FormData()
	formData.append('file', file)

	try {
		const res = await api.post('/drugs/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return res.data
	} catch (err) {
		console.error('Error uploading image:', err)
		throw err
	}
}
