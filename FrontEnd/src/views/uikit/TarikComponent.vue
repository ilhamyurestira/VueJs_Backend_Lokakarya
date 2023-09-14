<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2>Tarik Dana</h2>
        <form @submit.prevent="tarikDana">
          <div>
            <div>
              <h5>Nomor Rekening Tujuan:</h5>
              <InputText
                type="number"
                v-model="norek"
                class="custom-input"
                :class="{ 'p-invalid': nomorRekeningError }"
                required
              />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
          </div>
          <div>
            <h3>Jumlah Penarikan:</h3>
            <InputText
              type="number"
              v-model="jumlah"
              class="custom-input"
              :class="{ 'p-invalid': jumlahTarikError }"
              required
            />
            <span v-if="jumlahTarikError" class="p-error">Jumlah penarikan harus diisi</span>
          </div>
          <div style="margin: 10px;">
            <Button label="Tarik Dana" class="custom-button" type="submit" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "TarikDanaComponent",
  data() {
    return {
      norek: "",
      nomorRekeningError: false,
      jumlah: "",
      jumlahTarikError: false,
    };
  },
  methods: {
    async tarikDana() {
      if (!this.norek) {
        this.nomorRekeningError = true;
        return;
      } else {
        this.nomorRekeningError = false;
      }

      if (!this.jumlah) {
        this.jumlahTarikError = true;
        return;
      } else {
        this.jumlahTarikError = false;
      }

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/nasabah/tarik`,
          {
            norek: Number(this.norek),
            jumlah: Number(this.jumlah)
          }
        );

        Swal.fire({
          icon: 'success',
          text: 'Berhasil melakukan penarikan.'
        });

        // Setelah berhasil, Anda dapat mereset input
        this.norek = "";
        this.jumlah = "";
      } catch (error) {
        console.log(error);

        Swal.fire({
          icon: 'error',
          text: error.response.data
        });
      }
    },
  },
};
</script>
