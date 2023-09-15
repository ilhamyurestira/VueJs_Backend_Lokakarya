<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; // Import Axios

const toast = useToast();

const products = ref(null);
const apiUrl = 'http://localhost:8000/api/v1/masterPelanggan'; // Replace with your API URL
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const usersList = ref([]);
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    fetchData();
    fetchUsers();
});

const fetchData = () => {
    axios.get(apiUrl)
        .then((response) => {
            products.value = response.data; // Assuming your API response is an array of products
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from the API', life: 3000 });
        });
};

const fetchUsers = () => {
    axios
        .get('http://localhost:8000/api/v1/admin/manage/users')
        .then((response) => {
            // Response dari API berisi daftar pengguna
            const users = response.data; // Asumsikan API mengembalikan array objek pengguna
            // Assign daftar pengguna ke variabel di dalam data
            usersList.value = users;
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.userId) {
        // Produk baru, kirim permintaan POST hanya dengan mengirimkan userId
        const newData = {
            userId: product.value.userId, // Kirim hanya userId
        };

        // Kirim permintaan POST ke BE
        axios
            .post(`${apiUrl}/tambah`, newData) // Pastikan endpoint API sesuai
            .then((response) => {
                const data = response.data;
                console.log('data', data)
                if (response.status === 200) {
                    // Produk berhasil dibuat di BE, tidak ada respons yang diharapkan dari BE
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: data,
                        life: 3000,
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Rekening gagal dibuat`,
                        life: 3000,
                    });
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Rekening gagal dibuat`,
                    life: 3000,
                });
            });
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    if (product.value.id) {

        // Kirim permintaan POST ke BE
        axios.delete(`${apiUrl}/` + product.value.id);
        productDialog.value = false;
        product.value = {};
    }
    // products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!-- Button nambah data baru -->
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah Pelanggan" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>

                </Toolbar>

                <!-- Tabel data -->
                <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Data Pelanggan</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <!-- <Column field="id" header="ID" :sortable="true"
                        headerStyle="width:20%; min-width:10rem;has-text-centered">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column> -->
                    <Column field="nama" header="Nama" :sortable="true" headerStyle="width35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>
                    <Column field="noTlp" header="No Telpon" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No Telpon</span>
                            {{ slotProps.data.no_telp }}
                        </template>
                    </Column>
                    <Column field="alamat" header="Alamat" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat</span>
                            {{ slotProps.data.alamat }}
                        </template>
                    </Column>
                    <Column header="Action" headerStyle="width:10%;min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editProduct(slotProps.data)" /> -->
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detail Pelanggan" :modal="true"
                    class="p-fluid">
                    <!-- <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                        class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="id">Nama User</label>
                        <Dropdown v-model.trim="product.userId" optionLabel="nama" optionValue="id" :options="usersList"
                            placeholder="Pilih User" />
                        <small class="p-invalid" v-if="submitted && !product.nama">Nama User harus di pilih</small>
                    </div>
                    <!-- <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="nama" v-model.trim="product.nama" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.nama }" />
                        <small class="p-invalid" v-if="submitted && !product.nama">Nama harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="noTelp">No Telpon</label>
                        <InputText id="noTelp" v-model.trim="product.noTelp" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.noTelp }" />
                        <small class="p-invalid" v-if="submitted && !product.noTelp">No Telpon harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="alamat">Alamat</label>
                        <Textarea id="alamat" v-model="product.alamat" required="true" rows="3" cols="20" />
                    </div> -->
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <!-- Dialog untuk yakin hapus data -->
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
