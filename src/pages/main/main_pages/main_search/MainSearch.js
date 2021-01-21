import React, { useState, useEffect } from 'react'
import { useLazyQuery } from "react-apollo"
import MainNav from './../../Nav'
import { SEARCH_QUERY } from './../../../../graphql'

import "./MainSearch.css"
import Post from './Post'

const MainSearch = () =>
{
	const [searchValue, setSearchValue] = useState("")
	const [searchTitle, setSearchTitle] = useState(false)
	const [searchTag, setSearchTag] = useState(false)
	const [searchContent, setSearchContent] = useState(false)
	const [searchType, setSearchType] = useState(0)
	const [searchPosts, setSearchPosts] = useState([])
	const [getData, { loading, data }] = useLazyQuery(SEARCH_QUERY);
	useEffect(()=>{
		getData({
			variables: {text: searchValue, type: searchType, limit: 9}
		})
		if (data !== undefined) {
			setSearchPosts(data.search.map(mapPosts))
		}
	}, [searchValue, searchType, data])
	const mapPosts = (p) => {
		return <Post p={p}/>
	}
	return (
		<>
		
			<div id = 'theme-controller'>
				<p>MainSearch</p>
				<MainNav/>
			</div>
		
			<div className="context" >
				<div className="searchbar">
					<input placeholder="🔍 Search" onChange={
						(e)=>{setSearchValue(e.target.value)}}/>
					<input type="checkbox" name="title" onChange={
						(e)=>{if(e.target.checked){
								setSearchType(searchType%4+4)
							} else {
								setSearchType(searchType%4)}}}/>
					<label htmlFor="title">Title </label>
					<input type="checkbox" name="tag" onChange={
						(e)=>{if(e.target.checked){
								setSearchType(searchType-(searchType%4)+(searchType%2)+2)
							} else {
								setSearchType(searchType-(searchType%4)+(searchType%2))}}}/>
					<label htmlFor="tag">Tag </label>
					<input type="checkbox" name="content" onChange={
						(e)=>{if(e.target.checked){
								setSearchType(searchType-(searchType%2)+1)
							} else {
								setSearchType(searchType-(searchType%2))}}}/>
					<label htmlFor="content">Content</label>
				</div>
			<div style = {{maxHeight: "80vh", overflowY: "scroll"}}>
				<div>
					{	searchPosts }
				</div>
			</div>
		</div>
		</>
	);
}

export default MainSearch;
