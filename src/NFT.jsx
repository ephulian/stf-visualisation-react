import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';

export default function Data() {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);

	const getData = () => {
		onSnapshot(collection(db, 'nft'), (snapshot) => {
			const snapshotData = snapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			setData(snapshotData);
			setLoading(false);
		});
	};

	const compare = (a, b) => {
		if (a.createdAt < b.createdAt) {
			return -1;
		}
		if (a.createdAt > b.createdAt) {
			return 1;
		}
		return 0;
	};

	const deleteData = async (docID) => {
		await deleteDoc(doc(db, 'nft', docID));
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			{' '}
			<div className='nft-table'>
				<div className='nft-row'>
					<div className='cell'>
						<h5>ID</h5>
					</div>
					<div className='cell'>
						<h5>Manifesto</h5>
					</div>
					<div className='cell'>
						<h5>Delete</h5>
					</div>
				</div>
				{loading
					? 'Loading...'
					: data
							.sort(compare)
							.reverse()
							.map((point, index) => {
								return (
									<div key={index} className='nft-row'>
										<div className='cell'>
											<h4>{point.id}</h4>
										</div>
										<div className='cell'>
											<h4>{point.manifesto}</h4>
										</div>
										<div className='cell'>
											<h4 onClick={(e) => deleteData(point.id)}>X</h4>
										</div>
									</div>
								);
							})}
			</div>
		</>
	);
}
