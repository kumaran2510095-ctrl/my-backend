const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

/* ==============================
   DATABASE CONNECTION
============================== */

mongoose.connect(process.env.MONGO_URI)

mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully")
}).on("error", (error) => {
    console.log("Connection error:", error)
})


/* ==============================
   ITEM MODEL
============================== */

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    owner: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Item = mongoose.model("Item", itemSchema)


/* ==============================
   SWAP REQUEST MODEL
============================== */

const swapSchema = new mongoose.Schema({

    requesterName: {
        type: String,
        required: true
    },

    requesterItem: {
        type: String,
        required: true
    },

    requestedItemId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Swap = mongoose.model("Swap", swapSchema)



/* ==============================
   HOME ROUTE
============================== */

app.get("/", (req, res) => {
    res.send("SwapApp Backend Running Successfully")
})
app.get("/items", (req, res) => {
  res.json([]);
});



/* ==============================
   ADD ITEM
============================== */

app.post("/addItem", async (req, res) => {

    try {

        const newItem = new Item({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            owner: req.body.owner
        })

        const savedItem = await newItem.save()

        res.json({
            message: "Item added successfully",
            item: savedItem
        })

    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

})



/* ==============================
   GET ALL ITEMS
============================== */

/* ==============================
   GET ALL ITEMS
============================== */

app.get("/items", async (req, res) => {

    console.log("Items route hit")   // ADD THIS LINE HERE

    try {

        const items = await Item.find()

        res.json(items)

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   GET SINGLE ITEM
============================== */

app.get("/item/:id", async (req, res) => {

    try {

        const item = await Item.findById(req.params.id)

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            })
        }

        res.json(item)

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   UPDATE ITEM
============================== */

app.put("/updateItem/:id", async (req, res) => {

    try {

        const updatedItem = await Item.findByIdAndUpdate(

            req.params.id,

            {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category
            },

            { new: true }

        )

        res.json({
            message: "Item updated successfully",
            item: updatedItem
        })

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   DELETE ITEM
============================== */

app.delete("/deleteItem/:id", async (req, res) => {

    try {

        await Item.findByIdAndDelete(req.params.id)

        res.json({
            message: "Item deleted successfully"
        })

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   CREATE SWAP REQUEST
============================== */

app.post("/swapRequest", async (req, res) => {

    try {

        const newSwap = new Swap({

            requesterName: req.body.requesterName,
            requesterItem: req.body.requesterItem,
            requestedItemId: req.body.requestedItemId

        })

        const savedSwap = await newSwap.save()

        res.json({
            message: "Swap request created",
            swap: savedSwap
        })

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   GET ALL SWAP REQUESTS
============================== */

app.get("/swapRequests", async (req, res) => {

    try {

        const swaps = await Swap.find()

        res.json(swaps)

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   UPDATE SWAP STATUS
============================== */

app.put("/swapStatus/:id", async (req, res) => {

    try {

        const swap = await Swap.findByIdAndUpdate(

            req.params.id,

            {
                status: req.body.status
            },

            { new: true }

        )

        res.json({
            message: "Swap status updated",
            swap: swap
        })

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

})



/* ==============================
   SERVER START
============================== */

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})