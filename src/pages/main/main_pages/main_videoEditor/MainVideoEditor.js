import "./MainVideoEditor.css";
import React, { useState, useEffect } from "react";

import PureVideoComp from './Video'
import MainNav from './../../Nav'

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function MainVideoEditor() {

	//all the states--
	//for init
		const [ready, setReady] = useState(false);
		const [video, setVideo] = useState();
		const [gif, setGif] = useState('');
	
	//for filter
		const [gif_filter, setGifFilter] = useState();
		
		// contrast default 1.0
			const [contrast, setContrast] = useState(1.3);
		// brightness default 0.0
			const [brightness, setBrightness] = useState(0.3);
		//saturation default 1.0
			const [saturation, setSaturation] = useState(0.3);
		//gamma default 1.0
			const [gamma_R, setGammaR] = useState(1.0);
			const [gamma_G, setGammaG] = useState(1.0);
			const [gamma_B, setGammaB] = useState(1.0);

	//for Trim
		const [start_time, setStartTime] = useState("00:00:00");
		const [end_time, setEndTime] = useState("00:00:09");
		const [duration, setDuration] = useState("00:00:01");

	//preview
		const [preview, setPreview] = useState();
	
	//--all the states
//handle change	
	useEffect(()=>{
		console.log(gif_filter)
		if(gif_filter === '1')
		{
			console.log("hi")
			if(document.getElementById("Contrast"))
			{
				document.getElementById("Contrast").disabled = true
			}
			if(document.getElementById("Saturation"))
			{
				console.log("c1")
				document.getElementById("Saturation").disabled = true
			}
			if(document.getElementById("Brighten"))
			{
				console.log("c2")
				document.getElementById("Brighten").disabled = true
			}
			if(document.getElementById("Flip"))
			{
				console.log("c3")
				document.getElementById("Flip").disabled = true
			}

		}
		else
		{
			if(document.getElementById("Contrast"))
			{
				document.getElementById("Contrast").disabled = false
			} 
			if(document.getElementById("Saturation"))
			{
				document.getElementById("Saturation").disabled = false
			}
			if(document.getElementById("Brighten"))
			{
				document.getElementById("Brighten").disabled = false
			}
			if(document.getElementById("Flip"))
			{
				document.getElementById("Flip").disabled = false
			}
		}
	}, [gif_filter])


//theme
	function setTheme(themeName) {
		localStorage.setItem('theme', themeName);
		document.getElementById("theme-controller").className = themeName;
	}

	useEffect(
		// Immediately invoked function to set the theme on initial load
		() => {
			if (localStorage.getItem('theme') === 'theme-dark') {
				setTheme('theme-dark');
			} else {
				setTheme('theme-light');
			}
		}
	);
//theme set



	const load = async () => {

		await ffmpeg.load();
		setReady(true);
	};

	useEffect(() => {
		if(!ffmpeg.isLoaded()){
		load();
		}
	}, []);

	const convertToGif = async () => {
		//diable button
		document.getElementById("convertBtn").disabled = true;

		// Write the file to memory
		ffmpeg.FS("writeFile", "test.mov", await fetchFile(video));

		setStartTime("00:00:08");
		setEndTime("00:00:09");
		//setDuration(end_time-start_time);
		console.log(end_time.substring(6, 8));
		console.log(start_time.substring(6, 8));
		console.log(end_time.substring(6, 8)-start_time.substring(6, 8));

		// MOV -> MP4 and Trim
		await ffmpeg.run(
			"-ss",
			start_time,
			"-i",
			"test.mov",
			"-to",
			duration,
			"out1.mp4"
		);
		// MP4 -> GIF
		await ffmpeg.run("-i", "out1.mp4", "out.gif");
		// Read the NO FILTER result
		const data = ffmpeg.FS("readFile", "out.gif");

		// Create a URL
		const url = URL.createObjectURL(
			new Blob([data.buffer], { type: "image/gif" })
		);

		console.log("file converted")
		setGif(url);
		document.getElementById("convertBtn").disabled = false;
	};

/////////////////////////////////////////////////////////////////////////////
// FILTERS-------------------------
/////////////////////////////////////////////////////////////////////////////
	const addFilter_flip = async () => {
		document.getElementById("contrastRange").value = "50"
		document.getElementById("brightnessRange").value = "0"
		document.getElementById("saturationRange").value = "50"
		await setGifFilter('1')
		ffmpeg.FS("writeFile", "out.gif", await fetchFile(gif));
		await ffmpeg.run("-i", "out.gif", "-vf", "hflip", "filterout.gif");
		const filter_data =  ffmpeg.FS("readFile", "filterout.gif");

		const filter_url = URL.createObjectURL(
			new Blob([filter_data.buffer], { type: "image/gif" })
		);

		//filtered
		console.log("filter_flip added")
		setGifFilter(filter_url);
	};

	const addFilter_brightness = async () => {
		document.getElementById("contrastRange").value = "50"
		document.getElementById("saturationRange").value = "50"
		var command = "eq=brightness="+brightness;
		await setGifFilter('1')
		ffmpeg.FS("writeFile", "out.gif", await fetchFile(gif));
		await ffmpeg.run("-i", "out.gif", "-vf", command, "filterout.gif");
		const filter_data =  ffmpeg.FS("readFile", "filterout.gif");

		const filter_url = URL.createObjectURL(
			new Blob([filter_data.buffer], { type: "image/gif" })
		);

		//filtered
		console.log("filter_brighten added")
		setGifFilter(filter_url);
	};

	const addFilter_contrast = async () => {
		document.getElementById("brightnessRange").value = "0"
		document.getElementById("saturationRange").value = "50"
		var command = "eq=contrast="+contrast;
		await setGifFilter('1')
		ffmpeg.FS("writeFile", "out.gif", await fetchFile(gif));
		await ffmpeg.run("-i", "out.gif", "-vf", command, "filterout.gif");
		const filter_data =  ffmpeg.FS("readFile", "filterout.gif");

		const filter_url = URL.createObjectURL(
			new Blob([filter_data.buffer], { type: "image/gif" })
		);

		//filtered
		console.log("filter_brighten added")
		setGifFilter(filter_url);
	};

	const save_change = () =>{
		setGif(gif_filter)
		document.getElementById("contrastRange").value = "50"
		document.getElementById("brightnessRange").value = "0"
		document.getElementById("saturationRange").value = "50"
	}

	const addFilter_saturation = async () => {

		var command = "eq=saturation="+saturation;
		document.getElementById("contrastRange").value = "50"
		document.getElementById("brightnessRange").value = "0"
		await setGifFilter('1')
		ffmpeg.FS("writeFile", "out.gif", await fetchFile(gif));
		await ffmpeg.run("-i", "out.gif", "-vf", command, "filterout.gif");
		const filter_data =  ffmpeg.FS("readFile", "filterout.gif");

		const filter_url = URL.createObjectURL(
			new Blob([filter_data.buffer], { type: "image/gif" })
		);

		//filtered
		console.log("filter_brighten added")
		setGifFilter(filter_url);
	};

/////////////////////////////////////////////////////////////////////////////
// -------------------------FILTERS
/////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
// CHANGE FLITER SETTING-------------------------
/////////////////////////////////////////////////////////////////////////////

const changeContrast = (e) => { setContrast((e.target.value-50)/50); }
const changeBrightness = (e) => { setBrightness(e.target.value/50); }
const changeSaturation = (e) => { setSaturation((e.target.value-50)/50); }

/////////////////////////////////////////////////////////////////////////////
// -------------------------CHANGE FLITER SETTING
/////////////////////////////////////////////////////////////////////////////


	return { ready } ? (
		<div className = "theme-dark" id = "theme-controller">
			<MainNav className = "nav"/>
			<div className="App">
				<div className = 'main-center-v' id="main">
					{ video?<PureVideoComp videoSrc = {video}/>:<></>}

					<input
						type="file"
						onChange={(e) => setVideo(e.target.files?.item(0))}
					/>
					{video?
					<>
					<div>
						<button style ={{padding: "10px", display: "inline"}}>start</button>
						<p style = {{display: "inline"}}>    </p>
						<button style ={{padding: "10px", display: "inline"}}>stop</button>
					</div>
						
						<h3>Result</h3>
						<button onClick={convertToGif} id="convertBtn">Convert to GIF</button>
						<br/><br/>
						{gif && <><img src={gif} width="400" /><br/>{gif}</>}
						<br/><br/>
						</>:<>
						<h2>Select video above</h2>
					</>}
				</div>

				<div className = 'main-right-v' id="main">
				{video?<>
					{gif?
					gif_filter?
					(gif_filter === '1'?
					<>
						<h2>Select one filter</h2>
						<input type="range" min="0" max="99" onInput={changeContrast} id="contrastRange"/>
						<button id = "Contrast" onClick={addFilter_contrast}>Filter_contrast</button>

						<input type="range" min="-50" max="50" onInput={changeBrightness} id="brightnessRange"/>
						<button id = "Brighten" onClick={addFilter_brightness}>Filter_brighten</button>
						
						<br/><br/><button id = "Flip" onClick={addFilter_flip}>Filter_flip</button>
						
						<input type="range" min="0" max="100" onInput={changeSaturation} id="saturationRange"/>
						<button id = "Saturation" onClick={addFilter_saturation}>Filter_saturation</button>

						{<>
						<div style ={{padding: "10px"}}>
							<img src="https://i.stack.imgur.com/kOnzy.gif" width="80" style ={{padding: "10px"}}/>
							<br/>
						</div></>}
					</>:<>
						<h2>Select one filter</h2>
						<input type="range" min="0" max="100" onInput={changeContrast} id="contrastRange"/>
						<button id = "Contrast" onClick={addFilter_contrast}>Filter_contrast</button>

						<input type="range" min="-50" max="50" onInput={changeBrightness} id="brightnessRange"/>
						<button id = "Brighten" onClick={addFilter_brightness}>Filter_brighten</button>
						
						<br/><br/><button id = "Flip" onClick={addFilter_flip}>Filter_flip</button>
						
						<input type="range" min="0" max="100" onInput={changeSaturation} id="saturationRange"/>
						<button id = "Saturation" onClick={addFilter_saturation}>Filter_saturation</button>

						{gif_filter && <>
						<div style ={{padding: "10px"}}>
							<img src={gif_filter} width="250" />
							<br/>
							{gif_filter}
						</div>
						<div>
							<button onClick = {save_change}>Save Change</button>
						</div></>}
					</>):<>
						<h2>Select one filter</h2>
						<input type="range" min="0" max="100" onInput={changeContrast} id="contrastRange"/>
						<button id = "Contrast" onClick={addFilter_contrast}>Filter_contrast</button>

						<input type="range" defaultValue = "0" min="-50" max="50" onInput={changeBrightness} id="brightnessRange"/>
						<button id = "Brighten" onClick={addFilter_brightness}>Filter_brighten</button>
						
						<br/><br/><button id = "Flip" onClick={addFilter_flip}>Filter_flip</button>
						
						<input type="range" min="0" max="100" onInput={changeSaturation} id="saturationRange"/>
						<button id="Saturation" onClick={addFilter_saturation}>Filter_saturation</button>

						{gif && <>
						<div style ={{padding: "20px"}}>
							<img src={gif} width="250" />
							<br/>
							PLEASE APPLY CHANGE
						</div></>}
					</>:<>
						<h2>To add filter</h2><br/><br/><br/><br/>
						<h2>Please convert the video first!!!</h2><br/>
						<h4>Hit the convert button on the left side</h4>
					</>}
				</>:<>
					<h2>To add filter</h2><br/><br/><br/><br/>
					<h2>Please select the video first!!!</h2>
				</>}

				</div>
			</div>
		</div>
	) : (
		<p>Loading...</p>
	);
}

export default MainVideoEditor;
