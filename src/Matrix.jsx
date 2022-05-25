import React, { createRef, useEffect, useRef, useState } from 'react';

export default function Matrix({ manifestos }) {
	const requestRef = useRef();
	const [frames, setFrames] = useState(0);
	const [positions, setPositions] = useState({});
	const [phrase, setPhrase] = useState({});
	const [tail, setTail] = useState(9);
	const [density, setDensity] = useState(5);

	const animate = () => {
		setFrames((prevState) => (prevState < 60 ? (prevState += 0.25) : (prevState = 0)));
		requestRef.current = requestAnimationFrame(animate);
	};

	const randInRange = (end) => {
		return Math.floor(Math.random() * end);
	};

	const text = manifestos;
	// const text = ['0', '1'];

	// const refs = new Array(text.length).fill(null).map(() => createRef());
	const refs = new Array(density).fill(null).map(() => createRef());

	// Frames clock
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, []);

	useEffect(() => {
		if (frames === 60) {
			refs.forEach((ref) => {
				// Assign random X and Y values between 0 and window H/W
				let currentYPos = randInRange(window.innerHeight);
				let currentXPos = randInRange(window.innerWidth);

				// Save to state object with ids as keys
				setPositions((prevState) => {
					return { ...prevState, [ref.current.id]: { x: currentXPos, y: currentYPos } };
				});
				setPhrase((prevState) => {
					return { ...prevState, [ref.current.id]: randInRange(text.length) };
				});

				// If less than device height add, else reset
				if (
					positions[`${ref.current.id}`] &&
					positions[`${ref.current.id}`].y < window.innerHeight
				) {
					ref.current.style.transform = `translateX(${positions[`${ref.current.id}`].x}px)`;
					ref.current.firstChild.style.transform = `translateY(${
						positions[`${ref.current.id}`].y
					}px)`;
					setPositions((prevState) => {
						return {
							...prevState,
							[ref.current.id]: {
								x: positions[`${ref.current.id}`].x,
								y: positions[`${ref.current.id}`].y + 15,
							},
						};
					});
				} else {
					setPositions((prevState) => {
						return {
							...prevState,
							[ref.current.id]: {
								x: randInRange(window.innerWidth),
								y: randInRange(window.innerHeight) - window.innerHeight,
							},
						};
					});
				}
			});
		}
	}, [frames]);

	const addDifferent = (arrayLength, ind, num) => {
		const randomIndex = phrase[`${ind}`] + num;

		// console.log(randomIndex);
		return randomIndex < arrayLength ? randomIndex : Math.floor(randomIndex * 0.5);
	};

	return (
		<div className='canvas-container'>
			{refs.map((ref, index) => {
				return (
					<div ref={ref} key={index} id={index} className='single-stream'>
						<div className=''>
							{Array.from({ length: tail }, (v, k) => k + 1)
								.reverse()
								.map((el, ind) => {
									return (
										<h1 key={el} style={{ opacity: `${(1 / el).toFixed(2)}` }}>
											{text[addDifferent(text.length, index, ind)]}
										</h1>
									);
								})}
							<h1 style={{ opacity: '1' }}>{text[phrase[`${index}`]]}</h1>
						</div>
					</div>
				);
			})}
		</div>
	);
}
