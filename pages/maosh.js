function maosh() {
  return {
    currentMonth: new Date().toISOString().slice(0, 7),
    records: [],
    xodimlar: [],
    showForm: false,
    formData: {},
    editRowId: null,
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [records, xodimlar] = await Promise.all([
          api.read('Maosh', { oy: this.currentMonth }),
          api.read('DB_Xodimlar')
        ]);
        this.records = records;
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async changeMonth(offset) {
      const [yr, mo] = this.currentMonth.split('-').map(Number);
      const d = new Date(yr, mo - 1 + offset, 1);
      this.currentMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      this.loading = true;
      try {
        this.records = await api.read('Maosh', { oy: this.currentMonth });
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    monthLabel() {
      const [yr, mo] = this.currentMonth.split('-').map(Number);
      const months = [
        'Yanvar','Fevral','Mart','Aprel','May','Iyun',
        'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'
      ];
      return months[mo - 1] + ' ' + yr;
    },

    calcJami() {
      const f = this.formData;
      f.Jami = (Number(f.Operator) || 0) + (Number(f.Arenda) || 0) +
               (Number(f.Montaj) || 0) + (Number(f.PM) || 0) + (Number(f.Bonus) || 0);
    },

    openAdd() {
      this.formData = {
        Oy: this.currentMonth,
        Xodim: '',
        Avans: 0,
        Operator: 0,
        Arenda: 0,
        Montaj: 0,
        PM: 0,
        Bonus: 0,
        Jami: 0,
        Status: "To'lanmadi",
        Izoh: ''
      };
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = {
        Oy: row.Oy,
        Xodim: row.Xodim,
        Avans: row.Avans,
        Operator: row.Operator,
        Arenda: row.Arenda,
        Montaj: row.Montaj,
        PM: row.PM,
        Bonus: row.Bonus,
        Jami: row.Jami,
        Status: row.Status,
        Izoh: row.Izoh
      };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    async save() {
      if (!this.formData.Xodim) {
        this.error = 'Xodim tanlang';
        return;
      }
      this.calcJami();
      this.loading = true;
      try {
        const data = { ...this.formData };
        if (this.editRowId) {
          await api.update('Maosh', this.editRowId, data);
          const idx = this.records.findIndex(r => r._rowId === this.editRowId);
          if (idx !== -1) this.records[idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write('Maosh', data);
          this.records.push({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Maosh', row._rowId);
        this.records = await api.read('Maosh', { oy: this.currentMonth });
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    totalJami() {
      return this.records.reduce((s, r) => s + (Number(r.Jami) || 0), 0);
    },

    fmt(n) {
      if (n === null || n === undefined || n === '') return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
