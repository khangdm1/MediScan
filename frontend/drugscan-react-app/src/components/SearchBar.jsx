import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ placeholder = 'Tìm kiếm thuốc...', onSearch, initialValue = '' }) {
	const [searchTerm, setSearchTerm] = useState(initialValue)
	const navigate = useNavigate()
	const debounceTimer = useRef(null)

	// Sync with initialValue (from URL params)
	useEffect(() => {
		setSearchTerm(initialValue)
	}, [initialValue])

	// Real-time search with debounce (only if onSearch is provided)
	useEffect(() => {
		if (!onSearch) return

		// Clear previous timer
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		// Set new timer for debounced search
		debounceTimer.current = setTimeout(() => {
			onSearch(searchTerm.trim())
		}, 500) // 500ms debounce

		// Cleanup
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
			}
		}
	}, [searchTerm, onSearch])

	const handleSubmit = (e) => {
		e.preventDefault()
		// Clear debounce and search immediately
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}
		if (onSearch) {
			onSearch(searchTerm.trim())
		} else {
			if (searchTerm.trim()) {
				navigate(`/drugs?search=${encodeURIComponent(searchTerm.trim())}`)
			} else {
				navigate('/drugs')
			}
		}
	}

	const handleClear = () => {
		setSearchTerm('')
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}
		if (onSearch) {
			onSearch('')
		} else {
			navigate('/drugs')
		}
	}

	return (
		<form onSubmit={handleSubmit} className='relative w-full max-w-2xl mx-auto'>
			<div className='relative flex items-center'>
				<Search className='absolute left-4 w-5 h-5 text-gray-400' />
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder={placeholder}
					className='w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0056b3] focus:outline-none text-gray-800 placeholder-gray-400 transition-colors'
				/>
				{searchTerm && (
					<button
						type='button'
						onClick={handleClear}
						className='absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors'
					>
						<X className='w-5 h-5' />
					</button>
				)}
			</div>
			<button
				type='submit'
				className='mt-3 w-full bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
			>
				<Search className='w-5 h-5' />
				<span>Tìm kiếm</span>
			</button>
		</form>
	)
}

export default SearchBar

