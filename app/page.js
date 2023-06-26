'use client'
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("")

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log("Found an authorized account:", account)
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }


  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
      fetchFollowers(accounts[0])
      fetchTopFollowers(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-20'>
      <h1 className='text-5xl'>My Lens App</h1>
      {
        !currentAccount && (
          <button  onClick={connectWallet}
            className="mb-3 px-8 py-2 rounded-3xl bg-white text-black mt-2"
          >
            Connect Wallet
          </button>
        )
      }
      {
        currentAccount && (
          <p className="mt-3 mb-3">
            { currentAccount }
          </p>
        )
      }
    </div>
  )
}
