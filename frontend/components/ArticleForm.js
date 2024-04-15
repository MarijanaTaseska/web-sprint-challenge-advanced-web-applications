import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  
  const {postArticle} = props
  const {currentArticleId} = props
  const {updateArticle} = props
  const {setArticles} = props
  const {currentArticle} = props
  
  
  // ✨ where are my props? Destructure them here
  
  useEffect(() => {
    if(currentArticle){
    setValues(currentArticle)
  }
    else{
      setValues(initialFormValues)
    }
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  },[currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
     evt.preventDefault()
     if(currentArticle){
      updateArticle(currentArticleId, {
        title: values.title,
        text: values.text,
        topic: values.topic 
      })
      .then(res => {
        setArticles(prevArticles => {
          const index = prevArticles.findIndex(article => article.article_id === currentArticleId);
          const updatedArticles = [...prevArticles.slice(0, index), res.article, ...prevArticles.slice(index + 1)];
          console.log(updatedArticles);
          return updatedArticles;
        });
        setValues(initialFormValues);
      })
      .catch(err => console.log(err.message))
     }else{
      postArticle(values)
      .then(res =>{
      setArticles(prevArticles => [... prevArticles,res.article])
      setValues(initialFormValues)
     }
      )
      .catch(err => console.log(err))
     }
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
  }

  const isDisabled = () => {
    return !(
      values.title.trim().length >= 1 &&
      values.text.trim().length >= 1 && 
      ['React', 'JavaScript', 'Node'].includes(values.topic)
    )
  }
  const cancelEditHandler = (evt) =>{
    evt.preventDefault()
    setValues(initialFormValues) 
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {
        currentArticle ? (
          <button onClick={cancelEditHandler}>Cancel edit</button>
        ) : null
        } 
        
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
