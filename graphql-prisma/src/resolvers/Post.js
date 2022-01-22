const Post = {    // this block of code establishes the relationship between post and it's author.
author(parent, args, { db }, info){ // author field of the Post custom object returns all post from a specific user
  return db.users.find(user => user.id === parent.author) // 
},
comments(parent, args, { db }, info){
  return db.comments.filter((comment) => comment.post === parent.id)
}
}

export { Post as default }