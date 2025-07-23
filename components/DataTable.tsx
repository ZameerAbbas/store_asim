// import { useState } from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Pencil, Trash2 } from 'lucide-react'
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import React from 'react'

// interface Column<T> {
//   header: string;
//   accessorKey: keyof T;
//   cell?: (params: { row: { original: T } }) => React.ReactNode;
// }

// interface DataTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   onEdit: (item: T) => void;
//   onDelete: (item: T) => void;
// }

// export function DataTable<T extends { id: string | number }>({ 
//   data, 
//   columns, 
//   onEdit, 
//   onDelete 
// }: DataTableProps<T>) {
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
//   const [itemToDelete, setItemToDelete] = useState<T | null>(null)

//   const handleDeleteClick = (item: T) => {
//     setItemToDelete(item)
//     setDeleteConfirmOpen(true)
//   }

//   const handleConfirmDelete = () => {
//     if (itemToDelete) {
//       onDelete(itemToDelete)
//       setDeleteConfirmOpen(false)
//       setItemToDelete(null)
//     }
//   }

//   return (
//     <>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableHead key={column.accessorKey as string}>{column.header}</TableHead>
//               ))}
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={item.id || index}>
//                 {columns.map((column) => (
//                   <TableCell key={column.accessorKey as string}>
//                     {column.cell ? column.cell({ row: { original: item } }) : item[column.accessorKey] as React.ReactNode}
//                   </TableCell>
//                 ))}
//                 <TableCell>
//                   <div className="flex space-x-2">
//                     <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this item? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

