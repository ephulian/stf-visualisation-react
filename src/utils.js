const randInRange = (end) => {
	return Math.floor(Math.random() * end);
};

const getObjFromArr = (arr) => {
	return Object.assign(
		{},
		Array.from({ length: arr.length }, (v, k) => (k = randInRange(arr.length)))
	);
};

export { randInRange, getObjFromArr };
