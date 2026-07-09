import { useUIStore } from '../stores/core/uiStore'

export function useModal(id: string) {
  const activeModal = useUIStore((s) => s.activeModal)
  const openModal = useUIStore((s) => s.openModal)
  const closeModal = useUIStore((s) => s.closeModal)

  return {
    isOpen: activeModal === id,
    open: () => openModal(id),
    close: closeModal,
  }
}
