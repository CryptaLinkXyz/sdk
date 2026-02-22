import WebSocket, { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 8080 })

console.log("🔐 CryptaLink Relay running on ws://localhost:8080")

interface ClientMap {
  [address: string]: WebSocket
}

const clients: ClientMap = {}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString())

    if (msg.type === "register") {
      clients[msg.address] = ws
      console.log(`✅ Registered: ${msg.address}`)
    }

    if (msg.type === "message") {
      const recipient = clients[msg.to]
      if (recipient) {
        recipient.send(JSON.stringify(msg))
      }
    }
  })

  ws.on("close", () => {
    Object.keys(clients).forEach((key) => {
      if (clients[key] === ws) delete clients[key]
    })
  })
})
