import { useEffect, useState } from 'react'
import { getDrugs } from '../services/drugService'

export default function DrugList({ refreshFlag }) {
	const [drugs, setDrugs] = useState([])
	const [search, setSearch] = useState('')

	useEffect(() => {
		fetchDrugs()
	}, [refreshFlag])

	const fetchDrugs = async (name = '') => {
		try {
			const data = await getDrugs(name)
			setDrugs(data)
		} catch (err) {
			console.error('Failed to load drugs:', err)
		}
	}

	const handleSearch = (e) => {
		e.preventDefault()
		fetchDrugs(search)
	}

	return (
		<div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
			<h2 style={{ marginBottom: '1rem' }}>📋 Danh sách thuốc</h2>

			<form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
				<input
					type='text'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Tìm tên thuốc...'
					style={{ padding: '6px', width: '200px' }}
				/>
				<button type='submit' style={{ marginLeft: '8px', padding: '6px 12px', cursor: 'pointer' }}>
					Tìm kiếm
				</button>
			</form>

			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ background: '#f2f2f2' }}>
						<th style={thStyle}>ID</th>
						<th style={thStyle}>Tên thuốc</th>
						<th style={thStyle}>Hoạt chất</th>
						<th style={thStyle}>Nhà sản xuất</th>
						<th style={thStyle}>Mô tả</th>
					</tr>
				</thead>
				<tbody>
					{drugs.length === 0 ? (
						<tr>
							<td colSpan='5' style={{ textAlign: 'center', padding: '1rem' }}>
								Không có dữ liệu
							</td>
						</tr>
					) : (
						drugs.map((drug) => (
							<tr key={drug.id}>
								<td style={tdStyle}>{drug.id}</td>
								<td style={tdStyle}>{drug.name}</td>
								<td style={tdStyle}>{drug.active_ingredient || '-'}</td>
								<td style={tdStyle}>{drug.manufacturer || '-'}</td>
								<td style={tdStyle}>{drug.description || '-'}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	)
}

const thStyle = {
	textAlign: 'left',
	padding: '8px',
	borderBottom: '1px solid #ddd',
}

const tdStyle = {
	padding: '8px',
	borderBottom: '1px solid #eee',
}
