type AddFriendModalProps = {
  email: string
  onEmailChange: (email: string) => void
  onAdd: () => void
  onClose: () => void
}

export function AddFriendModal({
  email,
  onEmailChange,
  onAdd,
  onClose
}: AddFriendModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add New Friend</h3>
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Friend
          </button>
        </div>
      </div>
    </div>
  )
} 