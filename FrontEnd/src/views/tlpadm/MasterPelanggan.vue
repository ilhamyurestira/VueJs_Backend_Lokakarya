<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; // Import Axios

const toast = useToast();

const apiUrl = 'http://localhost:8000/api/v1/masterPelanggan'; // Replace with your API URL
const dataPelanggan = ref(null);
const tambahPelangganDialog = ref(false);
const deletePelangganDialog = ref(false);
const pelanggan = ref({});
const usersList = ref([]);
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    fetchData();
    fetchUsers();
});

const fetchData = () => {
    axios.get(apiUrl)
        .then((response) => {
            dataPelanggan.value = response.data;
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
    pelanggan.value = {};
    submitted.value = false;
    tambahPelangganDialog.value = true;
};

const hideDialog = () => {
    tambahPelangganDialog.value = false;
    submitted.value = false;
};

const savePelanggan = () => {
    submitted.value = true;
    if (pelanggan.value.userId) {
        // Produk baru, kirim permintaan POST hanya dengan mengirimkan userId
        const newData = {
            userId: pelanggan.value.userId, // Kirim hanya userId
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
                    fetchData();
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
        tambahPelangganDialog.value = false;
        pelanggan.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    tambahPelangganDialog.value = true;
};

const confirmDeletePelanggan = (deletePelanggan) => {
    pelanggan.value = deletePelanggan;
    deletePelangganDialog.value = true;
};

const deletePelanggan = () => {
    deletePelangganById(pelanggan.value.id);
    deletePelangganDialog.value = false;
    pelanggan.value = {};
};

const deletePelangganById = (id) => {
    axios
        .delete(`${apiUrl}/${id}`)
        .then((response) => {
            if (response.status === 200) {
                // Successful deletion
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Pelanggan berhasil di hapus',
                    life: 3000,
                });
                fetchData(); // Refresh the data after deletion
            } else {
                // Handle deletion failure
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal hapus pelanggan',
                    life: 3000,
                });
            }
        })
        .catch((error) => {
            // Handle API request error
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal hapus pelanggan',
                life: 3000,
            });
        });
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
                <DataTable ref="dt" :value="dataPelanggan" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
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
                                @click="confirmDeletePelanggan(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="tambahPelangganDialog" :style="{ width: '450px' }" header="Detail Pelanggan"
                    :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="id">Nama User</label>
                        <Dropdown v-model.trim="pelanggan.userId" optionLabel="nama" optionValue="id" :options="usersList"
                            placeholder="Pilih User" />
                        <small class="p-invalid" v-if="submitted && !pelanggan.nama">Nama User harus di pilih</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePelanggan" />
                    </template>
                </Dialog>

                <!-- Dialog untuk yakin hapus data -->
                <Dialog v-model:visible="deletePelangganDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="pelanggan">Are you sure you want to delete <b>{{ pelanggan.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deletePelangganDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePelanggan" />
                    </template>
                </Dialog>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
