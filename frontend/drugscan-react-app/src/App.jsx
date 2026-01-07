import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MediScanHomepage from './components/MediScanHomepage'
import DrugListPage from './pages/DrugListPage'
import DrugDetailPage from './pages/DrugDetailPage'
import Navigation from './components/Navigation'

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-[#e6f7f9]">
				<Navigation />
				<Routes>
					<Route path="/" element={<MediScanHomepage />} />
					<Route path="/drugs" element={<DrugListPage />} />
					<Route path="/drugs/:id" element={<DrugDetailPage />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
