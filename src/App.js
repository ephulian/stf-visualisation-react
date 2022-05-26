import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-config';
import './App.css';
import Matrix from './Matrix';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Data from './Data';

//

function App() {
	const [manifestos, setManifestos] = useState();
	const [loading, setLoading] = useState(true);

	const getManifestos = () => {
		setLoading(true);
		onSnapshot(collection(db, 'answers'), (snapshot) => {
			const man = snapshot.docs.map((doc) => doc.data().manifesto);
			setManifestos(man);
			setLoading(false);
		});
	};

	useEffect(() => {
		getManifestos();
	}, []);

	return (
		<Router>
			<Routes>
				<Route path='/' element={loading ? 'Loading...' : <Matrix manifestos={manifestos} />} />
				<Route path='/data' element={<Data />} />
				{/* {loading ? 'Loading...' : <Matrix manifestos={manifestos} />} */}
			</Routes>
		</Router>
	);
}

export default App;
