const express = require('express');
const fs = require('fs');

const PORT = 3000;
const app = express();


app.use(
    express.json()
)

const DB_PATH = './db.json';
const db = require(DB_PATH);


app.get('/users', function(req, res){
    console.log('req', req);
    res.json(db.users);
});

app.get('/users/:userID', function(req, res){
    const {userID} = req.params
    const user = db.users.find((user)=>user.id == userID)
    if(!user.id){
        res.status(404).send('yoxdu')
    }

    res.status(200).send(user)
    // console.log(user)
});

app.post('/users', function(req, res){
    const new_user = req.body
    db.users.push(new_user);
    console.log(new_user)
    fs.writeFileSync(DB_PATH, JSON.stringify(db));
    res.status(201).json(new_user);
});

app.put('/users/:userID', updateUserPUT);
function updateUserPUT(req, res){
    const {userID} = req.params;
    const userIndex = db.users.findIndex(u=> `${u.id}` === userID);
    if(userIndex !== -1){
        db.users[userIndex] = {
            ...req.body,
            id: db.users[userIndex].id
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(db))
        res.json(db.users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}


app.patch('/users/:userID', updateUser)
function updateUser(req, res){
    const {userID} = req.params;
    const userIndex = db.users.findIndex(u=> `${u.id}` === userID);
    if(userIndex !== -1){
        db.users[userIndex] = {
            ...db.users[userIndex],
            ...req.body,
            id: db.users[userIndex].id
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(db))
        res.json(db.users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}






app.listen(PORT, ()=>{console.log('port', PORT)});