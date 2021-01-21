import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
//apollo
import {
	GET_POST,
  CREATE_POST_MUTATION,
	POSTS_SUBSCRIPTION,
  COMMENT_MUTATION,
  GET_ID,
  LIKE_MUTATION,
  UNLIKE_MUTATION
  } from '../../graphql'
import { useQuery, useMutation } from 'react-apollo'


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    background: "#364e68"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));



const Post = (props: { title: string, type: string, author: string, text: string, picture: string, tags: Array, time: Function, id: String, comments: Array, video: String, likes: Array, Ctheme:String }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [user, SetUser] = useState(localStorage.getItem("user"))
  const sendcontrol = useRef()
  const [liked, Setliked] = useState(false);
  const [createComment] = useMutation(COMMENT_MUTATION)
  const { loading, error, data, subscribeToMore } = useQuery(GET_ID, {variables: {id: props.id}})
  const [handleLike] = useMutation(LIKE_MUTATION)
  const [handleUnlike] = useMutation(UNLIKE_MUTATION)
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

	var postColor1 = "#f7f7e8"
	var postColor2 = "black"
	switch(props.type) {
		case "red":
			postColor1 = "#ff577f"
			postColor2 = "black"
			break;
		case "orange":
			postColor1 = "#c24914"
			postColor2 = "black"
			break;
		case "yellow":
			postColor1 = "#fc8621"
			postColor2 = "black"
			break;
		case "green":
			postColor1 = "#9dad7f"
			postColor2 = "white"
			break;
		case "blue":
			postColor1 = "#557174"
			postColor2 = "white"
			break;
		case "purple":
			postColor1 = "#c1a1d3"
			postColor2 = "white"
			break;
		default:
	}

  useEffect(() => {
    props.likes.filter((name)=>{
      if(name == user)
      {
        Setliked(true)
      }
    })
  
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: {id: props.id},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        
        if (subscriptionData.data.postSub.mutation === "COMMENTADDED") {
          const newPost = subscriptionData.data.postSub.data
          return { getPostFromId: {
            _typename: prev.getPostFromId._typename,
            ...prev.getPostFromId,
            comments: [...prev.getPostFromId.comments, newPost]
          }
          }
        }
        else if (subscriptionData.data.postSub.mutation === "LIKED") {
          Setliked(true)
          return{
            getPostFromId:
            {
              ...prev.getPostFromId,
              likes: [...prev.getPostFromId.likes, user]
            }
          }
        }
        else if (subscriptionData.data.postSub.mutation === "UNLIKED") 
        {
          Setliked(false)
          return {
            getPostFromId:
            {
              ...prev.getPostFromId,
              likes: prev.getPostFromId.likes.filter((names)=>{
                if(names !== user)
                {
                  return names
                }
              })
            }
          }
        }
      } 
    })
  }, [subscribeToMore])

  
  const sendComment = () => {
    createComment({
        variables: {
          id: props.id,
          user: user,
          text: document.getElementById(props.id).value,
        }
    })
    document.getElementById(props.id).value = ''
  }
  return (
    <Card className={classes.root} style={{background: props.Ctheme==='theme-dark'?("#364e68"):("#98ccd3"), borderRadius:"10px"}}>
        <CardHeader
        style={{background: postColor1, color: postColor2, width: "100%"}}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {props.author[0]}
            </Avatar>
          }
          
          title={props.title}
          subheader={props.time}
        />
        <div style={{maxHeight: "37vh", overflowY: "scroll", overflowX:"hidden", width:"100%",display:'flex',
          flexDirection:"column", alignItems:"center", justifyContent:'space-around'}}>

          <br/><br/><br/><br/><br/><br/><br/>
          {props.picture? (<CardMedia
          className={classes.media}
          image = {props.picture}
          style={{width:"360px", height:"360px"}}
          controls 
          title="Paella dish"></CardMedia>):(<></>)}

          {props.video? 
          (<ReactPlayer url={props.video} playing = {false} controls width="360px" height="360px"
          style = {{margin: "0px auto"}}></ReactPlayer>):(<></>)}
          
        
        <CardContent>
          <Typography variant="body1" color={postColor2} component="p">
            {props.text}
          </Typography>
          <Typography variant="body2" color={postColor2} component="p">
            {props.tags.length>0?(<>tags:</>):(<></>)} {props.tags.map((tags, i) => (
            <>
              <span style={{ color: 'blue', textDecoration: 'underline' }}>{tags}</span>
              <span> </span>
            </>))}
          </Typography>
        </CardContent>
        </div>

        <CardActions  justify="space-between" container spacing={50}>
          <IconButton aria-label="add to favorites" style={{float:"left"}}>
            <FavoriteIcon color = {liked? ("secondary"):("default")} onClick = {()=>{
              Setliked(!liked)
              if(liked)
              {
                handleUnlike({variables : {
                  id: props.id, 
                  user: user}})
              }
              else if(liked === false)
              {
                handleLike({variables : {
                id: props.id, 
                user: user}})
              }
                }}/>
          </IconButton>
          <p>{data? data.getPostFromId.likes.length: 0}</p>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <AddIcon />
          </IconButton>

        </CardActions>

      <Collapse style = {{maxHeight: "37vh", overflowY: "scroll",overflowX:"hidden", width:"100%"}} in={expanded} timeout="auto" unmountOnExit>
        <div style = {{paddingLeft: "10px"}}>Comments: </div>
        <div>
          <Card>
            <CardHeader avatar = 
            {<Avatar aria-label="recipe" className={classes.avatar}>{user[0]}</Avatar>}
            title = {
              <>
            <TextField style = {{borderRadius: "10", float: "left"}} placeholder="Addcomment" multiline rows={1} rowsMax={2} id={props.id} ref={sendcontrol} />
            <Button onClick={() => { sendComment() }} id={props.id}>Send</Button>
            </>}>
            </CardHeader>
          </Card>
          {data? (data.getPostFromId.comments.map(({user, text}, i)=>(
            <Card>
            <CardHeader avatar = 
            {<Avatar aria-label="recipe" className={classes.avatar}>{user[0]}</Avatar>}
            title = {text}>
            </CardHeader>
          </Card>

          ))): (<div></div>)}
        </div>
        
      </Collapse>

    </Card>
  )
}

export default Post;


// action={
//   <IconButton aria-label="settings">
//     <MoreVertIcon />
//   </IconButton>
// }