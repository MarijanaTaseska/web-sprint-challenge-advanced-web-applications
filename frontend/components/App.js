import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'



const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState()
  const [isEditing, setIsEditing] = useState(false)
  

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
 
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage("Goodbye!")
    navigate('/')
  }
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(!spinnerOn)
    axios.post(loginUrl, {username:username, password:password})
     .then(res =>{ 
      const token = res.data.token
      setMessage(res.data.message) 
      localStorage.setItem('token', token)
      setSpinnerOn(spinnerOn)
      navigate('/articles')
      }
    ).catch(err => console.log(err.response))
    setSpinnerOn(false)
  }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  
  const token = {headers:{Authorization:localStorage.getItem('token')}}

  const getArticles = async () => {
    try{
        setMessage('')
        setSpinnerOn(!spinnerOn)
     const {data} = await axios.get(articlesUrl,token)
     setArticles(data.articles)
     setMessage(data.message)
     setSpinnerOn(spinnerOn)
      }catch (error){
        if(error?.response?.status === 401 ) logout()
      }
    }
    
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  

  const postArticle =async article => {
    try{
     const {data} = await axios.post(articlesUrl,article,token) 
     setCurrentArticleId(data.article_id)
     setMessage(data.message)
     return data
      }catch (error){
        console.error(error)
      }
    }
   
  const updateArticle =async ( article_id, article ) => { 
    try{
     const {data} =await axios.put(`${articlesUrl}/${article_id}`,{
     title:article.title,
     text:article.text,
     topic:article.topic,
    },token)
     setMessage(data.message)
     return data
    }catch(error){
     console.error(error)
    }
   }
  

  const deleteArticle = article_id => {
    axios.delete(`${articlesUrl}/${article_id}`,token)
    .then(res =>
      { setMessage(res.data.message)
       setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id))}
       )
    .catch(err => console.error(err))
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
               postArticle={postArticle}
               currentArticleId={currentArticleId}
               updateArticle={updateArticle}
               setArticles={setArticles}
               currentArticle={currentArticle}
               setIsEditing={setIsEditing}
               isEditing={isEditing}
               setCurrentArticleId={setCurrentArticleId}
               />
               <Articles
             getArticles={getArticles}
             articles={articles}
             deleteArticle={deleteArticle}
             setCurrentArticleId={setCurrentArticleId}
             setCurrentArticle={setCurrentArticle}
             setIsEditing={setIsEditing}
             isEditing={isEditing}
             /> 
              </> 
           }/>
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
