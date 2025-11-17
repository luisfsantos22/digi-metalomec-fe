'use client'

import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { EmployeeDocument } from '@/app/types/employee/document'
import Image from 'next/image'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

type DocumentPreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  document: EmployeeDocument | null
}

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
}: DocumentPreviewModalProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (!isOpen || !document) {
    return null
  }

  const isPDF =
    document.fileType?.toLowerCase() === 'pdf' ||
    document.fileType?.toLowerCase()?.includes('pdf') ||
    document.fileName?.toLowerCase()?.endsWith('.pdf')
  const isImage = ['png', 'jpg', 'jpeg'].some(
    (ext) =>
      document.fileType?.toLowerCase()?.includes(ext) ||
      document.fileName?.toLowerCase()?.endsWith(`.${ext}`)
  )

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={document.title}
      centered
      size="xl"
      transitionProps={{ transition: 'fade', duration: 400 }}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
        },
        body: {
          minHeight: '500px',
        },
      }}
    >
      <div className="flex flex-col gap-4">
        {isPDF && document.downloadUrl && (
          <div
            className="border border-gray-300 rounded-lg"
            style={{ height: '600px' }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={document.downloadUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        )}

        {isImage && document.downloadUrl && (
          <div
            className="relative w-full"
            style={{ minHeight: '400px' }}
          >
            <Image
              src={document.downloadUrl}
              alt={document.title}
              width={800}
              height={600}
              className="rounded-lg object-contain"
              unoptimized={true}
            />
          </div>
        )}

        {!document.downloadUrl && (
          <div className="flex items-center justify-center h-96">
            <p className="text-digibrown1624-normal">
              URL de download não disponível
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <SecondaryButton
            id="close-preview-modal"
            text="Fechar"
            onClick={onClose}
            type="button"
          />
          {document.downloadUrl && (
            <PrimaryButton
              id="open-new-tab"
              text="Abrir em nova aba"
              onClick={() => window.open(document.downloadUrl, '_blank')}
              type="button"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default DocumentPreviewModal
