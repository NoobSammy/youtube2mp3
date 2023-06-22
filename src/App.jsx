import axios from "axios";
import { useRef, useState } from "react";
import { youtube_parser } from "./utils";
import Spinner from "./Spinner";

function App() {
	const inputUrlRef = useRef();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const youtubeID = youtube_parser(inputUrlRef.current.value);

		const options = {
			method: "GET",
			url: "https://youtube-mp36.p.rapidapi.com/dl",
			headers: {
				"X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
				"X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
			},
			params: {
				id: youtubeID,
			},
		};

		axios(options)
			.then((res) => {
				setData(res.data);
			})
			.catch((err) => {
				setData({ status: "fail", msg: err.message });
			})
			.finally(() => setLoading(false));

		inputUrlRef.current.value = "";
	};

	return (
		<div className="app">
			<section className="content">
				<h1 className="content_title">Convertidor de YouTube a mp3</h1>
				<p className="content_description">
					Descarga audio de videos de YouTube en pocos clicks
				</p>

				<form onSubmit={handleSubmit} className="form">
					<input
						ref={inputUrlRef}
						placeholder="Pega la URL del video aquí"
						className="form_input"
						required
						type="url"
					/>
					<button type="submit" className="form_button">
						Buscar
					</button>
				</form>
				{loading && <Spinner />}
				{data.status === "ok" && (
					<>
						<p className="download_title">{data.title}</p>
						<a
							target="_blank"
							rel="noreferrer"
							href={data.link}
							className="download_btn"
						>
							Descargar mp3
						</a>
					</>
				)}
				{data.status === "fail" && <p className="text-error">{data.msg}</p>}
			</section>
		</div>
	);
}

export default App;
