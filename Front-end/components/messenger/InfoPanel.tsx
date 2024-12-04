import { X, Phone, Video, Search, Trash2, LogOut } from 'lucide-react'
import { Conversation } from '@/types/messenger'
import Image from 'next/image'

type InfoPanelProps = {
  conversation: Conversation
  width: number
  searchQuery: string
  onSearch: (query: string) => void
  onClose: () => void
  onLogout: () => void
  resizeHandleRef: React.RefObject<HTMLDivElement>
  infoPanelRef: React.RefObject<HTMLDivElement>
}

export function InfoPanel({
  conversation,
  width,
  searchQuery,
  onSearch,
  onClose,
  onLogout,
  resizeHandleRef,
  infoPanelRef
}: InfoPanelProps) {
  const firstLetter = conversation.name.charAt(0).toUpperCase()

  return (
    <div 
      className="border-l border-gray-200 overflow-y-auto relative"
      style={{ width: `${width}px` }}
      ref={infoPanelRef}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Information</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 text-center border-b border-gray-200">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {conversation.avatar ? (
            <Image
              src={conversation.avatar}
              alt={conversation.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white font-semibold text-4xl">{firstLetter}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{conversation.name}</h3>
        <p className="text-gray-500 text-sm">Hoạt động 2 giờ trước</p>
      </div>

      {/* Actions Section */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-gray-200">
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs">Gọi thoại</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-xs">Gọi video</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-xs">Tìm kiếm</span>
        </button>
      </div>

      {/* Search Messages */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm trong cuộc trò chuyện"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full p-2 pl-8 rounded-lg bg-gray-100"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Additional Actions */}
      <div className="p-4">
        <button 
          className="w-full p-2 rounded-lg flex items-center text-red-500 hover:bg-red-50 mb-2"
          onClick={() => {/* Xử lý xóa cuộc trò chuyện */}}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Xóa cuộc trò chuyện
        </button>
        <button 
          className="w-full p-2 rounded-lg flex items-center text-red-500 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Đăng xuất
        </button>
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500"
      />
    </div>
  )
} 