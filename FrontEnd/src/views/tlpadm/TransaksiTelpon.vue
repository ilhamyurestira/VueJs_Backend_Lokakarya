<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; // Import Axios

const toast = useToast();
const router = useRouter();
const now = new Date();

const products = ref(null);
const apiUrl = 'http://localhost:8000/api/v1/transaksiTelkom'; // Replace with your API URL
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
const year = ref(new Date().getFullYear());

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
    checkLogin();
    checkAdminPrevilage();
});
onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    fetchData();
    fetchUsers();
});

const checkLogin = () => {
    const Token = JSON.parse(localStorage.getItem('token'));
    // console.log(Token);
    if (!Token) {
        router.push({ name: 'login' });
    } else if (Token.expiry < now.getTime()) {
        alert('token has expired');
        localStorage.removeItem('userPrevilage');
        localeStorage.removeItem('token');
        router.push({ name: 'login' });
    }
};

const checkAdminPrevilage = () => {
    const previlage = JSON.parse(localStorage.getItem('userPrevilage'));
    // console.log(previlage);
    if (!previlage) {
        router.push({ name: 'accessDenied' });
    } else if (previlage.roleId !== 3 || previlage.roleId !== 8) {
        router.push({ name: 'accessDenied' });
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const fetchData = () => {
    axios
        .get(apiUrl)
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
        .get('http://localhost:8000/api/v1/masterPelanggan')
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

const getStatusText = (status) => {
    return status === 1 ? 'Belum Bayar' : status === 2 ? 'Lunas' : '';
};

const saveProduct = () => {
    submitted.value = true;
    // if (product.value.id) {
    // Produk baru, kirim permintaan POST hanya dengan mengirimkan userId
    const newData = {
        id_pelanggan: product.value.id_pelanggan,
        bulan_tagihan: product.value.bulan_tagihan,
        tahun_tagihan: product.value.tahun_tagihan,
        uang: product.value.uang,
        status: product.value.status
        // Kirim hanya userId
    };

    // Kirim permintaan POST ke BE
    axios
        .post(`${apiUrl}/tambah`, newData) // Pastikan endpoint API sesuai
        .then((response) => {
            const data = response.data;
            console.log('data', data);
            if (response.status === 200) {
                // Produk berhasil dibuat di BE, tidak ada respons yang diharapkan dari BE
                toast.add({
                    severity: 'success',
                    summary: 'Sukses',
                    detail: data,
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Rekening gagal dibuat`,
                    life: 3000
                });
            }
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: `Rekening gagal dibuat`,
                life: 3000
            });
        });
    productDialog.value = false;
    product.value = {};
    // }
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
    products.value = products.value.filter((val) => val.id !== product.value.id);
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
                <!-- <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah Transaksi Telpon" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>

                </Toolbar> -->

                <!-- Tabel data -->
                <DataTable
                    ref="dt"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Data Transaksi Telpon</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <!-- <Column field="idPelanggan" header="ID Pelanggan" :sortable="true"
                        headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID Pelanggan</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column> -->
                    <Column field="index" header="No" :sortable="false" headerStyle="width:5%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">N0</span>
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="nama" header="Nama" :sortable="true" headerStyle="width15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            <!-- {{ slotProps.data["master_pelanggan.nama"] }} -->
                            {{ slotProps.data.nama_pelanggan }}
                        </template>
                    </Column>
                    <Column field="blnTagihan" header="Bulan Tagihan" :sortable="true" headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Bulan Tagihan</span>
                            {{ slotProps.data.bulan_tagihan }}
                        </template>
                    </Column>
                    <Column field="thnTagihan" header="Tahun Tagihan" :sortable="true" headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tahun Tagihan</span>
                            {{ slotProps.data.tahun_tagihan }}
                        </template>
                    </Column>
                    <Column field="uang" header="Uang" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Uang</span>
                            {{ formatCurrency(slotProps.data.uang) }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            {{ getStatusText(slotProps.data.status) }}
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detail Pelanggan" :modal="true" class="p-fluid">
                    <!-- <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                        class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="id_pelanggan">ID Pelanggan</label>
                        <Dropdown v-model.trim="product.id_pelanggan" optionLabel="id" optionValue="id" :options="usersList" placeholder="Pilih User" />
                        <small class="p-invalid" v-if="submitted && !product.id_pelanggan">ID Pelanggan harus di pilih</small>
                    </div>
                    <!-- <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="nama" v-model.trim="product.nama" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.nama }" />
                        <small class="p-invalid" v-if="submitted && !product.nama">Nama harus di Isi.</small>
                    </div> -->
                    <div class="field">
                        <label for="bulan_tagihan">Bulan Tagihan</label>
                        <InputText id="bulan_tagihan" v-model.trim="product.bulan_tagihan" required="true" autofocus :class="{ 'p-invalid': submitted && !product.tahun_tagihan }" />
                        <small class="p-invalid" v-if="submitted && !product.bulan_tagihan">Bulan Tagihan harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="noTelp">Tahun Tagihan</label>
                        <InputText id="noTelp" v-model.trim="product.tahun_tagihan" required="true" autofocus :class="{ 'p-invalid': submitted && !product.tahun_tagihan }" />
                        <small class="p-invalid" v-if="submitted && !product.tahun_tagihan">Tahun Tagihan harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="uang">Uang</label>
                        <InputNumber id="uang" v-model="product.uang" mode="currency" currency="IDR" :class="{ 'p-invalid': submitted && !product.uang }" :required="true" />
                        <small class="p-invalid" v-if="submitted && !product.uang">Uang harus di isi</small>
                    </div>
                    <div class="field">
                        <label class="mb-3">Status</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="status1" name="status" value="1" v-model="product.status" />
                                <label for="status1">Belum Bayar</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="status2" name="status" value="2" v-model="product.status" />
                                <label for="status1">Lunas</label>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <!-- Dialog untuk yakin hapus data -->
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
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
