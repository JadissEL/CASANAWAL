import { ProductEditModal } from "@/components/ui/enterprise-product-modal";
import { Product, UpdateMessage } from "./dashboard-types";

interface DashboardProductModalProps {
  editingProduct: Product | null;
  isEditModalOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  updateMessage: UpdateMessage | null;
}

export const DashboardProductModal = ({
  editingProduct,
  isEditModalOpen,
  onClose,
  onSave,
  updateMessage
}: DashboardProductModalProps) => {
  if (typeof ProductEditModal !== "function") {
    return null;
  }

  return (
    <ProductEditModal
      product={editingProduct}
      isOpen={isEditModalOpen}
      onClose={onClose}
      onSave={onSave}
      message={updateMessage}
    />
  );
};
