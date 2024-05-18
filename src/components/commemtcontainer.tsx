import React, { useEffect } from 'react'
import Comment from './comment'

export default function CommemtContainer(props:{recipeId: number}) {
  useEffect( () => {
    async () =>{
      fetch('/comment',{
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain",
          "Content": "apllication/json"
        },
      });
    }
    
  },[]);
  return (
    <div>
        <h3></h3>
        <div>
          <Comment/>
        </div>
    </div>
  )
}
