import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Pill, Package, Building2, Calendar, ArrowRight } from 'lucide-react'
import { getDrugs } from '../services/drugService'
import SearchBar from '../components/SearchBar'

function DrugListPage() {
	const [drugs, setDrugs] = useState([])
	const [loading, setLoading] = useState(false)
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const searchQuery = searchParams.get('search') || ''

	useEffect(() => {
		fetchDrugs(searchQuery)
	}, [searchQuery])

	const fetchDrugs = async (name = '') => {
		setLoading(true)
		try {
			const data = await getDrugs(name)
			setDrugs(data)
		} catch (err) {
			console.error('Failed to load drugs:', err)
			setDrugs([])
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = (searchTerm) => {
		if (searchTerm) {
			navigate(`/drugs?search=${encodeURIComponent(searchTerm)}`)
		} else {
			navigate('/drugs')
		}
	}

	const handleDrugClick = (drugId) => {
		navigate(`/drugs/${drugId}`)
	}

	return (
		<div className="min-h-screen bg-[#e6f7f9]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl md:text-5xl font-bold text-[#0056b3] mb-4">
						📋 Danh sách thuốc
					</h1>
					<p className="text-gray-600 text-lg">
						Tìm kiếm và xem thông tin chi tiết về các loại thuốc
					</p>
				</div>

				{/* Search Bar */}
				<div className='mb-8'>
					<SearchBar
						placeholder='Tìm kiếm theo tên thuốc, hoạt chất, nhà sản xuất...'
						onSearch={handleSearch}
						initialValue={searchQuery}
					/>
					{searchQuery && (
						<div className='mt-3 text-center'>
							<p className='text-sm text-gray-600'>
								Kết quả tìm kiếm cho: <span className='font-semibold text-[#0056b3]'>{searchQuery}</span>
							</p>
							<p className='text-xs text-gray-500 mt-1'>
								Tìm thấy {drugs.length} {drugs.length === 1 ? 'thuốc' : 'thuốc'}
							</p>
						</div>
					)}
				</div>

				{/* Loading State */}
				{loading && (
					<div className="text-center py-12">
						<div className="inline-block w-12 h-12 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
						<p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
					</div>
				)}

				{/* Drug List */}
				{!loading && (
					<>
						{drugs.length === 0 ? (
							<div className="bg-white rounded-lg p-12 text-center shadow-md">
								<Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-700 mb-2">
									Không tìm thấy thuốc
								</h3>
								<p className="text-gray-500">
									{searchQuery
										? 'Thử tìm kiếm với từ khóa khác'
										: 'Chưa có dữ liệu thuốc trong hệ thống'}
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{drugs.map((drug) => (
									<div
										key={drug.id}
										onClick={() => handleDrugClick(drug.id)}
										className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#0056b3] group"
									>
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h3 className="text-xl font-bold text-[#0056b3] mb-2 group-hover:text-[#004494] transition-colors">
													{drug.name || 'Tên thuốc không xác định'}
												</h3>
											</div>
											<ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0056b3] transition-colors flex-shrink-0 ml-2" />
										</div>

										<div className="space-y-3">
											{drug.active_ingredient && (
												<div className="flex items-start space-x-2">
													<Pill className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-600">Hoạt chất</p>
														<p className="text-gray-800">{drug.active_ingredient}</p>
													</div>
												</div>
											)}

											{drug.manufacturer && (
												<div className="flex items-start space-x-2">
													<Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-600">Nhà sản xuất</p>
														<p className="text-gray-800">{drug.manufacturer}</p>
													</div>
												</div>
											)}

											{drug.expiry_date && (
												<div className="flex items-start space-x-2">
													<Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-600">Hạn sử dụng</p>
														<p className="text-gray-800">
															{new Date(drug.expiry_date).toLocaleDateString('vi-VN')}
														</p>
													</div>
												</div>
											)}

											{drug.description && (
												<div className="pt-2 border-t border-gray-200">
													<p className="text-sm text-gray-600 line-clamp-2">
														{drug.description}
													</p>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default DrugListPage

