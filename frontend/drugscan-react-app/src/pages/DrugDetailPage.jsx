import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	ArrowLeft,
	Pill,
	Building2,
	Calendar,
	AlertCircle,
	Package,
	FileText,
	CheckCircle2,
} from 'lucide-react'
import { getDrugById } from '../services/drugService'

function DrugDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [drug, setDrug] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchDrugDetails()
	}, [id])

	const fetchDrugDetails = async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await getDrugById(id)
			setDrug(data)
		} catch (err) {
			console.error('Failed to load drug details:', err)
			setError('Không thể tải thông tin thuốc. Vui lòng thử lại sau.')
		} finally {
			setLoading(false)
		}
	}

	const isExpired = (dateString) => {
		if (!dateString) return false
		const expiryDate = new Date(dateString)
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		return expiryDate < today
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		const date = new Date(dateString)
		return date.toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-[#e6f7f9] flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block w-16 h-16 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
					<p className="mt-4 text-gray-600 text-lg">Đang tải thông tin thuốc...</p>
				</div>
			</div>
		)
	}

	if (error || !drug) {
		return (
			<div className="min-h-screen bg-[#e6f7f9] flex items-center justify-center px-4">
				<div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-md">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
					<p className="text-gray-600 mb-6">{error || 'Không tìm thấy thông tin thuốc'}</p>
					<button
						onClick={() => navigate('/drugs')}
						className="bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
					>
						Quay lại danh sách
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#e6f7f9]">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Back Button */}
				<Link
					to="/drugs"
					className="inline-flex items-center space-x-2 text-[#0056b3] hover:text-[#004494] mb-6 transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-medium">Quay lại danh sách</span>
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Drug Name Card */}
						<div className="bg-white rounded-lg p-6 md:p-8 shadow-md">
							<h1 className="text-3xl md:text-4xl font-bold text-[#0056b3] mb-6">
								{drug.name || 'Tên thuốc không xác định'}
							</h1>

							{/* Drug Image if available */}
							{drug.image_path && (
								<div className="mb-6">
									<img
										src={drug.image_path}
										alt={drug.name}
										className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
									/>
								</div>
							)}

							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								{drug.active_ingredient && (
									<div className="flex items-start space-x-3">
										<Pill className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-1" />
										<div>
											<p className="text-sm font-medium text-gray-600 mb-1">Hoạt chất</p>
											<p className="text-lg font-semibold text-gray-800">
												{drug.active_ingredient}
											</p>
										</div>
									</div>
								)}

								{drug.manufacturer && (
									<div className="flex items-start space-x-3">
										<Building2 className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-1" />
										<div>
											<p className="text-sm font-medium text-gray-600 mb-1">Nhà sản xuất</p>
											<p className="text-lg font-semibold text-gray-800">
												{drug.manufacturer}
											</p>
										</div>
									</div>
								)}

								{drug.expiry_date && (
									<div className="flex items-start space-x-3">
										<Calendar className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-1" />
										<div>
											<p className="text-sm font-medium text-gray-600 mb-1">Hạn sử dụng</p>
											<div className="flex items-center space-x-2">
												<p
													className={`text-lg font-semibold ${
														isExpired(drug.expiry_date) ? 'text-red-600' : 'text-gray-800'
													}`}
												>
													{formatDate(drug.expiry_date)}
												</p>
												{isExpired(drug.expiry_date) && (
													<AlertCircle className="w-5 h-5 text-red-600" />
												)}
											</div>
											{isExpired(drug.expiry_date) && (
												<p className="text-sm text-red-600 font-medium mt-1">
													⚠️ Thuốc đã hết hạn sử dụng
												</p>
											)}
										</div>
									</div>
								)}

								{drug.detected_type && (
									<div className="flex items-start space-x-3">
										<Package className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-1" />
										<div>
											<p className="text-sm font-medium text-gray-600 mb-1">Loại đóng gói</p>
											<p className="text-lg font-semibold text-gray-800">
												{drug.detected_type}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Description */}
							{drug.description && (
								<div className="pt-6 border-t border-gray-200">
									<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
										<FileText className="w-5 h-5 text-[#0056b3]" />
										<span>Mô tả</span>
									</h3>
									<p className="text-gray-700 leading-relaxed">{drug.description}</p>
								</div>
							)}

							{/* Công dụng thuốc (Drug Usage/Indications) */}
							<div className="pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
									<CheckCircle2 className="w-5 h-5 text-[#0056b3]" />
									<span>Công dụng thuốc</span>
								</h3>
								{drug.usage || drug.indications ? (
									<div className="bg-[#e6f7f9] rounded-lg p-5">
										<p className="text-gray-800 leading-relaxed whitespace-pre-line">
											{drug.usage || drug.indications}
										</p>
									</div>
								) : drug.description ? (
									<div className="bg-[#e6f7f9] rounded-lg p-5">
										<p className="text-gray-800 leading-relaxed">
											Thông tin công dụng chi tiết đang được cập nhật. Vui lòng tham khảo hướng
											dẫn sử dụng từ nhà sản xuất hoặc tư vấn bác sĩ.
										</p>
									</div>
								) : (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
										<p className="text-yellow-800">
											⚠️ Chưa có thông tin công dụng. Vui lòng tham khảo hướng dẫn sử dụng từ
											nhà sản xuất hoặc tư vấn bác sĩ trước khi sử dụng.
										</p>
									</div>
								)}
							</div>

							{/* Disclaimer */}
							<div className="pt-6 border-t border-gray-200">
								<div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
									<p className="text-sm text-orange-800 flex items-start space-x-2">
										<AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
										<span>
											<strong className="font-semibold">Lưu ý quan trọng:</strong> Thông tin
											này chỉ mang tính chất tham khảo. Vui lòng{' '}
											<strong>tham khảo ý kiến bác sĩ hoặc dược sĩ</strong> trước khi sử dụng
											thuốc. Không tự ý sử dụng thuốc mà không có chỉ định của chuyên gia y
											tế.
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Info Card */}
						<div className="bg-white rounded-lg p-6 shadow-md">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin nhanh</h3>
							<div className="space-y-4">
								{drug.id && (
									<div>
										<p className="text-sm font-medium text-gray-600">Mã thuốc</p>
										<p className="text-gray-800 font-semibold">#{drug.id}</p>
									</div>
								)}
								{drug.created_at && (
									<div>
										<p className="text-sm font-medium text-gray-600">Ngày thêm vào hệ thống</p>
										<p className="text-gray-800">
											{new Date(drug.created_at).toLocaleDateString('vi-VN')}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="bg-white rounded-lg p-6 shadow-md">
							<Link
								to="/drugs"
								className="block w-full text-center bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
							>
								Xem danh sách thuốc khác
							</Link>
							<Link
								to="/"
								className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
							>
								Quét thuốc mới
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DrugDetailPage

