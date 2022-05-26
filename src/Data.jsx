import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';

export default function Data() {
	const [data, setData] = useState();
	// const [manifestos, setManifestos] = useState();
	const [loading, setLoading] = useState(true);

	const getData = () => {
		// setLoading(false)
		onSnapshot(collection(db, 'answers'), (snapshot) => {
			const snapshotData = snapshot.docs.map((doc) => doc.data());
			setData(snapshotData);
			setLoading(false);
		});
	};

	const unixToDate = (timestamp) => {
		const a = new Date(timestamp * 1000);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		const year = a.getFullYear();
		const month = months[a.getMonth()];
		const date = a.getDate();
		const hour = a.getHours();
		const min = a.getMinutes();
		const sec = a.getSeconds();
		const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
		return time;
	};

	useEffect(() => {
		getData();
		console.log(data);
	}, []);

	return (
		<>
			{' '}
			<div className='table'>
				<div className='row'>
					<div className='cell'>
						<h4>UID</h4>
					</div>
					<div className='cell'>
						<h4>Words 1-3</h4>
					</div>
					<div className='cell'>
						<h4>Words 4-6</h4>
					</div>
					<div className='cell'>
						<h4>Manifesto</h4>
					</div>
					<div className='cell'>
						<h4>Time</h4>
					</div>
					<div className='cell'>
						<h4>NFT</h4>
					</div>
				</div>
				{loading
					? 'Loading...'
					: data.map((point, index) => {
							return (
								<div key={index} className='row'>
									<div className='cell'>
										<h4>{point.createdAt}</h4>
									</div>
									<div className='cell'>
										<h4>
											{point.answers[1].A}, {point.answers[2].A}, {point.answers[3].A}
										</h4>
									</div>
									<div className='cell'>
										<h4>Words 4-6</h4>
									</div>
									<div className='cell'>
										<h4>{point.manifesto}</h4>
									</div>
									<div className='cell'>
										<h4>{unixToDate(point.createdAt)}</h4>
									</div>
									<div className='cell'>
										<h4>Yes</h4>
									</div>
								</div>
							);
					  })}
			</div>
		</>
	);
}
