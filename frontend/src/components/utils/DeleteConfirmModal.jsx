import Modal from '../form/Modal';

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold text-text-primary mb-4">
        Подтверждение удаления
      </h3>
      <p className="text-text-secondary mb-6">
        Вы действительно хотите удалить эту заметку?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 py-2 bg-danger hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
        >
          Удалить
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 bg-bg-tag hover:bg-hover-light text-text-secondary font-semibold rounded-lg transition-all"
        >
          Отмена
        </button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;