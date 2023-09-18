<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <!-- Input Form -->
      <div class="card">
        <h2 style="margin-bottom: 25px;">Bayar Telpon</h2>
        <form @submit.prevent="getAccountInfo">
          <div>
            <div>
              <h5>Masukkan Nomor Rekening Anda:</h5>
              <InputText
                type="text"
                v-model="nomorRekening"
                class="custom-input"
                :class="{'p-invalid': nomorRekeningError}"
                required
              />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
            <div>
              <h5>Masukkan Nomor ID Pelanggan:</h5>
              <InputText
                type="text"
                v-model="nomorPelanggan"
                class="custom-input"
                :class="{'p-invalid': nomorPelangganError}"
                required
              />
              <span v-if="nomorPelangganError" class="p-error">Nomor ID pelanggan harus diisi</span>
            </div>
          </div>
          <Button label="Cek Tagihan" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>

  <Dialog v-if="showPaymentModal" v-model:visible="showPaymentModal" modal header="Informasi Rekening" :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1; font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening: {{ accountInfo.nomorRekening }}</p>
      <p>Nama Pemilik Rekening: {{ accountInfo.namaPemilikRekening }}</p>
      <p>Saldo: {{ numberWithDot(accountInfo.saldoPemilikRekening) }}</p>
      <p>
        Jumlah Tagihan:{{ numberWithDot(accountInfo.tagihan) }}
      </p>
      <Button style="margin-top: 10px; margin-right: 32px;" label="Bayar" class="custom-button" @click="bayarTagihan" />
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "BayarTelponComponent",
  data() {
    return {
      nomorRekening: "",
      nomorPelanggan: "",
      nomorRekeningError: false,
      nomorPelangganError: false,
      accountInfo: {},
      showAccountInfo: false,
      tagihan: null, // Tambahkan variabel untuk menyimpan tagihan
      showPaymentModal: false, // Atur awalnya menjadi false
    };
  },

  methods: {
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async getAccountInfo() {
      // Validasi input nomor rekening dan nomor pelanggan
      if (!this.nomorRekening || !this.nomorPelanggan) {
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening dan ID pelanggan harus diisi',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      // Memeriksa tagihan
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/bayar-telpon`,
          {
            nomorRekening: this.nomorRekening,
            nomorPelanggan: this.nomorPelanggan
          }
        );

        // Memperbarui tagihan
        this.tagihan = response.data.tagihan;
        this.accountInfo = {
          nomorRekening: response.data.nomorRekening,
          namaPemilikRekening: response.data.namaPemilikRekening,
          saldoPemilikRekening: response.data.saldoPemilikRekening,
          tagihan: response.data.tagihan
        };

        // Tampilkan modal pembayaran
        this.showPaymentModal = true; // Setelah mendapatkan informasi rekening

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Terjadi kesalahan saat memeriksa tagihan',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },

    async bayarTagihan() {
      // Validasi apakah tagihan ada atau tidak
      if (!this.tagihan) {
        Swal.fire({
          icon: 'error',
          text: 'Tidak ada tagihan yang harus dibayar.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });

        // Tutup modal pembayaran
        this.showPaymentModal = false;
        return;
      }

      // Lakukan pembayaran tagihan di sini, misalnya dengan mengirim permintaan ke server
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/bayar-telpon`, // Ganti URL sesuai dengan endpoint pembayaran yang sesuai
          {
            nomorRekening: this.nomorRekening,
            nomorPelanggan: this.nomorPelanggan
          }
        );

        // Pastikan server memberikan respons yang sesuai setelah pembayaran berhasil
        if (response.data.message === "Tagihan sudah dibayar.") {
          Swal.fire({
            icon: 'success',
            text: 'Tagihan sudah dibayar.',
            customClass: {
              container: 'custom-class'
            },
            appendTo: 'body'
          });
        } else {
          Swal.fire({
            icon: 'success',
            text: 'Pembayaran berhasil.',
            customClass: {
              container: 'custom-class'
            },
            appendTo: 'body'
          });
        }

        // Tutup modal pembayaran
        this.showPaymentModal = false;

        // Reset input dan tagihan setelah pembayaran berhasil
        this.nomorRekening = "";
        this.nomorPelanggan = "";
        this.tagihan = null;
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Terjadi kesalahan saat melakukan pembayaran',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    }
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

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


</style>
