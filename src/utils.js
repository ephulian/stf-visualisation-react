// Get random in range of parameter
const randInRange = (end) => {
	return Math.floor(Math.random() * end);
};

// Given an array, creates an object with same length, indices as keys and random (within length) values
const getObjFromArr = (arr) => {
	return Object.assign(
		{},
		Array.from({ length: arr.length }, (v, k) => (k = randInRange(arr.length)))
	);
};

export { randInRange, getObjFromArr };
