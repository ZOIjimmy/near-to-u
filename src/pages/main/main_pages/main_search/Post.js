import React, {useState, useRef} from "react";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { Avatar } from "@material-ui/core";
import { red } from '@material-ui/core/colors';
import Collapse from '@material-ui/core/Collapse';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

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

const Post = (props) => {
  const classes = useStyles(); 
  const sendcontrol = useRef()
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  }; 
  const { p } = props;
  return (
		<div>
			<Card>
				
				<CardHeader title = {p.title} subheader = {p.author} 
				avatar = {<Avatar className = {classes.avatar}>{p.author}</Avatar>}/>
				<button onClick = {()=>{window.open(p.picture, "_blank")}} style = {{padding: "20px", color: "red"}}>image</button>
				<IconButton
				className={clsx(classes.expand, {
				[classes.expandOpen]: expanded,
				})}
				onClick={handleExpandClick}
				aria-expanded={expanded}
				aria-label="show more"
				style = {{float: "right"}}
				>
					<MoreVertIcon ></MoreVertIcon>
				</IconButton>
				<CardContent>{p.text}</CardContent>
				
				
			
			<Collapse style = {{maxHeight: "200px", overflowY: "scroll",overflowX:"hidden"}} in={expanded} timeout="auto" unmountOnExit>
        		<div>
				<div style ={{padding: "10px"}}>Comments:</div>
				{p.comments.map((c)=>
				(<Card>
					<CardHeader avatar = {<Avatar className = {classes.avatar}>{c.author}</Avatar>} title = {c.text}></CardHeader>
				</Card>)
				) }
				</div>
			</Collapse>
			</Card>
		</div>
  );
};


Post.propTypes = {
  p: PropTypes.object
};

export default Post;
