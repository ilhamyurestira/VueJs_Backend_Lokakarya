<template>
    <div class="grid p-fluid">
        <div class="col-12">
        <div class="card">
            <h2>Cek Saldo</h2>
            <form @submit="cekSaldo">
            <div>
                <div>
                <h5>No. Rekening:</h5>
                <InputText type="text" v-model="nomorRekening" class="custom-input" :class="{'p-invalid': nomorRekeningError}" required /><br />&nbsp;
                <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
                <br />&nbsp;
                <Button label="Submit" class="custom-button" type="submit" />
            </div>
            </div>
        </form>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';

const nomorRekening = ref('');
const nomorRekeningError = ref (false);

const cekSaldo = (e) => {
    e.preventDefault(); // Mencegah refresh halaman default

    // Validasi input nomor rekening
    if (!nomorRekening.value) {
    nomorRekeningError.value = true;
    return; // Menghentikan eksekusi jika input kosong
} else {
    nomorRekeningError.value = false;
}

    const nomorRekeningDummy = '1234567890'; // Nomor rekening dummy
    const saldoDummy = 5000; // Saldo dummy

    if (nomorRekening.value === nomorRekeningDummy) {
    Swal.fire({
        title: 'Saldo Anda',
        text: `Saldo untuk nomor rekening ${nomorRekeningDummy} saat ini adalah: Rp.${saldoDummy},00`,
        icon: 'success',
    });
} else {
    Swal.fire({
        title: 'Nomor Rekening Tidak Ditemukan',
        text: 'Nomor rekening tidak ditemukan.',
        icon: 'error',
    });
}
};
</script>

<style>
.custom-input {
    width: 200px;
    height: 40px; 
    font-size: 16px; 
}

.custom-button {
    width: 100px; 
    height: 40px; 
    font-size: 16px;
}

.p-invalid {
  border-color: red; /* Warna border merah jika input tidak valid */
}

.p-error {
  color: red; /* Warna teks merah untuk pesan kesalahan */
}
</style>
