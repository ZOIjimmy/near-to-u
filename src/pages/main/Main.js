import React, { useEffect, useRef, useState, useMemo } from "react";

import './Main.css'

import {
	GET_POST,
	CREATE_POST_MUTATION,
	POSTS_SUBSCRIPTION,
  COMMENT_MUTATION,
  GET_ID,
  ALL_SUBSCRIPTION
  } from '../../graphql'
import { useQuery, useMutation } from 'react-apollo'
//map
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";

//SPA Navigation 
import MainNav from './Nav'
import Post from './Post'
//material-ui
import { makeStyles } from '@material-ui/core/styles';

//bootstrap
import "react-slideshow-image/dist/styles.css"
import { Slide } from 'react-slideshow-image';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Main = ()=>{
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  const classes = useStyles();
  //const [user, Setuser] = useStyles(localStorage.getItem('user'));
	const [open0, setOpen0] = React.useState(true);
	const [open1, setOpen1] = React.useState(false);
	const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [user, SetUser] = useState(localStorage.getItem("user"))
  const [currentlat, SetLat] = useState(25.01);
  const [currentlng, SetLng] = useState(121.53);
  const [posts, Setposts] = useState([])
  const { loading, error, data, refetch} = useQuery(GET_POST, {variables: {x: currentlat, y: currentlng, s: 0.5}})
  const cachedMutatedData = useMemo(() => {
    if (loading || error) return null
    Setposts(data.getPosts)
    return data
  }, [loading, error, data])

 
  function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.getElementById("theme-controller").className = themeName;
  }
  
  useEffect(
    // Immediately invoked function to set the theme on initial load
    () => {
      document.querySelectorAll('.images-wrap')[0].childNodes[0].setAttribute('aria-hidden', 'ture')
      document.querySelectorAll('.images-wrap')[0].childNodes[document.querySelectorAll('.images-wrap')[0].childNodes.length - 1].setAttribute('aria-hidden', 'true')
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTheme('theme-dark');
        } else {
            setTheme('theme-light');
        }
      }
  );

 setInterval(function(){
   navigator.geolocation.getCurrentPosition((pos)=>{
   SetLat(pos.coords.latitude)
   SetLng(pos.coords.longitude)
   
 })}, 3000);
  const handleClick0 = () => {
    setOpen0(!open0);
    setOpen1(false)
    setOpen2(false)
    setOpen3(false)

  };
  const handleClick1 = () => {
      setOpen1(!open1);
      setOpen0(false)
      setOpen2(false)
      setOpen3(false)
	};
	const handleClick2 = () => {
      setOpen2(!open2);
      setOpen0(false)
      setOpen1(false)
      setOpen3(false)
	};
	const handleClick3 = () => {
      setOpen3(!open3);
      setOpen0(false)
      setOpen2(false)
      setOpen1(false)
    };

  function Map(){
    return (
      <GoogleMap
        zoom = {15}
        center = {{lat: currentlat, lng: currentlng}}
      >
          {posts !== undefined? posts.map(({location}, i)=>(<Marker
          position = {{
            lat: location.x,
            lng: location.y
          }}></Marker>)):(<Marker position = {{
            lat: currentlat,
            lng: currentlng}}></Marker>)}
        
      </GoogleMap>
    )
  }

  const WrappedMap = withScriptjs(withGoogleMap(Map))

	return (
		<>
     <div className="theme-dark" id = 'theme-controller'>
		<div className = 'main'>
			{/* <div className = 'main-left'> */}
				<MainNav/>
			{/* </div> */}
      <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBES8rvsfwrOtLZ5S4EvedrOJ4OSIR49UY&callback=initMap">
      </script>
			<div className = 'main-center'>
        <div style={{ height: '100vh', width: '100vh', margin:0, padding:0 }} id = "map">
          <WrappedMap 
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBES8rvsfwrOtLZ5S4EvedrOJ4OSIR49UY"}
          loadingElement = {<div style = {{height: '80vh', width: '80vh'}}/>}
          containerElement = {<div style = {{height: '85vh', width: '85vh'}}/>}
          mapElement = {<div style = {{height: '100%'}}/>}
          />
        </div>
      </div>
			<div className = 'main-right'>
	
          <div>
            <Slide easing = "ease">
            {posts !== undefined? (posts.map(({
							author,
							title,
							type,
							picture,
							text,
							time,
							tags,
							id,
							comments,
              video, 
              likes}, i) =>
            (<div className="each-slide" key = {i}>
              <Post
								title={title}
								type={type}
								author={author[0]}
								picture={picture}
								text={text}
								time={time}
								id={id}
								tags={tags}
								comments={comments}
								video={video}
                Ctheme={localStorage.getItem('theme')}
                likes = {likes}/>
              </div>)
            )): (<div></div>)}
            </Slide>
          </div>
          

        </div>
        <div style = {{position: "absolute", right: "1%", top: "8%", backgroundColor: "red"}}>
          <button onClick ={()=>{refetch()}}>REFRESH</button>
        </div>
    </div>
    </div>
    </>
  )
}

export default Main;
