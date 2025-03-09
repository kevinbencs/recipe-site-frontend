import {useRef, useState } from 'react'
import CommentShow from './comment';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { comments } from '../types/apitype';
import useSWR from 'swr';
import { useLogged } from './userProvider';

const fetcher = async (url: string): Promise<comments[]> => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error();
    error.cause = await res.json().then(data => data.error);
    console.error(error.cause)

    throw error;
  }

  return await res.json()
}


export default function CommemtContainer(props: { recipeId: number, hideComments: string, }) {
  const [Comment, setComment] = useState<string>('');
  const commentValue = useRef<HTMLParagraphElement>(null);
  const { userName } = useLogged()

  const { data, error, isLoading, mutate } = useSWR(`/api/comments/${props.recipeId}`, fetcher)

  const sendComment = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (Comment !== '') {
      try {
        if (data) mutate([...data, { name: userName, comment: Comment, _id: uuidv4(), canChange: 'true' }],false)
        const res = await fetch(`/sendcomment/${props.recipeId}`, {
          method: "POST",
          headers: {
            "Accept": "aplication/json, text/plain",
            "Content-type": "application/json"
          },
          body: JSON.stringify({ comment: Comment })
        });

        if (res.status !== 204) {
          const resJson = await res.json();
          if (resJson.error) console.error(resJson.error);
        }
        mutate()
      } catch (error) {
        console.error(error)
      }

    }

    setComment('');
    if (commentValue.current !== null) commentValue.current.innerText = '';
  };


  const handleComment = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    setComment(e.target.innerText);
  };

  return (
    <div className={`comment-section ${props.hideComments}`}>
      <h2>Comments</h2>
      {userName !== '' && <form action="" method='post' onSubmit={sendComment} className='comment-form'>
        <p contentEditable="true" onInput={handleComment} ref={commentValue} tabIndex={0}></p>
        <input type="submit" value="Send" />
      </form>}

      <div className='comment-container-container'>
        {error && <div>{error}</div>}
        {isLoading && <div className='loading-content'>...Loading</div>}
        {(data !== undefined && data.length !== 0) &&
          data.map((comment: comments) => <CommentShow recipeId={props.recipeId} comment={comment.comment}
            name={comment.name}
            canChange={comment.canChange}
            id={comment._id}
            mutate={mutate}
            data={data}
            key={uuidv4()} />)}
        {(data === undefined || data.length === 0) && <div className='no-comment'>No comments</div>}

      </div>
    </div>
  )
}
