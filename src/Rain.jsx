import React from 'react';

const Rain = React.forwardRef(({ content, id }, ref) => {
	return (
		<h1 className='rain-letter' ref={ref} id={id}>
			{content}
		</h1>
	);
});

export default Rain;
