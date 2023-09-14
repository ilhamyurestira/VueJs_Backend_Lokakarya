<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2>Bayar Telpon</h2>
        <form @submit.prevent="bayarTelpon">
          <div>
            <div>
              <h5>No. Rekening:</h5>
              <InputText v-model="nomorRekening" class="custom-input" :class="{'p-invalid': nomorRekeningError}" required />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
            <div>
              <h5>No. Telpon:</h5>
              <InputText v-model="nomorTelpon" class="custom-input" :class="{'p-invalid': nomorTelponError}" required />
              <span v-if="nomorTelponError" class="p-error">Nomor telepon harus diisi</span>
            </div>
            <div>
              <h5>Jumlah Pembayaran:</h5>
              <InputText v-model="jumlahPembayaran" class="custom-input" :class="{'p-invalid': jumlahPembayaranError}" required />
              <span v-if="jumlahPembayaranError" class="p-error">Jumlah pembayaran harus diisi</span>
            </div>
          </div>
          <Button label="Submit" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      nomorRekening: '',
      nomorRekeningError: false,
      nomorTelpon: '',
      nomorTelponError: false,
      jumlahPembayaran: '',
      jumlahPembayaranError: false,
      nomorPelanggan: '',
      namaPelanggan: '',
      transaksiBerhasil: false,
      saldoPemilikRekening: 5000, // Ganti dengan saldo sesuai dengan pemilik rekening
    };
  },
  methods: {
    bayarTelpon() {
      // Validasi input
      this.nomorRekeningError = !this.nomorRekening;
      this.nomorTelponError = !this.nomorTelpon;
      this.jumlahPembayaranError = !this.jumlahPembayaran;

      if (!this.nomorRekening || !this.nomorTelpon || !this.jumlahPembayaran) {
        return;
      }

 // Kirim data ke backend menggunakan Axios
 axios.post('/bayar-telpon', {
          nomorRekening: this.nomorRekening,
          nomorTelpon: this.nomorTelpon,
          jumlahPembayaran: this.jumlahPembayaran,
        })
        .then((response) => {
          // Tangani respons dari backend di sini
          const data = response.data;
          if (data.nomorPelanggan && data.namaPelanggan) {
            this.nomorPelanggan = data.nomorPelanggan;
            this.namaPelanggan = data.namaPelanggan;
            this.transaksiBerhasil = true;
            this.saldoPemilikRekening = data.saldoPemilikRekening;
          } else {
            this.transaksiBerhasil = false;
          }
        })
        .catch((error) => {
          console.error(error);
          this.transaksiBerhasil = false;
        });
    },
  },
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
  border-color: red;
}

.p-error {
  color: red;
}
</style>
