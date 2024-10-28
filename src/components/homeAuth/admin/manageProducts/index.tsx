import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import productService from "@/services/productService";
import { toast } from "react-toastify";
import Modal from "@/components/common/modal";
import PageSpinner from "@/components/common/pageSpinner";
import categoryService from "@/services/categoryService";

interface Product {
  id: number;
  name: string;
  amountInPoints: number;
  categoryId: number;
  image?: string;
}

interface Category {
  id: number;
  name: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const [newProduct, setNewProduct] = useState({
    name: "",
    amountInPoints: 0,
    categoryId: 1,
    image: undefined as string | undefined,
  });
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);

    try {
      const res = await categoryService.getCategories();
      if (res.status === 200) {
        setCategories(res.data.dados ?? []);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast.error("Erro ao carregar categoria.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      if (res.status === 200) {
        setProducts(res.data.dados ?? []);
        setPageIndex(0);
      } else {
        toast.error("Erro ao carregar produtos.");
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();

    const { name, amountInPoints, categoryId } = newProduct;

    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("amountInPoints", amountInPoints.toString());
    formData.append("categoryId", categoryId.toString());
    formData.append("image", selectedImage);

    try {
      const res = await productService.createProduct(formData);
      if (res.status === 200) {
        toast.success("Produto criado com sucesso!");
        fetchProducts();
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        toast.error("Erro ao criar produto.");
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Erro ao criar produto.");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setSelectedImageName(e.target.files[0].name);
      toBase64(e.target.files[0])
        .then((base64) =>
          setNewProduct((prev) => ({ ...prev, image: base64 as string }))
        )
        .catch((error) => console.error("Erro ao converter imagem:", error));
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      amountInPoints: 0,
      categoryId: 1,
      image: undefined,
    });
    setSelectedImage(null);
    setSelectedImageName(null);
  };

  const toBase64 = (file: File) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleEditProduct = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("id", selectedProduct.id.toString());
    formData.append("name", newProduct.name);
    formData.append("amountInPoints", newProduct.amountInPoints.toString());
    formData.append("categoryId", newProduct.categoryId.toString());

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const res = await productService.updateProduct(formData);
      if (res.status === 200) {
        toast.success("Produto atualizado com sucesso!");
        fetchProducts();
        setIsEditModalOpen(false);
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar produto.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await productService.deleteProduct(id);
      if (res.status === 200) {
        toast.success("Produto excluído com sucesso!");
        fetchProducts();
        setIsDeleteModalOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto.");
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      amountInPoints: product.amountInPoints,
      categoryId: product.categoryId,
      image: undefined,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const getCategoryName = (id: number) => {
    const name = categories.find((p) => p.id == id);
    return name ? name.name : "Nome inválido";
  };

  const totalPages = Math.max(Math.ceil(products.length / pageSize), 1);

  const currentPageData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return products.slice(start, end);
  }, [products, pageIndex]);

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gerenciamento de Produtos
      </h1>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="self-end mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Novo Produto +
      </button>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          {currentPageData.length > 0 ? (
            <>
              <table className="w-full max-w-4xl border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-sky-600">
                    <th className="border border-gray-300 p-2 text-left">
                      Nome
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Pontos
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Categoria
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((product) => (
                    <tr key={product.id} className="hover:bg-sky-600">
                      <td className="border border-gray-300 p-2">
                        {product.name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.amountInPoints}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {getCategoryName(product.categoryId)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {/* Flexbox para organizar os botões */}
                        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Quantidade de registros: {products.length}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  Página {pageIndex + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageIndex === totalPages - 1}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </>
          ) : (
            <p className="text-center mt-6">Nenhum usuário encontrado.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">Novo Produto</h2>
          <form
            onSubmit={handleCreateProduct}
            className="flex flex-col gap-4 mt-4"
          >
            <label htmlFor="name" className="text-black">
              Nome do Produto:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="amountInPoints" className="text-black">
              Pontos:
            </label>
            <input
              id="amountInPoints"
              type="number"
              name="amountInPoints"
              value={newProduct.amountInPoints}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="categoryId" className="text-black">
              Categoria:
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <input type="file" onChange={handleImageChange} className="p-2" />
              {selectedImageName && (
                <span className="-ml-36 text-black">{selectedImageName}</span>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Criar Produto
            </button>
          </form>
        </Modal>
      )}

      {isEditModalOpen && selectedProduct && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">Editar Produto</h2>
          <form
            onSubmit={handleEditProduct}
            className="flex flex-col gap-4 mt-4"
          >
            <label htmlFor="name" className="text-black">
              Nome do Produto:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="amountInPoints" className="text-black">
              Pontos:
            </label>
            <input
              id="amountInPoints"
              type="number"
              name="amountInPoints"
              value={newProduct.amountInPoints}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="categoryId" className="text-black">
              Categoria:
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <input type="file" onChange={handleImageChange} className="p-2" />
              {selectedImageName && (
                <span className="-ml-36 text-black">{selectedImageName}</span>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Editar Produto
            </button>
          </form>
        </Modal>
      )}

      {isDeleteModalOpen && selectedProduct && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">
            Confirmação de Exclusão
          </h2>
          <p className="text-black">
            Tem certeza de que deseja excluir o produto -{" "}
            <b>{selectedProduct.name}?</b>
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteProduct(selectedProduct.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageProducts;
