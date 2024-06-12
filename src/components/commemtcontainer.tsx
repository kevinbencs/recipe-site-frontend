import { useEffect, useRef, useState } from 'react'
import CommentShow from './comment';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { comments } from '../types/apitype';


export default function CommemtContainer(props: { recipeId: number, hideComments: string, account: string }) {
  const [Comment, setComment] = useState<string>('');
  const commentValue = useRef<HTMLParagraphElement>(null);
  const [oldComments, setOldCmments] = useState<comments[]>([]);
  const [deleteComment, setDeleteComment] = useState<string>('');
  const [editComment, setEditComment] = useState<string>('');
  const [newComment, setNewComment] = useState<String>('');

  const sendComment = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (Comment !== '') {
      await fetch('/sendcomment', {
        method: "POST",
        headers: {
          "Accept": "aplication/json, text/plain",
          "Content-type": "application/json"
        },
        body: JSON.stringify({ comment: Comment, recipeId: props.recipeId })
      });
    }
    setNewComment(Comment);
    setComment('');
    if (commentValue.current !== null) commentValue.current.innerText = '';
  };


  useEffect(() => {
    setOldCmments([]);
    const getComment = async () => {
      fetch('/getcomment', {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain",
          "Content": "apllication/json"
        },
        body: JSON.stringify({ recipeId: props.recipeId })
      })
        .then(data => data.json())
        .then(res => {
          if (res.length !== 0) setOldCmments(res as unknown as comments[]);
        });
    }
    getComment();
  }, [props.recipeId, deleteComment, editComment, newComment]);

  const handleComment = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    setComment(e.target.innerText);
  };

  return (
    <div className={`comment-section ${props.hideComments}`}>
      <h3>Comments</h3>
      {props.account !== 'undefined' && <form action="" method='post' onSubmit={sendComment} className='comment-form'>
        <p contentEditable="true" onInput={handleComment} ref={commentValue} tabIndex={0}></p>
        <input type="submit" value="Send" />
      </form>}

      <div className='comment-container-container'>
        {oldComments.length !== 0 &&
          oldComments.map((comment: comments) => <CommentShow comment={comment.comment}
            name={comment.name}
            canChange={comment.canChange}
            id={comment.id}
            setDeleteComment={setDeleteComment}
            setEditComment={setEditComment}
            key={uuidv4()} />)}
        {oldComments.length === 0 && <div className='no-comment'>No comments</div>}

      </div>
    </div>
  )
}
