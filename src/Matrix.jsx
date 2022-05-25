import React, { createRef, useEffect, useRef, useState } from 'react';
import { randInRange, getObjFromArr } from './utils';

export default function Matrix({ manifestos }) {
	const requestRef = useRef();
	const [frames, setFrames] = useState(0);
	const [positions, setPositions] = useState({});
	const [tail, setTail] = useState(5);
	const [density, setDensity] = useState(3);
	const [animSpeed, setAnimSpeed] = useState(1);

	// console.log(animSpeed);

	// const text = manifestos;
	const text = Array.from(Array(100).keys());
	const refs = new Array(density).fill(null).map(() => createRef());
	const [phrase, setPhrase] = useState(getObjFromArr(text));

	// Frames clock
	// const animate = () => {
	// 	setFrames((prevState) =>
	// 		prevState < 60 ? (prevState += parseInt(animSpeed)) : (prevState = 0)
	// 	);
	// 	requestRef.current = requestAnimationFrame(animate);
	// };

	const handleChange = (e) => {
		switch (e.currentTarget.name) {
			case 'animation-speed':
				setAnimSpeed(e.currentTarget.value);
				break;
			case 'trail':
				setTail(e.currentTarget.value);
				break;
			default:
		}
	};

	useEffect(() => {
		const animate = () => {
			setFrames((prevState) =>
				prevState < 60 ? (prevState += parseInt(animSpeed)) : (prevState = 0)
			);
			requestRef.current = requestAnimationFrame(animate);
		};
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, [animSpeed]);

	useEffect(() => {
		if (frames > 59) {
			// console.log('frame', 'speed:', parseInt(animSpeed));
			refs.forEach((ref) => {
				// Assign random X and Y values between 0 and window H/W
				let currentYPos = randInRange(window.innerHeight);
				let currentXPos = randInRange(window.innerWidth);

				// Save to state object with ids as keys
				setPositions((prevState) => {
					if (ref.current && prevState) {
						return { ...prevState, [ref.current.id]: { x: currentXPos, y: currentYPos } };
					}
				});
				setPhrase((prevState) => {
					if (ref.current && text && phrase) {
						return {
							...prevState,
							[ref.current.id]:
								prevState[ref.current.id] > 0 ? (prevState[ref.current.id] -= 1) : text.length - 1,
						};
					}
				});

				// If less than device height add, else reset
				if (ref.current && positions) {
					if (
						positions[`${ref.current.id}`] &&
						positions[`${ref.current.id}`].y < window.innerHeight
					) {
						ref.current.style.transform = `translateX(${positions[`${ref.current.id}`].x}px)`;
						ref.current.firstChild.style.transform = `translateY(${
							positions[`${ref.current.id}`].y
						}px)`;
						setPositions((prevState) => {
							if (ref.current !== null) {
								return {
									...prevState,
									[ref.current.id]: {
										x: positions[`${ref.current.id}`].x,
										y: positions[`${ref.current.id}`].y + 15,
									},
								};
							}
						});
					} else {
						setPositions((prevState) => {
							if (ref.current !== null) {
								return {
									...prevState,
									[ref.current.id]: {
										x: randInRange(window.innerWidth),
										y: randInRange(window.innerHeight) - window.innerHeight,
									},
								};
							}
						});
						setPhrase((prevState) => {
							if (ref.current !== null) {
								return {
									...prevState,
									[ref.current.id]: randInRange(text.length),
								};
							}
						});
					}
				}
			});
		}
	}, [frames]);

	// Loop over to beggining if number exceeds array length
	const addDifferent = (array, ind, num) => {
		if (array && ind & num && phrase) {
			const randomIndex = phrase[`${ind}`] + num;
			return ((randomIndex % array.length) + array.length) % array.length;
		} else {
		}
	};

	const trails = Array.from({ length: tail }, (v, k) => k + 1).reverse();

	const foo = (one, two, three, bar) => {
		if (one && two && three && bar) {
			return text[bar];
		} else {
			console.log('cunt');
		}
	};

	return (
		<>
			<div className='canvas-container'>
				{refs.map((ref, index) => {
					return (
						<div ref={ref} key={index} id={index} className='single-stream'>
							<div className=''>
								{/* Create array with length of tail and fill with h1 with decreasing opacities */}
								{
									// Array.from({ length: tail }, (v, k) => k + 1)
									// 	.reverse()
									trails.map((el, ind) => {
										return (
											<h1 key={el} style={{ opacity: `${(1 / el).toFixed(2)}` }}>
												{text[addDifferent(text, ind, el)]}
											</h1>
										);
									})
								}
								<h1 style={{ opacity: '1' }}>{text[phrase[`${index}`]]}</h1>
							</div>
						</div>
					);
				})}
			</div>
			<form className='controller-wrapper' id='controller'>
				{/* <div class='single-input'>
					<label for='falling-speed'>Falling Speed</label>
					<input type='range' value='10' id='falling-speed' name='falling-speed' min='0' max='30' />
				</div> */}
				{animSpeed}
				<br />
				{frames}
				<br />
				<div className='single-input'>
					<label htmlFor='animation-speed'>Animation Speed</label>
					<input
						type='range'
						onChange={(e) => handleChange(e)}
						value={animSpeed}
						id='animation-speed'
						name='animation-speed'
						min='0'
						max='20'
						step='0.25'
					/>
				</div>
				<div className='single-input'>
					<label htmlFor='trail'>Trail</label>
					<input
						type='range'
						onChange={(e) => {
							handleChange(e);
							// console.log(e.currentTarget.value);
						}}
						value={tail}
						id='trail'
						name='trail'
						min='0'
						max='20'
						step='1'
					/>
				</div>
				{/* <div class='single-input'>
					<label for='fadeout-effect'>Fadeout Effect</label>
					<input
						type='range'
						value='35'
						id='fadeout-effect'
						name='fadeout-effect'
						min='0'
						max='99'
					/>
				</div>
				<div class='single-input'>
					<label for='column-size'>Overlap</label>
					<input type='range' value='10' id='column-size' name='column-size' min='5' max='25' />
				</div>
				<div class='single-input'>
					<label for='symbols-color'>Symbols Color</label>
					<input type='color' value='#000000' id='symbols-color' name='symbols-color' />
				</div>
				<div class='single-input'>
					<label for='background-color'>Background Color</label>
					<input type='color' value='#ffffff' id='background-color' name='background-color' />
				</div> */}
				<button className='ok' id='ok-btn'>
					OK
				</button>
			</form>
		</>
	);
}
