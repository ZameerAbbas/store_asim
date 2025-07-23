// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// interface CrudDialogProps<T> {
//   title: string;
//   triggerText: string;
//   fields: {
//     name:  string;
//     label: string;
//     type: string;
//     options?: string[];
//   }[];
//   onSubmit: (data: Partial<T>) => void;
//   initialData?: Partial<T>;
// }

// export function CrudDialog<T>({ title, triggerText, fields, onSubmit, initialData }: CrudDialogProps<T>) {
//   const [formData, setFormData] = useState<Partial<T>>(initialData || {});

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>{triggerText}</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {fields.map((field) => (
//             <div key={field.name as string}>
//               <Label htmlFor={field.name as string}>{field.label}</Label>
//               {field.type === 'select' ? (
//                 <select
//                   id={field.name as string}
//                   value={formData[field.name] as string || ''}
//                   onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   {field.options?.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <Input
//                   id={field.name as string}
//                   type={field.type}
//                   value={formData[field.name] as string || ''}
//                   onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
//                 />
//               )}
//             </div>
//           ))}
//           <Button type="submit">Submit</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

