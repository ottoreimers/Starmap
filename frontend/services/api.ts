export const fetchAPOD = async () => {
	const response = await fetch(`http://localhost:8000/api/apod/`, {
		headers: {
			'Accept': 'application/json',
		},
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return response.json();
}

