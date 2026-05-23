function db() {
  return {
    activeTab: 'manbalar',
    tabs: [
      { id: 'manbalar',   label: 'Manbalar'    },
      { id: 'xodimlar',   label: 'Xodimlar'    },
      { id: 'hamyon',     label: 'Hamyon'       },
      { id: 'kontragent', label: 'Kontragent'   },
      { id: 'xizmat',     label: 'Xizmat'       },
      { id: 'yonalish',   label: "Yo'nalish"    }
    ],
    data: {},
    showForm: false,
    formData: {},
    editRowId: null,
    loading: false,
    error: '',

    sheetFor(tab) {
      const map = {
        manbalar:   'DB_Manbalar',
        xodimlar:   'DB_Xodimlar',
        hamyon:     'DB_Hamyon',
        kontragent: 'DB_Kontragent',
        xizmat:     'DB_Xizmat',
        yonalish:   "DB_Yo'nalish"
      };
      return map[tab];
    },

    fieldsFor(tab) {
      const fields = {
        manbalar:   ['Nomi', 'Turi', 'Xarakat_turi', 'Doimiy', 'Izoh'],
        xodimlar:   ['Nomi', 'Lavozim', 'Telefon', 'Status'],
        hamyon:     ['Nomi', 'Valyuta', 'Status'],
        kontragent: ['Nomi', 'Turi', 'Telefon', 'Izoh'],
        xizmat:     ['Nomi', "Yo'nalish", 'Ish_turi', 'Narxi_dollar', 'Narxi_sum'],
        yonalish:   ['Nomi', 'Izoh']
      };
      return fields[tab] || [];
    },

    async init() {
      await this.loadTab(this.activeTab);
    },

    async loadTab(tab) {
      this.activeTab = tab;
      if (this.data[tab]) return;
      this.loading = true;
      try {
        this.data[tab] = await api.read(this.sheetFor(tab));
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    openAdd() {
      this.formData = {};
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = { ...row };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    async save() {
      const sheet = this.sheetFor(this.activeTab);
      const data = { ...this.formData };
      delete data._rowId;
      this.loading = true;
      try {
        if (this.editRowId) {
          await api.update(sheet, this.editRowId, data);
          const idx = this.data[this.activeTab].findIndex(r => r._rowId === this.editRowId);
          if (idx !== -1) this.data[this.activeTab][idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write(sheet, data);
          this.data[this.activeTab].push({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.formData = {};
        this.editRowId = null;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      const sheet = this.sheetFor(this.activeTab);
      this.loading = true;
      try {
        await api.remove(sheet, row._rowId);
        this.data[this.activeTab] = this.data[this.activeTab].filter(r => r._rowId !== row._rowId);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    }
  };
}
