import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';

export default function Data() {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);

	const getData = () => {
		onSnapshot(collection(db, 'answers'), (snapshot) => {
			const snapshotData = snapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			setData(snapshotData);
			setLoading(false);
		});
	};

	const unixToDate = (timestamp) => {
		const date = new Date(timestamp);
		return date.toString().slice(4, -31);
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
		await deleteDoc(doc(db, 'answers', docID));
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			{' '}
			<div className='table'>
				<div className='row'>
					<div className='cell'>
						<h5>UID</h5>
					</div>
					<div className='cell'>
						<h5>Words 1-3</h5>
					</div>
					<div className='cell'>
						<h5>Words 4-6</h5>
					</div>
					<div className='cell'>
						<h5>Manifesto</h5>
					</div>
					<div className='cell'>
						<h5>Time</h5>
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
									<div key={index} className='row'>
										<div className='cell'>
											<h4>{point.id}</h4>
										</div>
										<div className='cell'>
											<h4>
												{point.answers[1].A}, {point.answers[2].A}, {point.answers[3].A}
											</h4>
										</div>
										<div className='cell'>
											<h4>
												{point.keywords
													? `${point.keywords[0]}, ${point.keywords[1]}, ${point.keywords[2]}`
													: '3-4'}
											</h4>
										</div>
										<div className='cell'>
											<h4>{point.manifesto}</h4>
										</div>
										<div className='cell'>
											<h4>{unixToDate(point.createdAt)}</h4>
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
