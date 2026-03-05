import TextImage from './TextImage'
import TextBlock from './TextBlock'
import Gallery from './Gallery'

export interface Block {
  _type: 'textImage' | 'textBlock' | 'gallery'
  [key: string]: unknown
}

interface BlockRendererProps {
  blocks: Block[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="blocks">
      {blocks?.map((block, index) => {
        switch (block._type) {
          case 'textImage':
            return <TextImage key={index} {...(block as any)} />
          case 'textBlock':
            return <TextBlock key={index} {...(block as any)} />
          case 'gallery':
            return <Gallery key={index} {...(block as any)} />
          default:
            return null
        }
      })}
    </div>
  )
}
