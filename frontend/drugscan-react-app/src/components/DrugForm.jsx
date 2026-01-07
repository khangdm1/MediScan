import { useState } from 'react'
import { createDrug } from '../services/drugService'

export default function DrugForm({ onAdded }) {
	const [name, setName] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!name.trim()) return
		try {
			await createDrug(name)
			setName('')
			onAdded?.()
		} catch (err) {
			console.error('Failed to add drug:', err)
		}
	}

	return (
		<div style={boxStyle}>
			<h3>➕ Thêm thuốc</h3>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Tên thuốc...'
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={inputStyle}
				/>
				<button type='submit' style={btnStyle}>
					Thêm
				</button>
			</form>
		</div>
	)
}

const boxStyle = {
	border: '1px solid #ccc',
	padding: '1rem',
	borderRadius: '8px',
}

const inputStyle = {
	padding: '6px',
	width: '100%',
	marginBottom: '8px',
}

const btnStyle = {
	padding: '6px 12px',
	cursor: 'pointer',
}
