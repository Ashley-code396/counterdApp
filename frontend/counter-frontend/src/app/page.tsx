"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit"
import {  useSuiClientQuery } from '@mysten/dapp-kit'
import {
  DEVNET_COUNTER_PACKAGE_ID,
  TESTNET_COUNTER_PACKAGE_ID,
  MAINNET_COUNTER_PACKAGE_ID,
} from "../constants" 

// Simple network detection (replace with a more robust solution if needed)
function getNetwork() {
  // You can enhance this logic based on your app's network selection UI
  if (typeof window !== "undefined") {
    const search = window.location.search
    if (search.includes("network=devnet")) return "devnet"
    if (search.includes("network=testnet")) return "testnet"
    if (search.includes("network=mainnet")) return "mainnet"
  }
  // Default to devnet
  return "devnet"
}

function getPackageIdForNetwork(network: string) {
  if (network === "devnet") return DEVNET_COUNTER_PACKAGE_ID
  if (network === "testnet") return TESTNET_COUNTER_PACKAGE_ID
  if (network === "mainnet") return MAINNET_COUNTER_PACKAGE_ID
  return DEVNET_COUNTER_PACKAGE_ID
}

export default function CounterApp() {
  const currentAccount = useCurrentAccount()
  const network = getNetwork()
  const PACKAGE_ID = getPackageIdForNetwork(network)
  const [counter, setCounter] = useState({ id: PACKAGE_ID, count: 0 })
  const [operationLoading, setOperationLoading] = useState<string | null>(null)

  // Replace this with your real contract call using PACKAGE_ID
  const executeTransaction = async (operation: string, updateFn: () => void) => {
    if (!currentAccount) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first",
      })
      return
    }
    setOperationLoading(operation)
    try {
      // TODO: Use PACKAGE_ID in your contract call here
      await new Promise((resolve) => setTimeout(resolve, 1200))
      updateFn()
      toast.success("Transaction Successful", {
        description: `Counter ${operation} completed`,
      })
    } catch (error) {
      toast.error("Transaction Failed", {
        description: `Failed to ${operation} counter`,
      })
    } finally {
      setOperationLoading(null)
    }
  }

  const incrementCounter = () => {
    executeTransaction("increment", () => {
      setCounter((prev) => ({ ...prev, count: prev.count + 1 }))
    })
  }

  const decrementCounter = () => {
    executeTransaction("decrement", () => {
      setCounter((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }))
    })
  }

  const resetCounter = () => {
    executeTransaction("reset", () => {
      setCounter((prev) => ({ ...prev, count: 0 }))
    })
  }

  const createNewCounter = () => {
    executeTransaction("create", () => {
      setCounter({
        id: PACKAGE_ID,
        count: 0,
      })
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation with Wallet Connection */}
      <nav className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Sui Counter DApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pt-8">
            <p className="text-gray-600">Interact with your Move smart contract on Sui blockchain</p>
            {currentAccount && (
              <div className="inline-flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Current Network: <b>{network}</b> &nbsp;|&nbsp; Package ID: <b>{PACKAGE_ID}</b>
            </div>
          </div>

          {/* Counter Display */}
          <Card>
            <CardHeader>
              <CardTitle>Counter Status</CardTitle>
              <CardDescription>Contract ID: {counter.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-blue-600">{counter.count}</div>
                <p className="text-gray-600">Current Count</p>
              </div>
            </CardContent>
          </Card>

          {/* Counter Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Counter Operations</CardTitle>
              <CardDescription>Interact with your smart contract functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={incrementCounter}
                  disabled={!currentAccount || operationLoading === "increment"}
                  className="flex items-center gap-2"
                >
                  {operationLoading === "increment" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Increment
                </Button>

                <Button
                  onClick={decrementCounter}
                  disabled={!currentAccount || operationLoading === "decrement"}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {operationLoading === "decrement" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  Decrement
                </Button>

                <Button
                  onClick={resetCounter}
                  disabled={!currentAccount || operationLoading === "reset"}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  {operationLoading === "reset" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  Reset
                </Button>
              </div>

              <Separator />

              <Button
                onClick={createNewCounter}
                disabled={!currentAccount || operationLoading === "create"}
                variant="secondary"
                className="w-full"
              >
                {operationLoading === "create" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating New Counter...
                  </>
                ) : (
                  "Create New Counter"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>1. Connect your Sui wallet using the button in the top right</p>
              <p>2. Use the increment/decrement buttons to modify the counter</p>
              <p>3. Reset the counter to zero at any time</p>
              <p>4. Create a new counter instance if needed</p>
              {!currentAccount && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 font-medium">
                    Please connect your Sui wallet to interact with the smart contract
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}