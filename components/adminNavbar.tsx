"use client"

import { useAdmin } from "@/context/adminContext"
import { useRouter } from "next/navigation"
import Button from "@/components/button"
import styled from "styled-components"
import Link from "next/link"

const Navbar = styled.nav`
  height: 60px;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
`

const Brand = styled.h1`
  color: #fff;
`

const Nav = styled.ul`
  display: flex;
  gap: 1rem;
`

const NavItem = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
`

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ccc;
  }

  &.active {
    color: #fff;
    font-weight: 500;
  }

  &.disabled {
    color: #777;
  }
`

const AdminNavbar = () => {
  const router = useRouter()
  const { logout, admin } = useAdmin()

  const isCurrentPage = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <Navbar>
      <Brand>🍰 Natalis</Brand>
      <Nav>
        <NavItem>
          <NavLink
            href="/admin/dashboard"
            className={isCurrentPage("/admin/dashboard")}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="/admin/users"
            className={isCurrentPage("/admin/users")}
          >
            Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="/admin/events"
            className={isCurrentPage("/admin/events")}
          >
            Events
          </NavLink>
        </NavItem>
        <NavItem>
          <Button onClick={logout}>Logout</Button>
        </NavItem>
      </Nav>
    </Navbar>
  )
}

export default AdminNavbar
