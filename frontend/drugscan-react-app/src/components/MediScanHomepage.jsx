import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Scan, FileImage, CheckCircle2, AlertCircle, List } from 'lucide-react'

function MediScanHomepage() {
	const [file, setFile] = useState(null)
	const [preview, setPreview] = useState(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [processingStep, setProcessingStep] = useState(0)
	const [results, setResults] = useState(null)
	const fileInputRef = useRef(null)
	const dragCounter = useRef(0)

	// Mock results data structure
	const mockResults = {
		detectedType: 'Blister Pack',
		confidence: 98,
		drugName: 'Paracetamol 500mg',
		activeIngredients: ['Paracetamol', '500mg'],
		manufacturer: 'PharmaCorp Industries',
		expiryDate: '2024-12-31', // Change to past date to test red highlight
	}

	const handleFileSelect = (selectedFile) => {
		if (selectedFile && selectedFile.type.startsWith('image/')) {
			setFile(selectedFile)
			setPreview(URL.createObjectURL(selectedFile))
			setResults(null)
		}
	}

	const handleFileInputChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0])
		}
	}

	const handleDragEnter = (e) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current++
	}

	const handleDragLeave = (e) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current--
		if (dragCounter.current === 0) {
			// Visual feedback can be removed here
		}
	}

	const handleDragOver = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current = 0

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0])
		}
	}

	const handleProcess = async () => {
		if (!file) return

		setIsProcessing(true)
		setProcessingStep(0)

		// Simulate processing steps
		const steps = [
			'ResNet-50 analyzing form...',
			'OCR extracting text...',
			'Validating drug information...',
		]

		for (let i = 0; i < steps.length; i++) {
			setProcessingStep(i)
			await new Promise((resolve) => setTimeout(resolve, 1500))
		}

		// Set results
		setResults(mockResults)
		setIsProcessing(false)
		setProcessingStep(0)
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
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	return (
		<div className='min-h-screen bg-[#e6f7f9]'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
				{/* Hero Section */}
				<div className='text-center mb-12'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#0056b3] mb-6'>
						Identify Drugs Instantly with AI
					</h1>

					{/* Quick Link to Drug List */}
					<div className='mb-8'>
						<Link
							to='/drugs'
							className='inline-flex items-center space-x-2 text-[#0056b3] hover:text-[#004494] font-semibold transition-colors'
						>
							<List className='w-5 h-5' />
							<span>Xem danh sách thuốc</span>
						</Link>
					</div>

					{/* Drag & Drop Upload Area */}
					{!file && (
						<div
							className='relative border-2 border-dashed border-[#0056b3] rounded-lg p-12 md:p-16 bg-white hover:bg-gray-50 transition-colors cursor-pointer'
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
						>
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*'
								onChange={handleFileInputChange}
								className='hidden'
							/>
							<div className='flex flex-col items-center justify-center space-y-4'>
								<Upload className='w-16 h-16 text-[#0056b3]' />
								<div>
									<p className='text-xl font-semibold text-gray-700 mb-2'>
										Drag & Drop your drug image here
									</p>
									<p className='text-gray-500'>or click to browse</p>
								</div>
								<p className='text-sm text-gray-400'>Supports JPG, PNG, WEBP formats</p>
							</div>
						</div>
					)}

					{/* File Selected View */}
					{file && !isProcessing && !results && (
						<div className='space-y-6'>
							<div className='bg-white rounded-lg p-6 shadow-md'>
								<div className='flex items-center justify-between mb-4'>
									<div className='flex items-center space-x-3'>
										<FileImage className='w-8 h-8 text-[#0056b3]' />
										<div>
											<p className='font-semibold text-gray-800'>{file.name}</p>
											<p className='text-sm text-gray-500'>
												{(file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<button
										onClick={() => {
											setFile(null)
											setPreview(null)
											setResults(null)
										}}
										className='text-red-500 hover:text-red-700 text-sm font-medium'
									>
										Remove
									</button>
								</div>
								<button
									onClick={handleProcess}
									className='w-full bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
								>
									<Scan className='w-5 h-5' />
									<span>Start Analysis</span>
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Processing State */}
				{isProcessing && (
					<div className='bg-white rounded-lg p-8 md:p-12 shadow-lg mb-8'>
						<div className='flex flex-col items-center justify-center space-y-6'>
							<div className='relative'>
								<div className='w-20 h-20 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin'></div>
								<Scan className='w-10 h-10 text-[#0056b3] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
							</div>
							<div className='text-center'>
								<h3 className='text-2xl font-semibold text-gray-800 mb-4'>Analyzing Drug Image</h3>
								<div className='space-y-3'>
									{[
										'ResNet-50 analyzing form...',
										'OCR extracting text...',
										'Validating drug information...',
									].map((step, index) => (
										<div
											key={index}
											className={`flex items-center space-x-3 ${
												index < processingStep
													? 'text-green-600'
													: index === processingStep
													? 'text-[#0056b3] font-semibold'
													: 'text-gray-400'
											}`}
										>
											{index < processingStep ? (
												<CheckCircle2 className='w-5 h-5' />
											) : index === processingStep ? (
												<div className='w-5 h-5 border-2 border-[#0056b3] border-t-transparent rounded-full animate-spin'></div>
											) : (
												<div className='w-5 h-5 border-2 border-gray-300 rounded-full'></div>
											)}
											<span>{step}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Results Section */}
				{results && (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Left Column - Image */}
						<div className='space-y-4'>
							{preview && (
								<div className='bg-white rounded-lg p-4 shadow-md'>
									<img
										src={preview}
										alt='Uploaded drug'
										className='w-full h-auto rounded-lg object-contain max-h-[500px]'
									/>
									<div className='mt-4 p-4 bg-[#e6f7f9] rounded-lg'>
										<p className='text-sm font-medium text-gray-600 mb-1'>Detected Type:</p>
										<p className='text-lg font-bold text-[#0056b3]'>
											{results.detectedType} ({results.confidence}% Conf)
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Right Column - Drug Information Card */}
						<div className='space-y-4'>
							<div className='bg-white rounded-lg p-6 md:p-8 shadow-md'>
								<h2 className='text-2xl font-bold text-gray-800 mb-6'>Drug Information</h2>

								{/* Drug Name */}
								<div className='mb-6'>
									<p className='text-sm font-medium text-gray-600 mb-2'>Drug Name</p>
									<p className='text-3xl font-bold text-[#0056b3]'>{results.drugName}</p>
								</div>

								{/* Active Ingredients */}
								<div className='mb-6'>
									<p className='text-sm font-medium text-gray-600 mb-3'>Active Ingredients</p>
									<div className='flex flex-wrap gap-2'>
										{results.activeIngredients.map((ingredient, index) => (
											<span
												key={index}
												className='px-4 py-2 bg-[#0056b3] text-white rounded-full text-sm font-medium'
											>
												{ingredient}
											</span>
										))}
									</div>
								</div>

								{/* Manufacturer */}
								<div className='mb-6'>
									<p className='text-sm font-medium text-gray-600 mb-2'>Manufacturer</p>
									<p className='text-lg font-semibold text-gray-800'>{results.manufacturer}</p>
								</div>

								{/* Expiry Date */}
								<div className='mb-6'>
									<p className='text-sm font-medium text-gray-600 mb-2'>Expiry Date</p>
									<div className='flex items-center space-x-2'>
										<p
											className={`text-lg font-semibold ${
												isExpired(results.expiryDate) ? 'text-red-600' : 'text-gray-800'
											}`}
										>
											{formatDate(results.expiryDate)}
										</p>
										{isExpired(results.expiryDate) && (
											<AlertCircle className='w-5 h-5 text-red-600' />
										)}
									</div>
									{isExpired(results.expiryDate) && (
										<p className='text-sm text-red-600 font-medium mt-1'>
											⚠️ This product has expired
										</p>
									)}
								</div>

								{/* Disclaimer */}
								<div className='pt-6 border-t border-gray-200'>
									<p className='text-sm text-gray-600 italic flex items-start space-x-2'>
										<AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
										<span>
											<strong className='text-orange-600'>Disclaimer:</strong> Consult a doctor
											before use. This information is for identification purposes only and should
											not replace professional medical advice.
										</span>
									</p>
								</div>

								{/* Reset Button */}
								<button
									onClick={() => {
										setFile(null)
										setPreview(null)
										setResults(null)
										setIsProcessing(false)
										if (fileInputRef.current) {
											fileInputRef.current.value = ''
										}
									}}
									className='mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors'
								>
									Analyze Another Drug
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default MediScanHomepage
