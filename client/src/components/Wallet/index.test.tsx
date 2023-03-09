import { cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Wallet from ".";


const account = {
    address: '0x' + '0'.repeat(63) + '1'
}

//mock the connect function
vi.mock('@aptos-labs/wallet-adapter-react', () => {
    return {
        useWallet: () => {
            const [connected, setConnected] = useState(false)
            return {
                connect: () => {
                    setConnected(true)
                },
                disconnect: () => {
                    setConnected(false)
                },
                connected,
                account
            }
        }
    }
})

describe('Use Wallet', async () => {
    afterEach(() => {
        cleanup()
        vi.restoreAllMocks()
    })
    it('Should have "Wallet" as button name', async () => {
        render(<Wallet />)
        const btn = screen.queryByText('Wallet')
        expect(btn).not.toBeNull()
    })
    it('Should have "{account.address}" as button name', async () => {
        render(<Wallet />)
        //find connect wallet button
        let btn = await screen.findByRole('button')
        btn.click()
        //click Petra button
        btn = await screen.findByText('Petra')
        btn.click()
        //find wallet button 
        btn = await screen.findByText(account.address)
        expect(btn).not.toBeNull()
    })
})
