'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/libs/utils'

interface Tab {
  id: string
  label: string
  content: ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export default function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div className="border-b border-input">
        <nav className="flex space-x-4 overflow-x-auto scrollbar-hide sm:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
className={cn(
  'py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors min-w-[80px] sm:py-4 sm:px-1',
  activeTab === tab.id
    ? 'border-primary text-primary-700'
    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-input'
)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'ml-2 py-0.5 px-2 text-xs rounded-full',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
