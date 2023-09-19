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
              <InputText type="text" v-model="nomorRekening" class="custom-input"
                :class="{ 'p-invalid': nomorRekeningError }" required />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
            <div> &nbsp;&nbsp;
              <h5>Masukkan Nomor Telpon:</h5>
              <InputText type="text" v-model="nomorTelpon" class="custom-input" :class="{ 'p-invalid': nomorTelponError }"
                required />
              <span v-if="nomorTelponError" class="p-error">Nomor telpon harus diisi</span>
            </div>
          </div> &nbsp;&nbsp;
          <Button label="Cek Tagihan" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>

  <Dialog v-if="showPaymentModal" v-model:visible="showPaymentModal" modal header="Informasi Rekening"
    :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1; font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening: {{ accountInfo.nomorRekening }}</p>
      <p>Nomor Telepon: {{ accountInfo.nomorTelpon }}</p>
      <p>Nama Pemilik Rekening: {{ accountInfo.namaPemilikRekening }}</p>
      <p>Saldo: Rp. {{ numberWithDot(accountInfo.saldoPemilikRekening) }}</p>
      <p>
        Jumlah Tagihan: Rp. {{ numberWithDot(tagihan) }}
      </p>
      <Button style="margin-top: 10px; margin-right: 32px;" label="Bayar" class="custom-button" @click="bayarTagihan()" />
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
      nomorTelpon: "",
      nomorRekeningError: false,
      nomorTelponError: false,
      accountInfo: {},
      showAccountInfo: false,
      tagihan: null,
      showPaymentModal: false,
    };
  },

  methods: {
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async getAccountInfo() {
      // Validasi input nomor rekening dan nomor telpon
      if (!this.nomorRekening || !this.nomorTelpon) {
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening dan nomor telpon harus diisi',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      // Memeriksa tagihan
      try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/nasabah/cek-tagihan`,
      {
        params: {
          nomorRekening: this.nomorRekening,
          noTelp: this.nomorTelpon
        }
      }
    );

    console.log(response); // Log respons dari server

    if (response.status === 404) {
      // Menangani kasus tidak ada tagihan
      const responseData = response.data;
      if (responseData && responseData.message) {
        Swal.fire({
          icon: 'error',
          text: responseData.message,
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: error.response.data.message,
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    } else {
      // Memperbarui tagihan dan menampilkan modal pembayaran
      this.tagihan = response.data.tagihan;
      this.accountInfo = {
        nomorRekening: response.data.nomorRekening,
        nomorTelpon: response.data.noTelp,
        namaPemilikRekening: response.data.namaPemilikRekening,
        saldoPemilikRekening: response.data.saldoPemilikRekening,
        tagihanTelpon: response.data.tagihanTelpon
      };
      this.showPaymentModal = true;
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      text: error.response.data.message,
      customClass: {
        container: 'custom-class'
      },
      appendTo: 'body'
    });
  }
},

    async bayarTagihan() {
      if (!this.tagihan) {
        Swal.fire({
          icon: 'error',
          text: 'Tidak ada tagihan yang harus dibayar.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });

        this.showPaymentModal = false;
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/bayar-telpon`,
          {
            nomorRekening: this.nomorRekening,
            noTelp: this.nomorTelpon,
          }
        );

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            text: 'Pembayaran berhasil.',
            customClass: {
              container: 'custom-class'
            },
            appendTo: 'body'
          });
          // sembunyikan modal: 
          this.showPaymentModal = false;

          this.tagihan = null;
      this.accountInfo = {};
      this.nomorRekening = "";
      this.nomorTelpon = "";

        } else {
          this.tagihan = response.data.tagihan;
          this.accountInfo = {
            nomorRekening: response.data.nomorRekening,
            nomorTelpon: response.data.noTelp,
            namaPemilikRekening: response.data.namaPemilikRekening,
            saldoPemilikRekening: response.data.saldoPemilikRekening,
            tagihanTelpon: response.data.tagihanTelpon
          };
          this.showPaymentModal = true;
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: error.response.data,
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },
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

.custom-class {
  z-index: 10000;
}
</style>