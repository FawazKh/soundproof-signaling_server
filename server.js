//Creating a server to be used with SocketIO
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
//Making a random unique ID for the room connection.
//We can replace this with username or something
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

//Create a brand new room and redirect the user to that
app.get('/', (req, res) => {
  //A random UUID gets appended to the end of our url
  //Can we somehow pass in the username/email here instead?
  res.redirect(`/${uuidV4()}`)
})

// /:room will be a dynamic parameter that we pass into the url
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

//Every time a user connects to this, we want this to run
io.on('connection', socket => {
  //When someone connects to the room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)
