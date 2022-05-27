import React, { createRef, useEffect, useRef, useState } from 'react';
import { randInRange, getObjFromArr } from './utils';

export default function Matrix({ manifestos }) {
	// const text = Array.from(Array(100).keys());
	const text = manifestos;

	const requestRef = useRef();
	const [frames, setFrames] = useState(0);
	const [positions, setPositions] = useState({});
	const [phrase, setPhrase] = useState(getObjFromArr(text));
	const [animPaused, setPause] = useState(false);

	const [streamRefs, setStreamRefs] = useState([]);

	const [animSpeed, setAnimSpeed] = useState(2);
	const [trail, setTrail] = useState(8);
	const [density, setDensity] = useState(3);
	const [spaceBetween, setSpaceBetween] = useState(5);
	const [backgroundCol, setBackgroundCol] = useState('#000000');
	const [symbolsCol, setSymbolsCol] = useState('#0ecc00');

	const [randomise, setRandomise] = useState(false);
	const [controller, setController] = useState('flex');

	const handleChange = (e) => {
		e.preventDefault();
		switch (e.currentTarget.name) {
			case 'anim-speed-increase':
				setAnimSpeed((currentSpeed) => (currentSpeed += 1));
				break;
			case 'anim-speed-decrease':
				setAnimSpeed((currentSpeed) => (currentSpeed -= 1));
				break;
			case 'trail-length-increase':
				setTrail((currentLength) => (currentLength += 1));
				break;
			case 'trail-length-decrease':
				setTrail((currentLength) => (currentLength -= 1));
				break;
			case 'text-density-increase':
				setDensity((currentDenisty) => (currentDenisty += 1));
				break;
			case 'text-density-decrease':
				setDensity((currentDenisty) => (currentDenisty -= 1));
				break;
			case 'space-between-increase':
				setSpaceBetween((currentSpaceBetween) => (currentSpaceBetween += 1));
				break;
			case 'space-between-decrease':
				setSpaceBetween((currentSpaceBetween) => (currentSpaceBetween -= 1));
				break;
			case 'symbols-color':
				setSymbolsCol(e.currentTarget.value);
				break;
			case 'background-color':
				setBackgroundCol(e.currentTarget.value);
				break;
			case 'randomise':
				randomise ? setRandomise(false) : setRandomise(true);
				break;
			case 'animation-pause':
				animPaused ? setPause(false) : setPause(true);
				break;
			case 'ok':
				controller === 'flex' ? setController('none') : setController('flex');
				break;
			case undefined:
				controller === 'flex' ? setController('none') : setController('flex');
				break;
			default:
		}
	};

	// Loop over to beggining if number exceeds array length
	const addDifferent = (arrayLength, ind, num) => {
		const randomIndex = phrase[`${ind}`] + num;
		return ((randomIndex % arrayLength) + arrayLength) % arrayLength;
	};

	useEffect(() => {
		const animate = () => {
			setFrames((prevState) =>
				prevState < 120 ? (prevState += parseInt(animSpeed)) : (prevState = 0)
			);
			requestRef.current = requestAnimationFrame(animate);
		};
		requestRef.current = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(requestRef.current);
	}, [animSpeed]);

	useEffect(() => {
		if (!animPaused) {
			if (frames > 119) {
				// Generate an array of refs equal to density
				setStreamRefs((streamRefs) =>
					Array(density)
						.fill()
						.map((_, i) => streamRefs[i] || createRef())
				);

				// Generate stream for every ref
				streamRefs.forEach((ref) => {
					// Assign random X and Y values between 0 and window H/W
					let randomYPos = randInRange(window.innerHeight);
					let randomXPos = randInRange(window.innerWidth);

					// Save to state object with ids as keys
					setPositions((prevState) => {
						return { ...prevState, [ref.current.id]: { x: randomXPos, y: randomYPos } };
					});

					if (randomise) {
						setPhrase((prevState) => {
							return {
								...prevState,
								[ref.current.id]:
									prevState[ref.current.id] > 0
										? (prevState[ref.current.id] -= 1)
										: text.length - 1,
							};
						});
					}

					// If less than device height add, else reset
					if (
						positions[`${ref.current.id}`] &&
						positions[`${ref.current.id}`].y < window.innerHeight
					) {
						// ref.current.style.transform = `translateX(${positions[`${ref.current.id}`].x}px)`;
						const element = ref.current.firstChild.firstChild.offsetWidth;
						ref.current.style.transform = `translateX(${
							positions[`${ref.current.id}`].x + element > window.innerWidth
								? positions[`${ref.current.id}`].x - element
								: positions[`${ref.current.id}`].x
						}px)`;
						ref.current.firstChild.style.transform = `translateY(${
							positions[`${ref.current.id}`].y
						}px)`;
						setPositions((prevState) => {
							return {
								...prevState,
								[ref.current.id]: {
									x: positions[`${ref.current.id}`].x,
									y: positions[`${ref.current.id}`].y + 15 + spaceBetween,
								},
							};
						});
					} else {
						setPositions((prevState) => {
							return {
								...prevState,
								[ref.current.id]: {
									x: randomXPos,
									y: randInRange(window.innerHeight) - window.innerHeight,
								},
							};
						});
						setPhrase((prevState) => {
							return {
								...prevState,
								[ref.current.id]: randInRange(text.length),
							};
						});
					}
				});
			}
		}
	}, [frames]);

	return (
		<>
			<div
				style={{ background: `${backgroundCol}` }}
				// onClick={(e) => console.log(e.currentTarget)}
				onClick={(e) => handleChange(e)}
				name='canvas'
				className='canvas-container'
			>
				{' '}
				{streamRefs.map((ref, index) => {
					return (
						<div ref={ref} key={index} id={index} className='single-stream'>
							<div className=''>
								{/* Create array with length of trail and fill with h1 with decreasing opacities */}
								{Array.from({ length: trail }, (v, k) => k + 1)
									.reverse()
									.map((el, ind) => {
										return (
											<h1
												key={el}
												style={{
													opacity: `${(1 / (el + 1)).toFixed(2)}`,
													// opacity: `0.${el - 1}`,
													marginTop: `${spaceBetween}px`,
													color: `${symbolsCol}`,
												}}
											>
												{text[addDifferent(text.length, index, randomise ? el : 0)]}
											</h1>
										);
									})}
								<h1
									name='leading'
									style={{ opacity: '1', marginTop: `${spaceBetween}px`, color: `${symbolsCol}` }}
								>
									{text[phrase[`${index}`]]}
								</h1>
							</div>
						</div>
					);
				})}
			</div>
			<form className='controller-wrapper' style={{ display: `${controller}` }} id='controller'>
				{/* <div class='single-input'>
					<label for='falling-speed'>Falling Speed</label>
					<input type='range' value='10' id='falling-speed' name='falling-speed' min='0' max='30' />
				</div> */}
				<div className='specs'>
					<h1 style={{ textDecoration: 'underline' }}>Current Specifications</h1>
					<br />
					Animation Speed: {animSpeed}
					<br />
					Trail Length: {trail}
					<br />
					Text Density: {density}
					<br />
					Space Between: {spaceBetween}
					<br />
					<br />
					{/* Frames: {frames} */}
				</div>
				<div className='single-input'>
					<label htmlFor='animation-speed'>Animation Speed</label>
					<span className='control-buttons'>
						<button
							name='anim-speed-decrease'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							-
						</button>
						<button
							name='anim-speed-increase'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							+
						</button>
					</span>
				</div>
				<div className='single-input'>
					<label htmlFor='trail'>Trail</label>
					<span className='control-buttons'>
						<button
							name='trail-length-decrease'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							-
						</button>
						<button
							name='trail-length-increase'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							+
						</button>
					</span>
				</div>
				<div className='single-input'>
					<label htmlFor='density'>Density</label>
					<span name='density' className='control-buttons'>
						<button
							name='text-density-decrease'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							-
						</button>
						<button
							name='text-density-increase'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							+
						</button>
					</span>
				</div>
				<div className='single-input'>
					<label htmlFor='space-between'>Space Between</label>
					<span name='space-between' className='control-buttons'>
						<button
							name='space-between-decrease'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							-
						</button>
						<button
							name='space-between-increase'
							onClick={(e) => handleChange(e)}
							style={{ width: '50%' }}
						>
							+
						</button>
					</span>
				</div>
				<span className='control-buttons'>
					<label htmlFor='symbols-color'>Symbols </label>
					<input
						type='color'
						value={symbolsCol}
						onChange={(e) => handleChange(e)}
						id='symbols-color'
						name='symbols-color'
					/>
					<label htmlFor='background-color'>Background</label>
					<input
						type='color'
						value={backgroundCol}
						onChange={(e) => handleChange(e)}
						id='background-color'
						name='background-color'
					/>
				</span>
				<span className='control-buttons'>
					<label htmlFor='randomise'>Randomise</label>
					<input
						name='randomise'
						checked={randomise}
						onChange={(e) => handleChange(e)}
						type='checkbox'
					/>
					<label htmlFor='randomise'>Pause</label>
					<input
						name='animation-pause'
						checked={animPaused}
						onChange={(e) => handleChange(e)}
						type='checkbox'
					/>
				</span>
				{/* <div className='single-input'></div>
				<div class='single-input'></div> */}
				<button className='ok' name='ok' onClick={(e) => handleChange(e)} id='ok-btn'>
					OK
				</button>
			</form>
		</>
	);
}
