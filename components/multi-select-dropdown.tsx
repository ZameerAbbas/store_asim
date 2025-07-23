"use client"

import { useState, useRef, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"
import React from "react"

interface User {
  id: string
  name: string
}

interface MultiSelectDropdownProps {
  users: User[]
  selectedUsers: string[]
  onUserSelect: (userId: string, checked: boolean) => void
}

export function MultiSelectDropdown({ users, selectedUsers, onUserSelect }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedUsers.length ? `${selectedUsers.length} user(s) selected` : "Select Users"}</span>
        <ChevronDown className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
              <Checkbox
                id={`user-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={(checked) => onUserSelect(user.id, checked as boolean)}
              />
              <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

