import { Component } from 'solid-js'
import { Editor } from './Editor'
import { LinkPanel } from './LinkPanel'

/**
 * NoteLayout component provides the main layout for the note editing interface
 * 
 * This component arranges the editor and link panels in a responsive layout.
 */
export const NoteLayout: Component = () => {
  // Mock data for demonstration
  const backlinks = [
    { id: 'note1', title: 'Introduction to Markdown' },
    { id: 'note2', title: 'Project Planning' }
  ]
  
  const forwardLinks = [
    { id: 'note3', title: 'Advanced Formatting' },
    { id: 'note4', title: 'Export Options' },
    { id: 'note5', title: 'Collaboration Features' }
  ]

  return (
    <div class="flex flex-col h-full">
      {/* Main content area */}
      <div class="flex-1 flex">
        {/* Editor takes up most of the space */}
        <div class="flex-1">
          <Editor />
        </div>
        
        {/* Sidebar for links */}
        <div class="w-64 p-4 border-l dark:border-gray-700 overflow-y-auto">
          <div class="space-y-6">
            <LinkPanel title="Backlinks" links={backlinks} />
            <LinkPanel title="Forward Links" links={forwardLinks} />
          </div>
        </div>
      </div>
    </div>
  )
}
