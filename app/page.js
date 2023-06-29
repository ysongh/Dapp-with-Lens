'use client'
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [profiles, setProfiles] = useState([])
  const [recipient, setRecipient] = useState("")
  const [flowRate, setFlowRate] = useState("")
  const [flowRateDisplay, setFlowRateDisplay] = useState("")
  const [topProfiles, setTopProfiles] = useState([])

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

  async function fetchFollowers(account) {
    try {
      const profileId = await fetchProfileId(account)
      const response = await client.query({
        query: getFollowers,
        variables: {
          profileId
        }
      })
      console.log(response)
      let profileData = response.data.followers.items.filter(profile => {
        if (profile.wallet.defaultProfile) {
          return true
        } else {
          return false
        }
      })
      profileData = profileData.map(p => {
        return {
          ...p.wallet.defaultProfile,
          address: p.wallet.address
        }
      }).filter(p => p.picture)
      console.log('profileData:', profileData)
      setProfiles(profileData)
    } catch (err) {
      console.log('error getting followers:', err)
    }
  }

  async function fetchTopFollowers(account) {
    try {
      const profileId = await fetchProfileId(account)
      const data = await fetch('/api/lens-bigquery', {
        method: "POST",
        body: JSON.stringify({
          profileId
        })
      })
      const json = await data.json()

      if (json.data) {
        setTopProfiles(json.data)
      }
    } catch (err) {
      console.log('error fetching top followers...', err)
    }
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value))
  }

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value))
    let newFlowRateDisplay = calculateFlowRate(e.target.value)
    if (newFlowRateDisplay) {
      setFlowRateDisplay(newFlowRateDisplay.toString())
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
      <div className="flex flex-col items-start">
        <input
          value={recipient}
          placeholder="Enter recipient address"
          onChange={handleRecipientChange}
          className='text-black py-1 px-2 mb-2 w-72'
        />
        <input
          value={flowRate}
          onChange={handleFlowRateChange}
          placeholder="Enter a flowRate in wei/second"
          className='text-black py-1  px-2 w-72'
        />
        <button
          className="px-8 py-2 rounded-3xl bg-white text-black mt-2"
          onClick={() => {
            createNewFlow(recipient, flowRate)
          }}
        >
          Click to Create Your Stream
        </button>
        <a className="mt-4 text-green-400" href="https://app.superfluid.finance/" target="_blank" rel='no-opener'>View Superfluid Dashboard</a>
      </div>
      <div className="border-green-400 border p-4 mt-3">
        <p>Your flow will be equal to:</p>
        <p>
          <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> Maticx/month
        </p>
      </div>
      {
        profiles.map((profile, index) => (
          <div key={index} className="
            p-3 border-white border mt-4 border-slate-400	cursor-pointer
          "
          onClick={() => setRecipient(profile.address)}
          >
            {
              profile.picture?.original?.url && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture?.original?.url)}
                />
              )
            }
            {
              profile.picture?.url && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture.url)}
                />
              )
            }
            {
              profile.picture?.uri && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture.uri)}
                />
              )
            }
            <p className="mt-2 text-xl text-fuchsia-400">@{profile.handle}</p>
            <p>{profile.name}</p>
          </div>
        ))
      }
    </div>
  )
}
