const InputMensaje = document.getElementById("mensaje")
const divMensaje = document.getElementById("mensajes")

Swal.fire({
    title: "identifiquese",
    input: "text",
    text: "Ingrese su nickname",
    inputValidator: (value) => {
        return !value && "Debe ingresar un nombre"
    },
    allowOutsideClick: false
}).then(
    (datos) => {
        const { value: nombre } = datos
        document.title = nombre;
        InputMensaje.focus()
        const socket = io()
        socket.emit("id", nombre)
        socket.on("nuevoUsuario", nombre => {
            // document.querySelector('#bienvenidaUsuario').innerHTML=`${nombre} se ha conectado!` 
            Swal.fire({
                text: `${nombre} se ha conectado...!!!`,
                toast: true,
                position: "top-right"
            })
        })

        socket.on("nuevoMensaje", (nombre, mensaje) => {
            const p = document.createElement("p")
            p.classList.add("mensaje")
            const s = document.createElement("strong")
            const sp = document.createElement("span")
            const m = document.createElement("span")

            s.textContent = nombre
            sp.textContent = " dice: "
            m.textContent = mensaje
            p.append(s, sp, m)
            divMensaje.append(p)
            divMensaje.scrollTop = divMensaje.scrollHeight
        })

        InputMensaje.addEventListener("keyup", e => {
            // console.log(e, e.target.value)
            if (e.code === "Enter" && e.target.value.trim().length > 0) {
                socket.emit("mensaje", nombre, e.target.value.trim())
                e.target.value = ""
                e.target.focus()
            }
        })
        socket.on("saleUsuario", (nombre) => {
            const p = document.createElement("p")
            p.classList.add("mensaje")
            const s = document.createElement("strong")
            const sp = document.createElement("span")

            s.textContent = nombre
            sp.textContent = " se ha desconectado del servidor "
            p.append(s, sp)
            divMensaje.append(p)
            divMensaje.scrollTop = divMensaje.scrollHeight
        })

    }) //fin del sw2

