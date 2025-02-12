"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchAPOD } from '../../services/api'

const APOD = () => {
	const [apodData, setApodData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getAPOD = async () => {
			try {
				const data = await fetchAPOD();
				setApodData(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		getAPOD();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error}</div>;
	}
	if (!apodData) {
		return <div>No data</div>;
	}

	return (
		<div className='container'>
			<h1 className='header'>{apodData.title}</h1>
			{apodData.media_type === 'image' ? (
				<Image
					src={apodData.url}
					alt={apodData.title}
					width={960}
					height={600}
				/>
			) : (
				<iframe title={apodData.title} src={apodData.url} />
			)}
		</div>
	);
}

export default APOD
