const { request } = require('express');
const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Tasks" });
});

app.use('*/tasks:id', (req, res, next) => {
    const paramId = req.params.id;
    if (paramId) {
        const task = tasks.find(b => b.id == paramId)
        if (!task) {
            return res.status(404).json({
                error: `Aufgabe nicht gefunden.`
            });
        }
        req.task = task;
    }
    next()
})

app.use(session({
    secret: 'm295',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

let tasks = [{
    id: 1,
    title: "Abfall entsorgen",
    startdate: "22-mai-2022",
    enddate: "25-mai-2022"
},
{
    id: 2,
    title: "Abwaschmaschine ausräumen",
    startdate: "12-juni-2022",
    enddate: "14-juni-2022"
},
{
    id: 3,
    title: "Hund füttern",
    startdate: "08-juli-2022",
    enddate: "09-juli-2022"
}
];

//Endpoints Tasks
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
    if (req.session.user) {
        const id = Number(req.params.id);
        const task = tasks.filter(task => task.id === id)
        if (!task) {
            res.status(404).send();
            return
        }
        res.send(task);
    }
    else {
        res.send(401).send();
    }
});

app.post('/tasks', (req, res) => {
    if (req.body.title && req.body.startdate && req.body.enddate) {
        tasks.push({ id: tasks[tasks.length - 1].id++, title: req.body.title, startdate: req.body.startdate, enddate: req.body.enddate })
        res.status(201).send();
    }
    else {
        res.status(422).send()
    }
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.status(200).send();
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.filter(task => task.id === id)[
        0
    ]
    if (req.body.title && req.body.startdate && req.body.enddate) {
        task.title = req.body.title
        task.startdate = req.body.startdate
        task.enddate = req.body.enddate
        res.send(task);
    }
    else {
        res.status(422).send()
    }
});

//LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body
    if (email == "m295" && password == "m295") {
        req.session.user = email;
        res.status(200).send()
    }
    else {
        res.status(401).send()
    }
});

app.get('/verify', (req, res) => {
    if (req.session.user)
        res.status(200).send()
    else res.status(401).send()
});

app.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
