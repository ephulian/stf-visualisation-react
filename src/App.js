import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-config';
import './App.css';
import Matrix from './Matrix';

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
		<>
			{/* <h1>{loading}</h1> */}
			{loading ? 'Loading...' : <Matrix manifestos={manifestos} />}
			{/* {manifestos} */}
			{/* <button onClick={console.log(manifestos)}>click</button> */}
		</>
	);
}

export default App;
