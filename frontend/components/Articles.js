import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles(props) {
  // ✨ where are my props? Destructure them here
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const {getArticles} = props
  const {articles} = props
  const {deleteArticle} = props
  const {setCurrentArticleId} = props
  const {setCurrentArticle} = props
  

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/')
    }else {
     getArticles(token)
    }
  },[])

  const editHandler = (id,article) => {
    setCurrentArticle(article)
    setCurrentArticleId(id)
    setIsEditing(true)
  }

  const deleteHandler = (id) => {
    deleteArticle(id)
  }
    
  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={isEditing} onClick={()=>editHandler(art.article_id,art)}>Edit</button>
                  <button disabled={isEditing} onClick={()=>deleteHandler(art.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
