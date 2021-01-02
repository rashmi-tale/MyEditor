import React, { useState } from 'react'
import './App.css'

const App = () => {

  const [content, setcontent] = useState("")
  const [tags, settags] = useState("")
  const [file, setfile] = useState("")
  const [fileURL, setfileURL] = useState("")
  const [id, setid] = useState(null)
  const [arrayOfPost, setarrayOfPost] = useState([])

  const getFile = (e) => {
    setfile(e.target.files[0])
    const reader = new FileReader();
    reader.onload = function () {
      setfileURL(reader.result)
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  const uploadPost = () => {
    if (content === "" && tags === "" && file === "") {
      return alert("Fill at least one field")
    }
    let type
    if (file !== "") {
      type = file.type
      type = type.substring(0, 5)
    }
    if (id !== null) {
      const updatedArray = arrayOfPost.map(data => {
        if (data.id === id) {
          data.content = content
          data.resource.url = "https://posts.com/" + data.id
          data.resource.tags = tags
          data.resource.fileData = file
          data.resource.type = type
          data.resource.fileURL = fileURL
          return data
        } else {
          return data
        }
      })
      setid(null)
      setarrayOfPost(updatedArray)
    } else {
      const data = {
        id: Date.now(),
        content: content,
        resource: {
          url: "https://posts.com/" + Date.now(),
          tags: tags,
          fileData: file,
          type: type,
          fileURL: fileURL
        }
      }
      console.log(data)
      setarrayOfPost((prev) => [...prev, data])
    }
    setcontent("")
    settags("")
    setfile("")
    setfileURL("")
    document.getElementById("file").value = ""
  }


  const addTagsAndContent = (e) => {
    let string = e.target.value
    setcontent(string)
    let data = string.split(' ')
    const filterTags = data.filter(data => data.startsWith("#"))
    settags(filterTags)
  }


  const editPost = (data) => {
    setcontent(data.content)
    settags(data.resource.tags)
    setid(data.id)
    setfile(data.resource.fileData)
    setfileURL(data.resource.fileURL)
    document.getElementById("file").value = ""
  }

  return (
    <div className="container">
      <div className="editor-container">
        <div className="input-container">
          <label>What's in your mind</label>
          <textarea placeholder="your content and tags"
            rows="8" cols="50"
            value={content}
            onChange={(e) => addTagsAndContent(e)} />
        </div>
        <div>
          <input id="file" type="file" accept="image/*, video/*" onChange={(e) => getFile(e)} />
        </div>
        <button onClick={uploadPost}>Upload</button>
      </div>
      <div className="posts">
        {
          arrayOfPost.map(data => {
            return <div key={data.id} className="card">
              <div className="edit" onClick={() => editPost(data)}>✎</div>
              <div className="content">{
                data.content.split(" ").map(data => {
                  if (data.startsWith("#")) {
                    return <span style={{ color: 'blue' }}>{data} </span>
                  } else {
                    return <span>{data} </span>
                  }
                })
              }</div>
              {
                data.resource.type !== undefined ? data.resource.type === "image" ? <img src={data.resource.fileURL} alt="" /> :
                  <video width="150" height="150" controls>
                    <source src={data.resource.fileURL} type="video/mp4" />
                  </video> : null
              }
            </div>
          })
        }
      </div>
    </div>
  )
}

export default App
