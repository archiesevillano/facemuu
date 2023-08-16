import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function App() {

  const users = [
    {
      username: "Lord Voldemort",
      image: "https://yt3.ggpht.com/a/AATXAJzGRFf-wWUwwcHgRIAx3T6wl3NDgwgViC2JNA=s900-c-k-c0xffffffff-no-rj-mo",
    },
    {
      username: "Herminay Grinder",
      image: "https://www.pixel-creation.com/wp-content/uploads/hermione-granger-in-harry-potter-is-she-white-800x800.jpg",
    },
    {
      username: "Happy Patter",
      image: "http://images6.fanpop.com/image/photos/33900000/Harry-Potter-harry-potter-the-boy-who-lived-and-much-more-33972788-1200-1200.jpg",
    },
  ]

  const commentField = useRef(null);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [userImage, setImage] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getList();
  }, [comment])

  const getList = () => {
    const items = [];

    axios.get("http://localhost:3010/comments").then(commentList => {
      commentList.data.map((data, index) => {
        items.push(
          <div key={index + 1} className="comment">
            <div className="commentator-image">
              <img src={data.image} />
            </div>
            <div className="comment-content">
              <p className='commentator'>{data.username}</p>
              <p className='comment-text'>{data.comment}</p>

              <ul className="comment-btns">
                <li>Like</li>
                <li>Reply</li>
                <li onClick={() => deleteComment(data.commentID)}>Delete</li>
                <li>{data.timestamp}</li>
              </ul>

            </div>
          </div>
        );
      })
      setComments(items);
    }
    );
  }

  const addComment = async () => {
    if (comment && username !== "") {

      const request = {
        user: username,
        text: comment,
        img: userImage,
      }

      try {
        const response = await axios.post("http://localhost:3010/comments/new", request);
        if (response.data) {
          setComment("");
          commentField.current.value = ""; //clear comment field after adding a comment
        }
      } catch (error) {
        alert(error);
      }

    }
    else {
      if (username === "") {
        alert("Please select user first!");
      }
      else {
        alert("Please enter your comment first!");
      }
    }

  }

  const pickUser = e => {
    users.forEach(item => {
      if (item.username === e.target.value) {
        setUsername(item.username);
        setImage(item.image);
      }
    })
  }

  const deleteComment = id => {
    axios.delete(`http://localhost:3010/comments/delete/${id}`).then(
      response => response.data === true ? getList() : alert("Unable to delete comment")
    )
  }

  const setUserList = () => {
    const u_values = [];

    users.map((user, index) => u_values.push(<option key={index}>{user.username}</option>));

    return u_values;
  }

  return (
    <div className="App">
      <header className="comment-header">
        <p>Facemuu</p>
      </header>
      <main>
        <div className='switch-user-box'>
          <select onChange={pickUser}>
            <option selected disabled>Choose an account</option>
            {
              setUserList()
            }
          </select>
          {username && <p className='user-label'>{`Comment below as ${username}`}</p>}
        </div>
        <div className="user-post">
          <header>
            <div className="header-content left">
              <img src="https://www.pixel-creation.com/wp-content/uploads/hermione-granger-in-harry-potter-is-she-white-800x800.jpg" className="user-image" />
              <p>Herminay Grinder</p>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="header-content right">
              <i className="fa-solid fa-ellipsis"></i>
            </div>
          </header>
          <div className="post-image">
            <img src="http://2.bp.blogspot.com/-qIPoxUjm908/T0fY8QaeqXI/AAAAAAAAU88/piz3nm7cFFc/s1600/harry-potter_04.jpg" className="user-post-image" />
          </div>
          <div className="post-stats">
            <div className="stats">
              <p>660,894 likes</p>
              <p>September 23</p>
            </div>
            <div className="button-collection">
              <button className="likeBtn"><i className="fa-regular fa-heart"></i>Like</button>
              <button className="commentBtn"><i className="fa-regular fa-comment"></i>Comment</button>
              <button className="shareBtn"><i className="fa-regular fa-share-from-square"></i>Share</button>
            </div>
          </div>
          <div className="comment-container">
            <div className="upper">
              <input type="text" ref={commentField} className="comment-content" placeholder="Add a comment..." onChange={e => setComment(e.target.value)} />
              <button type="button" onClick={addComment}>Comment</button>
            </div>
            <div className="comments">
              {comments}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


export default App;
