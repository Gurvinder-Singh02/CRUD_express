const express = require('express');
const path = require('path');
const port = 8080;
const views = path.join(__dirname, 'views');
const public = path.join(__dirname, 'public');

const { v4: uuidv4 } = require('uuid');
uuidv4(); 

const app = express();

app.set('view engine', 'ejs');
app.set('views', views);

app.use(express.static(public));
app.use(express.urlencoded({ extended: true }))

const methodOveride = require('method-override');

// override with POST having ?_method=DELETE
app.use(methodOveride('_method'))

let posts = [
    {
        id: uuidv4(),
        username: "gurvinder singh",
        content: " i love coding",
        likes : 5
    },
    {
        id: uuidv4(),
        username: "prah singh",
        content: " i hate coding",
        likes : 10
        
    },
    {
        id: uuidv4(),
        username: "minal",
        content: " i love networking ",
        likes : 51
    },
    {
        id: uuidv4(),
        username: "jazzy",
        content: " i love gym",
        likes : 25
    }
]

app.get('/', (req, res) => {
    res.send("server is working well")
})

app.get('/posts', (req, res) => {
    res.render('index.ejs', { posts: posts })
})

app.get('/posts/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/posts', (req, res) => {
    console.dir(req.body);
    let { username, content } = req.body;
    let newPost = {
        id: uuidv4(),
        username: username,
        content: content
    }
    posts.push(newPost)
    console.log(newPost)
    // res.send('post request wrking')
    res.redirect('./posts')
})

app.get('/posts/:id', (req, res) => {

    let { id } = req.params;
    let post = posts.find((p) => (id == p.id))
    console.log("view", post)
    res.render('show.ejs', { post })

})

app.patch('/posts/:id/', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => (id == p.id))
    let newContent = req.body.content;
    post.content = newContent;
    console.log("patched post ", post)
    res.redirect("/posts")
})

app.get('/posts/:id/edit', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => (id == p.id))
    console.log("get edit ", post)
    res.render("edit.ejs", { post })
})


app.delete('/posts/:id/delete', (req, res) => {
    let { id } = req.params;
    let updatedPosts = posts.filter((post)=>(post.id != id))
    posts = updatedPosts;
    console.log("Deleted post ", updatedPosts)
    res.redirect('/posts')    
})

app.patch('/posts/:id/likes', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => (id == p.id))
    post.likes++;
    console.log("patched  likes ", post.likes) 
    res.redirect('/posts')   
})

app.listen(port, () => {
    console.log("listening to port 8080")
})