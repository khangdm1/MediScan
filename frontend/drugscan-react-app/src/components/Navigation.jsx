import { Link, useLocation } from 'react-router-dom'
import { Scan, List, Home } from 'lucide-react'

function Navigation() {
	const location = useLocation()

	const isActive = (path) => {
		return location.pathname === path
	}

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo/Brand */}
					<Link to="/" className="flex items-center space-x-2">
						<div className="bg-[#0056b3] rounded-lg p-2">
							<Scan className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold text-[#0056b3]">MediScan AI</span>
					</Link>

					{/* Navigation Links */}
					<div className="flex items-center space-x-1">
						<Link
							to="/"
							className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
								isActive('/')
									? 'bg-[#0056b3] text-white'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<Home className="w-5 h-5" />
							<span className="font-medium">Trang chủ</span>
						</Link>
						<Link
							to="/drugs"
							className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
								isActive('/drugs') || location.pathname.startsWith('/drugs/')
									? 'bg-[#0056b3] text-white'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<List className="w-5 h-5" />
							<span className="font-medium">Danh sách thuốc</span>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navigation

