import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

const PORT = 8000

const app = express()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(import.meta.dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(import.meta.dirname, 'public')))

app.get('/', (req, res) => {

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('home')
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

const io = new Server(server)
let usuarios = [];

io.on("connection", socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`)
    socket.on("id", nombre => {
        usuarios.push({ id: socket.id, nombre })
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", (nombre, mensaje) => {

        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", () => {
        const usuario = usuarios.find(u => u.id === socket.id)

        if (usuarios) {
            io.emit("saleUsuario", usuario.nombre)
            usuarios = usuarios.filter(u => u.id !== socket.id)
        }
    })
})