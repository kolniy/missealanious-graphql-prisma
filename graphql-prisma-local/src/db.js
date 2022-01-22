let users = [
    {
    id:'1',
    name:'kolawole',
    email:'kolaniyi@example.com',
    age: 24
    },
    {
        id:'2',
        name:'james',
        email:'peter@example.com',
        age: 24
    },
    {
        id:'3',
        name:'peter',
        email:'jamesniyi@example.com',
        age: 24
    }
]

let posts = [
    {
        id:'10',
        title:'Some random post',
        body:'some body for the first post',
        published: true,
        author: '1'
    },
    {
        id:'11',
        title:'Some random post two',
        body:'some body for the second post',
        published: true,
        author: '2'
    },
    {
        id:'12',
        title:'Some random post three',
        body:'some body for the third post',
        published: false,
        author: '1'
    }
]

let comments = [{
  id: '22',
  text:"some comment from my the first post",
  author: '1',
  post: '10'
},
{
  id: '23',
  text:"some comment from my the second post",
  author: '1',
  post: '12'
},
{
  id: '24',
  text:"some comment from my the third post",
  author: '2',
  post: '11'
},
{
  id: '25',
  text:"some comment from my the forth post",
  author: '3',
  post: '10'
}]

const db = {
    users,
    posts,
    comments
}

export { db as default }