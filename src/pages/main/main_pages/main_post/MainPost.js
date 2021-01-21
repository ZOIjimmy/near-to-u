import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './MainPost.css'
import MainNav from './../../Nav'
import { CREATE_POST_MUTATION } from './../../../../graphql'
import { useMutation } from '@apollo/react-hooks'
//material icon
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
//font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {faCameraRetro} from '@fortawesome/free-solid-svg-icons'
// import PhotoCamera from '@material-ui/icons/PhotoCamera';
// import { AirlineSeatIndividualSuiteSharp } from '@material-ui/icons';
//antd
import { Input } from 'antd'

const { TextArea } = Input;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));

const MainPost = () => {
    const inputRef = useRef(null)
    const titleRef = useRef(null)
    const selectRef = useRef(null)

    const [user, setUser] = useState(localStorage.getItem('user'));
    const [location, setLocation] = useState({ x: 25.01, y: 121.53, s: 15 });
    const [type, setType] = useState("white");
    const [picture, setPicture] = useState("");
    const [video, setVideo] = useState("");

    const [createPost] = useMutation(CREATE_POST_MUTATION)

    useEffect(() => {
        console.log(user)
    }, []);

    setInterval(function () {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({ x: pos.coords.latitude, y: pos.coords.longitude, s: 15 })

        })
    }, 10000);

    //////////////////////////////////////////////////////////////////////////////
    //show media--
    const constraints = {
        audio: true,
        video: {
            width: 300,
            height: 300
        }
    }

    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleCapture(stream);
        }
        catch (e) {
            console.log(`navigator.mediaDevices.getUserMedia: ${e.toString()}`)
        }
    }

    function handleCapture(stream) {
        window.stream = stream;
        const videoHolder = document.getElementById("video-holder");
        videoHolder.innerHTML = "";
        const rawVideo = document.createElement("video");
        rawVideo.setAttribute('id', "raw-video");
        rawVideo.setAttribute('playsInline', null);
        rawVideo.setAttribute('autoPlay', null);
        rawVideo.muted = true;
        rawVideo.srcObject = stream;
        videoHolder.appendChild(rawVideo);
    }

    function handleImageUpload(stream) {
        const videoHolder = document.getElementById("video-holder");
        videoHolder.innerHTML = "";
        const rawImg = document.createElement("img");
        rawImg.setAttribute('id', "raw-img");
        rawImg.style.maxWidth = "300px"
        rawImg.style.maxHeight = "300px"
        rawImg.setAttribute('src', stream);
        videoHolder.appendChild(rawImg);
    }
    //--show media
    //////////////////////////////////////////////////////////////////////////////
    //cancel show media--
    function confirm() {
        const videoHolder = document.getElementById("video-holder");
        videoHolder.innerHTML = "";
        const b1 = document.getElementById("captureButton");
        const b2 = document.getElementById("recordButton");
        b1.style.display = "none"
        b2.style.display = "none"
    }
    //--cancel show media
    //////////////////////////////////////////////////////////////////////////////
    //remove Media--
    function removeMedia() {
        setPicture("");
        setVideo("");
        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
    }
    //--remove Media
    //////////////////////////////////////////////////////////////////////////////
    //record--
    let mediaRecorder;
    let recordedBlobs;

    function startRecording() {
        recordedBlobs = [];
        let options = { mimeType: 'video/webm;codecs=vp9,opus' };
        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        const recordButton = document.getElementById("recordButton");
        recordButton.innerHTML = "Stop Recording"
        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobs);
        };
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        console.log('MediaRecorder started', mediaRecorder);
    }

    function handleDataAvailable(event) {
        console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
            console.log(recordedBlobs);
            const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
            var reader = new FileReader();
            reader.readAsDataURL(superBuffer);
            reader.onload = function () {
                var base64data = reader.result;
                setVideo(base64data);
            }
        }
    }

    function stopRecording() {
        mediaRecorder.stop();
    }
    //--record
    //////////////////////////////////////////////////////////////////////////////
    //play recorded--
    function playRecorded() {

        // reset screen
        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
        var recordedVideo = document.createElement("video");
        recordedVideo.setAttribute('id', "videoPrev");
        recordedVideo.setAttribute('width', "300");
        recordedVideo.setAttribute('height', "300");
        mediaResult.appendChild(recordedVideo);
        // reset screen done

        recordedVideo.controls = true;
        recordedVideo.src = video;
        recordedVideo.play();
    };
    //--play recorded
    //////////////////////////////////////////////////////////////////////////////
    //download--
    function download() {
        const url = video;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    //--download

    //graphql
    function post() {
        if (!user || !location || !titleRef.current.state.value || !selectRef.current.value) return;
        var [doncare, ...pretags] = inputRef.current.state.value.replace(/\n/g, " ").split('#');
        var temptags = [];
        pretags.map(e => {
            temptags.push(e.split(' ')[0]);
        })
        createPost({
            variables: {
                author: user,
                x: location.x,
                y: location.y,
                s: location.s,
                title: titleRef.current.state.value,
                type: selectRef.current.value,
                text: inputRef.current.state.value,
                picture: picture,
                video: video,
                tags: temptags
            }
        })
        setPicture(""); setVideo("");
        titleRef.current.state.value = ""
        inputRef.current.state.value = ""
        selectRef.current.value = ""
        confirm();
        const downloadButton = document.getElementById("downloadButton");
        downloadButton.style.display = "none";
        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
    }


    //button function
    const addphoto = () => {
        init();

        // reset display
        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
        // reset done (append canvas)

        const playButton = document.getElementById("playButton");
        const recordButton = document.getElementById("recordButton");
        const captureButton = document.getElementById("captureButton");
        setVideo("");
        const downloadButton = document.getElementById("downloadButton");
        downloadButton.style.display = "none";
        playButton.style.display = "none"
        captureButton.style.display = "inline-block"
        recordButton.style.display = "none"

        captureButton.addEventListener("click", function () {
            // reset display
            const mediaResult = document.getElementById("mediaResult")
            mediaResult.innerHTML = "";
            var newCanvas = document.createElement("canvas");
            newCanvas.setAttribute('id', "canvas");
            newCanvas.setAttribute('width', "300");
            newCanvas.setAttribute('height', "300");
            mediaResult.appendChild(newCanvas);
            // reset done (append canvas)
            var context = newCanvas.getContext('2d');

            const rawVideo = document.getElementById("raw-video");
            context.drawImage(rawVideo, 0, 0, 300, 300);
            setPicture(newCanvas.toDataURL("image/png"));
            // console.log(picture);
        })
    }

    const addpic = (urlsrc) => {
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            canvas.getContext('2d').drawImage(this, 0, 0, 300, 300);
            setPicture(canvas.toDataURL('image/png'));
        };
        image.src = urlsrc;

        confirm();
        setVideo("");
        const downloadButton = document.getElementById("downloadButton");
        downloadButton.style.display = "none";

        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
        var newImg = document.createElement("img");
        newImg.setAttribute('id', "newImg");
        newImg.style.maxWidth = "300px"
        newImg.style.maxHeight = "300px"
        newImg.src = urlsrc;
        mediaResult.appendChild(newImg);
    }

    const addvideo = () => {
        init();

        // reset display
        const mediaResult = document.getElementById("mediaResult")
        mediaResult.innerHTML = "";
        // reset done (append video)

        const recordButton = document.getElementById("recordButton");
        const captureButton = document.getElementById("captureButton");
        recordButton.textContent = "Start Recording"
        captureButton.style.display = "none"
        recordButton.style.display = "inline-block"

        recordButton.addEventListener("click", () => {
            // console.log("abc")
            // console.log(recordButton.textContent);
            // console.log("abc")
            if (recordButton.textContent === "Start Recording") {
                startRecording();
                console.log("nnn")
                console.log(mediaRecorder)
                console.log(recordButton.textContent);
            }
            else{
                // console.log("???")
                stopRecording();
                //set screen
                recordButton.textContent = "Start Recording"
                const playButton = document.getElementById("playButton");
                playButton.innerHTML = "Play Recorded Video"
                playButton.style.display = "inline-block"
                const downloadButton = document.getElementById("downloadButton");
                downloadButton.style.display = "inline-block"
                //set screen done
            }
        })
    }
    //////////////////////////////////////////////////////////////////////////////
    const theme = localStorage.getItem('theme')
    return (
        <>
            <div className={theme} id="theme-controller">
                <MainNav className="nav" />
                <div className="main-div-post">
                    <div className='main-center-post' id="mainPost" style = {{height: "80%"}}>
                        <Input
                            placeholder="Title"
                            ref={titleRef}
                            style={{ marginBottom: 10, borderRadius: "5px" }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    inputRef.current.focus()
                                }
                            }}
                        ></Input>
                        <TextArea
                            rows={4}
                            placeholder="Type your text here..."
                            style={{ borderRadius: "5px" }}
                            ref={inputRef}
                        ></TextArea>
                        <div>
                            <label htmlFor="type" style={{ fontSize: "14px" }}><h6>Select a type: </h6></label>
                            <select style={{ fontSize: "14px", color: "black" }} name="type" ref={selectRef}>
                                <option value="">-- --</option>
                                <option value="red">Emergency</option>
                                <option value="orange">Activity</option>
                                <option value="yellow">Course</option>
                                <option value="green">Share</option>
                                <option value="blue">Mood</option>
                                <option value="purple">Things lost</option>
                            </select>
                            <IconButton onClick={addvideo} className="contexts"><VideoCallOutlinedIcon /></IconButton>
                            <IconButton onClick={addphoto} className="contexts"><AddAPhotoIcon /></IconButton>
                            <IconButton component="label"><AddPhotoAlternateIcon style={{ color: (theme === "theme-dark") ? ("#98ccd3") : ("#364e68") }} />
                                <input type="file"
                                    onChange={(e) => {
                                        const urlsrc = URL.createObjectURL(e.target.files?.item(0));
                                        handleImageUpload(urlsrc);
                                        addpic(urlsrc);
                                    }}
                                    hidden /></IconButton>
                            <Button onClick={post} className="contexts">post</Button>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <button id="playButton" onClick={playRecorded} className="contexts" style={{ display: "none"}}>Play recorded</button>

                            <button id="removePicture" onClick={removeMedia} className="contexts"> Remove Picture Or Video</button>
                            <button id="cancelButton" onClick={confirm} className="contexts"> Confirm(close camera view) </button>
                            <button id="downloadButton" onClick={download} className="contexts" style={{ display: "none"}}><FontAwesomeIcon icon={faDownload}/></button>
                        </div>

                        <div id="mediaResult" style={{ width: "100%", textAlign: "center" }}>
                        </div>

                    </div>

                    <div className='main-right-post' id="mainCam">
                        <div><FontAwesomeIcon icon={faCameraRetro} size="5x"/></div><br/><br/><br/>
                        <div className="video-holder" id="video-holder">
                        </div>
                        <br/><br/><br/>
                        <div style={{ margin: "0 auto", textAlign: "center" }}>
                            <button id="captureButton" style={{ display: "none"}}>Capture Image</button>
                            <button id="recordButton" style={{ display: "none"}}>Start Recording</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
export default MainPost;

// value={title}
//                             onChange={(e) => setTitle(e.target.value)}  
// value={text}
// onChange={(e) => {setText(e.target.value);}}