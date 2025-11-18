'use client'

import { Modal } from '@mantine/core'
import React from 'react'
import { EmployeeDocument } from '@/app/types/employee/document'
import Image from 'next/image'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import Spinner from '../Spinner/Spinner'
import Text from '@/app/components/Text/Text'

type DocumentPreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  document: EmployeeDocument | null
  isLoading?: boolean
  isError?: boolean
}

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
  isLoading = false,
  isError = false,
}: DocumentPreviewModalProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (!isOpen || !document) {
    return null
  }

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        onClose()
      }}
      title={document.fileName || 'Documento'}
      centered
      size="xl"
      transitionProps={{ transition: 'fade', duration: 400 }}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '20px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
        },
      }}
    >
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div
            className="flex justify-center items-center p-4"
            style={{ height: '600px' }}
          >
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-96">
            <Text
              styles="text-digired1420-normal"
              text="Erro ao carregar o contrato"
            />
          </div>
        ) : document?.downloadUrl ? (
          <>
            {document.fileType === 'pdf' && (
              <div
                className="border border-digiblue"
                style={{ height: '600px' }}
              >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.mjs">
                  <Viewer
                    fileUrl={document.downloadUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            )}

            {(document.fileType === 'png' ||
              document.fileType === 'jpg' ||
              document.fileType === 'jpeg') && (
              <div
                className="flex justify-center relative"
                style={{ minHeight: '400px' }}
              >
                <Image
                  src={document.downloadUrl}
                  alt={document.fileName || 'Documento'}
                  width={800}
                  height={600}
                  className="rounded-lg object-contain"
                  unoptimized={true}
                />
              </div>
            )}

            {document.fileType !== 'pdf' &&
              document.fileType !== 'png' &&
              document.fileType !== 'jpg' &&
              document.fileType !== 'jpeg' && (
                <div className="flex items-center justify-center h-96">
                  <Text
                    styles="text-gray1420-normal"
                    text="Pré-visualização não disponível para este tipo de ficheiro"
                  />
                </div>
              )}
          </>
        ) : null}
      </div>
    </Modal>
  )
}

export default DocumentPreviewModal
