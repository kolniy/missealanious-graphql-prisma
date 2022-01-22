const Query =  {
    users(parent, { query }, { db }, info) {
        if(query){
            return db.users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
        } else {
           return db.users
        }
    },
    posts(parent, { query } , { db }, info){
        if(!query){
           return db.posts
        }
        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(query)
            const isBodyMatch = post.body.toLowerCase().includes(query)
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, { db }, info){
       return db.comments
    },
   add(parent, args, ctx, info) {
     if (args.numbers.length === 0) return 0;
     return args.numbers.reduce((acc, curr) => acc + curr);
   },
   me() {
     return {
       id: "1234jgj",
       name: "mike",
       email: "mike@example.com",
       age: 23, 
     };
   },
   post() {   
     return {  
       id: "7483939jf",
       title: "Beginning Graphql the right way",
       body: "Some think graphql is hard, but i'll say it's really easy",
       published: true,
     };
   },
 }

 export { Query as default }