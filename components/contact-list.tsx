import type { Contact } from "@/types/contact"

interface ContactListProps {
  contacts: Contact[]
  onAddNew: () => void
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

// First, let's define the Contact type if it's not already defined in @/types/contact
// Add this to types/contact.ts if it doesn't exist:
/*
export interface Contact {
  id: string
  name: string
  email: string
}
*/

export default function ContactList({ 
  contacts, 
  onAddNew, 
  onEdit, 
  onDelete 
}: ContactListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Contacts</h2>
        <button
          onClick={onAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Contact</span>
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Company</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr 
                  key={index}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{contact.name}</td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

