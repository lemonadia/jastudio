'use client'

import React, { useCallback, useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { Card, Dialog, Flex, Button, Spinner, Text } from '@sanity/ui'
import type { AssetSourceComponentProps } from '@sanity/types'

function StripMetadataUpload({
  onSelect,
  onClose,
  assetType = 'image',
}: AssetSourceComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || assetType !== 'image') return

      setUploading(true)
      setError(null)

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 10,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | undefined,
        })
        const stripped = new File([compressed], file.name, {
          type: compressed.type,
          lastModified: Date.now(),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelect([{ kind: 'file', value: stripped, assetDocumentProps: { originalFilename: file.name } } as any])
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process image')
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [assetType, onSelect, onClose]
  )

  return (
    <Dialog id="strip-metadata-upload" header="Upload image" onClose={onClose} width={1} open>
      <Card padding={4}>
        <Flex direction="column" gap={4}>
          <Text size={1} muted>
            Strips EXIF/metadata (fixes upload issues)
          </Text>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {error && (
            <Text size={1} style={{ color: 'var(--card-critical-fg-color)' }}>
              {error}
            </Text>
          )}
          {uploading ? (
            <Flex align="center" gap={3}>
              <Spinner />
              <Text>Processing…</Text>
            </Flex>
          ) : (
            <Button
              text="Choose image"
              tone="primary"
              onClick={() => inputRef.current?.click()}
            />
          )}
          <Button text="Cancel" mode="ghost" onClick={onClose} />
        </Flex>
      </Card>
    </Dialog>
  )
}

export const stripMetadataUploadSource = {
  name: 'strip-metadata-upload',
  title: 'Upload',
  component: StripMetadataUpload,
}
