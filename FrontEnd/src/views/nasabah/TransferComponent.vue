<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2 style="margin-bottom: 25px;">Transfer</h2>
        <form @submit.prevent="getAccountInfo">
          <div>
            <div>
              <h5>Masukkan Nomor Rekening Anda:</h5>
              <InputText type="text" v-model="nomorRekeningPengirim" class="custom-input"
                :class="{ 'p-invalid': nomorRekeningError }" required />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
          </div>
          &nbsp;&nbsp;
          <Button label="Cek Rekening" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>

  <!-- Modal untuk informasi pemilik rekening -->
  <Dialog v-if="showAccountInfo" v-model:visible="showAccountInfo" modal header="Informasi Rekening"
    :style="{ width: '50vw' }">
    <div style="text-align: center; line-height: 1;font-size: 20px; margin-top: 10px;">
      <p>Nomor Rekening: {{ accountInfo.nomorRekening }}</p>
      <p>Nama Pemilik Rekening: {{ accountInfo.namaPemilikRekening }}</p>
      <p>Saldo Saat Ini: Rp. {{ numberWithDot(accountInfo.saldo) }}</p>
      <div>
        <h5>Masukkan Nomor Rekening Penerima:</h5>
        <InputText type="index" v-model="nomorRekeningPenerima" class="custom-input"
          :class="{ 'p-invalid': nomorRekeningPenerimaError }" required />
        <span v-if="nomorRekeningPenerimaError" class="p-error">Nomor rekening penerima harus diisi</span>
      </div>
      <div> &nbsp;
        <h5>Jumlah Transfer:</h5>
        <InputText type="text" v-model="jumlahTransfer" class="custom-input" :class="{ 'p-invalid': jumlahTransferError }"
          required />
      </div>&nbsp; &nbsp; &nbsp;
      <Button style="margin-top: 10px; margin-right: 32px;" label="Transfer" class="custom-button" @click="transfer" />
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "TransferComponent",
  data() {
    return {
      nomorRekeningPengirim: "",
      nomorRekeningPenerima: "",
      jumlahTransfer: "",
      accountInfo: {},
      nomorRekeningError: false,
      nomorRekeningPenerimaError: false,
      jumlahTransferError: false,
      showAccountInfo: false,
      saldoPengirim: 0,
      showModal: false
    };
  },

  methods: {
    numberWithDot(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    async getAccountInfo() {
      // Validasi input nomor rekening pengirim
      this.nomorRekeningError = !this.nomorRekeningPengirim;

      if (this.nomorRekeningError) {
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening harus diisi',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      if (this.jumlahTransferError) {
        Swal.fire({
          icon: 'error',
          text: 'Jumlah transfer harus diisi',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/nasabah/accountInfo/${this.nomorRekeningPengirim}`
        );

        this.accountInfo = response.data;
        this.saldoPengirim = response.data.saldo;
        this.showAccountInfo = true;

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening tidak ditemukan',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },

    async transfer() {

      this.nomorRekeningPenerimaError = !this.nomorRekeningPenerima;
      this.jumlahTransferError = !this.jumlahTransfer;

      if (this.nomorRekeningPenerimaError || this.jumlahTransferError) {
        Swal.fire({
          icon: 'error',
          text: 'Data yang diperlukan tidak lengkap',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      // Periksa apakah jumlah transfer kurang dari 50,000
      if (this.jumlahTransfer < 50000) {
        Swal.fire({
          icon: 'error',
          text: 'Jumlah transfer minimum Rp.50,000.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      // Periksa apakah saldo pengirim cukup
      if (this.jumlahTransfer > this.saldoPengirim) {
        Swal.fire({
          icon: 'error',
          text: 'Saldo tidak cukup',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      //Saldo tidak bisa kurang dari 50000
      if (this.saldoPengirim - this.jumlahTransfer < 50000) {
        Swal.fire({
          icon: 'error',
          text: 'Saldo tidak bisa kurang dari Rp 50.000.',
          customClass: {
            container: 'custom-class'
          },
          appendTo: 'body'
        });
        return;
      }

      try {
        // Lakukan transfer
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/transfer`,
          {
            nomorRekeningPengirim: Number(this.nomorRekeningPengirim),
            nomorRekeningPenerima: Number(this.nomorRekeningPenerima),
            jumlahTransfer: Number(this.jumlahTransfer),
          }
        );

        Swal.fire({
          icon: 'success',
          text: 'Transfer berhasil.',
          customClass: {
            container: 'custom-class'
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          appendTo: 'body'
        });

        this.nomorRekeningPengirim = "";
        this.nomorRekeningPenerima = "";
        this.jumlahTransfer = "";
        this.showAccountInfo = false;
        this.showModal = false
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
  width: 200px;
  height: 40px;
  font-size: 16px;
}

.p-invalid {
  border-color: red;
}

.p-error {
  color: red;
}

.custom-class {
  z-index: 10000;
}

.custom-button {
  width: 200px;
  height: 50px;
  font-size: 20px;
}

.custom-input {
  width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
