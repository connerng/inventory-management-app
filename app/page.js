'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { query, collection, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name:  doc.id,
        ...doc.data(),
      })
    })
    inventoryList.sort()
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity <= 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()

  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const decreaseItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity > 1) {
        await setDoc(docRef, {quantity: quantity - 1})
      } else {
        await setDoc(docRef, {quantity: 0})
      }
    }

    await updateInventory()
  }

  const increaseItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }

    await updateInventory()
  }

  const searchFor = async (item) => {
    if (item == '') {
      await updateInventory()
    } else {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const searchList = []
      docs.forEach((doc)=>{
        if (doc.id.toLowerCase() == item.toLowerCase()) {
          searchList.push({
            name:  doc.id,
            ...doc.data(),
          })
        }
        searchList.sort()
        setInventory(searchList)
    })
  }
}

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      bgcolor="#d0f6fc"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onOpen={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left = "50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxshadow={24}
          p={4}
          display="flex"
          flexdirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
            <TextField
              variant="outlined"
              width={300}
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" size="small" width="30px" height="30px" onClick={() => {
              if (itemName.length > 0) {
                addItem(itemName)
                setItemName('')
                handleClose()
              }
              handleClose()
            }}
            >
              Add
            </Button>
        </Box>
      </Modal>
      
      <Typography variant="h2" textAlign="center" padding={0}>Inventory Manager</Typography>
      <Button variant="contained" color="success" onClick={() => {
          handleOpen()
        }}>
          Add New Item
      </Button>
      <Box width="300px" bgcolor="#d0f6fc" display="flex" alignItems="center" justifyContent="center" gap={2}>
        <TextField 
            variant="filled"
            width="200px"
            bgcolor="white"
            size="small"
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }}
        />
        <Button variant="contained" onClick={() => {
          searchFor(itemName)
        }}>Search</Button>
        <Button variant="contained" onClick={() => {
          searchFor('')
        }}>Clear</Button>
      </Box>
        

      <Box border="1px solid #333" bgcolor="white">
        <Box
          width="900px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="left"
        >
          <Box width="300px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4" color="#333">Name</Typography>
          </Box>
          <Box width="300px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4" color="#333">Quantity</Typography>
          </Box>
          <Box width="300px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4" color="#333">Edit</Typography>
          </Box>
        </Box>
      <Stack
        width="900px"
        height="300px"
        spacing={1}
        overflow="auto"
      >
        {
          inventory.map(({name, quantity}) => (
            <Box
            key={name}
            width="100%"
            minHeight="100px"
            display="flex"
            aiignItems="center"
            justifyContent="left"
            bgcolor="#f0f0f0"
            >
              <Box width="300px" display="flex" alignContent="center" justifyContent="center" padding={4}>
                <Typography
                  variant="h5"
                  color="333"
                  textAlign="center"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Box>
              <Box width="300px" display="flex" alignContent="center" justifyContent="center" padding={4}>
                <Typography
                  variant="h5"
                  color="333"
                  textAlign="center"
                >
                  {quantity}
                </Typography>
              </Box>
              <Box width="300px" display="flex" alignContent="center" justifyContent="center" gap={2} padding={4}>
                <Button variant="contained" size="small" onClick={() => {
                  increaseItem(name)
                }}>
                  +
                </Button>
                <Button variant="contained" size="small" onClick={() => {
                  decreaseItem(name)
                }}>
                  -
                </Button>
                <Button variant="contained" size="small" onClick={() => {
                  removeItem(name)
                }}>
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  )
}
