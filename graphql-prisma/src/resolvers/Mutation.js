import uuid4 from "uuid/v4"

const Mutation = {
    createUser(parent, args, { db }, info){
      const emailTaken = db.users.some((user) => user.email === args.data.email)

      if(emailTaken){
        throw new Error("Email Taken")
      }
 
      const user = {
        id: uuid4(),
        ...args.data
      }

      db.users.push(user)

      return user
    },
    updateUser(parent, { id, data }, { db }, info){
        const user = db.users.find((user) => user.id === id)
        
        if(!user){
            throw new Error("User not found")
        }

        if(typeof data.email === 'string'){
            const emailTaken = db.users.some((user) => user.email === data.email)

            if(emailTaken){
                throw new Error("Email taken")
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user
    },
    deleteUser(parent, args, { db }, info){
      const userIndex = db.users.findIndex((user) => user.id === args.id)
      
      if(userIndex === -1){
        throw new Error("User not found")
      }

      const deletedUsers = db.users.splice(userIndex, 1)

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id

        if(match){
          db.comments = db.comments.filter((comment) => comment.post !== post.id)
        }

        return !match
      })

      db.comments = db.comments.filter((comment) => comment.author != args.id)

      return deletedUsers[0]

    },
    createPost(parent, args, { db, pubsub }, info){
      const userExists = db.users.some((user) => user.id === args.post.author)

      if(!userExists){
        throw new Error("User not found")
      }

      const post = {
        id: uuid4(),
        ...args.post
      }

      db.posts.push(post)
      
      if(args.post.published){
        pubsub.publish('post', {
          post : {
            mutation: 'CREATED',
            data: post
          }
        })
      }

      return post

    },
    updatePost(parent, { id, data }, { db, pubsub }, info){
        const post = db.posts.find((post) => post.id ===  id)
        const originalPost = { ...post } 

        if(!post){
            throw new Error("Post not found")
        }

        if(typeof data.title === 'string'){
            post.title = data.title
        }

        if(typeof data.body === 'string'){
            post.body = data.body
        }

        if(typeof data.published === 'boolean'){
            post.published = data.published

            // this condition checks if the post had already being published and want's to be unpublished, then the deleted event should run so the post can be removed from the UI.
            if(originalPost.published && !post.published){
              pubsub.publish("post", {
                post: {
                  mutation: "DELETED",
                  data: originalPost
                }
              })
            } else if (!originalPost.published && post.published) // this condition checks if the post has not being published and now needs to be publsihed, so the created event should run and the post can be displayed by the UI.
             {
             pubsub.publish("post", {
               post: {
                 mutation: "CREATED",
                 data: post
               }
             })
            }

        } else if (post.published) // this condition simply checks if the post was already published and the some of the post properties were update, so the update event can be fired and the UI responds accordingly.
        {  
             pubsub.publish("post", {
               post: {
                 mutation: "UPDATED",
                 data: post
               }
             })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if(postIndex === -1){
          throw new Error("Post not found")
        } 

        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if(post.published){
          pubsub.publish('post', {
            post: {
            mutation: "DELETED",
            data: post
          }
          })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info){
      const userExists = db.users.some((user) => user.id === args.comment.author)
      if(!userExists){
        throw new Error("User not found")
      }

      const validPost = db.posts.find((post) => post.id === args.comment.post)
      if(!validPost){
        throw new Error("Post not found")
      }
      if(validPost.published === false){
        throw new Error("Cannot comment on this post")
      }
      const comment = {
        id: uuid4(),
        ...args.comment
      }

      db.comments.push(comment)

      pubsub.publish(`comment ${args.comment.post}`, { 
       comment: {
        mutation: "CREATED",
        data : comment 
       }
      })

      return comment
    },
    updateComment(parent, { id, data }, { db, pubsub }, info){
        const comment = db.comments.find((comment) => comment.id === id)

        if(!comment){
            throw new Error("comment not found")
        }

        if(typeof data.text === 'string'){
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
          comment: {
            mutation: "UPDATED",
            data : comment 
           }
        })

        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if(commentIndex === -1){
          throw new Error("Comment not found")
        }

        const [deletedComments] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComments.post}`, {
          comment: {
            mutation: "DELETED",
            data : deletedComments 
           }
        })

        return deletedComments
    }
  }

  export { Mutation as default }