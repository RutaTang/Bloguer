import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ThemeSwitcher from '.'


describe('Switch theme between dark and light', async () => {
    afterEach(() => {
        cleanup()
    })
    it('Should default to light', async () => {
        render(<ThemeSwitcher />)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
    it('Should switch to dark', async () => {
        render(<ThemeSwitcher />)
        screen.getByRole('button').click()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    it('Should switch to dark and switch back to light', async () => {
        render(<ThemeSwitcher />)
        screen.getByRole('button').click()
        screen.getByRole('button').click()
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
})
