function createTable({
  id,
  ajaxUrl,
  data,
  orderColumn,
  orderType,
  columns,
  pageLength = 10,
  columnDropdowns = false,
  columnSearchText = true,
}) {
  const ajax = ajaxUrl && {
    url: ajaxUrl,
    dataSrc: '',
    error: () => {
      if (ajaxUrl !== undefined) {
        alert('An error occurred when loading table data.')
      }
    },
  }

  return new DataTable(`#${id}`, {
    layout: {
      bottomStart: {
        buttons: [
          'colvis',
          {
            extend: 'copy',
            exportOptions: {
              columns: ':visible',
            },
          },
          {
            extend: 'csv',
            exportOptions: {
              columns: ':visible',
            },
          },
        ],
      },
    },
    lengthMenu: [
      [10, 25, 50, 75, 100, -1],
      [10, 25, 50, 75, 100, 'All'],
    ],
    pageLength,
    paging: true,
    pagingType: 'simple_numbers',
    order: [[orderColumn, orderType]],
    sortable: true,
    ajax,
    data,
    columns,
    initComplete: function () {
      if (columnDropdowns) {
        this.api()
          .columns()
          .every(function () {
            const column = this

            // Create select element
            const select = document.createElement('select')
            select.add(new Option(''))
            column.footer().replaceChildren(select)

            // Apply listener for user change in value
            select.addEventListener('change', function () {
              column.search(select.value, { exact: true }).draw()
            })

            // Add list of options
            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.add(new Option(d))
              })
          })
      }
      if (columnSearchText) {
        this.api()
          .columns()
          .every(function () {
            const column = this
            const title = `${column.footer().textContent}  (regex)`

            // Create input element
            const input = document.createElement('input')
            input.placeholder = title
            column.footer().replaceChildren(input)

            // Event listener for user input
            input.addEventListener('keyup', () => {
              if (column.search() !== this.value) {
                const regex = true
                const smart = false
                column.search(input.value, regex, smart).draw()
              }
            })
          })
      }
    },
  })
}

jQuery(() => {
  const columns = [
    {
      data: 'title',
    },
    {
      data: 'establistment',
    },
    {
      data: 'contentType',
    },
    {
      data: 'sentiment',
    },
    {
      data: 'comment',
    },
    {
      data: 'date',
    },
    {
      data: 'categories',
    },
    {
      data: 'series',
    },
  ]

  // use globally added startDate/endDate, these are validating in the route
  if (startDate !== undefined && endDate !== undefined) {
    createTable({
      id: 'feedbackTable',
      ajaxUrl: `/reports/data/${startDate.replaceAll('/', '-')}/${endDate.replaceAll('/', '-')}`,
      orderColumn: 4,
      orderType: 'desc',
      columns,
    })
  }
})
