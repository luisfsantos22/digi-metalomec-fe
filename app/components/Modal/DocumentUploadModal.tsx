'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Modal } from '@mantine/core'
import PrimaryButton from '../Button/PrimaryButton'
import Image from 'next/image'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { DocumentUploadData } from '@/app/types/employee/document'
import Text from '../Text/Text'
import { classNames } from '@/utils'
import PreviewButton from '../Button/PreviewButton'
import DeleteButton from '../Button/DeleteButton'

type DocumentUploadModalProps = {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: DocumentUploadData) => Promise<boolean>
  loading: boolean
}

type FileWithStatus = {
  file: File
  status: 'uploading' | 'uploaded' | 'error'
  error?: string
  progress?: number
}

const DocumentUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  loading,
}: DocumentUploadModalProps) => {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  // Memoize the file URL to prevent recreating on every render
  const previewFileUrl = useMemo(() => {
    if (!previewFile) return null

    return URL.createObjectURL(previewFile)
  }, [previewFile])

  // Cleanup object URL when preview closes
  useEffect(() => {
    return () => {
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl)
      }
    }
  }, [previewFileUrl])

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validate file type - only PDF, PNG, JPEG
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg']
    const fileName = file.name.toLowerCase()
    const isValidType = allowedExtensions.some((ext) => fileName.endsWith(ext))

    if (!isValidType) {
      return {
        valid: false,
        error:
          'This document is not supported, please delete and upload another file.',
      }
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size cannot exceed 10MB' }
    }

    return { valid: true }
  }

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validatedFiles: FileWithStatus[] = []

    fileArray.forEach((file) => {
      const validation = validateFile(file)
      if (validation.valid) {
        validatedFiles.push({
          file,
          status: 'uploading',
          progress: 0,
        })
      } else {
        validatedFiles.push({
          file,
          status: 'error',
          error: validation.error,
        })
      }
    })

    setFiles((prev) => [...prev, ...validatedFiles])

    // Simulate upload progress for valid files
    validatedFiles.forEach((fileWithStatus, index) => {
      if (fileWithStatus.status === 'uploading') {
        simulateUpload(files.length + index)
      }
    })
  }

  const simulateUpload = (fileIndex: number) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setFiles((prev) =>
        prev.map((f, i) => (i === fileIndex ? { ...f, progress } : f))
      )

      if (progress >= 100) {
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f, i) =>
            i === fileIndex
              ? { ...f, status: 'uploaded' as const, progress: 100 }
              : f
          )
        )
      }
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadAll = async () => {
    const uploadedFiles = files.filter((f) => f.status === 'uploaded')

    for (const fileWithStatus of uploadedFiles) {
      const success = await onUpload({
        file: fileWithStatus.file,
        title: fileWithStatus.file.name.replace(/\.[^/.]+$/, ''),
        documentType: 'other',
      })

      if (!success) {
        // If upload fails, stop processing remaining files
        return
      }
    }
  }

  const handleClose = () => {
    setFiles([])
    setIsDragging(false)
    setPreviewFile(null)
    setShowPreview(false)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  const uploadingFiles = files.filter((f) => f.status === 'uploading')
  const uploadedFiles = files.filter((f) => f.status === 'uploaded')
  const errorFiles = files.filter((f) => f.status === 'error')

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Adicionar Documento"
      centered
      transitionProps={{ transition: 'fade', duration: 400 }}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
          textAlign: 'center',
          width: '100%',
        },
      }}
      size="lg"
    >
      <div className="flex flex-col gap-6">
        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={classNames(
            isDragging
              ? 'border-digiblue-hover bg-digiblue-hover/10'
              : 'border-gray-300 bg-gray-50 hover:bg-digiblue-hover/10',
            'border-2 hover:cursor-pointer border-dashed rounded-lg p-12',
            'flex flex-col items-center justify-center gap-4 transition-colors'
          )}
          onClick={handleBrowseClick}
        >
          {/* Cloud Upload Icon */}
          <Image
            src="/icons/cloud-upload.svg"
            alt="Upload Icon"
            width={64}
            height={64}
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <Text
              text={'Arraste os seus ficheiros, ou clique na janela'}
              styles="text-digibrown1624-semibold"
            />
            <div className="flex flex-col gap-1 items-center justify-center">
              <Text
                text="Suportado: PDF, PNG, JPEG. "
                styles="text-gray1420-normal"
              />
              <Text
                text="Tamanho máximo por ficheiro: 10MB."
                styles="text-gray1420-normal"
              />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* File Lists */}
        {(uploadingFiles.length > 0 || errorFiles.length > 0) && (
          <div className="flex flex-col gap-3">
            <Text
              styles="text-gray1420-normal"
              text={`A carregar - ${uploadingFiles.length + errorFiles.length}/${files.length} ficheiro${
                files.length > 1 ? 's' : ''
              }`}
            />
            {[...errorFiles, ...uploadingFiles].map((fileWithStatus, index) => (
              <div key={index}>
                <div
                  className={`${
                    fileWithStatus.status === 'error'
                      ? 'border border-digired bg-white rounded-lg p-3'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Text
                      styles="text-digibrown1624-normal truncate flex-1"
                      text={fileWithStatus.file.name}
                    />
                  </div>
                  {fileWithStatus.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-digiblue h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${fileWithStatus.progress || 0}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                {fileWithStatus.status === 'error' && (
                  <Text
                    styles="text-digired1420-normal"
                    text={fileWithStatus.error || ''}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            <Text
              styles="text-digibrown1212-normal"
              text={`Concluído - ${uploadedFiles.length} ficheiro${uploadedFiles.length > 1 ? 's' : ''}`}
            />
            {uploadedFiles.map((fileWithStatus, index) => (
              <div
                key={index}
                className="border border-digiblue bg-white rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <Text
                    styles="text-digiblack1420-normal line-clamp-1 flex-1"
                    text={fileWithStatus.file.name}
                  />
                  <div className="flex items-center gap-2">
                    <PreviewButton
                      onClick={() => {
                        setPreviewFile(fileWithStatus.file)
                        setShowPreview(true)
                      }}
                      type="button"
                      id="preview-file-btn"
                      onlyIcon={true}
                      hasTooltip
                      size="small"
                    />
                    <DeleteButton
                      id="delete-uploaded-file-btn"
                      onClick={() => removeFile(files.indexOf(fileWithStatus))}
                      typeBtn="icon"
                      tooltipText="Remover Ficheiro"
                      hasTooltip
                      theme="dark"
                      heightIcon={20}
                      widthIcon={20}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <PrimaryButton
          id="upload-files-btn"
          text={
            loading
              ? 'A CARREGAR...'
              : uploadedFiles.length === 0
                ? 'A AGUARDAR FICHEIROS PARA CARREGAR'
                : `CARREGAR FICHEIRO` + (uploadedFiles.length > 1 ? 'S' : '')
          }
          onClick={handleUploadAll}
          type="button"
          disabled={loading || uploadedFiles.length === 0}
          extraStyles="w-full"
          textDisabled="Por favor faça upload de ficheiros válidos antes de continuar"
        />
      </div>

      {/* Preview Modal */}
      {showPreview && previewFile && previewFileUrl && (
        <Modal
          opened={showPreview}
          onClose={() => {
            setShowPreview(false)
            setPreviewFile(null)
          }}
          title={previewFile.name}
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
            {previewFile.type === 'application/pdf' && (
              <div
                className="border border-digiblue"
                style={{ height: '600px' }}
              >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.mjs">
                  <Viewer
                    fileUrl={previewFileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            )}

            {previewFile.type.startsWith('image/') && (
              <div
                className="flex justify-center relative"
                style={{ minHeight: '400px' }}
              >
                <Image
                  src={previewFileUrl}
                  alt={previewFile.name}
                  width={800}
                  height={600}
                  className="rounded-lg object-contain"
                  unoptimized={true}
                />
              </div>
            )}

            {!previewFile.type.startsWith('image/') &&
              previewFile.type !== 'application/pdf' && (
                <div className="flex items-center justify-center h-96">
                  <Text
                    styles="text-gray1420-normal"
                    text="Pré-visualização não disponível para este tipo de ficheiro"
                  />
                </div>
              )}
          </div>
        </Modal>
      )}
    </Modal>
  )
}

export default DocumentUploadModal
