import { Modal } from '@mantine/core'
import React from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'

type AreYouSureModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  primaryBtnText?: string
}

const AreYouSureModal = (props: AreYouSureModalProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    primaryBtnText = 'Remover',
  } = props

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      centered
      transitionProps={{ transition: 'fade', duration: 400 }}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <p>{message}</p>
        <div className="flex justify-end gap-4">
          <SecondaryButton
            text="Cancelar"
            id="cancel-btn"
            onClick={onClose}
          />
          <PrimaryButton
            type="button"
            text={primaryBtnText}
            id="primary-btn"
            onClick={onConfirm}
            extraStyles="!bg-digired/80 hover:!bg-digired !text-white"
          />
        </div>
      </div>
    </Modal>
  )
}

export default AreYouSureModal
