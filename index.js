import express from 'express'
import mysql from 'mysql2/promise'
import { Myconfig } from './configDatebase.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

let connection

try {
    connection = mysql.createPool(Myconfig)
    await connection.execute('SELECT 1')
    console.log('Database is Successfuly Connected')
} catch (error) {
    console.log('HIBA!', error);
}

app.get('/todos', async (req, res) => {
    try {
        const sql ='select * from todo order by timestamp'
        const [rows, fields] = await connection.execute(sql)
        console.log(rows, fields)
        res.status(200).send(rows)
    } catch (error) {
        console.log('ERROR!', error);
    }
})

app.post('/todos', async (req, res) => {
    const {task} =req.body
    console.log(task)
    try {
        const sql ='INSERT INTO todo (task) VALUES (?)'
        console.log(sql)
        await connection.execute(sql, [task])
        res.status(200).json({msg: 'Successfuly Added'})
    } catch (error) {
        console.log('ERROR!', error);
    }
})

app.patch('/todos/:id', async (req, res) =>{
    const {id} = req.params
    try {
        const sql ='UPDATE todo SET complete=NOT complete WHERE id=?'
        await connection.execute(sql, [+id])
        res.status(200).json({msg: 'Successfuly Modified'})
    } catch (error) {
        console.log('ERROR!', error);
    }

})

app.delete('/todos/:id', async (req, res)=>{
    const {id} = req.params
    try {
        const sql ='DELETE FROM todo WHERE id=?'
        await connection.execute(sql, [+id])
        res.status(200).json({msg: 'Successfuly Deleted!'})
    } catch (error) {
        console.log('ERROR!', error);
    }
})

//Login

app.post('/todos/login',(req, res)=> {
    const {username, password} = req.body
    if(username == process.env.LOGIN_USERNAME && password == process.env.LOGIN_PASSWORD){
        res.json({success: true, msg: "Successfully Logged In"})
    }else{
        res.json({success: false, msg: "Invalid Username or password"})
    }
})

//INSERT INTO `todoclient`.`todo` (`task`) VALUES ('asd');


app.use((req, res)=>{
    res.send("Oldal nem elerhető")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
