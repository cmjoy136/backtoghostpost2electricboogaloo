import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from  "react-router-dom";
import { Form, Input, Button, Radio } from 'antd'
import Feed from "./Feed"

const API_POSTS = "http://localhost:8000/posts/"

class App extends Component {
  state = {
    content: "",
    boast_roast: false,
    posts: []
  }

  
  componentDidMount() {
   this.getPosts()
  }

  getPosts = () =>{
    fetch(API_POSTS)
    .then(results => {
      return results.json();
    }).then(data => {
        this.setState({posts: data});
    })
  }
  handlefilterboast = () => {
    fetch(API_POSTS)
    .then(res => {
      return res.json();
    }).then(data => {
        let boasts = data.filter(boast => boast.boast_roast === true)
        console.log(boasts)
        this.setState({posts: boasts})
    })
  }
  
  handlefilterroast = () => {
    fetch(API_POSTS)
    .then(res => {
      return res.json();
    }).then(data => {
        let roasts = data.filter(roast => roast.boast_roast === false)
        this.setState({posts: roasts})
    })
  }
 
  upvote = (e, id) => {
  //const API_UPVOTE = API_POSTS + `${post.id}/`
  // let id  = payload something something
    fetch(`${API_POSTS}${id}/upvote/`)
    let vote = e.target.parentNode.childNodes[2].innerHTML
    vote = parseInt(vote, 10)
    vote += 1
    e.target.parentNode.childNodes[2].innerHTML = vote
  }

  downvote = (e, id) =>  {
    //const API_DOWNVOTE = API_POSTS + `${post.id}/`
    fetch(`${API_POSTS}${id}/downvote/`)
    let vote = e.target.parentNode.childNodes[4].innerHTML
    vote = parseInt(vote, 10)
    vote += 1
    e.target.parentNode.childNodes[4].innerHTML = vote
  }

  filterUpvote = () => {
    // filter by upvote
    fetch(`${API_POSTS}filter_upvotes/`)
      .then(results => {
      return results.json();
    }).then(data => {
        this.setState({posts: data});
    })
  }

  filterDownvote = () => {
    // filter by downvote
    fetch(`${API_POSTS}filter_downvotes/`)
      .then(results => {
      return results.json();
    }).then(data => {
        this.setState({posts: data});
    })
  } 

  handleCreate = (boast_roast, content) => {
    let payload = JSON.stringify({
      boast_roast: boast_roast,
      content: content
    })
    fetch(API_POSTS, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: payload
    }).then(res=> {
      console.log(res.json())
    }).then(data => {
      console.log(data)
      this.getPosts()
    })
    .catch(error => {
      console.log(error)
    })
  }
  
  handlePost = e => {
    e.preventDefault();
    let content = e.target.children[2].value 
    let boast_roast= e.target.children[1].checked
    this.setState({
      boast_roast: boast_roast,
      content: content
    })
    this.handleCreate(boast_roast, content)
  }
 
 
  render() {
    return (
      <section>
        <header className="header">
          <h1>GhostPost</h1>
          <button onClick={this.getPosts}>Home</button>
          <button onClick={this.handlefilterboast}>Boasts</button>
          <button onClick={this.handlefilterroast}>Roasts</button>
          <button onClick={this.filterUpvote}>Filter by Upvotes</button>
          <button onClick={this.filterDownvote}>Filter by Downvotes</button>
        </header>
      <div>
        {this.state.posts.map(post => (
          <div key={post.id}>
          <p> this is a {post.boast_roast === true ? 'Boast' : 'Roast'}</p>
          <p>{post.content}</p>
          <p>{post.upvote}</p>
          <button onClick={e => this.upvote(e, post.id)}>Upvote</button> 
          <p>{post.downvote}</p>
          <button onClick={e => this.downvote(e, post.id)}>Downvote</button>
          <p>{post.datetime}</p>
          <br/>
      </div>
        ))}
      </div>
      <div>
      <form onSubmit={this.handlePost}>
        <label>Boast</label>
        <input type='checkbox' value='boast'/>
        <input type='text'/>
        <input type='submit' value='Submit'/>
      </form>
      </div>
      </section>
    )
  }
}

export default App