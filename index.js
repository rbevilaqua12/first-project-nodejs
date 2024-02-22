const { request, response } = require ("express")
const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

const orders = []

const checkUseID = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({ message: "ID not found" })
    }
    request.orderIndex = index
    request.orderID = id
    
    next() 

}

const checkUrlMethod = (request, response, next) =>{
    const url = request.url
    const method = request.method

    console.log(url)
    console.log(method)
    
    next()
}

app.post('/order',checkUrlMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/order',checkUrlMethod, (request, response) => {

    return response.json(orders)
})

app.put('/order/:id', checkUseID,checkUrlMethod, (request, response) => {
    const id = request.orderID
    const index = request.orderIndex

    const { order, clientName, price, status } = request.body
    const updateOrder = { id, order, clientName, price, status }


    orders[index] = updateOrder
    return response.json(updateOrder)
})

app.delete('/order/:id', checkUseID,checkUrlMethod, (request, response) => {
    const index = response.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id',checkUseID,checkUrlMethod, (request, response) => {
    const index = request.orderIndex
    
    const showOrders = orders[index]
 
    return response.json(showOrders)
})

app.patch('/order/:id',checkUseID,checkUrlMethod, (request, response) => {
    const id = request.orderID
    const index = request.orderIndex
    const {status} = request.body
  
    orders[index].status = status
   
  
    return response.json(orders[index])
})





app.listen(port, () => {
    console.log('👨‍💻 Server started on port 3000')
})