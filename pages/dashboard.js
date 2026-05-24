function dashboard() {
  return {
    kpi: {
      totalBalance: 0,
      monthIncome: 0,
      monthExpense: 0,
      monthProfit: 0,
      ddsOpen: 0,
      ddsClose: 0,
      debtors: 0,
      doimiy: 0,
      monthPlan: 0
    },
    recentOps: [],
    dailyData: [],
    expenseData: [],
    loading: false,
    error: '',
    charts: {},

    currentMonthKey() {
      const now = new Date();
      return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    },

    async init() {
      this.loading = true;
      try {
        const month = this.currentMonthKey();
        const [allKassa, monthKassa, monthZakaz, manbalar, reja] = await Promise.all([
          api.read('Kassa'),
          api.read('Kassa', { month }),
          api.read('Zakaz', { month }),
          api.read('DB_Manbalar'),
          api.read('Reja')
        ]);

        // Total balance across all wallets (all time)
        let totalBal = 0;
        allKassa.forEach(op => {
          const amt = Number(op.Summa) || 0;
          totalBal += op.Turi === 'Kirim' ? amt : -amt;
        });
        this.kpi.totalBalance = totalBal;

        // Monthly income & expenses
        let income = 0, expense = 0;
        monthKassa.forEach(op => {
          const amt = Number(op.Summa) || 0;
          if (op.Turi === 'Kirim')  income  += amt;
          if (op.Turi === 'Chiqim') expense += amt;
        });
        this.kpi.monthIncome  = income;
        this.kpi.monthExpense = expense;
        this.kpi.monthProfit  = income - expense;

        // DDS: opening balance (sum of all ops before this month)
        let openBal = 0;
        allKassa.forEach(op => {
          const d = new Date(op.Sana);
          if (isNaN(d.getTime())) return;
          const opMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
          if (opMonth < month) {
            const amt = Number(op.Summa) || 0;
            openBal += op.Turi === 'Kirim' ? amt : -amt;
          }
        });
        this.kpi.ddsOpen  = openBal;
        this.kpi.ddsClose = openBal + income - expense;

        // Debtors: sum of Qoldiq from unpaid/partial orders this month
        this.kpi.debtors = monthZakaz.reduce((s, o) => s + (Number(o.Qoldiq) || 0), 0);

        // Doimiy xarajatlar this month
        const doimiyNames = new Set(
          manbalar
            .filter(m => m.Doimiy === 'TRUE' || m.Doimiy === true || m.Doimiy === 'true')
            .map(m => m.Nomi)
        );
        this.kpi.doimiy = monthKassa
          .filter(op => op.Turi === 'Chiqim' && doimiyNames.has(op.Manbalar))
          .reduce((s, op) => s + (Number(op.Summa) || 0), 0);

        // Monthly plan
        const rejaRow = reja.find(r => r.Oy === month);
        this.kpi.monthPlan = rejaRow ? (Number(rejaRow.Oylik_reja) || 0) : 0;

        // Recent 10 operations (all time, most recent first)
        this.recentOps = [...allKassa]
          .filter(op => op.Sana)
          .sort((a, b) => new Date(b.Sana) - new Date(a.Sana))
          .slice(0, 10);

        // Daily income this month for chart
        const dailyMap = {};
        monthKassa
          .filter(op => op.Turi === 'Kirim' && op.Sana)
          .forEach(op => {
            dailyMap[op.Sana] = (dailyMap[op.Sana] || 0) + (Number(op.Summa) || 0);
          });
        this.dailyData = Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b));

        // Top 5 expense categories this month
        const expMap = {};
        monthKassa
          .filter(op => op.Turi === 'Chiqim')
          .forEach(op => {
            const cat = op.Manbalar || 'Boshqa';
            expMap[cat] = (expMap[cat] || 0) + (Number(op.Summa) || 0);
          });
        this.expenseData = Object.entries(expMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
      this.$nextTick(() => this.renderCharts());
    },

    renderCharts() {
      // Daily income bar chart
      if (this.dailyData.length) {
        const ctx1 = document.getElementById('dailyChart');
        if (ctx1) {
          if (this.charts.daily) this.charts.daily.destroy();
          this.charts.daily = new Chart(ctx1, {
            type: 'bar',
            data: {
              labels: this.dailyData.map(([d]) => d.slice(5)),
              datasets: [{
                label: 'Kirim',
                data: this.dailyData.map(([, v]) => v),
                backgroundColor: '#5856D6',
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }
          });
        }
      }

      // Top expenses donut chart
      if (this.expenseData.length) {
        const ctx2 = document.getElementById('expChart');
        if (ctx2) {
          if (this.charts.exp) this.charts.exp.destroy();
          this.charts.exp = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              labels: this.expenseData.map(([k]) => k),
              datasets: [{
                data: this.expenseData.map(([, v]) => v),
                backgroundColor: ['#5856D6','#FF3B30','#FF9500','#34C759','#8E8E93']
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { position: 'right' } }
            }
          });
        }
      }
    },

    planPercent() {
      if (!this.kpi.monthPlan) return null;
      return Math.round((this.kpi.monthIncome / this.kpi.monthPlan) * 100);
    },

    fmt(n) {
      if (n === null || n === undefined || n === '') return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
